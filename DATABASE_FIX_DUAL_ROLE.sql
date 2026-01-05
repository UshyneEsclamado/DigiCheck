-- ============================================
-- ADMIN-TEACHER DUAL ROLE DATABASE FIX
-- This script ensures the database schema supports dual-role functionality
-- Run this in Supabase SQL Editor
-- ============================================

-- First, let's check the current teachers table structure
-- Run this to see what columns exist:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'teachers' 
-- ORDER BY ordinal_position;

-- ============================================
-- STEP 1: Ensure profiles table supports admin role
-- ============================================

-- Update role constraint to include 'admin' if not already there
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    -- Add new constraint with admin role
    ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('student', 'teacher', 'admin'));
    
    RAISE NOTICE 'Updated profiles role constraint to include admin';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profiles constraint already correct or error: %', SQLERRM;
END $$;

-- ============================================
-- STEP 2: Ensure teachers table has required columns
-- ============================================

-- The teachers table MUST have these columns based on your schema:
-- - id (UUID, primary key)
-- - profile_id (UUID, references profiles)
-- - employee_id (text, unique)
-- - full_name (text, required)
-- - email (text, unique, required)
-- - department (text, nullable)
-- - is_active (boolean, default true)
-- - created_at (timestamptz)
-- - updated_at (timestamptz)
-- - created_by (UUID, references profiles)
-- - phone_number (text, nullable)
-- - address (text, nullable)

-- Add missing columns if they don't exist
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT;

-- Ensure employee_id allows NULL (for auto-generation)
ALTER TABLE teachers ALTER COLUMN employee_id DROP NOT NULL;

-- Ensure full_name is NOT NULL
ALTER TABLE teachers ALTER COLUMN full_name SET NOT NULL;

-- Ensure email is NOT NULL
ALTER TABLE teachers ALTER COLUMN email SET NOT NULL;

-- Add updated_at trigger if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 3: Verify RLS policies allow admin-teacher creation
-- ============================================

-- Enable RLS on teachers table
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can view their own record" ON teachers;
DROP POLICY IF EXISTS "Teachers can update their own record" ON teachers;

-- Admin can manage all teachers (including creating for themselves)
CREATE POLICY "Admins can manage all teachers"
ON teachers FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.auth_user_id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Teachers can view their own record
CREATE POLICY "Teachers can view their own record"
ON teachers FOR SELECT TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles 
        WHERE auth_user_id = auth.uid()
    )
);

-- Teachers can update their own record
CREATE POLICY "Teachers can update their own record"
ON teachers FOR UPDATE TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles 
        WHERE auth_user_id = auth.uid()
    )
);

-- ============================================
-- STEP 4: Create helper function for admin-teacher registration
-- ============================================

-- Function to check if a profile already has a teacher record
CREATE OR REPLACE FUNCTION has_teacher_record(p_profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM teachers 
        WHERE profile_id = p_profile_id 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create teacher record for admin
CREATE OR REPLACE FUNCTION create_teacher_for_admin(
    p_profile_id UUID,
    p_employee_id TEXT DEFAULT NULL,
    p_department TEXT DEFAULT NULL,
    p_phone_number TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_teacher_id UUID;
    v_full_name TEXT;
    v_email TEXT;
    v_generated_employee_id TEXT;
BEGIN
    -- Get profile details
    SELECT full_name, email 
    INTO v_full_name, v_email
    FROM profiles 
    WHERE id = p_profile_id AND role = 'admin';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Admin profile not found';
    END IF;
    
    -- Check if teacher record already exists
    IF has_teacher_record(p_profile_id) THEN
        RAISE EXCEPTION 'Teacher record already exists for this admin';
    END IF;
    
    -- Generate employee_id if not provided
    IF p_employee_id IS NULL THEN
        v_generated_employee_id := 'T' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    ELSE
        v_generated_employee_id := p_employee_id;
    END IF;
    
    -- Create teacher record
    INSERT INTO teachers (
        profile_id,
        employee_id,
        full_name,
        email,
        department,
        phone_number,
        address,
        is_active,
        created_by
    ) VALUES (
        p_profile_id,
        v_generated_employee_id,
        v_full_name,
        v_email,
        COALESCE(p_department, 'Administration'),
        p_phone_number,
        p_address,
        true,
        p_profile_id
    )
    RETURNING id INTO v_teacher_id;
    
    RETURN v_teacher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION has_teacher_record(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_teacher_for_admin(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================
-- STEP 5: Create indexes for performance
-- ============================================

-- Index for faster teacher lookup by profile_id
CREATE INDEX IF NOT EXISTS idx_teachers_profile_id ON teachers(profile_id);

-- Index for active teachers
CREATE INDEX IF NOT EXISTS idx_teachers_is_active ON teachers(is_active);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);

-- ============================================
-- STEP 6: Verification queries
-- ============================================

-- Check if the schema is correct
DO $$
DECLARE
    v_has_department BOOLEAN;
    v_has_phone BOOLEAN;
    v_has_address BOOLEAN;
    v_has_created_by BOOLEAN;
    v_admin_role_allowed BOOLEAN;
BEGIN
    -- Check teachers table columns
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'department'
    ) INTO v_has_department;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'phone_number'
    ) INTO v_has_phone;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'address'
    ) INTO v_has_address;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'teachers' AND column_name = 'created_by'
    ) INTO v_has_created_by;
    
    -- Check if admin role is allowed in profiles
    SELECT EXISTS (
        SELECT 1 FROM information_schema.check_constraints cc
        JOIN information_schema.constraint_column_usage ccu ON cc.constraint_name = ccu.constraint_name
        WHERE ccu.table_name = 'profiles' 
        AND ccu.column_name = 'role'
        AND cc.check_clause LIKE '%admin%'
    ) INTO v_admin_role_allowed;
    
    -- Report results
    RAISE NOTICE '=== Database Schema Verification ===';
    RAISE NOTICE 'Teachers table has department column: %', v_has_department;
    RAISE NOTICE 'Teachers table has phone_number column: %', v_has_phone;
    RAISE NOTICE 'Teachers table has address column: %', v_has_address;
    RAISE NOTICE 'Teachers table has created_by column: %', v_has_created_by;
    RAISE NOTICE 'Profiles table allows admin role: %', v_admin_role_allowed;
    
    IF v_has_department AND v_has_phone AND v_has_address AND v_has_created_by AND v_admin_role_allowed THEN
        RAISE NOTICE '✅ Database schema is ready for dual-role functionality!';
    ELSE
        RAISE NOTICE '⚠️ Some columns or constraints are missing. Please review the output above.';
    END IF;
END $$;

-- Display teachers table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'teachers' 
ORDER BY ordinal_position;

-- ============================================
-- SCRIPT COMPLETE
-- ============================================

/*
USAGE INSTRUCTIONS:

1. Run this entire script in Supabase SQL Editor
2. Check the verification output at the end
3. If all checks pass (✅), the database is ready
4. If some checks fail (⚠️), review the column list and manually add missing columns

TESTING:

After running this script, test the dual-role functionality:

1. Log in as an admin user
2. Click "Enable Teacher Role" in Admin Dashboard
3. The system will create a teacher record using your admin profile
4. You can then switch between Admin and Teacher dashboards

TROUBLESHOOTING:

If you get "Failed to enable teacher role" error:
- Check browser console for detailed error message
- Verify your profile has role = 'admin'
- Check that RLS policies allow the operation
- Run: SELECT * FROM profiles WHERE auth_user_id = auth.uid();

If teacher record creation fails:
- Check teachers table constraints
- Verify email and employee_id are unique
- Check that profile_id exists in profiles table
*/
