<template>
  <div class="dashboard-container">
    <!-- Top Navigation Bar (Clean) -->
    <nav class="top-navbar">
      <div class="navbar-content">
        <!-- Left: Logo and Brand -->
        <div class="navbar-left">
          <div class="brand-logo">
            <img src="@/assets/LOGO WAY BG.png" alt="DigiCheck" class="logo-img" />
            <span class="brand-name">DigiCheck</span>
          </div>
        </div>
        
        <!-- Center: Empty space for clean look -->
        <div class="navbar-center">
        </div>
        
        <!-- Right: User Profile and Notifications -->
        <div class="navbar-right">
          
          <!-- Section Filter -->
          <select v-model="selectedSection" @change="filterBySection" class="section-filter rounded-bg">
            <option value="">All Sections</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">
              {{ section.name }} - {{ section.subject_name }}
            </option>
          </select>
          
          <!-- Export Button -->
          <button @click="exportData" class="export-btn rounded-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span>Export</span>
          </button>
          
          <!-- Notifications and Profile Group -->
          <div class="notifications-profile-group">
            <!-- Notification Bell -->
            <div class="notif-wrapper">
              <button class="nav-icon-btn rounded-bg" @click="toggleNotifDropdown" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span v-if="notifications.length" class="notification-badge">{{ notifications.length }}</span>
              </button>
              
              <!-- Notification Dropdown -->
              <div v-if="showNotifDropdown" class="notification-dropdown">
                <div class="dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <div class="notification-list">
                  <div v-if="notifications.length === 0" class="no-notifications">
                    No new notifications
                  </div>
                  <div v-for="notif in notifications" :key="notif.id" class="notification-item" @click="handleNotificationClick(notif)">
                    <div class="notif-content">
                      <h4>{{ notif.title }}</h4>
                      <p>{{ notif.body }}</p>
                      <span class="notif-time">{{ notif.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- User Profile -->
            <div class="user-profile-wrapper">
              <div class="user-profile rounded-bg" @click="toggleProfileDropdown">
                <div class="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span class="user-name">{{ fullName }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="dropdown-arrow">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              
              <!-- Profile Dropdown -->
            <div v-if="showProfileDropdown" class="profile-dropdown">
              <div class="dropdown-header">
                <div class="profile-info">
                  <div class="profile-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div class="profile-details">
                    <h4>{{ fullName }}</h4>
                    <p>Teacher</p>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-menu">
                <router-link to="/teacher/settings" class="dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H5V20A2 2 0 0 0 7 22H17A2 2 0 0 0 19 20V9H21M17 20H7V9H10V12H14V9H17V20Z"/>
                  </svg>
                  <span>Profile & Settings</span>
                </router-link>
                
                <div class="dropdown-divider"></div>
                
                <button @click="logout" class="dropdown-item logout-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 17V14H9V10H16V7L21 12L16 17M14 2A2 2 0 0 1 16 4V6H14V4H5V20H14V18H16V20A2 2 0 0 1 14 22H5A2 2 0 0 1 3 20V4A2 2 0 0 1 5 2H14Z"/>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Navigation - Custom Tooltip Labels on Hover -->
    <aside class="sidebar" style="background:#3D8D7A; border-right:none;">
      <nav class="sidebar-nav">
        <router-link to="/teacher/dashboard" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/dashboard' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 20v-6h4v6m5-8h3L12 3 2 12h3v8h5v-6h4v6h5v-8z" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Dashboard</span>
        </router-link>
        <router-link to="/teacher/subjects" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/subjects' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M3 7l9-4 9 4" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Classes</span>
        </router-link>
        <router-link to="/teacher/gradebook" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/gradebook' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 2v4M16 2v4" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Gradebook</span>
        </router-link>
        <router-link to="/teacher/analytics" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/analytics' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="12" width="4" height="8" />
              <rect x="10" y="8" width="4" height="12" />
              <rect x="17" y="4" width="4" height="16" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Analytics</span>
        </router-link>
        <router-link to="/teacher/messages" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/messages' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 5l9 7 9-7" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Messages</span>
        </router-link>
        
        <div class="sidebar-divider"></div>
        
        <router-link to="/teacher/settings" class="sidebar-item rounded-bg" :class="{ 'active': $route.path === '/teacher/settings' }">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="sidebar-tooltip">Profile & Settings</span>
        </router-link>
        
        <button @click="logout" class="sidebar-item sidebar-logout rounded-bg">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <span class="sidebar-tooltip">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Student Analytics</h1>
              <p class="header-subtitle">
                {{ selectedSection ? `Viewing: ${getSelectedSectionName()}` : 'Monitor and analyze student performance across all sections' }}
              </p>
              <div v-if="currentSchoolYear && currentQuarter" class="academic-info">
                <span class="academic-year">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  S.Y. {{ currentSchoolYear.year_name }}
                </span>
                <span class="quarter-badge">{{ currentQuarter.period_name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner-container">
            <div class="loading-spinner"></div>
          </div>
          <p class="loading-text">Loading analytics...</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon stat-average">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ overallStats.averageScore }}%</div>
          <div class="stat-label">Overall Average</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-students">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ overallStats.totalStudents }}</div>
          <div class="stat-label">{{ selectedSection ? 'Students in Section' : 'Total Students' }}</div>
        </div>
      </div>

        <div class="stat-card">
          <div class="stat-icon stat-assessments">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z" />
            </svg>
          </div>
          <div>
            <div class="stat-number">{{ overallStats.totalQuizzes }}</div>
            <div class="stat-label">{{ selectedSection ? 'Quizzes in Section' : 'Total Quizzes' }}</div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div v-if="!loading" class="content-grid">
        <!-- Quiz Performance -->
        <div class="content-card">
          <div class="card-header">
            <h3>Quiz Performance Summary</h3>
            <p class="card-desc">Average scores across all quizzes</p>
          </div>
          <div class="chart-placeholder">
            <div v-if="quizPerformanceData.length > 0" class="performance-list">
              <div v-for="quiz in quizPerformanceData" :key="quiz.quiz_id" class="performance-item">
                <div class="quiz-info">
                  <div class="quiz-title">{{ quiz.quiz_title }}</div>
                  <div class="quiz-meta">{{ quiz.total_attempts }} attempts • {{ quiz.students_attempted }} students</div>
                </div>
                <div class="quiz-score">
                  <span :class="['score-badge', getScoreClass(quiz.average_score)]">
                    {{ quiz.average_score }}%
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              No quiz data available yet. Students need to take quizzes first.
            </div>
          </div>
        </div>

        <!-- Student Distribution -->
        <div class="content-card">
          <div class="card-header">
            <h3>Student Performance Distribution</h3>
            <p class="card-desc">Count of students by performance level</p>
          </div>
          <div class="chart-placeholder">
            <div v-if="performanceDistribution" class="distribution-list">
              <div class="dist-item">
                <span class="dist-label excellent">Excellent (90+)</span>
                <span class="dist-count">{{ performanceDistribution.excellent }}</span>
              </div>
              <div class="dist-item">
                <span class="dist-label good">Good (80-89)</span>
                <span class="dist-count">{{ performanceDistribution.good }}</span>
              </div>
              <div class="dist-item">
                <span class="dist-label satisfactory">Satisfactory (75-79)</span>
                <span class="dist-count">{{ performanceDistribution.satisfactory }}</span>
              </div>
              <div class="dist-item">
                <span class="dist-label warning">Needs Help (&lt;75)</span>
                <span class="dist-count">{{ performanceDistribution.needsHelp }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Performance Table -->
      <div v-if="!loading" class="content-card">
        <div class="card-header">
          <h3>Student Performance Overview</h3>
          <p class="card-desc">
            {{ selectedSection ? `Showing students from ${getSelectedSectionName()}` : 'Quiz results and performance data for all students' }}
          </p>
          <div class="table-controls">
            <select v-model="selectedSection" class="sort-select" style="min-width: 200px;">
              <option value="">All Sections</option>
              <option v-for="section in sections" :key="section.id" :value="section.id">
                {{ section.name }} - {{ section.subject_name }}
              </option>
            </select>
            <button 
              v-if="selectedSection" 
              @click="selectedSection = ''; currentPage = 1" 
              class="clear-filter-btn"
              title="Clear section filter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
              Clear Filter
            </button>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search students..."
              class="search-input"
            >
            <select v-model="sortBy" @change="sortStudents" class="sort-select">
              <option value="surname">Sort by Surname (A-Z)</option>
              <option value="name">Sort by Full Name</option>
              <option value="average">Sort by Average Score</option>
              <option value="quizzes">Sort by Quizzes Taken</option>
            </select>
          </div>
        </div>
        
        <div class="table-wrapper">
          <table class="performance-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Quizzes Taken</th>
                <th>Average Score</th>
                <th>Best Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in filteredStudents" :key="student.student_id" class="student-row">
                <td class="student-cell">
                  <div class="student-info">
                    <div class="student-avatar">
                      <div class="avatar-placeholder">
                        {{ getInitials(student.student_name) }}
                      </div>
                    </div>
                    <div>
                      <div class="student-name">{{ student.student_name }}</div>
                      <div class="student-id">ID: {{ student.student_number }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ student.section_name }}</td>
                <td>{{ student.subject_name }}</td>
                <td>{{ student.quizzes_attempted }}</td>
                <td>{{ student.average_score || 0 }}%</td>
                <td>
                  <span :class="['score-badge', getScoreClass(student.best_score || 0)]">
                    {{ student.best_score || 0 }}%
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', getStatusClass(student.average_score || 0)]">
                    {{ student.performance_status }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button @click="viewStudentDetails(student)" class="action-btn view-btn" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="8" style="text-align: center; padding: 2rem; color: #999;">
                  {{ studentData.length === 0 ? 'No student data yet. Students need to take quizzes first.' : 'No students match your search.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </main>


    <!-- Student Detail Modal -->
    <div v-if="selectedStudent" class="modal-overlay" @click.self="selectedStudent = null">
      <div class="modal student-detail-modal">
        <div class="modal-header">
          <h3>{{ selectedStudent.student_name }} - Quiz Results</h3>
          <button @click="selectedStudent = null" class="close-btn">✕</button>
        </div>
        
        <div class="modal-content">
          <div class="student-summary">
            <div class="summary-stat">
              <h4>{{ selectedStudent.average_score || 0 }}%</h4>
              <p>Average Score</p>
            </div>
            <div class="summary-stat">
              <h4>{{ selectedStudent.total_quiz_attempts }}</h4>
              <p>Total Attempts</p>
            </div>
            <div class="summary-stat">
              <h4>{{ selectedStudent.best_score || 0 }}%</h4>
              <p>Best Score</p>
            </div>
          </div>

          <div class="quiz-history">
            <h4>Quiz Attempts</h4>
            <div v-if="studentQuizResults.length > 0" class="history-list">
              <div v-for="result in studentQuizResults" :key="result.attempt_id" class="history-item">
                <div class="quiz-info">
                  <h5>{{ result.quiz_title }}</h5>
                  <p>Attempt {{ result.attempt_number }} • {{ formatDate(result.submitted_at) }}</p>
                </div>
                <div class="quiz-score">
                  <span :class="['score-badge', getScoreClass(result.percentage)]">
                    {{ Math.round(result.percentage) }}%
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              No quiz attempts yet
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scroll to Top Button -->
    <Transition name="fade" mode="out-in">
      <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="scroll-to-top"
        aria-label="Scroll to top"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" class="scroll-to-top-btn">
          <path
            fill="#ffffff"
            stroke="none"
            d="M12 2L3 11h3v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8h3l-9-9z"
          />
        </svg>
      </button>
    </Transition>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="closeLogoutModal">
      <div class="modal-content logout-modal" @click.stop>
        <div class="modal-header logout-header">
          <h3>Confirm Logout</h3>
        </div>
        <div class="modal-body">
          <div class="logout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <p class="logout-message">Are you sure you want to logout?</p>
          <p class="logout-submessage">You will be redirected to the login page.</p>
        </div>
        <div class="modal-footer logout-footer">
          <button @click="closeLogoutModal" class="btn-cancel" :disabled="isLoggingOut">Cancel</button>
          <button @click="confirmLogout" class="btn-logout" :disabled="isLoggingOut">
            <span v-if="!isLoggingOut">Logout</span>
            <span v-else class="loading-text">
              <div class="logout-spinner"></div>
              Redirecting...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { supabase } from '../../supabase.js'
import { useDarkMode } from '../../composables/useDarkMode.js'

interface Section {
  id: string
  name: string
  subject_name: string
}

interface StudentData {
  student_id: string
  student_name: string
  student_number: string
  student_email: string
  grade_level: number
  section_id: string
  section_name: string
  section_code: string
  subject_id: string
  subject_name: string
  teacher_id: string
  teacher_name: string
  total_quiz_attempts: number
  quizzes_attempted: number
  average_score: number
  best_score: number
  lowest_score: number
  last_quiz_date: string
  attempts_last_week: number
  performance_status: string
}

interface QuizPerformance {
  quiz_id: string
  quiz_title: string
  quiz_code: string
  section_id: string
  section_name: string
  subject_id: string
  subject_name: string
  teacher_id: string
  teacher_name: string
  total_attempts: number
  students_attempted: number
  average_score: number
  highest_score: number
  lowest_score: number
  count_excellent: number
  count_good: number
  count_satisfactory: number
  count_needs_help: number
}

interface QuizResult {
  attempt_id: string
  quiz_id: string
  quiz_title: string
  attempt_number: number
  percentage: number
  submitted_at: string
}

export default {
  name: 'AnalyticsView',
  setup() {
    const { isDarkMode, initDarkMode } = useDarkMode()
    
    const sections = ref<Section[]>([])
    const studentData = ref<StudentData[]>([])
    const quizPerformanceData = ref<QuizPerformance[]>([])
    const selectedSection = ref('')
    const searchQuery = ref('')
    const sortBy = ref('surname')
    const currentPage = ref(1)
    const itemsPerPage = 10
    const loading = ref(false)
    const selectedStudent = ref<StudentData | null>(null)
    const studentQuizResults = ref<QuizResult[]>([])
    const teacherId = ref<string>('')
    const showProfileDropdown = ref(false)
    const fullName = ref('Teacher')
    
    // School year and quarter
    const currentSchoolYear = ref<any>(null)
    const gradingPeriods = ref<any[]>([])
    const currentQuarter = ref<any>(null)
    
    // Notification dropdown states
    const showNotifDropdown = ref(false)
    const notifications = ref([])

    // Logout modal states
    const showLogoutModal = ref(false)
    const isLoggingOut = ref(false)
    
    // Scroll to top functionality
    const showScrollTop = ref(false)

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleScroll = () => {
      showScrollTop.value = window.scrollY > 300
    }
    
    // Real-time subscription channels
    let quizAttemptsSubscription: any = null
    let quizzesSubscription: any = null
    let enrollmentsSubscription: any = null

    // Computed properties
    const overallStats = computed(() => {
      let students = studentData.value
      if (selectedSection.value) {
        students = students.filter(s => s.section_id === selectedSection.value)
      }

      const totalStudents = students.length
      
      // Count unique quizzes from quiz performance data
      let quizzes = quizPerformanceData.value
      if (selectedSection.value) {
        quizzes = quizzes.filter(q => q.section_id === selectedSection.value)
      }
      const totalQuizzes = quizzes.length
      
      // Calculate average score from students who have taken quizzes
      const studentsWithScores = students.filter(s => s.average_score > 0)
      const averageScore = studentsWithScores.length > 0 
        ? Math.round(studentsWithScores.reduce((sum, s) => sum + s.average_score, 0) / studentsWithScores.length)
        : 0

      return {
        totalStudents,
        totalQuizzes,
        averageScore
      }
    })

    const performanceDistribution = computed(() => {
      let students = studentData.value
      if (selectedSection.value) {
        students = students.filter(s => s.section_id === selectedSection.value)
      }

      // Only count students who have taken at least one quiz
      const studentsWithScores = students.filter(s => s.average_score > 0)

      return {
        excellent: studentsWithScores.filter(s => s.average_score >= 90).length,
        good: studentsWithScores.filter(s => s.average_score >= 80 && s.average_score < 90).length,
        satisfactory: studentsWithScores.filter(s => s.average_score >= 75 && s.average_score < 80).length,
        needsHelp: studentsWithScores.filter(s => s.average_score < 75).length
      }
    })

    // Helper function to extract surname from full name
    const getSurname = (fullName: string): string => {
      const parts = fullName.trim().split(' ')
      // Assuming last name is the last part
      return parts[parts.length - 1].toLowerCase()
    }

    const filteredStudents = computed(() => {
      let filtered = studentData.value

      // Filter by section
      if (selectedSection.value) {
        filtered = filtered.filter(s => s.section_id === selectedSection.value)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(s => 
          s.student_name.toLowerCase().includes(query) ||
          s.student_number.toLowerCase().includes(query) ||
          s.student_email.toLowerCase().includes(query)
        )
      }

      // Sort students
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'surname':
            // Sort by surname (last name) alphabetically
            const surnameA = getSurname(a.student_name)
            const surnameB = getSurname(b.student_name)
            return surnameA.localeCompare(surnameB)
          case 'average':
            return (b.average_score || 0) - (a.average_score || 0)
          case 'quizzes':
            return b.quizzes_attempted - a.quizzes_attempted
          default: // 'name'
            return a.student_name.localeCompare(b.student_name)
        }
      })

      // Paginate
      const start = (currentPage.value - 1) * itemsPerPage
      return filtered.slice(start, start + itemsPerPage)
    })

    const totalPages = computed(() => {
      let filtered = studentData.value
      
      if (selectedSection.value) {
        filtered = filtered.filter(s => s.section_id === selectedSection.value)
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(s => 
          s.student_name.toLowerCase().includes(query) ||
          s.student_number.toLowerCase().includes(query)
        )
      }
      
      return Math.ceil(filtered.length / itemsPerPage) || 1
    })

    // Get current teacher ID
    const getCurrentTeacherId = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) {
          console.error('No session found')
          return null
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, full_name')
          .eq('auth_user_id', session.user.id)
          .single()

        if (profileError || !profile || profile.role !== 'teacher') {
          console.error('Teacher profile not found')
          return null
        }

        const { data: teacher, error: teacherError } = await supabase
          .from('teachers')
          .select('id, full_name')
          .eq('profile_id', profile.id)
          .single()

        if (teacherError || !teacher) {
          console.error('Teacher not found')
          return null
        }

        // Set the full name for the profile dropdown
        fullName.value = teacher.full_name || profile.full_name || 'Teacher'

        return teacher.id
      } catch (error) {
        console.error('Error getting teacher ID:', error)
        return null
      }
    }

    // Fetch student performance data with manual calculation
    const fetchStudentPerformanceData = async (currentTeacherId: string) => {
      try {
        console.log('Fetching student performance data...')
        
        // Get all enrolled students in teacher's sections
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select(`
            student_id,
            section_id,
            subject_id,
            students!inner (
              id,
              student_id,
              full_name,
              email,
              grade_level
            ),
            sections!inner (
              id,
              name,
              section_code,
              subjects!inner (
                id,
                name,
                teacher_id,
                teachers!inner (
                  id,
                  full_name
                )
              )
            )
          `)
          .eq('status', 'active')
          .eq('sections.subjects.teacher_id', currentTeacherId)

        if (enrollError) throw enrollError

        if (!enrollments || enrollments.length === 0) {
          console.log('No enrollments found')
          studentData.value = []
          return
        }

        // Get all quiz attempts for these students
        const studentIds = enrollments.map((e: any) => e.student_id)
        
        const { data: attempts, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            student_id,
            quiz_id,
            percentage,
            submitted_at,
            attempt_number,
            status,
            quizzes!inner (
              id,
              title,
              section_id
            )
          `)
          .in('student_id', studentIds)
          .in('status', ['submitted', 'graded'])

        if (attemptsError) throw attemptsError

        console.log('Found attempts:', attempts?.length || 0)

        // Calculate stats for each student
        const studentStats = enrollments.map((enrollment: any) => {
          const student = enrollment.students
          const section = enrollment.sections
          const subject = section.subjects
          const teacher = subject.teachers

          // Get all attempts for this student in this teacher's sections
          const studentAttempts = (attempts || []).filter((a: any) => 
            a.student_id === student.id &&
            enrollments.some((e: any) => 
              e.student_id === student.id && 
              e.section_id === a.quizzes.section_id
            )
          )

          // Calculate statistics
          const totalAttempts = studentAttempts.length
          const uniqueQuizzes = new Set(studentAttempts.map((a: any) => a.quiz_id)).size
          
          let averageScore = 0
          let bestScore = 0
          let lowestScore = 0
          let lastQuizDate = ''
          let performanceStatus = 'No Data'

          if (totalAttempts > 0) {
            const scores = studentAttempts.map((a: any) => a.percentage || 0)
            averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
            bestScore = Math.max(...scores)
            lowestScore = Math.min(...scores)
            
            // Get most recent attempt date
            const sortedAttempts = studentAttempts.sort((a: any, b: any) => 
              new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
            )
            lastQuizDate = sortedAttempts[0]?.submitted_at || ''

            // Determine performance status
            if (averageScore >= 90) performanceStatus = 'Excellent'
            else if (averageScore >= 80) performanceStatus = 'Good'
            else if (averageScore >= 75) performanceStatus = 'Satisfactory'
            else performanceStatus = 'Needs Help'
          }

          // Count attempts in last week
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          const attemptsLastWeek = studentAttempts.filter((a: any) => 
            new Date(a.submitted_at) >= oneWeekAgo
          ).length

          return {
            student_id: student.id,
            student_name: student.full_name,
            student_number: student.student_id,
            student_email: student.email,
            grade_level: student.grade_level,
            section_id: section.id,
            section_name: section.name,
            section_code: section.section_code,
            subject_id: subject.id,
            subject_name: subject.name,
            teacher_id: teacher.id,
            teacher_name: teacher.full_name,
            total_quiz_attempts: totalAttempts,
            quizzes_attempted: uniqueQuizzes,
            average_score: averageScore,
            best_score: bestScore,
            lowest_score: lowestScore,
            last_quiz_date: lastQuizDate,
            attempts_last_week: attemptsLastWeek,
            performance_status: performanceStatus
          }
        })

        studentData.value = studentStats
        console.log('Student data updated:', studentStats.length, 'students')

      } catch (error) {
        console.error('Error fetching student performance:', error)
        studentData.value = []
      }
    }

    // Fetch quiz performance data with manual calculation
    const fetchQuizPerformanceData = async (currentTeacherId: string) => {
      try {
        console.log('Fetching quiz performance data...')

        // Get all quizzes for this teacher
        const { data: quizzes, error: quizzesError } = await supabase
          .from('quizzes')
          .select(`
            id,
            title,
            quiz_code,
            section_id,
            sections!inner (
              id,
              name,
              subject_id,
              subjects!inner (
                id,
                name,
                teacher_id,
                teachers!inner (
                  id,
                  full_name
                )
              )
            )
          `)
          .eq('sections.subjects.teacher_id', currentTeacherId)

        if (quizzesError) throw quizzesError

        if (!quizzes || quizzes.length === 0) {
          console.log('No quizzes found')
          quizPerformanceData.value = []
          return
        }

        // Get all attempts for these quizzes
        const quizIds = quizzes.map((q: any) => q.id)
        
        const { data: attempts, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('id, quiz_id, student_id, percentage, status')
          .in('quiz_id', quizIds)
          .in('status', ['submitted', 'graded'])

        if (attemptsError) throw attemptsError

        console.log('Found quiz attempts:', attempts?.length || 0)

        // Calculate stats for each quiz
        const quizStats = quizzes.map((quiz: any) => {
          const section = quiz.sections
          const subject = section.subjects
          const teacher = subject.teachers

          // Get all attempts for this quiz
          const quizAttempts = (attempts || []).filter((a: any) => a.quiz_id === quiz.id)
          
          const totalAttempts = quizAttempts.length
          const uniqueStudents = new Set(quizAttempts.map((a: any) => a.student_id)).size

          let averageScore = 0
          let highestScore = 0
          let lowestScore = 0
          let countExcellent = 0
          let countGood = 0
          let countSatisfactory = 0
          let countNeedsHelp = 0

          if (totalAttempts > 0) {
            const scores = quizAttempts.map((a: any) => a.percentage || 0)
            averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
            highestScore = Math.max(...scores)
            lowestScore = Math.min(...scores)

            // Count by performance level
            scores.forEach(score => {
              if (score >= 90) countExcellent++
              else if (score >= 80) countGood++
              else if (score >= 75) countSatisfactory++
              else countNeedsHelp++
            })
          }

          return {
            quiz_id: quiz.id,
            quiz_title: quiz.title,
            quiz_code: quiz.quiz_code,
            section_id: section.id,
            section_name: section.name,
            subject_id: subject.id,
            subject_name: subject.name,
            teacher_id: teacher.id,
            teacher_name: teacher.full_name,
            total_attempts: totalAttempts,
            students_attempted: uniqueStudents,
            average_score: averageScore,
            highest_score: highestScore,
            lowest_score: lowestScore,
            count_excellent: countExcellent,
            count_good: countGood,
            count_satisfactory: countSatisfactory,
            count_needs_help: countNeedsHelp
          }
        })

        quizPerformanceData.value = quizStats
        console.log('Quiz performance data updated:', quizStats.length, 'quizzes')

      } catch (error) {
        console.error('Error fetching quiz performance:', error)
        quizPerformanceData.value = []
      }
    }

    // Fetch grading periods
    const fetchGradingPeriods = async () => {
      try {
        // Get active school year
        const { data: schoolYear, error: syError } = await supabase
          .from('school_years')
          .select('id, year_name')
          .eq('is_active', true)
          .single()
        
        if (syError) {
          console.log('No active school year found:', syError)
          return
        }
        
        currentSchoolYear.value = schoolYear
        
        // Get grading periods for this school year
        const { data: periods, error: periodsError } = await supabase
          .from('grading_periods')
          .select('*')
          .eq('school_year_id', schoolYear.id)
          .order('period_number', { ascending: true })
        
        if (periodsError) {
          console.error('Error fetching grading periods:', periodsError)
          return
        }
        
        gradingPeriods.value = periods || []
        
        // Auto-select active quarter
        const activeQuarter = periods?.find(p => p.is_active)
        currentQuarter.value = activeQuarter || (periods && periods.length > 0 ? periods[0] : null)
        
        console.log('📅 School Year:', currentSchoolYear.value?.year_name)
        console.log('📅 Current Quarter:', currentQuarter.value?.period_name)
      } catch (err) {
        console.error('Error in fetchGradingPeriods:', err)
      }
    }

    // Fetch all analytics data
    const fetchData = async () => {
      loading.value = true
      try {
        const currentTeacherId = await getCurrentTeacherId()
        if (!currentTeacherId) {
          console.error('Could not get teacher ID')
          loading.value = false
          return
        }

        teacherId.value = currentTeacherId
        console.log('Teacher ID:', currentTeacherId)

        // Fetch both student and quiz performance data
        await Promise.all([
          fetchStudentPerformanceData(currentTeacherId),
          fetchQuizPerformanceData(currentTeacherId)
        ])

        // Build unique sections list for filter
        const uniqueSections = new Map()
        studentData.value.forEach(s => {
          if (!uniqueSections.has(s.section_id)) {
            uniqueSections.set(s.section_id, {
              id: s.section_id,
              name: s.section_name,
              subject_name: s.subject_name
            })
          }
        })
        sections.value = Array.from(uniqueSections.values())

        console.log('Data loaded successfully:', {
          students: studentData.value.length,
          quizzes: quizPerformanceData.value.length,
          sections: sections.value.length
        })

      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        loading.value = false
      }
    }

    // Setup real-time subscriptions
    const setupRealtimeSubscriptions = async () => {
      if (!teacherId.value) return

      console.log('Setting up real-time subscriptions...')

      // Subscribe to quiz attempts changes
      quizAttemptsSubscription = supabase
        .channel('quiz_attempts_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quiz_attempts'
          },
          async (payload) => {
            console.log('Quiz attempt changed:', payload)
            // Refresh data when attempts are created, updated, or deleted
            await fetchStudentPerformanceData(teacherId.value)
            await fetchQuizPerformanceData(teacherId.value)
          }
        )
        .subscribe()

      // Subscribe to quizzes changes
      quizzesSubscription = supabase
        .channel('quizzes_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'quizzes'
          },
          async (payload) => {
            console.log('Quiz changed:', payload)
            // Refresh quiz performance data
            await fetchQuizPerformanceData(teacherId.value)
          }
        )
        .subscribe()

      // Subscribe to enrollments changes
      enrollmentsSubscription = supabase
        .channel('enrollments_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'enrollments'
          },
          async (payload) => {
            console.log('Enrollment changed:', payload)
            // Refresh student data
            await fetchStudentPerformanceData(teacherId.value)
          }
        )
        .subscribe()

      console.log('Real-time subscriptions active')
    }

    // Cleanup subscriptions
    const cleanupSubscriptions = () => {
      if (quizAttemptsSubscription) {
        supabase.removeChannel(quizAttemptsSubscription)
        quizAttemptsSubscription = null
      }
      if (quizzesSubscription) {
        supabase.removeChannel(quizzesSubscription)
        quizzesSubscription = null
      }
      if (enrollmentsSubscription) {
        supabase.removeChannel(enrollmentsSubscription)
        enrollmentsSubscription = null
      }
      console.log('Real-time subscriptions cleaned up')
    }

    // View student details
    const viewStudentDetails = async (student: StudentData) => {
      selectedStudent.value = student

      try {
        // Fetch individual quiz attempts for this student
        const { data: attempts, error } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            quiz_id,
            attempt_number,
            percentage,
            submitted_at,
            quizzes (
              title
            )
          `)
          .eq('student_id', student.student_id)
          .in('status', ['submitted', 'graded'])
          .order('submitted_at', { ascending: false })

        if (error) throw error

        if (attempts) {
          studentQuizResults.value = attempts.map((a: any) => ({
            attempt_id: a.id,
            quiz_id: a.quiz_id,
            quiz_title: a.quizzes?.title || `Quiz ${a.quiz_id.slice(0, 8)}`,
            attempt_number: a.attempt_number,
            percentage: a.percentage || 0,
            submitted_at: a.submitted_at
          }))
        }
      } catch (error) {
        console.error('Error fetching student details:', error)
        studentQuizResults.value = []
      }
    }

    // Filter by section
    const filterBySection = () => {
      currentPage.value = 1
    }

    // Sort students
    const sortStudents = () => {
      currentPage.value = 1
    }

    // Export data to CSV
    const exportData = () => {
      const headers = ['Student Name', 'ID', 'Section', 'Subject', 'Average Score', 'Best Score', 'Quizzes Taken', 'Status']
      const csvData = studentData.value.map(student => [
        student.student_name,
        student.student_number,
        student.section_name,
        student.subject_name,
        student.average_score || 0,
        student.best_score || 0,
        student.quizzes_attempted,
        student.performance_status
      ])

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `student_analytics_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    }

    // Helper functions
    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getSelectedSectionName = () => {
      const section = sections.value.find(s => s.id === selectedSection.value)
      return section ? `${section.name} - ${section.subject_name}` : 'All Sections'
    }

    const getScoreClass = (score: number) => {
      if (score >= 90) return 'excellent'
      if (score >= 80) return 'good'
      if (score >= 75) return 'satisfactory'
      return 'needs-improvement'
    }

    const getStatusClass = (score: number) => {
      if (score >= 90) return 'excellent'
      if (score >= 80) return 'good'
      if (score >= 75) return 'satisfactory'
      return 'warning'
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    // Lifecycle
    onMounted(async () => {
      initDarkMode()
      await fetchGradingPeriods()
      await fetchData()
      await setupRealtimeSubscriptions()
    })

    onUnmounted(() => {
      cleanupSubscriptions()
    })

    // Notification dropdown functions
    const toggleNotifDropdown = () => {
      showNotifDropdown.value = !showNotifDropdown.value
    }

    const handleNotificationClick = (notification: any) => {
      // Handle notification click
      console.log('Notification clicked:', notification)
      showNotifDropdown.value = false
    }

    // Profile dropdown functions
    const toggleProfileDropdown = () => {
      showProfileDropdown.value = !showProfileDropdown.value
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: Event) => {
      const target = event.target as Element
      if (!target.closest('.user-profile-wrapper')) {
        showProfileDropdown.value = false
      }
      if (!target.closest('.notif-wrapper')) {
        showNotifDropdown.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // Logout confirmation modal functions
    const openLogoutModal = () => {
      showLogoutModal.value = true
    }

    const closeLogoutModal = () => {
      showLogoutModal.value = false
    }

    const confirmLogout = () => {
      console.log('🚪 Logging out...')
      
      // Clear storage immediately
      localStorage.clear()
      sessionStorage.clear()
      
      // Sign out from Supabase (don't wait)
      supabase.auth.signOut().catch(err => console.log('Signout error:', err))
      
      // Immediate redirect - no waiting!
      setTimeout(() => {
        window.location.assign('/login')
      }, 100)
      
      console.log('✅ Logout initiated')
    }

    const logout = () => {
      openLogoutModal()
    }

    return {
      isDarkMode,
      sections,
      studentData,
      quizPerformanceData,
      selectedSection,
      searchQuery,
      sortBy,
      currentPage,
      itemsPerPage,
      loading,
      selectedStudent,
      studentQuizResults,
      showProfileDropdown,
      showNotifDropdown,
      notifications,
      fullName,
      currentSchoolYear,
      gradingPeriods,
      currentQuarter,
      overallStats,
      performanceDistribution,
      filteredStudents,
      totalPages,
      fetchData,
      filterBySection,
      sortStudents,
      viewStudentDetails,
      exportData,
      getInitials,
      getSelectedSectionName,
      getScoreClass,
      getStatusClass,
      formatDate,
      toggleProfileDropdown,
      toggleNotifDropdown,
      handleNotificationClick,
      logout,
      showLogoutModal,
      isLoggingOut,
      closeLogoutModal,
      confirmLogout,
      showScrollTop,
      scrollToTop
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Reset and Hide Parent Layouts */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Hide any parent layout elements */
body, html {
  overflow-x: hidden !important;
}

/* Custom Scrollbar Styling - Green Theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #20c997);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #18a577);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.3);
}

::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #1e5a4a, #146e5a);
}

::-webkit-scrollbar-corner {
  background: #f1f5f9;
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #3D8D7A #f1f5f9;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #1a1d21;
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #20c997, #18a577);
  border: 1px solid #374151;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #18a577, #146e5a);
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

.dark ::-webkit-scrollbar-corner {
  background: #1a1d21;
}

.dark * {
  scrollbar-color: #20c997 #1a1d21;
}

/* Dashboard Container Layout */
.dashboard-container {
  min-height: 100vh;
  width: 100vw;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.dark .dashboard-container {
  background: #0f172a;
}

.dark .academic-year {
  color: #f9fafb;
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border-color: #4b5563;
}

.dark .academic-year svg {
  color: #20c997;
}

.dark .quarter-badge {
  background: linear-gradient(135deg, #20c997 0%, #17a085 100%);
  color: #fff;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}

/* Sidebar Navigation - Simple Outlined Icons Only, Single Color, Active Highlight */
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  width: 80px;
  height: calc(100vh - 64px);
  background: #3D8D7A;
  border-right: none;
  z-index: 900;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  overflow: visible;
}

.sidebar-nav {
  padding: 2rem 0.5rem 1rem 0.5rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  margin: 8px 0;
  border-radius: 12px;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  text-decoration: none;
}

.sidebar-item.active {
  background: rgba(255,255,255,0.15);
  border: 2px solid #fff;
}

.sidebar-item:hover {
  background: rgba(255,255,255,0.22);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.sidebar-icon svg {
  display: block;
}

.sidebar-tooltip {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #3D8D7A;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.sidebar-item:hover .sidebar-tooltip {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 12px;
}

.sidebar-logout {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logout:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Top Navigation Bar (Greenish Theme) */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(61, 141, 122, 0.3);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.navbar-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
  max-width: 600px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Notifications and Profile Group */
.notifications-profile-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Notification Styles */
.notif-wrapper {
  position: relative;
}

.nav-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #3D8D7A;
}

.notification-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
  border: 1px solid #e2e8f0;
}

.notification-dropdown .dropdown-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-dropdown .dropdown-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}

.notification-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item:last-child {
  border-bottom: none;
}

.notif-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.notif-content p {
  margin: 0 0 0.5rem 0;
  font-size: 0.813rem;
  color: #64748b;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.section-filter {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.section-filter option {
  background: #3D8D7A;
  color: white;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-profile-wrapper {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: background 0.2s;
  cursor: pointer;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.8);
  transition: transform 0.2s;
}

.user-profile:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.profile-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
  border: 1px solid #e2e8f0;
}

.dropdown-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.profile-details p {
  font-size: 0.85rem;
  opacity: 0.9;
}

.dropdown-menu {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: #1e293b;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
}

.dropdown-item:hover {
  background: #f1f5f9;
  color: #3D8D7A;
}

.dropdown-item svg {
  color: #64748b;
  transition: color 0.2s;
}

.dropdown-item:hover svg {
  color: #3D8D7A;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.logout-btn {
  color: #ef4444 !important;
}

.logout-btn:hover {
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.logout-btn svg {
  color: #ef4444 !important;
}

.logout-btn:hover svg {
  color: #dc2626 !important;
}

/* Rounded semi-transparent backgrounds for sidebar and navbar icons/buttons */
.rounded-bg {
  background: rgba(255,255,255,0.13);
  border-radius: 16px;
  transition: background 0.2s;
}
.rounded-bg:hover {
  background: rgba(255,255,255,0.22);
}

/* Main Content */
.main-content {
  margin-top: 64px;
  margin-left: 80px;
  padding: 1.5rem;
  width: calc(100% - 80px);
  height: calc(100vh - 64px);
  min-height: calc(100vh - 64px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* Custom scrollbar for main content */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 8px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #3D8D7A;
  border-radius: 8px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #2d6a5a;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.academic-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.academic-year {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.academic-year svg {
  width: 16px;
  height: 16px;
  color: #3D8D7A;
}

.quarter-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3D8D7A 0%, #2d6d5f 100%);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(61, 141, 122, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-filter {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.section-filter:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-average { background: linear-gradient(135deg, #3D8D7A, #2d6a5a); }
.stat-students { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.stat-assessments { background: linear-gradient(135deg, #10b981, #059669); }
.stat-help { background: linear-gradient(135deg, #f59e0b, #d97706); }

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 100%;
}
.dark .content-card {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.card-header {
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}
.dark .card-header h3 {
  color: #A3D1C6;
}

.card-desc {
  font-size: 0.813rem;
  color: #6b7280;
}
.dark .card-desc {
  color: #A3D1C6;
}

.table-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input,
.sort-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #A3D1C6;
  border-radius: 6px;
  background: white;
  color: #3D8D7A;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-input {
  cursor: text;
}

.sort-select option {
  background: white;
  color: #1f2937;
  padding: 0.5rem;
  font-weight: 500;
}

.sort-select:focus,
.search-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

/* Make the section filter more prominent */
.table-controls .sort-select:first-child {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: 2px solid #3D8D7A;
  font-weight: 600;
  padding: 0.6rem 1rem;
}

.table-controls .sort-select:first-child option {
  background: white;
  color: #1f2937;
  font-weight: 500;
  padding: 0.5rem;
}

.table-controls .sort-select:first-child:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e5a4a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.dark .search-input,
.dark .sort-select {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.dark .sort-select option {
  background: #23272b;
  color: #A3D1C6;
}

.dark .table-controls .sort-select:first-child {
  background: linear-gradient(135deg, #20c997, #18a577);
  color: #1a1d21;
  border-color: #20c997;
}

.dark .table-controls .sort-select:first-child option {
  background: #23272b;
  color: #A3D1C6;
}

/* Clear Filter Button */
.clear-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filter-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.clear-filter-btn svg {
  width: 16px;
  height: 16px;
}

.dark .clear-filter-btn {
  background: #f87171;
  color: #1a1d21;
}

.dark .clear-filter-btn:hover {
  background: #ef4444;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #A3D1C6;
  background: white;
  color: #3D8D7A;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}
.dark .period-btn {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.period-btn.active,
.period-btn:hover {
  background: #3D8D7A;
  color: white;
  border-color: #3D8D7A;
}

.chart-placeholder {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FBFFE4;
  border-radius: 8px;
  color: #6b7280;
}
.dark .chart-placeholder {
  background: #181c20;
  color: #A3D1C6;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 1rem;
  /* Custom scrollbar for table */
  scrollbar-width: thin;
  scrollbar-color: #3D8D7A #f1f5f9;
}

.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 6px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #3D8D7A, #20c997);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #2d6a5a, #18a577);
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th,
.performance-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.dark .performance-table th,
.dark .performance-table td {
  border-bottom-color: #374151;
}

.performance-table th {
  background: #FBFFE4;
  font-weight: 600;
  color: #3D8D7A;
  font-size: 0.875rem;
}
.dark .performance-table th {
  background: #181c20;
  color: #A3D1C6;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #3D8D7A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
}

.student-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}
.dark .student-name {
  color: #A3D1C6;
}

.student-id {
  font-size: 0.75rem;
  color: #6b7280;
}
.dark .student-id {
  color: #9ca3af;
}

.score-badge,
.improvement-badge,
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.score-badge.excellent,
.status-badge.excellent {
  background: #dcfce7;
  color: #166534;
}

.score-badge.good,
.status-badge.good {
  background: #dbeafe;
  color: #1e40af;
}

.score-badge.satisfactory,
.status-badge.satisfactory {
  background: #fef3c7;
  color: #92400e;
}

.score-badge.needs-improvement,
.status-badge.warning {
  background: #fee2e2;
  color: #dc2626;
}

.improvement-badge.positive {
  background: #dcfce7;
  color: #166534;
}

.improvement-badge.negative {
  background: #fee2e2;
  color: #dc2626;
}

.actions-cell {
  width: 120px;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.25rem;
  transition: all 0.2s;
}

.view-btn {
  background: #FBFFE4;
  color: #3D8D7A;
}

.view-btn:hover {
  background: #A3D1C6;
}

.edit-btn {
  background: #B3D8A8;
  color: #1f2937;
}

.edit-btn:hover {
  background: #A3D1C6;
}

.warning-btn {
  background: #fef3c7;
  color: #d97706;
}

.warning-btn:hover {
  background: #fde68a;
}

.pagination {
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
}
.dark .pagination {
  border-top-color: #374151;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #A3D1C6;
  background: white;
  color: #3D8D7A;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.dark .page-btn {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.page-btn:hover:not(:disabled) {
  background: #A3D1C6;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}
.dark .page-info {
  color: #A3D1C6;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
.dark .modal {
  background: #23272b;
  border: 1px solid #20c997;
}

.student-detail-modal {
  max-width: 600px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .modal-header {
  border-bottom-color: #374151;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}
.dark .modal-header h3 {
  color: #A3D1C6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}
.dark .close-btn {
  color: #A3D1C6;
}

.close-btn:hover {
  background: #f3f4f6;
}
.dark .close-btn:hover {
  background: #374151;
}

.modal-content {
  padding: 1.5rem;
}

.student-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-stat {
  text-align: center;
  padding: 1rem;
  background: #FBFFE4;
  border-radius: 8px;
}
.dark .summary-stat {
  background: #181c20;
}

.summary-stat h4 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3D8D7A;
  margin: 0;
}
.dark .summary-stat h4 {
  color: #A3D1C6;
}

.summary-stat p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}
.dark .summary-stat p {
  color: #A3D1C6;
}

.assessment-history h4 {
  color: #1f2937;
  margin: 0 0 1rem 0;
}
.dark .assessment-history h4 {
  color: #A3D1C6;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  /* Custom scrollbar for modal lists */
  scrollbar-width: thin;
  scrollbar-color: #3D8D7A #f1f5f9;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 6px;
}

.history-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #20c997);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2d6a5a, #18a577);
}

.dark .history-list {
  scrollbar-color: #20c997 #1a1d21;
}

.dark .history-list::-webkit-scrollbar-track {
  background: #1a1d21;
}

.dark .history-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #20c997, #18a577);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.dark .history-item {
  border-color: #374151;
}

.assessment-info h5 {
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}
.dark .assessment-info h5 {
  color: #A3D1C6;
}

.assessment-info p {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
}
.dark .assessment-info p {
  color: #A3D1C6;
}

.remediation-notes {
  margin-top: 1.5rem;
}

.remediation-notes h4 {
  color: #1f2937;
  margin: 0 0 1rem 0;
}
.dark .remediation-notes h4 {
  color: #A3D1C6;
}

.notes-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #A3D1C6;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  background: white;
  color: #1f2937;
}
.dark .notes-textarea {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.save-notes-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.save-notes-btn:hover {
  background: #2c6b5c;
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}
.dark .form-group label {
  color: #A3D1C6;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #A3D1C6;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #1f2937;
}
.dark .form-group input,
.dark .form-group select,
.dark .form-group textarea {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3D8D7A;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #A3D1C6;
  background: white;
  color: #3D8D7A;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}
.dark .cancel-btn {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.cancel-btn:hover {
  background: #FBFFE4;
}
.dark .cancel-btn:hover {
  background: #181c20;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #2c6b5c;
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .main-content {
    padding: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .navbar-center {
    gap: 0.25rem;
  }
  
  .nav-item {
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .navbar-content {
    padding: 0 0.5rem;
  }
  
  .brand-name {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .content-grid {
    gap: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .table-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-input {
    width: 100%;
  }
  
  .table-wrapper {
    font-size: 0.875rem;
  }
  
  .performance-table th,
  .performance-table td {
    padding: 0.5rem;
  }
  
  .student-summary {
    grid-template-columns: 1fr;
  }
  
  .navbar-right {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .section-filter,
  .export-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}

/* New styles for quiz performance list */
.performance-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.performance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: #FBFFE4;
  border-radius: 6px;
  border-left: 3px solid #3D8D7A;
  width: 100%;
}

.dark .performance-item {
  background: #181c20;
  border-left-color: #20c997;
}

.quiz-info {
  flex: 1;
  min-width: 0;
}

.quiz-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.dark .quiz-title {
  color: #A3D1C6;
}

.quiz-meta {
  font-size: 0.813rem;
  color: #6b7280;
}

.dark .quiz-meta {
  color: #9ca3af;
}

.quiz-score {
  margin-left: 1rem;
  flex-shrink: 0;
}

/* Distribution list styles */
.distribution-list {
  display: grid;
  gap: 0.15rem;
  width: 100%;
}

.dist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: #FBFFE4;
  border-radius: 6px;
  width: 100%;
}

.dark .dist-item {
  background: #181c20;
}

.dist-label {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.dist-label.excellent {
  background: #dcfce7;
  color: #166534;
}

.dist-label.good {
  background: #dbeafe;
  color: #1e40af;
}

.dist-label.satisfactory {
  background: #fef3c7;
  color: #92400e;
}

.dist-label.warning {
  background: #fee2e2;
  color: #dc2626;
}

.dist-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3D8D7A;
  margin-left: 1rem;
}

.dark .dist-count {
  color: #A3D1C6;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.dark .empty-state {
  color: #9ca3af;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.dark .history-item {
  border-color: #374151;
}

.quiz-info h5 {
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 0.25rem;
}

.dark .quiz-info h5 {
  color: #A3D1C6;
}

.quiz-info p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.dark .quiz-info p {
  color: #9ca3af;
}

/* Enhanced Loading Overlay - Matches MessagesPage */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(251, 255, 228, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dark .loading-overlay {
  background: rgba(24, 28, 32, 0.95);
}

.loading-content {
  background: white;
  padding: 3rem 4rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(61, 141, 122, 0.15);
  border: 2px solid #a3d1c6;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark .loading-content {
  background: #23272b;
  border-color: #374151;
}

.loading-spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(61, 141, 122, 0.1);
  border-left: 5px solid #3d8d7a;
  border-top: 5px solid #20c997;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(61, 141, 122, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dark .loading-spinner {
  border: 5px solid rgba(32, 201, 151, 0.1);
  border-left: 5px solid #20c997;
  border-top: 5px solid #18a577;
  box-shadow: 0 0 20px rgba(32, 201, 151, 0.1);
}

.loading-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.025em;
}

.dark .loading-text {
  color: #A3D1C6;
}

/* Logout Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.logout-modal {
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  border: 2px solid #3D8D7A;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.logout-header {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 1.5rem;
}

.logout-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.logout-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logout-icon svg {
  color: #3D8D7A;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.logout-message {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.logout-submessage {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0;
}

.logout-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background: #f8fafc;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-logout {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-logout:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.logout-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-logout .loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 