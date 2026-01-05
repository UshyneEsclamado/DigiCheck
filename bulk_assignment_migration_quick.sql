-- ============================================
-- BULK ASSIGNMENT MIGRATION - QUICK REFERENCE
-- Execute in Supabase SQL Editor
-- ============================================

-- 1. Create bulk_assignments junction table
CREATE TABLE IF NOT EXISTS bulk_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, section_id)
);

-- 2. Add indexes
CREATE INDEX IF NOT EXISTS idx_bulk_assignments_assignment_id ON bulk_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_bulk_assignments_section_id ON bulk_assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_bulk_assignments_composite ON bulk_assignments(assignment_id, section_id);

-- 3. Add school_year_id to assignments
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assignments_school_year_id ON assignments(school_year_id);

-- 4. Migrate existing assignments to bulk_assignments
INSERT INTO bulk_assignments (assignment_id, section_id, created_at)
SELECT a.id, a.section_id, a.created_at
FROM assignments a
WHERE a.section_id IS NOT NULL
AND EXISTS (SELECT 1 FROM sections s WHERE s.id = a.section_id)
ON CONFLICT (assignment_id, section_id) DO NOTHING;

-- 5. Make section_id nullable
ALTER TABLE assignments ALTER COLUMN section_id DROP NOT NULL;

-- 6. Enable RLS
ALTER TABLE bulk_assignments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for bulk_assignments

-- Teachers manage bulk assignments for their assignments
DROP POLICY IF EXISTS "Teachers manage bulk assignments for their assignments" ON bulk_assignments;
CREATE POLICY "Teachers manage bulk assignments for their assignments"
    ON bulk_assignments FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM assignments a
            JOIN teachers t ON a.teacher_id = t.id
            JOIN profiles p ON t.profile_id = p.id
            WHERE a.id = bulk_assignments.assignment_id 
            AND p.auth_user_id = auth.uid()
        )
    );

-- Students view bulk assignments for their sections
DROP POLICY IF EXISTS "Students view bulk assignments for their sections" ON bulk_assignments;
CREATE POLICY "Students view bulk assignments for their sections"
    ON bulk_assignments FOR SELECT TO authenticated
    USING (
        section_id IN (
            SELECT e.section_id FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- 8. Update existing assignment policies

-- Drop old student policy
DROP POLICY IF EXISTS "Students can view published assignments" ON assignments;

-- Recreate student policy (using bulk_assignments junction table)
CREATE POLICY "Students can view published assignments"
    ON assignments FOR SELECT TO authenticated
    USING (
        status = 'published'
        AND id IN (
            SELECT ba.assignment_id FROM bulk_assignments ba
            JOIN enrollments e ON ba.section_id = e.section_id
            JOIN students s ON e.student_id = s.id
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- 9. Update assignment_submissions policy
DROP POLICY IF EXISTS "Students can create their own submissions" ON assignment_submissions;
CREATE POLICY "Students can create their own submissions"
    ON assignment_submissions FOR INSERT TO authenticated
    WITH CHECK (
        student_id IN (
            SELECT id FROM students
            WHERE profile_id = auth.uid()
        )
        AND assignment_id IN (
            SELECT ba.assignment_id FROM bulk_assignments ba
            JOIN enrollments e ON ba.section_id = e.section_id
            JOIN students s ON e.student_id = s.id
            JOIN profiles p ON s.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
            AND e.status = 'active'
        )
    );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if bulk_assignments table was created
SELECT COUNT(*) as bulk_assignments_count FROM bulk_assignments;

-- Check if existing assignments were migrated
SELECT 
    COUNT(*) as total_assignments,
    COUNT(CASE WHEN section_id IS NULL THEN 1 END) as bulk_assignments,
    COUNT(CASE WHEN section_id IS NOT NULL THEN 1 END) as legacy_assignments
FROM assignments;

-- View bulk assignment distribution
SELECT 
    a.id,
    a.title,
    COUNT(ba.section_id) as assigned_sections_count
FROM assignments a
LEFT JOIN bulk_assignments ba ON a.id = ba.assignment_id
WHERE a.section_id IS NULL
GROUP BY a.id, a.title
ORDER BY assigned_sections_count DESC;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
