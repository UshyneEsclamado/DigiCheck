# Troubleshooting Guide: Admin-Teacher Dual Role

## Error: "Failed to enable teacher role: No admin session found"

### Cause

The admin authentication composable hasn't been initialized when the component loads.

### Solution

✅ **FIXED** - The AdminDashboard now calls `initializeAuth()` on mount.

### Verification Steps

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for: `Admin authentication initialized: <profile_id>`
4. If you don't see this, the session isn't initializing

### Manual Fix

If still seeing this error:

```javascript
// Check if you're logged in
const {
  data: { session }
} = await supabase.auth.getSession()
console.log('Session:', session)

// Check your profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('auth_user_id', session.user.id)
  .single()
console.log('Profile:', profile)
```

---

## Error: "Failed to create teacher record" (Database Error)

### Possible Causes

1. **Missing columns in teachers table**
2. **Constraint violations (unique email, employee_id)**
3. **RLS policy blocking the insert**

### Solution Steps

#### Step 1: Run the Database Fix Script

```sql
-- Run this in Supabase SQL Editor
-- File: DATABASE_FIX_DUAL_ROLE.sql
```

#### Step 2: Verify Teachers Table Structure

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'teachers'
ORDER BY ordinal_position;
```

Required columns:

- ✅ `id` (uuid)
- ✅ `profile_id` (uuid)
- ✅ `employee_id` (text, nullable)
- ✅ `full_name` (text, not null)
- ✅ `email` (text, not null)
- ✅ `department` (text, nullable)
- ✅ `is_active` (boolean)
- ✅ `created_at` (timestamptz)
- ✅ `updated_at` (timestamptz)
- ✅ `created_by` (uuid, nullable)
- ✅ `phone_number` (text, nullable)
- ✅ `address` (text, nullable)

#### Step 3: Check for Existing Teacher Record

```sql
-- Check if admin already has a teacher record
SELECT * FROM teachers
WHERE profile_id = (
  SELECT id FROM profiles
  WHERE auth_user_id = auth.uid()
);
```

If a record exists, delete it or update the code to handle existing records.

#### Step 4: Verify RLS Policies

```sql
-- Check RLS policies on teachers table
SELECT * FROM pg_policies
WHERE tablename = 'teachers';
```

Should have:

- "Admins can manage all teachers" (FOR ALL)

---

## Error: "Wrong role" when accessing Teacher Dashboard

### Cause

The `useTeacherAuth` composable only allowed 'teacher' role, not 'admin'.

### Solution

✅ **FIXED** - Now accepts both 'teacher' AND 'admin' roles.

### Verification

```javascript
// In browser console on Teacher Dashboard
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('auth_user_id', (await supabase.auth.getSession()).data.session.user.id)
  .single()

console.log('Role:', profile.role) // Should be 'admin'

const { data: teacher } = await supabase
  .from('teachers')
  .select('*')
  .eq('profile_id', profile.id)
  .single()

console.log('Teacher record:', teacher) // Should exist
```

---

## Button Not Showing / UI Issues

### Issue: "Enable Teacher Role" button not visible

**Check:**

1. Ensure you're logged in as admin
2. Check browser console for errors
3. Verify `showDualRoleSection` is true

**Debug:**

```javascript
// In Vue DevTools
$vm0.showDualRoleSection // Should be true
$vm0.isAuthenticated // Should be true
$vm0.adminInfo // Should contain admin data
```

### Issue: "Switch to Admin Dashboard" not showing in Teacher Navbar

**Check:**

1. Profile role must be 'admin'
2. Must have teacher record
3. Check `isAdmin` computed property

**Debug:**

```javascript
// In Vue DevTools on Teacher Dashboard
$vm0.isAdmin // Should be true
$vm0.teacherProfile.role // Should be 'admin'
```

---

## Database Query Issues

### Check Current User Profile

```sql
SELECT
  p.id,
  p.full_name,
  p.email,
  p.role,
  p.auth_user_id
FROM profiles p
WHERE p.auth_user_id = auth.uid();
```

### Check Teacher Record

```sql
SELECT
  t.*,
  p.role as profile_role
FROM teachers t
JOIN profiles p ON t.profile_id = p.id
WHERE p.auth_user_id = auth.uid();
```

### Check RLS Policies

```sql
-- Test if you can insert
INSERT INTO teachers (
  profile_id,
  employee_id,
  full_name,
  email,
  is_active
)
SELECT
  id,
  'TEST123',
  full_name,
  email,
  true
FROM profiles
WHERE auth_user_id = auth.uid()
RETURNING *;

-- If this fails, check RLS policies
```

---

## Common Issues Checklist

- [ ] Admin profile exists with role = 'admin'
- [ ] Teachers table has all required columns
- [ ] RLS policies allow admin to insert teachers
- [ ] No existing teacher record for this profile_id
- [ ] Employee ID is unique (or NULL for auto-generation)
- [ ] Email in teachers table matches profile email
- [ ] Admin session is initialized (check console)
- [ ] No JavaScript errors in browser console
- [ ] Supabase connection is working

---

## Testing Workflow

### 1. Fresh Admin Login

```
1. Log in as admin
2. Navigate to /admin/dashboard
3. Open DevTools Console
4. Look for: "Admin authentication initialized"
```

### 2. Enable Teacher Role

```
1. Click "Enable Teacher Role"
2. Confirm the dialog
3. Watch Console for errors
4. Should see: "Teacher record created for admin"
5. Button changes to "Switch to Teacher Dashboard"
```

### 3. Switch to Teacher Dashboard

```
1. Click "Switch to Teacher Dashboard"
2. Should navigate to /teacher/dashboard
3. Check profile dropdown
4. Should see "Admin • Teacher" badge
5. Should see "Switch to Admin Dashboard" link
```

### 4. Switch Back to Admin

```
1. Click profile dropdown
2. Click "Switch to Admin Dashboard"
3. Should navigate to /admin/dashboard
4. Teacher Access card should show enabled state
```

---

## Contact & Support

If issues persist:

1. **Check Files:**

   - `/src/composables/useAdminAuth.js`
   - `/src/views/admin/AdminDashboard.vue`
   - `/src/composables/useTeacherAuth.js`
   - `/src/components/teacher/TeacherNavbar.vue`

2. **Database:**

   - Run `DATABASE_FIX_DUAL_ROLE.sql`
   - Check verification output

3. **Browser:**

   - Clear cache
   - Hard refresh (Ctrl+Shift+R)
   - Try incognito mode

4. **Logs:**
   - Browser Console (F12)
   - Network tab for failed requests
   - Supabase Dashboard > Logs
