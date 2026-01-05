# Quick Debug Guide: Switch to Teacher Dashboard Button

## What Was Fixed

### 1. **Router Guard Update**

- **Problem**: The route guard was blocking admins from accessing teacher routes
- **Solution**: Added special check to allow admins with teacher records to access teacher routes
- **File**: `src/router/index.js`

### 2. **Button Click Handler**

- **Problem**: Button might not be properly handling clicks
- **Solution**: Added `@click.prevent` and `type="button"` to prevent form submission
- **File**: `AdminDashboard.vue`

### 3. **CSS Z-Index**

- **Problem**: Button might be hidden behind other elements
- **Solution**: Added `z-index: 10` to button and container
- **File**: `AdminDashboard.vue` styles

### 4. **Better Error Logging**

- Added console.log statements to track the flow
- Added double-check of teacher role before navigation

## How to Test

### Step 1: Open Browser DevTools

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Clear the console (trash icon)

### Step 2: Enable Teacher Role

1. On Admin Dashboard, find "Teacher Access" card
2. Click "Enable Teacher Role"
3. Confirm the dialog
4. Watch console for messages
5. Button should change to "Switch to Teacher Dashboard"

### Step 3: Click the Switch Button

1. Click "Switch to Teacher Dashboard"
2. Watch console for these messages:
   ```
   Switching to teacher dashboard...
   Admin info: { id: '...', role: 'admin', ... }
   Has teacher role: true
   Navigating to /teacher/dashboard
   ✓ Admin has teacher record, allowing access to teacher route
   ✓ Auth check passed, proceeding
   Navigation complete
   ```
3. Should navigate to Teacher Dashboard

## Troubleshooting

### Button Not Visible

**Check in Console:**

```javascript
// In browser console
$vm0.hasTeacherRole // Should be true after enabling
$vm0.showDualRoleSection // Should be true
```

### Button Not Clickable

**Check:**

1. Is the button disabled? Check the HTML in Elements tab
2. Is there an overlay? Right-click → Inspect → Check z-index
3. Try clicking directly in console:

```javascript
document.querySelector('.btn-switch-teacher').click()
```

### Navigation Blocked

**Check Console for:**

- "Role mismatch" - Route guard is blocking
- "No teacher record" - Need to enable teacher role first
- "Profile error" - Database issue

**Verify Teacher Record:**

```javascript
// In browser console
const session = await supabase.auth.getSession()
const profile = await supabase
  .from('profiles')
  .select('*')
  .eq('auth_user_id', session.data.session.user.id)
  .single()
const teacher = await supabase
  .from('teachers')
  .select('*')
  .eq('profile_id', profile.data.id)
  .single()

console.log('Profile:', profile.data)
console.log('Teacher:', teacher.data)
```

### Database Query

**Run in Supabase SQL Editor:**

```sql
-- Check if you have teacher record
SELECT
    p.id as profile_id,
    p.full_name,
    p.email,
    p.role,
    t.id as teacher_id,
    t.employee_id,
    t.is_active
FROM profiles p
LEFT JOIN teachers t ON t.profile_id = p.id
WHERE p.auth_user_id = auth.uid();
```

## Expected Flow

1. **Page Load**

   ```
   Admin authentication initialized: <id>
   Checking teacher role...
   ```

2. **Enable Teacher (if not enabled)**

   ```
   Enabling teacher role...
   Teacher record created for admin: { id: '...', ... }
   Teacher role enabled successfully!
   ```

3. **Switch to Teacher**
   ```
   Switching to teacher dashboard...
   Admin info: { ... }
   Has teacher role: true
   Navigating to /teacher/dashboard
   ✓ Admin has teacher record, allowing access to teacher route
   Teacher authentication initialized: <teacher_id>
   Navigation complete
   ```

## Manual Test Script

Copy and paste this in browser console after enabling teacher role:

```javascript
// Test 1: Check state
console.log('=== STATE CHECK ===')
console.log('Has teacher role:', $vm0.hasTeacherRole)
console.log('Admin info:', $vm0.adminInfo)

// Test 2: Check teacher record in database
console.log('=== DATABASE CHECK ===')
const session = await supabase.auth.getSession()
const profile = await supabase
  .from('profiles')
  .select('id, role')
  .eq('auth_user_id', session.data.session.user.id)
  .single()
console.log('Profile:', profile.data)

const teacher = await supabase
  .from('teachers')
  .select('*')
  .eq('profile_id', profile.data.id)
  .eq('is_active', true)
  .maybeSingle()
console.log('Teacher record:', teacher.data)

// Test 3: Try manual navigation
console.log('=== NAVIGATION TEST ===')
await $vm0.$router.push('/teacher/dashboard')
console.log('Navigation attempted')
```

## Quick Fixes

### If Still Can't Click:

1. **Hard Refresh**: Ctrl + Shift + R
2. **Clear Cache**: DevTools → Network → Disable cache
3. **Incognito Mode**: Test in private window
4. **Force Update**:
   ```javascript
   $vm0.hasTeacherRole = true
   $vm0.$forceUpdate()
   ```

### If Navigation Blocked:

1. Check you ran the SQL fix script
2. Verify teacher record exists
3. Check route guard in browser console
4. Try direct URL: `http://localhost:5173/teacher/dashboard`

## Success Indicators

✅ Button visible and styled correctly
✅ Button changes from "Enable" to "Switch"
✅ Click triggers console logs
✅ Route guard allows access
✅ Teacher Dashboard loads
✅ Navbar shows "Admin • Teacher" badge
✅ Can switch back to Admin Dashboard

## Need More Help?

If the button still doesn't work:

1. Take a screenshot of the button
2. Copy all console logs
3. Run the manual test script above
4. Share the results
