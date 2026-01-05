# Admin-Teacher Dual Role Implementation

## Overview

This implementation allows administrators to also function as teachers without needing separate accounts. An admin can enable teacher access, which registers them in the teachers table and allows them to switch between the Admin Dashboard and Teacher Dashboard while remaining logged in under the same account.

## Features

### 1. **Admin Dashboard Enhancement**

- New "Teacher Access" section in the Admin Dashboard
- Shows current teacher role status
- "Enable Teacher Role" button to register admin as teacher
- "Switch to Teacher Dashboard" button once teacher role is enabled

### 2. **Teacher Dashboard Enhancement**

- Detects if logged-in teacher is also an admin
- Shows "Admin • Teacher" badge in profile dropdown
- "Switch to Admin Dashboard" link in the profile menu

### 3. **Seamless Role Switching**

- No need to log out and log back in
- Maintains session across role switches
- Full access to both interfaces

## Implementation Details

### Files Modified

#### 1. `/src/composables/useAdminAuth.js` (NEW)

- Admin authentication composable
- Methods:
  - `initializeAuth()` - Initializes admin session
  - `checkTeacherRole()` - Checks if admin has teacher record
  - `registerAsTeacher()` - Creates teacher record for admin
  - `switchToTeacherDashboard()` - Navigates to teacher dashboard

#### 2. `/src/views/admin/AdminDashboard.vue`

- Added dual-role section with teacher access card
- Integrated `useAdminAuth` composable
- Methods added:
  - `checkIfHasTeacherRole()` - Checks on mount
  - `enableTeacherRole()` - Registers admin as teacher
  - `switchToTeacher()` - Switches to teacher dashboard

#### 3. `/src/composables/useTeacherAuth.js`

- Modified to accept both 'teacher' and 'admin' roles
- Checks for teacher record for both role types
- Returns specific error for admins without teacher records

#### 4. `/src/components/teacher/TeacherNavbar.vue`

- Added `isAdmin` computed property
- Shows "Switch to Admin Dashboard" link for admins
- Displays "Admin • Teacher" badge for dual-role users
- Special styling for admin link with gradient background

### Database Schema

The implementation uses existing tables:

- **profiles** - Contains user auth and role ('admin' or 'teacher')
- **teachers** - Contains teacher-specific data

When an admin enables teacher role:

```javascript
{
  profile_id: <admin_profile_id>,
  first_name: <from_admin_profile>,
  last_name: <from_admin_profile>,
  full_name: <from_admin_profile>,
  email: <admin_email>,
  employee_id: <auto_generated>,
  status: 'active',
  is_active: true
}
```

## User Flow

### Enabling Teacher Role (Admin → Teacher)

1. Admin logs into Admin Dashboard
2. Sees "Teacher Access" card showing role is not enabled
3. Clicks "Enable Teacher Role"
4. Confirms the action
5. System creates teacher record with admin's profile info
6. Card updates to show "Switch to Teacher Dashboard" button
7. Admin can now switch to teacher dashboard

### Switching Between Dashboards

#### Admin → Teacher:

1. Click "Switch to Teacher Dashboard" button
2. Redirected to `/teacher/dashboard`
3. Full teacher functionality available

#### Teacher → Admin:

1. Click profile dropdown in navbar
2. See "Switch to Admin Dashboard" link (only if user is admin)
3. Click to navigate to `/admin/dashboard`
4. Full admin functionality available

## Error Handling

- **Already registered**: If admin tries to enable teacher role twice, shows success message
- **Missing profile**: Throws error if no admin profile found
- **Database errors**: Catches and displays specific error messages
- **Navigation errors**: Graceful handling with user-friendly messages

## UI/UX Design

### Admin Dashboard - Teacher Access Card

- Clean, card-based design
- Gradient icon for visual appeal
- Clear call-to-action buttons
- Color-coded states:
  - Gray/white: Role not enabled
  - Green gradient: Role enabled

### Teacher Navbar - Admin Link

- Prominent placement at top of dropdown menu
- Special gradient background (teal/green)
- Icon representing admin dashboard
- Hover effects for interactivity

### Visual Indicators

- **Badge**: "Admin • Teacher" in profile dropdown
- **Gradient colors**: Teal (#3D8D7A) for admin-related features
- **Icons**: Distinctive SVG icons for each role

## Security Considerations

- Only users with 'admin' role can enable teacher access
- Teacher record requires valid profile_id
- Authentication checked on every route
- Role validation in composables
- No privilege escalation possible

## Future Enhancements

Potential improvements:

1. Admin settings to configure dual-role permissions
2. Ability to disable teacher role
3. Audit log for role switches
4. Role-specific permissions within teacher dashboard
5. Quick role switcher in header for faster navigation

## Testing Checklist

- [ ] Admin can enable teacher role
- [ ] Admin can switch to teacher dashboard
- [ ] Teacher dashboard shows admin badge
- [ ] Admin can switch back to admin dashboard
- [ ] Teacher role persists after logout/login
- [ ] Error handling works correctly
- [ ] UI elements display properly
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Database records created correctly

## Support

For issues or questions about the dual-role feature:

1. Check the browser console for errors
2. Verify database teacher record exists
3. Ensure profile role is 'admin'
4. Clear browser cache if UI doesn't update
5. Check network tab for failed API calls
