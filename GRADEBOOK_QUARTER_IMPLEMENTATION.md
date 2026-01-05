# Gradebook Quarter Organization Implementation

## ✅ Changes Completed

### 1. **Database Updates**

- Added `grading_period_id` column to `quizzes` table
- Added `grading_period_id` column to `assignments` table
- Created migration SQL file: `add_grading_period_to_assessments.sql`

### 2. **Gradebook.vue Updates**

#### **New Data Properties:**

```javascript
const gradingPeriods = ref([])
const selectedQuarter = ref(null)
const currentSchoolYear = ref(null)
```

#### **New Computed Property:**

- `filteredAssessments`: Filters assessments by selected quarter
- Updated `analyticsData` to use filtered assessments

#### **New Functions:**

- `fetchGradingPeriods()`: Fetches all grading periods for the active school year
- `selectQuarter(quarter)`: Allows teachers to switch between quarters

#### **Updated Functions:**

- `fetchGradebookData()`: Now fetches `grading_period_id` from quizzes and assignments
- `onMounted()`: Now calls `fetchGradingPeriods()` on component mount

### 3. **UI Components Added**

#### **Quarter Selection Card:**

- Displays all 4 quarters (1st, 2nd, 3rd, 4th)
- Shows school year badge (e.g., "S.Y. 2025-2026")
- Visual indicators for:
  - **Active Quarter**: Green "Active" badge
  - **Completed Quarter**: Gray "Completed" badge
  - **Upcoming Quarter**: Orange "Upcoming" badge
- Displays date range for each quarter
- Highlights currently selected quarter

#### **Gradebook Table:**

- Now only shows assessments for the selected quarter
- Analytics (Average, Highest, Lowest, Submission Rate) calculated per quarter
- Maintains sorting and filtering functionality

### 4. **Styling Added**

- Modern card design for quarter selection
- Gradient backgrounds for selected quarter
- Responsive grid layout
- Full dark mode support
- Smooth transitions and hover effects

## 📅 Quarter System

Based on Philippine DepEd Calendar (Butuan City):

- **1st Quarter**: June - August
- **2nd Quarter**: September - November (Currently Active - January 5, 2026)
- **3rd Quarter**: December - February
- **4th Quarter**: March - May

## 🎯 Features

### For Teachers:

1. **Organize by Quarter**: View and manage grades by specific grading periods
2. **Visual Quarter Status**: Easily see which quarter is active, completed, or upcoming
3. **Quarter Analytics**: Get statistics specific to each quarter
4. **Easy Navigation**: Click to switch between quarters instantly
5. **Export by Quarter**: Excel export now includes only the selected quarter's data

### Automatic Features:

- Auto-selects the currently active quarter on load
- Automatically calculates which quarter based on current date
- Shows school year information
- Filters assessments in real-time

## 📋 How to Use

### Step 1: Run the Database Migration

```sql
-- Run this in Supabase SQL Editor
-- File: add_grading_period_to_assessments.sql
```

### Step 2: Assign Grading Periods to Assessments

When creating quizzes or assignments, teachers should select the appropriate quarter. The system will:

- Auto-assign to current active quarter for existing assessments
- Allow manual selection for future assessments

### Step 3: View Gradebook

1. Select a Grade Level
2. Select a Section
3. Choose a Quarter (defaults to active quarter)
4. View and manage grades for that specific quarter

## 🔄 Data Flow

```
1. Component Mounts
   ↓
2. Fetch Active School Year
   ↓
3. Fetch Grading Periods for That Year
   ↓
4. Auto-select Active Quarter
   ↓
5. Display Quarter Selection UI
   ↓
6. When Section Selected → Fetch Assessments
   ↓
7. Filter Assessments by Selected Quarter
   ↓
8. Display Gradebook Table with Filtered Data
```

## 🎨 UI/UX Improvements

### Quarter Selection Card:

- **Header**: Shows "Select Grading Period" with school year badge
- **Buttons**: Grid of 4 quarter cards
- **Each Card Shows**:
  - Quarter icon
  - Quarter name (1st Quarter, 2nd Quarter, etc.)
  - Date range
  - Status badge (Active/Completed/Upcoming)
- **Active Selection**: Highlighted with gradient background

### Visual Feedback:

- ✅ Selected quarter: Green gradient background
- 📅 Active quarter: Green border (if not selected)
- ✔️ Completed quarter: Reduced opacity
- ⏳ Upcoming quarter: Orange badge

## 📊 Analytics Per Quarter

The gradebook now calculates and displays:

- **Average Score**: Mean of all student scores in selected quarter
- **Highest Score**: Best performance in selected quarter
- **Lowest Score**: Lowest performance in selected quarter
- **Submission Rate**: Percentage of completed assessments in selected quarter

## 🚀 Benefits

1. **Better Organization**: Grades clearly separated by quarter
2. **Easier Grading**: Focus on one quarter at a time
3. **Accurate Reporting**: Quarter-specific analytics and reports
4. **Compliance**: Matches Philippine DepEd grading system
5. **Historical Data**: Easy access to past quarters
6. **Planning**: See upcoming quarters for planning

## 🔧 Technical Details

### Database Schema:

```sql
-- quizzes table
grading_period_id UUID REFERENCES grading_periods(id)

-- assignments table
grading_period_id UUID REFERENCES grading_periods(id)
```

### Component Architecture:

- Uses Vue 3 Composition API
- Reactive data with `ref()`
- Computed properties for filtering
- Auto-updates on quarter change

## 📝 Notes

- All existing assessments are auto-assigned to the current active quarter
- Teachers can manually change the quarter for any assessment
- The system automatically determines the current quarter based on date
- Dark mode fully supported throughout
- Mobile-responsive design included

## ✨ Future Enhancements (Optional)

- Bulk quarter assignment for assessments
- Quarter comparison charts
- Quarter performance trends
- Quarter-based student reports
- Quarter closing/locking mechanism
