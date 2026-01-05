<template>
  <div class="admin-dashboard">
    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="welcome-content">
        <h1>Admin Dashboard</h1>
        <p class="welcome-subtitle">Overview of system statistics and recent activity</p>
      </div>
      <div class="header-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
    </div>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card" v-for="card in statsCards" :key="card.key">
          <div class="stat-icon" :class="card.iconClass">
            <component :is="card.icon" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ card.value }}</div>
            <div class="stat-label">{{ card.title }}</div>
            <div class="stat-sub" v-if="card.sub">{{ card.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dual Role Section -->
    <section v-if="showDualRoleSection" class="dual-role-section">
      <div class="dual-role-card" :class="{ 'teacher-active': hasTeacherRole }">
        <div class="dual-role-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="dual-role-content">
          <h3>Teacher Access</h3>
          <p v-if="!hasTeacherRole">Enable teacher access to create assignments, quizzes, and manage grades</p>
          <p v-else>You have teacher access enabled. Switch to Teacher Dashboard to manage classes.</p>
        </div>
        <div class="dual-role-actions">
          <button 
            v-if="!hasTeacherRole" 
            @click="enableTeacherRole" 
            class="btn-enable-teacher"
            :disabled="enablingTeacherRole"
          >
            {{ enablingTeacherRole ? 'Enabling...' : 'Enable Teacher Role' }}
          </button>
          <button 
            v-else 
            @click.prevent="switchToTeacher" 
            class="btn-switch-teacher"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            Switch to Teacher Dashboard
          </button>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="actions-section">
      <div class="section-header">
        <h2>Quick Actions</h2>
        <p class="section-description">Manage users, enrollments, and system settings</p>
      </div>
      <div class="actions-grid">
        <button class="action-card primary" @click="navigateTo('/admin/create-account')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Create Student Account</h3>
            <p>Add new student to the system</p>
          </div>
        </button>

        <button class="action-card primary" @click="navigateTo('/admin/create-account?role=teacher')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Create Teacher Account</h3>
            <p>Add new teacher to the system</p>
          </div>
        </button>

        <button class="action-card secondary" @click="navigateTo('/admin/enrollment')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Manage Enrollments</h3>
            <p>Handle student enrollments</p>
          </div>
        </button>

        <button class="action-card secondary" @click="navigateTo('/admin/students')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>View All Students</h3>
            <p>Browse and manage students</p>
          </div>
        </button>

        <button class="action-card secondary" @click="navigateTo('/admin/teachers')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>View All Teachers</h3>
            <p>Browse and manage teachers</p>
          </div>
        </button>

        <button class="action-card warn" @click="navigateTo('/admin/school-years')">
          <div class="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>School Year Management</h3>
            <p>Configure academic year settings</p>
          </div>
        </button>
      </div>
    </section>

    <!-- Content Grid -->
    <section class="content-section">
      <div class="content-grid">
        <!-- Recent Activity -->
        <div class="content-card large">
          <div class="card-header">
            <div class="card-title-section">
              <h3>Recent Activity</h3>
              <p class="card-description">Latest system events and updates</p>
            </div>
            <button class="refresh-btn" @click="fetchRecentActivity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
          </div>
          <div class="activity-list">
            <div class="activity-item" v-for="item in recentActivity" :key="item.id">
              <div class="activity-icon" :class="getActivityIconClass(item.type)">
                <component :is="getActivityIcon(item.type)" />
              </div>
              <div class="activity-content">
                <h4>{{ item.type }}</h4>
                <p>{{ item.summary }}</p>
                <span class="activity-time">{{ formatTime(item.when) }}</span>
              </div>
            </div>
            <div v-if="recentActivity.length === 0" class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h4>No Recent Activity</h4>
              <p>System events will appear here</p>
            </div>
          </div>
        </div>

        <!-- System Overview -->
        <div class="content-card small">
          <div class="card-header">
            <div class="card-title-section">
              <h3>System Overview</h3>
              <p class="card-description">Quick stats and insights</p>
            </div>
          </div>
          <div class="overview-list">
            <div class="overview-item">
              <div class="overview-label">Active School Year</div>
              <div class="overview-value">{{ stats.current_school_year || 'Not Set' }}</div>
            </div>
            <div class="overview-item">
              <div class="overview-label">Current Grading Period</div>
              <div class="overview-value">{{ stats.current_grading_period || 'Not Set' }}</div>
            </div>
            <div class="overview-item">
              <div class="overview-label">Total Sections</div>
              <div class="overview-value">{{ stats.total_sections }}</div>
            </div>
            <div class="overview-item">
              <div class="overview-label">Active Students</div>
              <div class="overview-value">{{ stats.active_students }}</div>
            </div>
            <div class="overview-item">
              <div class="overview-label">Inactive Students</div>
              <div class="overview-value">{{ stats.inactive_students }}</div>
            </div>
            <div class="overview-item">
              <div class="overview-label">Recent Enrollments (7d)</div>
              <div class="overview-value highlight">{{ stats.recent_enrollments_count }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import { useAdminAuth } from '@/composables/useAdminAuth.js'

// Icon components
const StudentIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `
}

const TeacherIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `
}

const SectionIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  `
}

const CalendarIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  `
}

const EnrollmentIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <polyline points="17 11 19 13 23 9"/>
    </svg>
  `
}

const ActivityIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  `
}

export default {
  name: 'AdminDashboard',
  components: {
    StudentIcon,
    TeacherIcon,
    SectionIcon,
    CalendarIcon,
    EnrollmentIcon,
    ActivityIcon
  },
  setup() {
    const { 
      adminInfo,
      isAuthenticated,
      initializeAuth,
      checkTeacherRole, 
      registerAsTeacher, 
      switchToTeacherDashboard 
    } = useAdminAuth()
    
    return {
      adminInfo,
      isAuthenticated,
      initializeAuth,
      checkTeacherRole,
      registerAsTeacher,
      switchToTeacherDashboard
    }
  },
  data() {
    return {
      stats: {
        total_students: 0,
        active_students: 0,
        inactive_students: 0,
        total_teachers: 0,
        total_sections: 0,
        current_school_year: null,
        current_grading_period: null,
        recent_enrollments_count: 0
      },
      recentActivity: [],
      showDualRoleSection: true,
      hasTeacherRole: false,
      enablingTeacherRole: false
    }
  },
  computed: {
    statsCards() {
      return [
        { 
          key: 'students', 
          title: 'Total Students', 
          value: this.stats.total_students, 
          sub: `${this.stats.active_students} active • ${this.stats.inactive_students} inactive`,
          icon: StudentIcon,
          iconClass: 'students'
        },
        { 
          key: 'teachers', 
          title: 'Total Teachers', 
          value: this.stats.total_teachers, 
          sub: '',
          icon: TeacherIcon,
          iconClass: 'teachers'
        },
        { 
          key: 'sections', 
          title: 'Sections', 
          value: this.stats.total_sections, 
          sub: '',
          icon: SectionIcon,
          iconClass: 'sections'
        },
        { 
          key: 'schoolyear', 
          title: 'School Year', 
          value: this.stats.current_school_year || '—', 
          sub: this.stats.current_grading_period || '',
          icon: CalendarIcon,
          iconClass: 'schoolyear'
        },
        { 
          key: 'enrollments', 
          title: 'Recent Enrollments', 
          value: this.stats.recent_enrollments_count, 
          sub: 'Last 7 days',
          icon: EnrollmentIcon,
          iconClass: 'enrollments'
        }
      ]
    }
  },
  mounted() {
    this.initializeAdminAuth()
    this.fetchSystemStats()
    this.fetchRecentActivity()
  },
  methods: {
    async initializeAdminAuth() {
      try {
        // Initialize admin authentication first
        const result = await this.initializeAuth()
        if (!result.success) {
          console.error('Admin auth initialization failed:', result)
          // Redirect to login if not authenticated
          if (result.needsLogin) {
            this.$router.push('/login')
          }
          return
        }
        
        // Check if admin has teacher role
        await this.checkIfHasTeacherRole()
      } catch (error) {
        console.error('Error initializing admin auth:', error)
      }
    },

    async checkIfHasTeacherRole() {
      try {
        const result = await this.checkTeacherRole()
        this.hasTeacherRole = result.hasTeacherRole
      } catch (error) {
        console.error('Error checking teacher role:', error)
      }
    },

    async enableTeacherRole() {
      if (this.enablingTeacherRole) return

      const confirmed = confirm(
        'This will enable teacher access for your admin account. ' +
        'You will be able to create assignments, quizzes, and manage grades. ' +
        'Do you want to continue?'
      )

      if (!confirmed) return

      this.enablingTeacherRole = true

      try {
        // Create teacher record for admin
        await this.registerAsTeacher({
          department: 'Administration'
        })

        this.hasTeacherRole = true
        
        alert('Teacher role enabled successfully! You can now switch to the Teacher Dashboard.')
      } catch (error) {
        console.error('Error enabling teacher role:', error)
        alert('Failed to enable teacher role: ' + error.message)
      } finally {
        this.enablingTeacherRole = false
      }
    },

    async switchToTeacher() {
      try {
        console.log('Switching to teacher dashboard...')
        console.log('Admin info:', this.adminInfo)
        console.log('Has teacher role:', this.hasTeacherRole)
        
        // Double check teacher role before switching
        const check = await this.checkTeacherRole()
        if (!check.hasTeacherRole) {
          alert('You need to enable teacher role first.')
          return
        }
        
        console.log('Navigating to /teacher/dashboard')
        await this.$router.push('/teacher/dashboard')
        console.log('Navigation complete')
      } catch (error) {
        console.error('Error switching to teacher dashboard:', error)
        alert('Failed to switch to teacher dashboard: ' + error.message)
      }
    },

    async fetchSystemStats() {
      // Students counts
      const { data: studentsAll, error: e1 } = await supabase.from('students').select('id, enrollment_status')
      if (e1) console.error('students fetch error', e1)
      const total_students = studentsAll ? studentsAll.length : 0
      const active_students = studentsAll ? studentsAll.filter(s => s.enrollment_status === 'active').length : 0
      const inactive_students = total_students - active_students

      // Teachers
      const { data: teachers, error: e2 } = await supabase.from('teachers').select('id')
      if (e2) console.error('teachers fetch error', e2)

      // Sections
      const { data: sections, error: e3 } = await supabase.from('sections').select('id')
      if (e3) console.error('sections fetch error', e3)

      // Current school year and grading period
      const { data: sy, error: e4 } = await supabase.from('school_years').select('id, year_name').eq('is_active', true).single()
      if (e4 && e4.code !== 'PGRST116') console.error('school year fetch error', e4)

      const { data: gp, error: e5 } = await supabase.from('grading_periods').select('id, period_name').eq('is_active', true).single()
      if (e5 && e5.code !== 'PGRST116') console.error('grading period fetch error', e5)

      // Recent enrollments (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { data: enrolls, error: e6 } = await supabase.from('enrollments').select('id, created_at').gte('created_at', sevenDaysAgo.toISOString())
      if (e6) console.error('enrollments fetch error', e6)

      this.stats.total_students = total_students
      this.stats.active_students = active_students
      this.stats.inactive_students = inactive_students
      this.stats.total_teachers = teachers ? teachers.length : 0
      this.stats.total_sections = sections ? sections.length : 0
      this.stats.current_school_year = sy ? sy.year_name : null
      this.stats.current_grading_period = gp ? gp.period_name : null
      this.stats.recent_enrollments_count = enrolls ? enrolls.length : 0
    },

    async fetchRecentActivity() {
      // Recently added students
      const { data: newStudents } = await supabase.from('students').select('id, first_name, last_name, created_at').order('created_at', { ascending: false }).limit(5)
      const { data: newTeachers } = await supabase.from('teachers').select('id, first_name, last_name, created_at').order('created_at', { ascending: false }).limit(5)
      const { data: recentEnrolls } = await supabase.from('enrollments').select('id, student_id, section_id, created_at').order('created_at', { ascending: false }).limit(5)

      const items = []
      if (newStudents) newStudents.forEach(s => items.push({ id: `student-${s.id}`, type: 'Student Added', summary: `${s.first_name} ${s.last_name}`, when: s.created_at }))
      if (newTeachers) newTeachers.forEach(t => items.push({ id: `teacher-${t.id}`, type: 'Teacher Added', summary: `${t.first_name} ${t.last_name}`, when: t.created_at }))
      if (recentEnrolls) recentEnrolls.forEach(en => items.push({ id: `en-${en.id}`, type: 'Enrollment', summary: `Student ${en.student_id} enrolled in Section ${en.section_id}`, when: en.created_at }))

      // Sort by when (newest first)
      items.sort((a, b) => new Date(b.when) - new Date(a.when))
      this.recentActivity = items.slice(0, 10)
    },

    navigateTo(path) {
      this.$router.push(path)
    },

    getActivityIcon(type) {
      if (type.includes('Student')) return StudentIcon
      if (type.includes('Teacher')) return TeacherIcon
      if (type.includes('Enrollment')) return EnrollmentIcon
      return ActivityIcon
    },

    getActivityIconClass(type) {
      if (type.includes('Student')) return 'student'
      if (type.includes('Teacher')) return 'teacher'
      if (type.includes('Enrollment')) return 'enrollment'
      return 'default'
    },

    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
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

.admin-dashboard {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1.5rem 2rem;
  position: relative;
  overflow-y: auto;
}

/* Custom Scrollbar */
.admin-dashboard::-webkit-scrollbar {
  width: 12px;
}

.admin-dashboard::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.admin-dashboard::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.admin-dashboard::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.activity-list::-webkit-scrollbar {
  width: 8px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
}

.activity-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 6px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Welcome Header */
.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
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

.welcome-header::before {
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

.welcome-content h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
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

/* Stats Section */
.stats-section {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(61, 141, 122, 0.3);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon.students { 
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a); 
}

.stat-icon.teachers { 
  background: linear-gradient(135deg, #06b6d4, #0891b2); 
}

.stat-icon.sections { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed); 
}

.stat-icon.schoolyear { 
  background: linear-gradient(135deg, #f59e0b, #d97706); 
}

.stat-icon.enrollments { 
  background: linear-gradient(135deg, #10b981, #059669); 
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: 0.3px;
}

.stat-sub {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Actions Section */
.actions-section {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.section-header {
  margin-bottom: 1.25rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  letter-spacing: -0.3px;
}

.section-description {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.action-card.primary {
  border-color: rgba(61, 141, 122, 0.4);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
}

.action-card.primary:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.15));
  border-color: #3D8D7A;
  box-shadow: 0 12px 28px rgba(61, 141, 122, 0.2);
}

.action-card.primary .action-icon {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.action-card.secondary {
  border-color: rgba(203, 213, 225, 0.8);
}

.action-card.secondary:hover {
  border-color: #94a3b8;
  background: rgba(248, 250, 252, 0.95);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.action-card.secondary .action-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
}

.action-card.warn {
  border-color: rgba(251, 191, 36, 0.4);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(217, 119, 6, 0.08));
}

.action-card.warn:hover {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(217, 119, 6, 0.15));
  border-color: #f59e0b;
  box-shadow: 0 12px 28px rgba(251, 191, 36, 0.2);
}

.action-card.warn .action-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  letter-spacing: -0.2px;
}

.action-content p {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

/* Content Section */
.content-section {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.25rem;
}

.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.content-card.large {
  min-height: 500px;
}

.content-card.small {
  min-height: 500px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
}

.card-title-section h3 {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
  letter-spacing: -0.3px;
}

.card-description {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.refresh-btn {
  width: 44px;
  height: 44px;
  background: rgba(241, 245, 249, 0.8);
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
}

.refresh-btn:hover {
  background: rgba(226, 232, 240, 0.9);
  color: #3D8D7A;
  transform: rotate(180deg);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;
  overflow-y: auto;
  max-height: none;
  min-height: 300px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.activity-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(61, 141, 122, 0.1), transparent);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.activity-item:hover::before {
  width: 100%;
}

.activity-item:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateX(4px);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.activity-icon.student {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.activity-icon.teacher {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.activity-icon.enrollment {
  background: linear-gradient(135deg, #10b981, #059669);
}

.activity-icon.default {
  background: linear-gradient(135deg, #64748b, #475569);
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  letter-spacing: -0.1px;
}

.activity-content p {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.5;
}

.activity-time {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: #94a3b8;
  gap: 1.25rem;
  padding: 3.5rem 2rem;
}

.empty-state svg {
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #64748b;
}

.empty-state p {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Overview List */
.overview-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.overview-item:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateX(4px);
}

.overview-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

.overview-value {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
}

.overview-value.highlight {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Dual Role Section */
.dual-role-section {
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
}

.dual-role-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.dual-role-card.teacher-active {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
}

.dual-role-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.dual-role-content {
  flex: 1;
}

.dual-role-content h3 {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.3px;
}

.dual-role-content p {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.6;
  font-weight: 500;
}

.dual-role-actions {
  display: flex;
  gap: 0.875rem;
  position: relative;
  z-index: 10;
}

.btn-enable-teacher,
.btn-switch-teacher {
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 10;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.btn-enable-teacher::before,
.btn-switch-teacher::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-enable-teacher:hover::before,
.btn-switch-teacher:hover::before {
  left: 100%;
}

.btn-enable-teacher {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
}

.btn-enable-teacher:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3d);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35);
}

.btn-enable-teacher:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-switch-teacher {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.btn-switch-teacher:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.35);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .admin-dashboard {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 0.75rem 1rem;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: 1.75rem;
  }

  .welcome-content h1 {
    font-size: 1.75rem;
  }

  .welcome-subtitle {
    font-size: 0.95rem;
  }

  .header-icon {
    width: 64px;
    height: 64px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .content-card {
    padding: 1.75rem;
  }

  .content-card.large,
  .content-card.small {
    min-height: auto;
  }

  .dual-role-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.75rem;
  }

  .dual-role-content h3 {
    font-size: 1.2rem;
  }

  .dual-role-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-enable-teacher,
  .btn-switch-teacher {
    width: 100%;
    justify-content: center;
  }

  .section-header h2 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .admin-dashboard {
    padding: 0.5rem;
  }

  .welcome-header {
    padding: 1.5rem;
  }

  .welcome-content h1 {
    font-size: 1.5rem;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-icon {
    width: 52px;
    height: 52px;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .action-card {
    padding: 1.5rem;
  }

  .action-icon {
    width: 48px;
    height: 48px;
  }

  .content-card {
    padding: 1.5rem;
  }

  .card-title-section h3 {
    font-size: 1.2rem;
  }

  .dual-role-card {
    padding: 1.5rem;
  }

  .dual-role-icon {
    width: 60px;
    height: 60px;
  }

  .btn-enable-teacher,
  .btn-switch-teacher {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>