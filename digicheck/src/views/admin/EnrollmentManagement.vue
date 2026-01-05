<template>
  <div class="enrollment-management">
    <!-- Back Button & Page Header -->
    <div class="top-navigation">
      <button @click="goBackToDashboard" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Dashboard</span>
      </button>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Enrollment Management</h1>
          <p class="subtitle">Enroll students into sections and manage enrollment status</p>
        </div>
        <div class="header-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Section Selection Card -->
    <section class="selection-card">
      <div class="card-header-section">
        <h2>Section Details</h2>
        <p class="card-description">Select a section to manage enrollments</p>
      </div>
      <div class="selection-grid">
        <div class="form-group">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Select Section
          </label>
          <select v-model="selectedSectionId" @change="onSectionChange" class="select-input">
            <option value="">-- Choose a section --</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">
              {{ section.name }} - {{ section.subject_name }} (Grade {{ section.grade_level }})
            </option>
          </select>
        </div>
        <div class="form-group" v-if="selectedSection">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Subject
          </label>
          <div class="info-display">{{ selectedSection.subject_name || '—' }}</div>
        </div>
        <div class="form-group" v-if="selectedSection">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Teacher
          </label>
          <div class="info-display">{{ selectedSection.teacher_name || 'Not assigned' }}</div>
        </div>
        <div class="form-group" v-if="selectedSection">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            School Year
          </label>
          <div class="info-display">{{ selectedSection.school_year_name || '—' }}</div>
        </div>
      </div>
    </section>

    <!-- Two-Column Layout -->
    <div v-if="selectedSectionId" class="enrollment-container">
      <div class="two-columns">
        <!-- Available Students (Left) -->
        <div class="students-panel">
          <div class="panel-header">
            <div class="panel-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <h2>Available Students</h2>
            </div>
            <span class="count-badge">{{ filteredAvailableStudents.length }}</span>
          </div>
          
          <div class="panel-controls">
            <div class="search-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                v-model="searchAvailable" 
                type="text" 
                placeholder="Search students..." 
                class="search-input"
              />
            </div>
            <select v-model="filterGrade" @change="applyAvailableFilter" class="filter-select">
              <option value="">All Grades</option>
              <option v-for="g in [7,8,9,10,11,12]" :key="g" :value="g">Grade {{ g }}</option>
            </select>
          </div>
          
          <div class="students-list">
            <div v-if="loadingAvailable" class="loading-state">
              <div class="spinner"></div>
              <p>Loading students...</p>
            </div>
            <div v-else-if="filteredAvailableStudents.length === 0" class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h4>No Available Students</h4>
              <p>All students are enrolled or no students match the criteria</p>
            </div>
            <div 
              v-else 
              v-for="student in filteredAvailableStudents" 
              :key="student.id"
              class="student-item"
              :class="{ selected: selectedAvailableStudents.includes(student.id) }"
              @click="toggleAvailableStudent(student.id)"
            >
              <div class="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  :checked="selectedAvailableStudents.includes(student.id)"
                  @click.stop="toggleAvailableStudent(student.id)"
                />
              </div>
              <div class="student-avatar">
                {{ (student.first_name || '?').charAt(0) }}{{ (student.last_name || '?').charAt(0) }}
              </div>
              <div class="student-info">
                <div class="student-name">{{ student.last_name || 'N/A' }}, {{ student.first_name || 'N/A' }}</div>
                <div class="student-meta">
                  <span class="student-id">{{ student.student_id }}</span>
                  <span class="separator">•</span>
                  <span class="grade-badge">Grade {{ student.grade_level }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="panel-actions">
            <button 
              @click="enrollSelected" 
              :disabled="selectedAvailableStudents.length === 0"
              class="btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Enroll Selected ({{ selectedAvailableStudents.length }})
            </button>
            <button 
              @click="clearAvailableSelection"
              :disabled="selectedAvailableStudents.length === 0"
              class="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear Selection
            </button>
          </div>
        </div>

        <!-- Currently Enrolled Students (Right) -->
        <div class="students-panel enrolled-panel">
          <div class="panel-header">
            <div class="panel-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
              </svg>
              <h2>Currently Enrolled</h2>
            </div>
            <span class="count-badge enrolled">{{ filteredEnrolledStudents.length }}</span>
          </div>
          
          <div class="panel-controls">
            <div class="search-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                v-model="searchEnrolled" 
                type="text" 
                placeholder="Search enrolled students..." 
                class="search-input"
              />
            </div>
            <button @click="showBulkEnrollModal = true" class="btn-bulk">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              Bulk Enroll
            </button>
          </div>
          
          <div class="students-list">
            <div v-if="loadingEnrolled" class="loading-state">
              <div class="spinner"></div>
              <p>Loading enrolled students...</p>
            </div>
            <div v-else-if="filteredEnrolledStudents.length === 0" class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h4>No Students Enrolled</h4>
              <p>Start by enrolling students from the left panel</p>
            </div>
            <div 
              v-else 
              v-for="enrollment in filteredEnrolledStudents" 
              :key="enrollment.id"
              class="student-item enrolled"
            >
              <div class="student-avatar enrolled-avatar">
                {{ (enrollment.student_first_name || '?').charAt(0) }}{{ (enrollment.student_last_name || '?').charAt(0) }}
              </div>
              <div class="student-info">
                <div class="student-name">{{ enrollment.student_last_name || 'N/A' }}, {{ enrollment.student_first_name || 'N/A' }}</div>
                <div class="student-meta">
                  <span class="student-id">{{ enrollment.student_id }}</span>
                  <span class="separator">•</span>
                  <span class="enrollment-date">Enrolled: {{ formatDate(enrollment.created_at) }}</span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="openTransferModal(enrollment)" class="action-btn transfer" title="Transfer to another section">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                    <polyline points="7 23 3 19 7 15"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </button>
                <button @click="confirmUnenroll(enrollment)" class="action-btn unenroll" title="Unenroll student">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state-main">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
      <h3>Select a Section</h3>
      <p>Choose a section from the dropdown above to manage enrollments</p>
    </div>

    <!-- Unenroll Confirmation Modal -->
    <div v-if="showUnenrollModal" class="modal-overlay" @click.self="showUnenrollModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Confirm Unenrollment</h2>
          <button @click="showUnenrollModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p class="modal-message">Are you sure you want to unenroll <strong>{{ selectedEnrollment?.student_first_name }} {{ selectedEnrollment?.student_last_name }}</strong> from this section?</p>
          <p class="warn-text">This will remove their access to this subject and all related content.</p>
          <div class="modal-actions">
            <button @click="unenrollStudent" class="btn-warn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Unenroll Student
            </button>
            <button @click="showUnenrollModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Student Modal -->
    <div v-if="showTransferModal" class="modal-overlay" @click.self="showTransferModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Transfer Student</h2>
          <button @click="showTransferModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedEnrollment">
          <div class="modal-icon info">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </div>
          <p class="modal-message">Transfer <strong>{{ selectedEnrollment.student_first_name }} {{ selectedEnrollment.student_last_name }}</strong> to another section</p>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Select Target Section
            </label>
            <select v-model="transferTargetSectionId" class="select-input">
              <option value="">-- Choose a section --</option>
              <option 
                v-for="section in sections" 
                :key="section.id" 
                :value="section.id"
                :disabled="section.id === selectedSectionId"
              >
                Grade {{ section.grade_level }} - {{ section.name }} ({{ section.subject_name }})
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button @click="transferStudent" :disabled="!transferTargetSectionId" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              </svg>
              Transfer Student
            </button>
            <button @click="showTransferModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Enrollment Modal -->
    <div v-if="showBulkEnrollModal" class="modal-overlay" @click.self="showBulkEnrollModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Bulk Enrollment via CSV</h2>
          <button @click="showBulkEnrollModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon info">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
              <polyline points="13 2 13 9 20 9"/>
            </svg>
          </div>
          <p class="modal-message">Upload a CSV file with student IDs to enroll multiple students at once</p>
          <div class="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
              <strong>CSV Format:</strong> One student ID per line or comma-separated
              <br>
              <small>Example: 2024001, 2024002, 2024003</small>
            </div>
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              Select CSV File
            </label>
            <input type="file" accept=".csv" @change="handleCSVUpload" class="file-input" />
          </div>
          <div v-if="bulkEnrollPreview.length > 0" class="preview-section">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Preview ({{ bulkEnrollPreview.length }} students found)
            </h4>
            <div class="preview-list">
              <div v-for="(id, idx) in bulkEnrollPreview.slice(0, 10)" :key="idx" class="preview-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ id }}
              </div>
              <div v-if="bulkEnrollPreview.length > 10" class="preview-more">
                +{{ bulkEnrollPreview.length - 10 }} more students
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="processBulkEnroll" :disabled="bulkEnrollPreview.length === 0" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Enroll {{ bulkEnrollPreview.length }} Students
            </button>
            <button @click="showBulkEnrollModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'EnrollmentManagement',
  data() {
    return {
      sections: [],
      selectedSectionId: '',
      selectedSection: null,
      availableStudents: [],
      enrolledStudents: [],
      filteredAvailableStudents: [],
      filteredEnrolledStudents: [],
      searchAvailable: '',
      searchEnrolled: '',
      filterGrade: '',
      selectedAvailableStudents: [],
      loadingAvailable: false,
      loadingEnrolled: false,
      showUnenrollModal: false,
      showTransferModal: false,
      showBulkEnrollModal: false,
      selectedEnrollment: null,
      transferTargetSectionId: '',
      bulkEnrollPreview: []
    }
  },
  mounted() {
    this.fetchSections()
  },
  watch: {
    searchAvailable() {
      this.applyAvailableFilter()
    },
    searchEnrolled() {
      this.applyEnrolledFilter()
    }
  },
  methods: {
    goBackToDashboard() {
      this.$router.push('/admin/dashboard')
    },

    async fetchSections() {
      const { data, error } = await supabase
        .from('sections')
        .select(`
          id,
          name,
          section_code,
          max_students,
          is_active,
          subject_id,
          subjects!inner(
            id, 
            name,
            grade_level,
            teacher_id,
            teachers!inner(
              id,
              full_name,
              email
            )
          ),
          school_years(
            id, 
            year_name
          )
        `)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching sections:', error)
        alert('Failed to load sections. Please check the database connection.')
        return
      }

      console.log('Fetched sections:', data)

      this.sections = data?.map(s => ({
        id: s.id,
        name: s.name,
        section_code: s.section_code,
        max_students: s.max_students,
        subject_id: s.subject_id,
        subject_name: s.subjects?.name || 'N/A',
        grade_level: s.subjects?.grade_level || 0,
        teacher_id: s.subjects?.teachers?.id || null,
        teacher_name: s.subjects?.teachers?.full_name || 'Not assigned',
        teacher_email: s.subjects?.teachers?.email || '',
        school_year_name: s.school_years?.year_name || 'N/A'
      })) || []
    },

    async onSectionChange() {
      this.selectedSection = this.sections.find(s => s.id === this.selectedSectionId)
      this.selectedAvailableStudents = []
      this.searchAvailable = ''
      this.searchEnrolled = ''
      this.filterGrade = ''
      
      if (this.selectedSectionId) {
        await Promise.all([
          this.fetchEnrolledStudents(),
          this.fetchAvailableStudents()
        ])
      }
    },

    async fetchEnrolledStudents() {
      this.loadingEnrolled = true
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          created_at,
          students(id, student_id, first_name, last_name, grade_level)
        `)
        .eq('section_id', this.selectedSectionId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching enrolled students:', error)
        this.loadingEnrolled = false
        return
      }

      this.enrolledStudents = data.map(e => ({
        ...e,
        student_first_name: e.students?.first_name || '',
        student_last_name: e.students?.last_name || '',
        student_id: e.students?.student_id || '',
        student_grade: e.students?.grade_level || ''
      }))
      
      this.applyEnrolledFilter()
      this.loadingEnrolled = false
    },

    async fetchAvailableStudents() {
      this.loadingAvailable = true
      
      // Get all students with matching grade level (if section has grade_level)
      const gradeLevel = this.selectedSection?.grade_level
      
      let query = supabase
        .from('students')
        .select('id, student_id, first_name, last_name, middle_name, grade_level, enrollment_status')
        .eq('enrollment_status', 'active')

      if (gradeLevel) {
        query = query.eq('grade_level', gradeLevel)
      }

      const { data: allStudents, error } = await query

      if (error) {
        console.error('Error fetching students:', error)
        this.loadingAvailable = false
        return
      }

      // Filter out students already enrolled in this section
      const enrolledStudentIds = this.enrolledStudents.map(e => e.students?.id)
      this.availableStudents = allStudents.filter(s => !enrolledStudentIds.includes(s.id))
      
      this.applyAvailableFilter()
      this.loadingAvailable = false
    },

    applyAvailableFilter() {
      let result = [...this.availableStudents]

      // Search filter
      if (this.searchAvailable.trim()) {
        const q = this.searchAvailable.toLowerCase()
        result = result.filter(s => 
          s.first_name?.toLowerCase().includes(q) ||
          s.last_name?.toLowerCase().includes(q) ||
          s.student_id?.toLowerCase().includes(q)
        )
      }

      // Grade filter
      if (this.filterGrade) {
        result = result.filter(s => s.grade_level === parseInt(this.filterGrade))
      }

      this.filteredAvailableStudents = result
    },

    applyEnrolledFilter() {
      let result = [...this.enrolledStudents]

      // Search filter
      if (this.searchEnrolled.trim()) {
        const q = this.searchEnrolled.toLowerCase()
        result = result.filter(e => 
          e.student_first_name?.toLowerCase().includes(q) ||
          e.student_last_name?.toLowerCase().includes(q) ||
          e.student_id?.toLowerCase().includes(q)
        )
      }

      this.filteredEnrolledStudents = result
    },

    toggleAvailableStudent(studentId) {
      const index = this.selectedAvailableStudents.indexOf(studentId)
      if (index > -1) {
        this.selectedAvailableStudents.splice(index, 1)
      } else {
        this.selectedAvailableStudents.push(studentId)
      }
    },

    clearAvailableSelection() {
      this.selectedAvailableStudents = []
    },

    async enrollSelected() {
      if (this.selectedAvailableStudents.length === 0) return

      // Get current school year and grading period
      const { data: schoolYear } = await supabase
        .from('school_years')
        .select('id')
        .eq('is_active', true)
        .single()

      const { data: gradingPeriod } = await supabase
        .from('grading_periods')
        .select('id')
        .eq('is_active', true)
        .single()

      const enrollments = this.selectedAvailableStudents.map(studentId => ({
        student_id: studentId,
        section_id: this.selectedSectionId,
        school_year_id: schoolYear?.id || null,
        grading_period_id: gradingPeriod?.id || null,
        status: 'active'
      }))

      const { error } = await supabase.from('enrollments').insert(enrollments)

      if (error) {
        console.error('Error enrolling students:', error)
        alert('Failed to enroll students')
        return
      }

      alert(`Successfully enrolled ${this.selectedAvailableStudents.length} student(s)`)
      this.selectedAvailableStudents = []
      await this.onSectionChange() // Refresh lists
    },

    confirmUnenroll(enrollment) {
      this.selectedEnrollment = enrollment
      this.showUnenrollModal = true
    },

    async unenrollStudent() {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', this.selectedEnrollment.id)

      if (error) {
        console.error('Error unenrolling student:', error)
        alert('Failed to unenroll student')
        return
      }

      alert('Student unenrolled successfully')
      this.showUnenrollModal = false
      await this.onSectionChange() // Refresh lists
    },

    openTransferModal(enrollment) {
      this.selectedEnrollment = enrollment
      this.transferTargetSectionId = ''
      this.showTransferModal = true
    },

    async transferStudent() {
      if (!this.transferTargetSectionId) return

      // Delete old enrollment
      const { error: deleteError } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', this.selectedEnrollment.id)

      if (deleteError) {
        console.error('Error removing old enrollment:', deleteError)
        alert('Failed to transfer student')
        return
      }

      // Create new enrollment
      const { data: schoolYear } = await supabase
        .from('school_years')
        .select('id')
        .eq('is_active', true)
        .single()

      const { data: gradingPeriod } = await supabase
        .from('grading_periods')
        .select('id')
        .eq('is_active', true)
        .single()

      const { error: insertError } = await supabase
        .from('enrollments')
        .insert({
          student_id: this.selectedEnrollment.students.id,
          section_id: this.transferTargetSectionId,
          school_year_id: schoolYear?.id || null,
          grading_period_id: gradingPeriod?.id || null,
          status: 'active'
        })

      if (insertError) {
        console.error('Error creating new enrollment:', insertError)
        alert('Failed to transfer student')
        return
      }

      alert('Student transferred successfully')
      this.showTransferModal = false
      await this.onSectionChange() // Refresh lists
    },

    handleCSVUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        // Parse CSV - support both comma-separated and newline-separated
        const ids = text
          .split(/[\n,]/)
          .map(id => id.trim())
          .filter(id => id.length > 0)
        
        this.bulkEnrollPreview = ids
      }
      reader.readAsText(file)
    },

    async processBulkEnroll() {
      if (this.bulkEnrollPreview.length === 0) return

      // Find students by student_id
      const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('id, student_id')
        .in('student_id', this.bulkEnrollPreview)

      if (fetchError) {
        console.error('Error fetching students:', fetchError)
        alert('Failed to find students')
        return
      }

      if (students.length === 0) {
        alert('No matching students found')
        return
      }

      // Get current school year and grading period
      const { data: schoolYear } = await supabase
        .from('school_years')
        .select('id')
        .eq('is_active', true)
        .single()

      const { data: gradingPeriod } = await supabase
        .from('grading_periods')
        .select('id')
        .eq('is_active', true)
        .single()

      const enrollments = students.map(s => ({
        student_id: s.id,
        section_id: this.selectedSectionId,
        school_year_id: schoolYear?.id || null,
        grading_period_id: gradingPeriod?.id || null,
        status: 'active'
      }))

      const { error: insertError } = await supabase
        .from('enrollments')
        .insert(enrollments)

      if (insertError) {
        console.error('Error bulk enrolling:', insertError)
        alert('Failed to enroll students')
        return
      }

      alert(`Successfully enrolled ${students.length} student(s)`)
      this.showBulkEnrollModal = false
      this.bulkEnrollPreview = []
      await this.onSectionChange() // Refresh lists
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.enrollment-management {
  min-height: 100vh;
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1.5rem 2rem;
  position: relative;
}

/* Custom Scrollbar */
.enrollment-management::-webkit-scrollbar {
  width: 12px;
}

.enrollment-management::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.enrollment-management::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.enrollment-management::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Back Button */
.top-navigation {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(241, 245, 249, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.back-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.back-button:hover::before {
  left: 100%;
}

.back-button:hover {
  background: rgba(226, 232, 240, 0.9);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.back-button svg {
  transition: transform 0.3s ease;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

/* Page Header */
.page-header {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.header-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3D8D7A, #2d6a5a, #3D8D7A);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.header-text h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 30px rgba(61, 141, 122, 0.4);
  }
}

/* Selection Card */
.selection-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
  position: relative;
  overflow: hidden;
}

.selection-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.selection-card:hover::before {
  left: 100%;
}

.card-header-section {
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid #f1f5f9;
}

.card-header-section h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  letter-spacing: -0.3px;
}

.card-description {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1400px) {
  .selection-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.8125rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.form-group label svg {
  color: #3D8D7A;
  width: 14px;
  height: 14px;
}

.select-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.select-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1);
}

.info-display {
  padding: 0.625rem 0.875rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
  min-height: 40px;
  display: flex;
  align-items: center;
}

/* Two Columns Layout */
.enrollment-container {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Students Panel - Perfectly Fitted */
.students-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 420px);
  min-height: 400px;
  max-height: 520px;
  overflow: hidden;
  position: relative;
}

.students-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.students-panel:hover::before {
  left: 100%;
}

.enrolled-panel {
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 30px rgba(61, 141, 122, 0.15);
}

.panel-header {
  padding: 1rem 1.25rem;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(250, 251, 252, 0.9), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.panel-title svg {
  color: #3D8D7A;
  width: 22px;
  height: 22px;
}

.panel-title h2 {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.count-badge {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #475569;
  padding: 0.3125rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 700;
  min-width: 36px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.count-badge.enrolled {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
}

.panel-controls {
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  gap: 0.625rem;
  align-items: center;
  flex-shrink: 0;
  background: rgba(250, 251, 252, 0.8);
  backdrop-filter: blur(10px);
}

.search-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-wrapper svg {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
  width: 16px;
  height: 16px;
}

.search-input {
  flex: 1;
  padding: 0.5625rem 0.875rem 0.5625rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.filter-select {
  padding: 0.5625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.filter-select:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1);
}

.btn-bulk {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5625rem 1rem;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.25);
  position: relative;
  overflow: hidden;
}

.btn-bulk::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-bulk:hover::before {
  left: 100%;
}

.btn-bulk:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);
}

.btn-bulk svg {
  width: 16px;
  height: 16px;
}

/* Students List - Enhanced Scrollbar */
.students-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.875rem;
  min-height: 0;
}

.students-list::-webkit-scrollbar {
  width: 10px;
}

.students-list::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 8px;
  margin: 8px 0;
}

.students-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 8px;
  border: 2px solid rgba(241, 245, 249, 0.5);
}

.students-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2d6a5a, #1e4d3f);
  border: 1px solid #e2e8f0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #94a3b8;
  gap: 0.875rem;
}

.empty-state svg {
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #64748b;
  margin: 0;
}

.empty-state p {
  font-size: 0.8125rem;
  margin: 0;
  font-weight: 500;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  border-radius: 12px;
  margin-bottom: 0.625rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e2e8f0;
  background: white;
}

.student-item:hover {
  background: linear-gradient(135deg, #fafbfc, #f8fafc);
  border-color: #cbd5e1;
  transform: translateX(3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.student-item.selected {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1), rgba(45, 106, 90, 0.08));
  border-color: #3D8D7A;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.student-item.enrolled {
  cursor: default;
  background: #fafbfc;
}

.student-item.enrolled:hover {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  transform: none;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3D8D7A;
  border-radius: 4px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8125rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.25);
  letter-spacing: 0.5px;
}

.enrolled-avatar {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.25);
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 700;
  font-size: 0.875rem;
  color: #1e293b;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.student-meta {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-weight: 500;
}

.student-id {
  font-weight: 600;
  color: #3D8D7A;
}

.separator {
  color: #cbd5e1;
}

.grade-badge {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #0369a1;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.enrollment-date {
  font-size: 0.6875rem;
  color: #94a3b8;
  font-weight: 500;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.transfer {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #0369a1;
}

.action-btn.transfer:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

.action-btn.unenroll {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.action-btn.unenroll:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* Panel Actions - Enhanced */
.panel-actions {
  padding: 1rem 1.25rem;
  border-top: 2px solid #f1f5f9;
  display: flex;
  gap: 0.625rem;
  background: linear-gradient(135deg, rgba(250, 251, 252, 0.9), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
  border-radius: 0 0 16px 16px;
  flex-shrink: 0;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  padding: 0.6875rem 1.125rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.25);
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary svg {
  width: 16px;
  height: 16px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 0.6875rem 1.125rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0.3px;
}

.btn-secondary svg {
  width: 16px;
  height: 16px;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-warn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.6875rem 1.125rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.btn-warn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-warn:hover::before {
  left: 100%;
}

.btn-warn svg {
  width: 16px;
  height: 16px;
}

.btn-warn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
}

.btn-warn:active {
  transform: translateY(0);
}

/* Empty State Main */
.empty-state-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px dashed rgba(203, 213, 225, 0.6);
  color: #94a3b8;
  gap: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.empty-state-main svg {
  opacity: 0.4;
}

.empty-state-main h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  letter-spacing: -0.3px;
}

.empty-state-main p {
  font-size: 0.9375rem;
  margin: 0;
  font-weight: 500;
}

/* Modal Styles - Enhanced */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 550px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 8px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 8px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content.small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, rgba(250, 251, 252, 0.9), rgba(255, 255, 255, 0.9));
  backdrop-filter: blur(10px);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.close-btn {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
}

.close-btn:hover {
  background: #dc2626;
  color: white;
  transform: rotate(90deg);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.modal-body {
  padding: 2rem;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-icon.warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
}

.modal-icon.info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1d4ed8;
}

.modal-message {
  font-size: 0.9375rem;
  color: #475569;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
}

.warn-text {
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  padding: 0.875rem 1rem;
  border-radius: 10px;
  border-left: 4px solid #dc2626;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.info-box {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-left: 4px solid #0ea5e9;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #0c4a6e;
  font-weight: 500;
}

.info-box svg {
  flex-shrink: 0;
  color: #0ea5e9;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.file-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  font-size: 0.875rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.file-input:hover {
  border-color: #3D8D7A;
  background: #f8fafc;
}

.preview-section {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
}

.preview-section h4 {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-section h4 svg {
  color: #3D8D7A;
}

.preview-list {
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-list::-webkit-scrollbar {
  width: 6px;
}

.preview-list::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 6px;
}

.preview-list::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 6px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.preview-item svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.preview-more {
  padding: 0.75rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 700;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .enrollment-management {
    padding: 1rem 1.5rem;
  }

  .students-panel {
    max-height: 480px;
  }
}

@media (max-width: 1200px) {
  .two-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .enrolled-panel {
    border-width: 2px;
  }

  .students-panel {
    height: auto;
    max-height: 450px;
  }
}

@media (max-width: 768px) {
  .enrollment-management {
    padding: 0.75rem 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .selection-grid {
    grid-template-columns: 1fr;
  }

  .panel-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-warn {
    width: 100%;
  }

  .panel-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrapper {
    width: 100%;
  }

  .filter-select,
  .btn-bulk {
    width: 100%;
  }

  .student-item {
    padding: 0.75rem;
  }

  .student-avatar {
    width: 36px;
    height: 36px;
    font-size: 0.75rem;
  }

  .back-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .enrollment-management {
    padding: 0.5rem;
  }

  .header-text h1 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.8125rem;
  }

  .student-name {
    font-size: 0.8125rem;
  }

  .students-panel {
    max-height: 380px;
  }

  .back-button {
    padding: 0.65rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
