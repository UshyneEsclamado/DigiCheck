# Analytics Page - School Year and Quarter Display

## ✅ Changes Completed

### 1. **Data Properties Added**

```javascript
const currentSchoolYear = ref<any>(null)
const gradingPeriods = ref<any[]>([])
const currentQuarter = ref<any>(null)
```

### 2. **New Function: fetchGradingPeriods()**

- Fetches the active school year from database
- Retrieves all grading periods for that school year
- Auto-selects the currently active quarter
- Logs school year and quarter information to console

### 3. **Updated Lifecycle**

- `onMounted()` now calls `fetchGradingPeriods()` before loading analytics data
- Ensures school year and quarter are loaded when page initializes

### 4. **UI Updates**

#### **Page Header Enhancement:**

Added academic information display below the subtitle:

- **School Year Badge**: Shows "S.Y. 2025-2026" with calendar icon
- **Quarter Badge**: Displays current quarter (e.g., "2nd Quarter")
- Both badges are styled consistently with the app's theme

### 5. **Styling Added**

#### **Academic Info Container:**

- Flexbox layout for responsive positioning
- Proper spacing and alignment
- Mobile-friendly with wrapping

#### **Academic Year Badge:**

- Gray gradient background (light mode)
- Dark gradient background (dark mode)
- Calendar icon with brand color accent
- Subtle border and padding

#### **Quarter Badge:**

- Teal/green gradient background (brand colors)
- Prominent uppercase text with letter spacing
- Shadow effect for depth
- White text for high contrast

#### **Dark Mode Support:**

- Custom dark theme colors for academic year badge
- Adjusted quarter badge colors for better dark mode visibility
- Proper contrast ratios maintained

### 6. **Return Statement Updated**

Added new properties to the component's return:

```javascript
currentSchoolYear,
gradingPeriods,
currentQuarter,
```

## 📅 Current Display (January 5, 2026)

Based on the database:

- **School Year**: 2025-2026 (Active)
- **Current Quarter**: 2nd Quarter (Active)

## 🎨 Visual Design

### Light Mode:

- Academic Year: Light gray gradient with teal icon
- Quarter: Teal gradient with white text

### Dark Mode:

- Academic Year: Dark gray gradient with green icon
- Quarter: Green gradient with white text

## 📱 Responsive Design

- Badges stack properly on mobile devices
- Icons scale appropriately
- Text remains readable at all sizes
- Flexbox ensures proper wrapping

## 🔄 Data Flow

```
1. Component Mounts
   ↓
2. fetchGradingPeriods() called
   ↓
3. Fetch active school year
   ↓
4. Fetch grading periods for that year
   ↓
5. Auto-select active quarter
   ↓
6. Display in page header
   ↓
7. Continue with fetchData() for analytics
```

## 🎯 Benefits

1. **Context Awareness**: Teachers always know which school year and quarter they're viewing
2. **Consistency**: Matches the same design used in Gradebook and Subjects pages
3. **Professional**: Clean, modern display of academic periods
4. **Informative**: No confusion about which period analytics apply to

## 📝 Technical Details

### CSS Classes:

- `.academic-info` - Container for both badges
- `.academic-year` - School year badge
- `.quarter-badge` - Quarter display badge
- Dark mode variants with `.dark` prefix

### Data Source:

- `school_years` table (for S.Y. 2025-2026)
- `grading_periods` table (for quarters 1-4)

## ✨ Features

- **Auto-Detection**: Automatically shows the current active quarter
- **Real-time**: Updates based on database settings
- **Consistent Branding**: Matches app's color scheme
- **Accessible**: High contrast, readable text
- **Themeable**: Full light/dark mode support

## 🔧 Future Enhancements (Optional)

- Quarter filter dropdown (filter analytics by specific quarter)
- Comparison between quarters
- Historical quarter selector
- Quarter performance trends

---

**Status**: ✅ Complete and Ready for Testing

The Analytics page now displays the current school year and quarter in a prominent, professional manner that matches the rest of the DigiCheck application!
