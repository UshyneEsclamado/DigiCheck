import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'

// Import views that actually exist
import Login from '../views/Login.vue'
import RoleSelection from '../views/RoleSelection.vue'
import EmailVerified from '../views/EmailVerified.vue'
import Signup from '../views/Signup.vue'
import SignupStudent from '../views/SignupStudent.vue'
import Landing from '../views/Landing.vue'
import Intro from '../views/Intro.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import ResetPassword from '../views/ResetPassword.vue'

// Dashboard views
import StudentDashboard from '../views/StudentDashboard.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'

// Teacher subfolder components that actually exist
import Analytics from '../views/teacher/Analytics.vue'
import CreateQuiz from '../views/teacher/CreateQuiz.vue'
import EditQuiz from '../views/teacher/EditQuiz.vue'
import DashboardHome from '../views/teacher/DashboardHome.vue'
import GradeManagement from '../views/teacher/GradeManagement.vue'
import MessagesPage from '../views/teacher/MessagesPage.vue'
import MySubjects from '../views/teacher/MySubjects.vue'
import SettingsPage from '../views/teacher/SettingsPage.vue'
import UploadAssessment from '../views/teacher/UploadAssessment.vue'
import ViewAssessments from '../views/teacher/ViewAssessments.vue'
import ViewStudents from '../views/teacher/ViewStudents.vue'
import Gradebook from '../views/teacher/Gradebook.vue'
import CreateAssignment from '../views/teacher/CreateAssignment.vue'
import StudentSubmissions from '../views/teacher/StudentSubmissions.vue'

// Student subfolder components
import Home from '../views/student/Home.vue'
import Subjects from '../views/student/Subjects.vue'
import Messages from '../views/student/Messages.vue'
import Calendar from '../views/student/Calendar.vue'
import Settings from '../views/student/Settings.vue'
import TakeQuiz from '../views/student/TakeQuiz.vue'
import TakeAssignments from '../views/student/TakeAssignments.vue'
import StudentGrades from '../views/student/Grades.vue'

// Admin components - NEW
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import StudentManagement from '../views/admin/StudentManagement.vue'
import TeacherManagement from '../views/admin/TeacherManagement.vue'
import EnrollmentManagement from '../views/admin/EnrollmentManagement.vue'
import SchoolYearManagement from '../views/admin/SchoolYearManagement.vue'
import GradingPeriodManagement from '../views/admin/GradingPeriodManagement.vue'
import UserAccountCreation from '../views/admin/UserAccountCreation.vue'

const routes = [
  {
    path: '/',
    name: 'Intro',
    component: Intro,
    meta: { public: true }
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      public: true,
      guestOnly: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { 
      public: true,
      guestOnly: true
    }
  },
  {
    path: '/signup-student',
    name: 'SignupStudent',
    component: SignupStudent,
    meta: { 
      public: true,
      guestOnly: true
    }
  },
  {
    path: '/role-selection',
    name: 'RoleSelection',
    component: RoleSelection,
    meta: { 
      public: true,
      guestOnly: true
    }
  },
  {
    path: '/email-verified',
    name: 'EmailVerified',
    component: EmailVerified,
    meta: { public: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { public: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { public: true }
  },
  // Teacher Dashboard Routes
  {
    path: '/teacher',
    name: 'TeacherLayout',
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'teacher' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboardHome',
        component: DashboardHome
      },
      {
        path: 'subjects',
        name: 'MySubjects',
        component: MySubjects
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: Analytics
      },
      {
        path: 'messages',
        name: 'MessagesPage',
        component: MessagesPage
      },
      {
        path: 'settings',
        name: 'SettingsPage',
        component: SettingsPage
      },
      {
        path: 'upload-assessment',
        name: 'UploadAssessment',
        component: UploadAssessment,
        meta: { requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'create-quiz/:subjectId/:sectionId',
        name: 'CreateQuiz',
        component: CreateQuiz
      },
      {
        path: 'edit-quiz/:quizId',
        name: 'EditQuiz',
        component: EditQuiz,
        meta: { requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'grade-management/:subjectId/:sectionId',
        name: 'GradeManagement',
        component: GradeManagement
      },
      {
        path: 'view-assessments/:subjectId/:sectionId',
        name: 'ViewAssessments',
        component: ViewAssessments
      },
      {
        path: 'view-students/:subjectId/:sectionId',
        name: 'ViewStudents',
        component: ViewStudents
      },
      {
        path: 'gradebook',
        name: 'TeacherGradebook',
        component: Gradebook,
        meta: { requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'create-assignment/:subjectId/:sectionId',
        name: 'CreateAssignment',
        component: CreateAssignment,
        meta: { requiresAuth: true, role: 'teacher' }
      },
      {
        path: 'student-submissions/:subjectId/:sectionId',
        name: 'StudentSubmissions',
        component: StudentSubmissions,
        meta: { requiresAuth: true, role: 'teacher' }
      }
    ]
  },
  // Student Dashboard Routes
  {
    path: '/student',
    name: 'StudentLayout',
    component: StudentDashboard,
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: '',
        redirect: 'dashboard'
      },
      {
        path: 'dashboard',
        name: 'StudentDashboardHome',
        component: Home
      },
      {
        path: 'subjects',
        name: 'StudentSubjects',
        component: Subjects
      },
      {
        path: 'calendar',
        name: 'StudentCalendar',
        component: Calendar
      },
      {
        path: 'messages',
        name: 'StudentMessages',
        component: Messages
      },
      {
        path: 'settings',
        name: 'StudentSettings',
        component: Settings
      },
      {
        path: 'take-quiz/:subjectId/:sectionId',
        name: 'TakeQuiz',
        component: TakeQuiz
      },
      {
        path: 'assignments/:subjectId/:sectionId',
        name: 'TakeAssignments',
        component: TakeAssignments
      },
      {
        path: 'grades/:subjectId/:sectionId',
        name: 'StudentGrades',
        component: StudentGrades
      }
    ]
  },
  // Admin Dashboard Routes
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/students',
    name: 'StudentManagement',
    component: StudentManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/teachers',
    name: 'TeacherManagement',
    component: TeacherManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/enrollment',
    name: 'EnrollmentManagement',
    component: EnrollmentManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/school-years',
    name: 'SchoolYearManagement',
    component: SchoolYearManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/grading-periods',
    name: 'GradingPeriodManagement',
    component: GradingPeriodManagement,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/create-account',
    name: 'UserAccountCreation',
    component: UserAccountCreation,
    meta: { requiresAuth: true, role: 'admin' }
  },
  // Legacy student dashboard route (for backward compatibility)
  {
    path: '/student-dashboard',
    redirect: '/student/dashboard'
  },
  // Catch-all redirect to Intro
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Cache for auth state to avoid redundant checks
let cachedSession = null
let cachedRole = null
let lastAuthCheck = 0
const AUTH_CACHE_DURATION = 30000 // 30 seconds

// Enhanced Navigation Guard with Caching for Better Performance
router.beforeEach(async (to, from, next) => {
  console.log('=== ROUTER NAVIGATION ===')
  console.log('From:', from.path, '→ To:', to.path)
  
  // Public routes - no auth needed, proceed immediately
  if (!to.meta.requiresAuth) {
    console.log('✓ Public route, proceeding')
    next()
    return
  }

  const now = Date.now()
  const cacheValid = cachedSession && (now - lastAuthCheck) < AUTH_CACHE_DURATION

  try {
    // Use cached session if valid, otherwise fetch fresh
    let session = cachedSession
    
    if (!cacheValid) {
      console.log('Fetching fresh session...')
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session error:', error)
        cachedSession = null
        cachedRole = null
        next('/login')
        return
      }
      
      session = data?.session
      cachedSession = session
      lastAuthCheck = now
    } else {
      console.log('Using cached session')
    }

    // Check if authenticated
    if (!session?.user) {
      console.log('Not authenticated, redirecting to login')
      cachedSession = null
      cachedRole = null
      next('/login')
      return
    }

    // Check role if required
    if (to.meta.role) {
      // Use cached role if we have a valid session cache
      let userRole = cachedRole
      
      if (!cacheValid || !userRole) {
        console.log('Fetching user role...')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('auth_user_id', session.user.id)
          .single()

        if (profileError || !profile) {
          console.error('Profile error:', profileError)
          // Allow navigation, component will handle
          next()
          return
        }
        
        userRole = profile.role
        cachedRole = userRole
      } else {
        console.log('Using cached role:', userRole)
      }

      // Check role match
      // Allow admin to access teacher routes if they have a teacher record
      if (userRole !== to.meta.role) {
        // Special case: Allow admins with teacher records to access teacher routes
        if (userRole === 'admin' && to.meta.role === 'teacher') {
          // Check if admin has teacher record
          const { data: teacherRecord, error: teacherError } = await supabase
            .from('teachers')
            .select('id')
            .eq('profile_id', (await supabase.from('profiles').select('id').eq('auth_user_id', session.user.id).single()).data?.id)
            .eq('is_active', true)
            .maybeSingle()
          
          if (!teacherError && teacherRecord) {
            // Admin has teacher record, allow access
            console.log('✓ Admin has teacher record, allowing access to teacher route')
            next()
            return
          }
        }
        
        console.log('Role mismatch:', userRole, '!=', to.meta.role)
        // Updated to include admin redirect
        const redirectPath = userRole === 'student' ? '/student/dashboard' : 
                           userRole === 'teacher' ? '/teacher/dashboard' : 
                           '/admin/dashboard'
        next(redirectPath)
        return
      }
    }

    console.log('✓ Auth check passed, proceeding')
    next()

  } catch (error) {
    console.error('Navigation guard error:', error)
    // On error, allow navigation and let component handle
    next()
  }
})

// Clear cache on auth state change
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event)
  cachedSession = session
  cachedRole = null
  lastAuthCheck = Date.now()
  
  if (event === 'SIGNED_OUT') {
    cachedSession = null
    cachedRole = null
  }
})

export default router