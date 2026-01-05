# Bulk Quiz Assignment Implementation Guide

## Overview

This document provides a complete implementation guide for adding **bulk section assignment** to the CreateQuiz.vue component, allowing teachers to assign one quiz to multiple sections simultaneously.

## Database Schema (Already Completed ✅)

Your Supabase migration has already created:

- `bulk_quizzes` junction table
- Helper functions: `assign_quiz_to_sections()`, `remove_quiz_from_sections()`, `get_bulk_quiz_sections()`
- Proper RLS policies
- Academic period tracking (school_year_id, grading_period_id)

## Implementation Steps

### 1. Add Data Properties (in `<script setup>`)

Add these reactive references after the existing `section` ref:

```javascript
// After: const section = ref({ id: '', name: '' });

// Bulk section assignment
const teacherSections = ref([])
const selectedSections = ref([])
const allSectionsSelected = ref(false)
const gradingPeriods = ref([])
const selectedGradingPeriod = ref(null)
const currentSchoolYear = ref(null)
```

### 2. Add Section Fetching Function

Add this function after `getTeacherInfo()`:

```javascript
const fetchTeacherSections = async () => {
  try {
    if (!teacherInfo.value.teacher_id) {
      console.log('No teacher ID available yet')
      return
    }

    console.log('📚 Fetching teacher sections...')

    const { data: sectionsData, error } = await supabase
      .from('sections')
      .select(
        `
        id,
        name,
        section_code,
        subject_id,
        subjects!inner (
          id,
          name,
          grade_level
        )
      `
      )
      .eq('teacher_id', teacherInfo.value.teacher_id)
      .eq('is_active', true)
      .order('subjects(grade_level)', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error

    teacherSections.value = sectionsData.map((s) => ({
      id: s.id,
      name: s.name,
      section_code: s.section_code,
      subject_id: s.subject_id,
      subject_name: s.subjects.name,
      grade_level: s.subjects.grade_level
    }))

    console.log(`✅ Found ${teacherSections.value.length} sections`)

    // Auto-select current section if we came from a specific section
    if (section.value.id) {
      selectedSections.value = [section.value.id]
    }
  } catch (error) {
    console.error('Error fetching teacher sections:', error)
  }
}
```

### 3. Add Grading Period Fetching Function

```javascript
const fetchGradingPeriods = async () => {
  try {
    // Get active school year
    const { data: schoolYear, error: syError } = await supabase
      .from('school_years')
      .select('id, year_name')
      .eq('is_active', true)
      .single()

    if (syError) {
      console.log('No active school year found')
      return
    }

    currentSchoolYear.value = schoolYear

    // Get grading periods
    const { data: periods, error: periodsError } = await supabase
      .from('grading_periods')
      .select('*')
      .eq('school_year_id', schoolYear.id)
      .order('period_number', { ascending: true })

    if (periodsError) throw periodsError

    gradingPeriods.value = periods || []

    // Auto-select active period
    const activePeriod = periods?.find((p) => p.is_active)
    selectedGradingPeriod.value = activePeriod || periods?.[0] || null

    console.log('📅 Grading periods loaded:', periods?.length)
  } catch (error) {
    console.error('Error fetching grading periods:', error)
  }
}
```

### 4. Add Section Selection Helper Functions

```javascript
const toggleAllSections = () => {
  if (allSectionsSelected.value) {
    selectedSections.value = teacherSections.value.map((s) => s.id)
  } else {
    selectedSections.value = []
  }
}

const toggleSectionSelection = (sectionId) => {
  const index = selectedSections.value.indexOf(sectionId)
  if (index > -1) {
    selectedSections.value.splice(index, 1)
  } else {
    selectedSections.value.push(sectionId)
  }

  // Update "select all" checkbox state
  allSectionsSelected.value = selectedSections.value.length === teacherSections.value.length
}

const isSectionSelected = (sectionId) => {
  return selectedSections.value.includes(sectionId)
}

const getSelectedSectionsCount = computed(() => {
  return selectedSections.value.length
})
```

### 5. Update `onMounted` Lifecycle Hook

Update the existing `onMounted` to call the new functions:

```javascript
onMounted(async () => {
  console.log('🎯 CreateQuiz component mounted')
  console.log('Route params:', route.params)

  isInitializing.value = true

  // Step 1: Get teacher info first
  await getTeacherInfo()

  // Step 2: Fetch grading periods
  await fetchGradingPeriods()

  // Step 3: Fetch teacher sections (for bulk assignment)
  await fetchTeacherSections()

  // Step 4: Load subject and section info
  subject.value.id = route.params.subjectId
  section.value.id = route.params.sectionId

  await loadSubjectInfo()
  await loadSectionInfo()
  await checkExistingQuizzes()

  // Step 5: Setup realtime subscription
  setupRealtimeSubscription()

  // Step 6: Scroll listener
  window.addEventListener('scroll', handleScroll)

  isInitializing.value = false
  console.log('✅ Initialization complete')
})
```

### 6. Update Template - Add Section Selector in Quiz Settings

Add this new section in the Quiz Settings step (after Time Limit and Attempts settings):

```vue
<!-- Section Assignment (Bulk) -->
<div class="setting-card enhanced-setting full-width">
  <div class="setting-header">
    <div class="setting-info">
      <span class="setting-emoji">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </span>
      <div class="setting-details">
        <h3>Assign to Sections</h3>
        <p>Select which sections can access this quiz</p>
        <div v-if="currentSchoolYear && selectedGradingPeriod" class="academic-tags">
          <span class="academic-tag">{{ currentSchoolYear.year_name }}</span>
          <span class="quarter-tag">{{ selectedGradingPeriod.period_name }}</span>
        </div>
      </div>
    </div>
    <div class="selected-count">
      <span class="count-badge">{{ getSelectedSectionsCount }} / {{ teacherSections.length }}</span>
    </div>
  </div>

  <div class="setting-content">
    <!-- Select All Option -->
    <div class="section-select-all">
      <label class="checkbox-label">
        <input
          type="checkbox"
          v-model="allSectionsSelected"
          @change="toggleAllSections"
        />
        <span class="checkbox-custom"></span>
        <span class="checkbox-text">Select All Sections</span>
      </label>
    </div>

    <!-- Sections Grid -->
    <div class="sections-grid">
      <div
        v-for="section in teacherSections"
        :key="section.id"
        class="section-checkbox-card"
        :class="{ 'selected': isSectionSelected(section.id) }"
        @click="toggleSectionSelection(section.id)"
      >
        <div class="section-card-content">
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              :checked="isSectionSelected(section.id)"
              @click.stop
              @change="toggleSectionSelection(section.id)"
            />
            <span class="checkbox-visual"></span>
          </div>
          <div class="section-info">
            <div class="section-name">{{ section.name }}</div>
            <div class="section-meta">
              <span class="section-code">{{ section.section_code }}</span>
              <span class="section-subject">{{ section.subject_name }}</span>
              <span class="section-grade">Grade {{ section.grade_level }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Sections Message -->
    <div v-if="teacherSections.length === 0" class="no-sections-message">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>No sections available</p>
    </div>
  </div>
</div>

<!-- Grading Period Selector (if you want to allow changing) -->
<div v-if="gradingPeriods.length > 0" class="setting-card enhanced-setting full-width">
  <div class="setting-header">
    <div class="setting-info">
      <span class="setting-emoji">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </span>
      <div class="setting-details">
        <h3>Grading Period</h3>
        <p>Assign this quiz to a specific quarter</p>
      </div>
    </div>
  </div>

  <div class="setting-content">
    <div class="grading-period-selector">
      <label
        v-for="period in gradingPeriods"
        :key="period.id"
        class="period-option"
        :class="{ 'selected': selectedGradingPeriod?.id === period.id, 'active-period': period.is_active }"
      >
        <input
          type="radio"
          :value="period"
          v-model="selectedGradingPeriod"
          name="gradingPeriod"
        />
        <span class="period-content">
          <span class="period-name">{{ period.period_name }}</span>
          <span v-if="period.is_active" class="active-badge">Active</span>
          <span class="period-dates">
            {{ new Date(period.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }} -
            {{ new Date(period.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </span>
        </span>
      </label>
    </div>
  </div>
</div>
```

### 7. Update `publishQuiz` Function

Replace the quiz creation section with bulk assignment logic:

```javascript
const publishQuiz = async () => {
  // Validate sections selected
  if (selectedSections.value.length === 0) {
    alert('⚠️ Please select at least one section for this quiz.')
    return
  }

  // CRITICAL: Check if teacher info is loaded
  if (!teacherInfo.value.teacher_id) {
    alert(
      '⚠️ System Error: Teacher information not loaded.\n\nPlease refresh the page and try again.'
    )
    console.error('❌ Publish blocked: teacher_id not available')
    return
  }

  // Validation first
  if (!validateQuiz()) {
    console.log('❌ Validation failed')
    return
  }

  const sectionCount = selectedSections.value.length
  const sectionText = sectionCount === 1 ? '1 section' : `${sectionCount} sections`

  if (
    !confirm(
      `Publish "${quiz.value.title}" to ${sectionText}?\n\nStudents in the selected sections will be able to see and take this quiz immediately.`
    )
  ) {
    return
  }

  isPublishing.value = true
  console.log('🚀 Starting bulk quiz publication...')

  try {
    console.log('✅ Teacher verified:', teacherInfo.value.teacher_id)
    console.log(`📚 Publishing to ${sectionCount} section(s)`)

    // === STEP 1: Create Quiz (WITHOUT section_id) ===
    const startDateUTC = convertPHTimeToUTC(quiz.value.settings.startDate)
    const endDateUTC = convertPHTimeToUTC(quiz.value.settings.endDate)

    const quizData = {
      subject_id: subject.value.id,
      // NOTE: section_id is now nullable - we use bulk_quizzes instead
      section_id: null,
      teacher_id: teacherInfo.value.teacher_id,
      title: quiz.value.title.trim(),
      description: quiz.value.description.trim() || null,
      number_of_questions: parseInt(quiz.value.numberOfQuestions),
      has_time_limit: quiz.value.settings.hasTimeLimit,
      time_limit_minutes: quiz.value.settings.hasTimeLimit
        ? parseInt(quiz.value.settings.timeLimit)
        : null,
      attempts_allowed: parseInt(quiz.value.settings.attemptsAllowed),
      shuffle_questions: quiz.value.settings.shuffle,
      shuffle_options: quiz.value.settings.shuffle,
      start_date: startDateUTC,
      end_date: endDateUTC,
      status: 'published',
      // Academic period tracking
      school_year_id: currentSchoolYear.value?.id || null,
      grading_period_id: selectedGradingPeriod.value?.id || null
    }

    console.log('📝 Quiz data prepared:', quizData)
    console.log('📤 Step 1: Creating quiz...')

    const { data: newQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single()

    if (quizError) {
      console.error('❌ Quiz creation failed:', quizError)
      throw new Error(`Failed to create quiz: ${quizError.message}`)
    }

    if (!newQuiz?.id) {
      throw new Error('Quiz created but no ID returned')
    }

    console.log('✅ Step 1 complete: Quiz created with ID:', newQuiz.id)

    // === STEP 1.5: Assign Quiz to Multiple Sections ===
    console.log('📤 Step 1.5: Assigning quiz to sections...')

    const { data: assignResult, error: assignError } = await supabase.rpc(
      'assign_quiz_to_sections',
      {
        p_quiz_id: newQuiz.id,
        p_section_ids: selectedSections.value
      }
    )

    if (assignError) {
      console.error('❌ Section assignment failed:', assignError)
      throw new Error(`Failed to assign quiz to sections: ${assignError.message}`)
    }

    console.log(`✅ Step 1.5 complete: Quiz assigned to ${assignResult} section(s)`)

    // === STEP 2: Insert Questions ===
    // ... (keep existing question insertion code)

    // === STEP 3: Insert Options and Answers ===
    // ... (keep existing options/answers insertion code)

    // === SUCCESS ===
    console.log('🎉 Quiz published successfully to multiple sections!')
    console.log('Quiz details:', {
      id: newQuiz.id,
      code: newQuiz.quiz_code,
      title: newQuiz.title,
      questions: insertedQuestions.length,
      sections: selectedSections.value.length
    })

    alert(
      `✅ Success!\n\n"${newQuiz.title}" has been published to ${sectionCount} section(s)!\n\nQuiz Code: ${newQuiz.quiz_code}\nQuestions: ${insertedQuestions.length}`
    )

    // Redirect back
    router.push(`/teacher/subject/${subject.value.id}/section/${section.value.id}`)
  } catch (error) {
    console.error('❌ Publication failed:', error)
    alert(
      `❌ Failed to publish quiz:\n\n${error.message}\n\nPlease try again or contact support if the problem persists.`
    )
  } finally {
    isPublishing.value = false
  }
}
```

### 8. Add CSS Styles

Add these styles to your `<style scoped>` section:

```css
/* Bulk Section Assignment Styles */
.full-width {
  grid-column: 1 / -1;
}

.academic-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.academic-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.quarter-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #3d8d7a 0%, #2d6d5f 100%);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-count {
  display: flex;
  align-items: center;
}

.count-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
}

.section-select-all {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #1f2937;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

input[type='checkbox']:checked + .checkbox-custom {
  background: #10b981;
  border-color: #10b981;
}

input[type='checkbox']:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.section-checkbox-card {
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.section-checkbox-card:hover {
  border-color: #3d8d7a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.section-checkbox-card.selected {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.section-card-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.checkbox-wrapper {
  position: relative;
  flex-shrink: 0;
}

.checkbox-wrapper input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.section-info {
  flex: 1;
}

.section-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-code,
.section-subject,
.section-grade {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.section-checkbox-card.selected .section-code,
.section-checkbox-card.selected .section-subject,
.section-checkbox-card.selected .section-grade {
  background: #10b981;
  color: white;
}

.no-sections-message {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.no-sections-message svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.grading-period-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.period-option {
  position: relative;
  display: block;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-option:hover {
  border-color: #3d8d7a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.period-option.selected {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.period-option.active-period {
  border-color: #3b82f6;
}

.period-option input[type='radio'] {
  position: absolute;
  opacity: 0;
}

.period-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.period-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
}

.active-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.period-dates {
  font-size: 0.875rem;
  color: #6b7280;
}
```

### 9. Validation Update

Add section validation to the `validateQuiz()` function:

```javascript
const validateQuiz = () => {
  // ... existing validation ...

  // Validate sections selected
  if (selectedSections.value.length === 0) {
    alert('⚠️ Please select at least one section for this quiz.')
    return false
  }

  // ... rest of validation ...

  return true
}
```

## Testing Checklist

After implementation:

- [ ] Teacher can see all their sections
- [ ] "Select All" checkbox works
- [ ] Individual section selection works
- [ ] Current section is pre-selected if coming from a specific section
- [ ] Grading period selector displays and works
- [ ] Quiz can be published to 1 section
- [ ] Quiz can be published to multiple sections
- [ ] Quiz can be published to all sections
- [ ] bulk_quizzes table is populated correctly
- [ ] Students can see quiz only in their assigned sections
- [ ] School year and quarter are saved with quiz
- [ ] UI shows selected section count
- [ ] Validation prevents publishing without section selection

## Database Verification

After publishing a quiz, verify in Supabase:

```sql
-- Check bulk assignments
SELECT * FROM bulk_quizzes WHERE quiz_id = 'YOUR_QUIZ_ID';

-- Check quiz has academic period info
SELECT id, title, school_year_id, grading_period_id
FROM quizzes
WHERE id = 'YOUR_QUIZ_ID';

-- Use helper function
SELECT * FROM get_bulk_quiz_sections('YOUR_QUIZ_ID');
```

## Benefits

✅ **No Duplication**: One quiz entity, multiple section mappings
✅ **Easy Management**: Update quiz once, affects all sections
✅ **Academic Tracking**: School year and quarter metadata
✅ **Flexible Assignment**: Assign to 1, some, or all sections
✅ **Data Normalization**: Proper relational structure
✅ **Simplified Reuse**: Share quizzes across sections efficiently

## Notes

- The quiz itself (questions, options, answers) is created once
- The `bulk_quizzes` table creates the section relationships
- Students see the quiz through their section enrollment
- Quiz results track which section the student belongs to via `quiz_results.section_id`
- Academic period tracking enables proper grade organization by quarter
