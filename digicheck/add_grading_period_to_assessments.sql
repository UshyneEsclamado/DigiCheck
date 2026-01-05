-- ============================================
-- ADD GRADING PERIOD SUPPORT TO ASSESSMENTS
-- Run this in Supabase SQL Editor
-- ============================================

-- Add grading_period_id column to quizzes table
ALTER TABLE quizzes 
ADD COLUMN IF NOT EXISTS grading_period_id UUID REFERENCES grading_periods(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_quizzes_grading_period ON quizzes(grading_period_id);

-- Add comment
COMMENT ON COLUMN quizzes.grading_period_id IS 'The grading period (quarter) this quiz belongs to';

-- Add grading_period_id column to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS grading_period_id UUID REFERENCES grading_periods(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_assignments_grading_period ON assignments(grading_period_id);

-- Add comment
COMMENT ON COLUMN assignments.grading_period_id IS 'The grading period (quarter) this assignment belongs to';

-- ============================================
-- OPTIONAL: Auto-assign existing assessments to current quarter
-- ============================================

-- Get the active grading period ID
DO $$
DECLARE
    v_active_period_id UUID;
BEGIN
    -- Get current active grading period
    SELECT id INTO v_active_period_id
    FROM grading_periods
    WHERE is_active = true
    LIMIT 1;
    
    IF v_active_period_id IS NOT NULL THEN
        -- Update quizzes without a grading period
        UPDATE quizzes
        SET grading_period_id = v_active_period_id
        WHERE grading_period_id IS NULL
        AND status = 'published';
        
        -- Update assignments without a grading period
        UPDATE assignments
        SET grading_period_id = v_active_period_id
        WHERE grading_period_id IS NULL
        AND status = 'published';
        
        RAISE NOTICE 'Successfully assigned existing assessments to active grading period';
    ELSE
        RAISE NOTICE 'No active grading period found. Skipping auto-assignment.';
    END IF;
END $$;

-- Verify the changes
SELECT 
    'quizzes' as table_name,
    COUNT(*) as total_quizzes,
    COUNT(grading_period_id) as with_quarter,
    COUNT(*) - COUNT(grading_period_id) as without_quarter
FROM quizzes
WHERE status = 'published'
UNION ALL
SELECT 
    'assignments' as table_name,
    COUNT(*) as total_assignments,
    COUNT(grading_period_id) as with_quarter,
    COUNT(*) - COUNT(grading_period_id) as without_quarter
FROM assignments
WHERE status = 'published';

-- Show quizzes by grading period
SELECT 
    gp.period_name,
    COUNT(q.id) as quiz_count
FROM grading_periods gp
LEFT JOIN quizzes q ON q.grading_period_id = gp.id
WHERE gp.school_year_id IN (SELECT id FROM school_years WHERE is_active = true)
GROUP BY gp.id, gp.period_name, gp.period_number
ORDER BY gp.period_number;

-- Show assignments by grading period
SELECT 
    gp.period_name,
    COUNT(a.id) as assignment_count
FROM grading_periods gp
LEFT JOIN assignments a ON a.grading_period_id = gp.id
WHERE gp.school_year_id IN (SELECT id FROM school_years WHERE is_active = true)
GROUP BY gp.id, gp.period_name, gp.period_number
ORDER BY gp.period_number;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
