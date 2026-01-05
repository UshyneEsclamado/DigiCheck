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
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1V3H9V1L3 7V9H5V20A2 2 0 0 0 7 22H17A2 2 0 0 0 19 20V9H21M17 20H7V4H13V9H18V20Z"/>
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
        <router-link to="/teacher/subjects" class="sidebar-item rounded-bg" :class="{ 'active': $route.path.includes('/teacher/subjects') }">
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
      <!-- Scroll to Top Button -->
      <button v-if="showScrollTop" @click="scrollToTop" class="scroll-to-top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      </button>
      
      <!-- Main Content Container -->
      <div class="main-container">
        <!-- Assessment Management Header -->
        <div class="section-header">
          <div class="header-content">
            <div class="header-left">
              <button @click="goBackToSubjects" class="back-btn" title="Back to My Subjects">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
              </button>
              <div class="header-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div class="header-info">
                <h1 class="section-title">Assessment Management</h1>
                <p class="section-subtitle">{{ subjectName }}<span v-if="sectionName"> - {{ sectionName }}</span></p>
              </div>
            </div>
            <div class="header-actions">
              <button @click="navigateToCreateQuiz" class="action-btn primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Create Quiz
              </button>
              <button @click="navigateToCreateAssignment" class="action-btn primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Create Assignment
              </button>
            </div>
          </div>
        </div>
        
        <div class="container">
          <!-- Loading State -->
          <div v-if="isLoading" class="status-card loading-card">
            <div class="status-icon">
              <div class="spinner"></div>
            </div>
            <h3 class="status-title">Loading Assessment Data...</h3>
            <p class="status-description">Please wait while we fetch your assessments.</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="status-card error-card">
            <div class="status-icon error-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
              </svg>
            </div>
            <h3 class="status-title">Error Loading Assessments</h3>
            <p class="status-description">{{ error }}</p>
            <div class="status-actions">
              <button @click="fetchAllAssessments" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                </svg>
                Try Again
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="allAssessments.length === 0" class="status-card empty-state-card">
            <div class="status-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 class="status-title">No Assessments Available</h3>
            <p class="status-description">You haven't created any assessments for this section yet.</p>
            <div class="status-actions">
              <button @click="navigateToCreateQuiz" class="create-quiz-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Create Your First Assessment
              </button>
            </div>
          </div>

          <!-- Assessments Grid -->
          <div v-else class="content-section">
            <!-- Filter Tabs -->
            <div class="filter-tabs">
              <button 
                @click="activeView = 'all'" 
                :class="['filter-tab', { active: activeView === 'all' }]"
              >
                All ({{ allAssessments.length }})
              </button>
              <button 
                @click="activeView = 'quizzes'" 
                :class="['filter-tab', { active: activeView === 'quizzes' }]"
              >
                Quizzes ({{ quizzes.length }})
              </button>
              <button 
                @click="activeView = 'assignments'" 
                :class="['filter-tab', { active: activeView === 'assignments' }]"
              >
                Assignments ({{ assignments.length }})
              </button>
            </div>

            <div class="section-header">
              <div class="section-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <div class="section-content">
                <h2 class="section-title">Your Assessments</h2>
                <p class="section-subtitle">{{ allAssessments.length }} assessment{{ allAssessments.length !== 1 ? 's' : '' }} created</p>
              </div>
            </div>

            <div class="quizzes-grid-modern">
              <!-- Quiz Cards -->
              <div 
                v-for="item in allAssessments" 
                :key="item.id" 
                class="quiz-card-modern"
                :class="{ 'assignment-card': item.type === 'assignment' }"
              >
                <div class="quiz-card-header">
                  <div class="assessment-type-badge" :class="item.type">
                    <svg v-if="item.type === 'quiz'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                    </svg>
                    {{ item.type === 'quiz' ? 'Quiz' : 'Assignment' }}
                  </div>
                  <div class="quiz-status-badge" :class="item.status">
                    <span class="status-indicator"></span>
                    {{ formatStatus(item.status) }}
                  </div>
                  <div class="quiz-menu">
                    <button 
                      @click="item.type === 'quiz' ? deleteQuiz(item) : deleteAssignment(item)" 
                      class="menu-btn danger"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="quiz-card-body">
                  <h3 class="quiz-title-modern">{{ item.title }}</h3>
                  
                  <!-- Quiz Code Display (only for quizzes) -->
                  <div v-if="item.type === 'quiz' && item.quiz_code" class="quiz-code-modern">
                    <span class="code-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
                      </svg>
                    </span>
                    <span class="code-text">{{ item.quiz_code }}</span>
                  </div>

                  <!-- Assignment Type Badge -->
                  <div v-if="item.type === 'assignment'" class="assignment-type-badge">
                    {{ formatAssignmentType(item.assignment_type) }}
                  </div>

                  <p v-if="item.description" class="quiz-description-modern">{{ item.description }}</p>

                  <!-- Stats (different for quiz vs assignment) -->
                  <div class="quiz-stats-modern">
                    <template v-if="item.type === 'quiz'">
                      <div class="stat-item-modern">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ item.question_count || 0 }}</span>
                          <span class="stat-label-modern">Questions</span>
                        </div>
                      </div>

                      <div class="stat-item-modern">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ item.total_points || 0 }}</span>
                          <span class="stat-label-modern">Points</span>
                        </div>
                      </div>

                      <div class="stat-item-modern" v-if="item.has_time_limit && item.time_limit_minutes">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ item.time_limit_minutes }}</span>
                          <span class="stat-label-modern">Minutes</span>
                        </div>
                      </div>
                    </template>

                    <template v-else>
                      <div class="stat-item-modern">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ item.total_points || 100 }}</span>
                          <span class="stat-label-modern">Points</span>
                        </div>
                      </div>

                      <div class="stat-item-modern">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9,10H7V12H9V10M13,10H11V12H13V10M17,10H15V12H17V10M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ formatDate(item.due_date) }}</span>
                          <span class="stat-label-modern">Due Date</span>
                        </div>
                      </div>

                      <div class="stat-item-modern">
                        <div class="stat-icon-modern">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16,9H13V14.5H16M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M11,8H6V10H11V8M21,19H3V5H21V19M16,12H13V14H16V12Z" />
                          </svg>
                        </div>
                        <div class="stat-content-modern">
                          <span class="stat-number-modern">{{ item.submission_count || 0 }}</span>
                          <span class="stat-label-modern">Submissions</span>
                        </div>
                      </div>
                    </template>
                  </div>

                  <!-- Meta Info -->
                  <div class="quiz-meta-modern">
                    <span class="meta-item-modern">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                      </svg>
                      Created {{ formatDate(item.created_at) }}
                    </span>
                    <span v-if="item.type === 'quiz' && item.shuffle_questions" class="meta-item-modern">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,20H16V18H20V16H16A2,2 0 0,1 14,14V10A2,2 0 0,1 16,8H20V6H16V4H14V6L12,8V10L14,12V14L12,16V18L14,20M10,8V10L12,12L10,14V16L4,10L10,8Z" />
                      </svg>
                      Shuffle Enabled
                    </span>
                  </div>
                </div>

                <div class="quiz-card-footer">
                  <button 
                    @click="item.type === 'quiz' ? viewQuizDetails(item) : viewAssignmentDetails(item)" 
                    class="action-btn-modern primary"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                    View Details
                  </button>

                  <button 
                    @click="item.type === 'quiz' ? editQuiz(item) : editAssignment(item)" 
                    class="action-btn-modern secondary"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                    </svg>
                    Edit
                  </button>

                  <button 
                    @click="item.type === 'quiz' ? toggleQuizStatus(item) : toggleAssignmentStatus(item)" 
                    :class="['action-btn-modern', item.status === 'published' ? 'warning' : 'success']"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path v-if="item.status === 'published'" d="M8.5,8.64L13.77,12L8.5,15.36V8.64M6.5,5V19L17.5,12"/>
                      <path v-else d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z"/>
                    </svg>
                    {{ item.status === 'published' ? 'Unpublish' : 'Publish' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Details Modal (for both quiz and assignment) -->
    <div v-if="selectedItem" class="modal-overlay" @click="closeModal">
      <div class="modal-content quiz-details-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedItem.title }}</h2>
          <button @click="closeModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Quiz Details -->
          <div v-if="selectedItemType === 'quiz'" class="quiz-overview">
            <div class="quiz-code-section">
              <div class="code-display-box">
                <span class="code-label-large">Quiz Code</span>
                <span class="code-value-large">{{ selectedItem.quiz_code || 'N/A' }}</span>
              </div>
            </div>

            <p v-if="selectedItem.description" class="quiz-description-modal">{{ selectedItem.description }}</p>
            
            <div class="overview-stats">
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.question_count || 0 }}</span>
                <span class="stat-label">Questions</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.total_points || 0 }}</span>
                <span class="stat-label">Total Points</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.has_time_limit && selectedItem.time_limit_minutes ? selectedItem.time_limit_minutes + ' min' : 'No Limit' }}</span>
                <span class="stat-label">Time Limit</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.attempts_allowed === 999 ? '∞' : selectedItem.attempts_allowed }}</span>
                <span class="stat-label">Attempts</span>
              </div>
            </div>

            <div class="questions-preview">
              <h4>Questions Preview</h4>
              
              <div v-if="loadingDetails" class="loading-questions">
                <div class="loading-spinner-small"></div>
                <p>Loading questions...</p>
              </div>

              <div v-else-if="selectedQuizQuestions.length > 0" class="questions-list">
                <div v-for="question in selectedQuizQuestions" :key="question.id" class="question-preview">
                  <div class="question-number">{{ question.question_number }}</div>
                  <div class="question-content">
                    <p class="question-text">{{ question.question_text }}</p>
                    <div class="question-meta">
                      <span class="question-type">{{ formatQuestionType(question.question_type) }}</span>
                      <span class="question-points">{{ question.points }} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="no-questions">
                <p>No questions found for this quiz.</p>
              </div>
            </div>
          </div>

          <!-- Assignment Details -->
          <div v-else-if="selectedItemType === 'assignment'" class="assignment-overview">
            <p v-if="selectedItem.description" class="quiz-description-modal">{{ selectedItem.description }}</p>
            
            <div class="overview-stats">
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.total_points || 100 }}</span>
                <span class="stat-label">Total Points</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ formatDate(selectedItem.due_date) }}</span>
                <span class="stat-label">Due Date</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.submission_count || 0 }}</span>
                <span class="stat-label">Submissions</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ selectedItem.graded_count || 0 }}</span>
                <span class="stat-label">Graded</span>
              </div>
            </div>

            <div class="assignment-details">
              <h4>Assignment Details</h4>
              <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">{{ formatAssignmentType(selectedItem.assignment_type) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Submission Type:</span>
                <span class="detail-value">{{ selectedItem.submission_type }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Allow Late Submission:</span>
                <span class="detail-value">{{ selectedItem.allow_late_submission ? 'Yes' : 'No' }}</span>
              </div>
              <div v-if="selectedItem.allow_late_submission" class="detail-row">
                <span class="detail-label">Late Penalty:</span>
                <span class="detail-value">{{ selectedItem.late_penalty }}% per day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../supabase.js'
import { useDarkMode } from '../../composables/useDarkMode.js'

// Initialize composables
const { initDarkMode } = useDarkMode()
const router = useRouter()
const route = useRoute()

// User and authentication state
const fullName = ref('Teacher')
const isLoadingName = ref(false)
const userId = ref(null)
const teacherId = ref(null)

// UI state
const notifications = ref([])
const showNotifDropdown = ref(false)
const showProfileDropdown = ref(false)
const showScrollTop = ref(false)
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

// Route parameters
const subjectId = ref(route.params.subjectId)
const sectionId = ref(route.params.sectionId)
const subjectName = ref(route.query.subjectName || '')
const sectionName = ref(route.query.sectionName || '')
const gradeLevel = ref(route.query.gradeLevel || '')
const sectionCode = ref(route.query.sectionCode || '')

// Assessment management state
const quizzes = ref([])
const assignments = ref([])
const selectedItem = ref(null)
const selectedItemType = ref(null) // 'quiz' or 'assignment'
const selectedQuizQuestions = ref([])
const isLoading = ref(false)
const loadingDetails = ref(false)
const error = ref(null)

// View toggle
const activeView = ref('all') // 'all', 'quizzes', 'assignments'

let quizSubscription = null
let assignmentSubscription = null

// Computed property for combined assessments
const allAssessments = computed(() => {
  const all = [...quizzes.value, ...assignments.value]
  
  if (activeView.value === 'quizzes') {
    return quizzes.value
  } else if (activeView.value === 'assignments') {
    return assignments.value
  }
  
  return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// Methods for UI interactions
const toggleNotifDropdown = () => {
  showNotifDropdown.value = !showNotifDropdown.value
  if (showNotifDropdown.value) {
    showProfileDropdown.value = false
  }
}

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
  if (showProfileDropdown.value) {
    showNotifDropdown.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.pageYOffset > 300
}

const goBackToSubjects = () => {
  router.push('/teacher/subjects')
}

// Load teacher profile
const loadTeacherProfile = async () => {
  try {
    isLoadingName.value = true
    console.log('🔍 Loading teacher profile...')
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('❌ No user found:', userError)
      return false
    }
    
    userId.value = user.id
    console.log('✅ User ID:', user.id)
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('auth_user_id', user.id)
      .single()
    
    if (profileError || !profile) {
      console.error('❌ Profile error:', profileError)
      return false
    }
    
    console.log('✅ Profile found:', profile)
    
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id, full_name')
      .eq('profile_id', profile.id)
      .single()
    
    if (teacherError || !teacher) {
      console.error('❌ Teacher error:', teacherError)
      return false
    }
    
    teacherId.value = teacher.id
    fullName.value = teacher.full_name || profile.full_name || 'Teacher'
    
    console.log('✅ Teacher loaded:', { id: teacher.id, name: fullName.value })
    return true
    
  } catch (err) {
    console.error('❌ Error loading profile:', err)
    return false
  } finally {
    isLoadingName.value = false
  }
}

// Load notifications
const loadNotifications = async () => {
  if (!teacherId.value) {
    console.warn('⚠️ No teacher ID, cannot load notifications')
    return
  }
  
  try {
    console.log('🔔 Loading notifications for teacher:', teacherId.value)
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString()
    
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        submitted_at,
        student_id,
        quiz_id,
        quizzes!inner(title, teacher_id),
        students!inner(full_name)
      `)
      .eq('quizzes.teacher_id', teacherId.value)
      .eq('status', 'submitted')
      .gte('submitted_at', yesterdayISO)
      .order('submitted_at', { ascending: false })
    
    if (submissionsError) {
      console.error('❌ Error loading submissions:', submissionsError)
      return
    }
    
    const submissionNotifications = (recentSubmissions || []).map(submission => ({
      id: `submission-${submission.id}`,
      title: `New Quiz Submission`,
      body: `${submission.students.full_name} submitted "${submission.quizzes.title}"`,
      date: new Date(submission.submitted_at).toLocaleDateString(),
      type: 'submission'
    }))
    
    notifications.value = submissionNotifications
    
    console.log('✅ Loaded', notifications.value.length, 'notifications')
    
  } catch (err) {
    console.error('❌ Error loading notifications:', err)
  }
}

const handleNotificationClick = (notif) => {
  console.log('Notification clicked:', notif)
}

// Logout functionality
const openLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = () => {
  console.log('🚪 Logging out...')
  localStorage.clear()
  sessionStorage.clear()
  supabase.auth.signOut().catch(err => console.log('Signout error:', err))
  setTimeout(() => {
    window.location.assign('/login')
  }, 100)
  console.log('✅ Logout initiated')
}

const logout = () => {
  openLogoutModal()
}

const loadTeacherInfo = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw new Error('Authentication failed')
    if (!user) throw new Error('Please login to continue')

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()
    if (profileError || !profile) throw new Error('Profile not found')

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('profile_id', profile.id)
      .single()
    if (teacherError || !teacher) throw new Error('Teacher profile not found')

    teacherId.value = teacher.id
    return teacher.id
  } catch (err) {
    throw err
  }
}

const fetchQuizzes = async () => {
  try {
    if (!teacherId.value) await loadTeacherInfo()

    console.log('📚 Fetching quizzes for:', { teacherId: teacherId.value, subjectId: subjectId.value, sectionId: sectionId.value })

    // Fetch quizzes that are assigned to this section via bulk_quizzes table
    const { data: bulkQuizzes, error: bulkError } = await supabase
      .from('bulk_quizzes')
      .select('quiz_id')
      .eq('section_id', sectionId.value);

    if (bulkError) {
      console.error('Error fetching bulk quizzes:', bulkError);
      throw bulkError;
    }

    const quizIds = bulkQuizzes?.map(bq => bq.quiz_id) || [];
    console.log('📋 Found quiz IDs from bulk_quizzes:', quizIds);

    // If no quizzes found in bulk_quizzes for this section, return empty
    if (quizIds.length === 0) {
      console.log('✅ No quizzes found for this section');
      quizzes.value = [];
      return;
    }

    // Fetch the actual quiz data
    const { data: quizzesData, error: quizzesError } = await supabase
      .from('quizzes')
      .select(`*, quiz_questions(id, points)`)
      .in('id', quizIds)
      .eq('subject_id', subjectId.value)
      .eq('teacher_id', teacherId.value)
      .order('created_at', { ascending: false })

    if (quizzesError) throw quizzesError

    console.log('✅ Quizzes fetched:', quizzesData?.length || 0)

    quizzes.value = (quizzesData || []).map(quiz => {
      const questions = quiz.quiz_questions || []
      return {
        ...quiz,
        question_count: questions.length,
        total_points: questions.reduce((sum, q) => sum + (q.points || 0), 0),
        quiz_questions: undefined,
        type: 'quiz'
      }
    })
  } catch (err) {
    console.error('❌ Error fetching quizzes:', err)
    throw err
  }
}

const fetchAssignments = async () => {
  try {
    if (!teacherId.value) await loadTeacherInfo()

    console.log('📝 Fetching assignments for:', { teacherId: teacherId.value, subjectId: subjectId.value, sectionId: sectionId.value })

    // ✅ BULK ASSIGNMENTS - Two-step query via bulk_assignments junction table
    // Step 1: Get assignment IDs for this section from bulk_assignments
    const { data: bulkAssignments, error: bulkError } = await supabase
      .from('bulk_assignments')
      .select('assignment_id')
      .eq('section_id', sectionId.value)

    if (bulkError) throw bulkError

    const assignmentIds = bulkAssignments?.map(ba => ba.assignment_id) || []
    console.log('📋 Found', assignmentIds.length, 'assignments via bulk_assignments')

    // If no assignments found, return empty
    if (assignmentIds.length === 0) {
      assignments.value = []
      return
    }

    // Step 2: Get actual assignment data using the IDs
    const { data: assignmentsData, error: assignmentsError } = await supabase
      .from('assignments')
      .select(`
        *,
        assignment_submissions(id, status)
      `)
      .in('id', assignmentIds)
      .eq('subject_id', subjectId.value)
      .eq('teacher_id', teacherId.value)
      .order('created_at', { ascending: false })

    if (assignmentsError) throw assignmentsError

    console.log('✅ Assignments fetched:', assignmentsData?.length || 0)

    assignments.value = (assignmentsData || []).map(assignment => {
      const submissions = assignment.assignment_submissions || []
      return {
        ...assignment,
        submission_count: submissions.length,
        graded_count: submissions.filter(s => s.status === 'graded').length,
        assignment_submissions: undefined,
        type: 'assignment'
      }
    })
  } catch (err) {
    console.error('❌ Error fetching assignments:', err)
    throw err
  }
}

const fetchAllAssessments = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await Promise.all([fetchQuizzes(), fetchAssignments()])
    console.log('✅ All assessments loaded:', { quizzes: quizzes.value.length, assignments: assignments.value.length })
  } catch (err) {
    error.value = err.message
    console.error('❌ Error loading assessments:', err)
    if (err.message.includes('login') || err.message.includes('not found')) {
      alert('Session expired. Please login again.')
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

const viewQuizDetails = async (quiz) => {
  selectedItem.value = quiz
  selectedItemType.value = 'quiz'
  selectedQuizQuestions.value = []
  loadingDetails.value = true
  
  try {
    const { data: questions, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('question_number')
    
    if (error) throw error
    selectedQuizQuestions.value = questions || []
  } catch (err) {
    selectedQuizQuestions.value = []
    alert('Error loading quiz questions: ' + err.message)
  } finally {
    loadingDetails.value = false
  }
}

const viewAssignmentDetails = async (assignment) => {
  selectedItem.value = assignment
  selectedItemType.value = 'assignment'
  loadingDetails.value = false
}

const editQuiz = async (quiz) => {
  try {
    await router.push({
      name: 'EditQuiz',
      params: { quizId: quiz.id },
      query: {
        subjectId: subjectId.value,
        sectionId: sectionId.value,
        subjectName: subjectName.value,
        sectionName: sectionName.value,
        gradeLevel: gradeLevel.value,
        sectionCode: sectionCode.value
      }
    })
  } catch (error) {
    alert('Error navigating to edit page: ' + error.message)
  }
}

const editAssignment = async (assignment) => {
  try {
    await router.push({
      name: 'EditQuiz',
      params: { 
        quizId: assignment.id,  // Changed from assignmentId to quizId
        subjectId: subjectId.value, 
        sectionId: sectionId.value 
      },
      query: {
        subjectName: subjectName.value,
        sectionName: sectionName.value,
        gradeLevel: gradeLevel.value,
        sectionCode: sectionCode.value,
        type: 'assignment'  // Add this to distinguish it's an assignment
      }
    })
  } catch (error) {
    alert('Error navigating to edit page: ' + error.message)
  }
}

const toggleQuizStatus = async (quiz) => {
  const newStatus = quiz.status === 'published' ? 'draft' : 'published'
  if (!confirm(`Are you sure you want to ${newStatus === 'published' ? 'publish' : 'unpublish'} this quiz?`)) return
  
  try {
    const { error } = await supabase
      .from('quizzes')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', quiz.id)
    
    if (error) throw error
    quiz.status = newStatus
    alert(`Quiz ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
  } catch (err) {
    alert(`Error updating quiz: ${err.message}`)
  }
}

const toggleAssignmentStatus = async (assignment) => {
  const newStatus = assignment.status === 'published' ? 'draft' : 'published'
  if (!confirm(`Are you sure you want to ${newStatus === 'published' ? 'publish' : 'unpublish'} this assignment?`)) return
  
  try {
    const { error } = await supabase
      .from('assignments')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      })
      .eq('id', assignment.id)
    
    if (error) throw error
    assignment.status = newStatus
    alert(`Assignment ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
  } catch (err) {
    alert(`Error updating assignment: ${err.message}`)
  }
}

const deleteQuiz = async (quiz) => {
  if (!confirm(`Are you sure you want to delete "${quiz.title}"?\n\nThis action cannot be undone and will delete all associated questions, student attempts, and results.`)) return
  
  try {
    const { error } = await supabase.from('quizzes').delete().eq('id', quiz.id)
    if (error) throw error
    quizzes.value = quizzes.value.filter(q => q.id !== quiz.id)
    alert('Quiz deleted successfully!')
  } catch (err) {
    alert(`Error deleting quiz: ${err.message}`)
  }
}

const deleteAssignment = async (assignment) => {
  if (!confirm(`Are you sure you want to delete "${assignment.title}"?\n\nThis action cannot be undone and will delete all associated submissions.`)) return
  
  try {
    const { error } = await supabase.from('assignments').delete().eq('id', assignment.id)
    if (error) throw error
    assignments.value = assignments.value.filter(a => a.id !== assignment.id)
    alert('Assignment deleted successfully!')
  } catch (err) {
    alert(`Error deleting assignment: ${err.message}`)
  }
}

const navigateToCreateQuiz = async () => {
  try {
    await router.push({
      name: 'CreateQuiz',
      params: { subjectId: subjectId.value, sectionId: sectionId.value },
      query: {
        subjectName: subjectName.value,
        sectionName: sectionName.value,
        gradeLevel: gradeLevel.value,
        sectionCode: sectionCode.value
      }
    })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const navigateToCreateAssignment = async () => {
  try {
    await router.push({
      name: 'CreateAssignment',
      params: { subjectId: subjectId.value, sectionId: sectionId.value },
      query: {
        subjectName: subjectName.value,
        sectionName: sectionName.value,
        gradeLevel: gradeLevel.value,
        sectionCode: sectionCode.value
      }
    })
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const closeModal = () => {
  selectedItem.value = null
  selectedItemType.value = null
  selectedQuizQuestions.value = []
  loadingDetails.value = false
}

const formatStatus = (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatQuestionType = (type) => {
  const types = {
    'multiple_choice': 'Multiple Choice',
    'true_false': 'True/False',
    'fill_blank': 'Fill in the Blank'
  }
  return types[type] || type
}

const formatAssignmentType = (type) => {
  const types = {
    'homework': 'Homework',
    'project': 'Project',
    'essay': 'Essay',
    'presentation': 'Presentation',
    'research': 'Research',
    'lab': 'Lab Work',
    'other': 'Other'
  }
  return types[type] || type
}

const setupRealtimeSubscription = () => {
  if (!teacherId.value) return

  quizSubscription = supabase
    .channel('quiz-changes')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'quizzes',
        filter: `teacher_id=eq.${teacherId.value}`
      },
      () => {
        console.log('📡 Quiz change detected, refreshing...')
        fetchQuizzes()
      }
    )
    .subscribe()

  assignmentSubscription = supabase
    .channel('assignment-changes')
    .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assignments',
        filter: `teacher_id=eq.${teacherId.value}`
      },
      () => {
        console.log('📡 Assignment change detected, refreshing...')
        fetchAssignments()
      }
    )
    .subscribe()
}

onMounted(async () => {
  console.log('🚀 Component mounted')
  initDarkMode()
  window.addEventListener('scroll', handleScroll)
  await loadTeacherProfile()
  await loadNotifications()
  
  if (!subjectId.value || !sectionId.value) {
    error.value = 'Missing required parameters'
    alert('Missing subject or section information. Redirecting back...')
    router.push('/teacher/subjects')
    return
  }

  await fetchAllAssessments()
  setupRealtimeSubscription()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (quizSubscription) supabase.removeChannel(quizSubscription)
  if (assignmentSubscription) supabase.removeChannel(assignmentSubscription)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  min-height: 100vh;
  width: 100vw;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
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

.sidebar-item.rounded-bg {
  background: rgba(255,255,255,0.1);
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
  gap: 0.75rem;
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
}

.brand-logo:hover {
  opacity: 0.9;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.brand-name {
  font-size: 1.5rem;
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

/* User Profile and Notifications */
.nav-icon-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.notification-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

.notif-wrapper {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 360px;
  max-height: 480px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
  border: 1px solid #e2e8f0;
}

.dropdown-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fafafa;
}

.dropdown-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

.notification-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item:last-child {
  border-bottom: none;
}

.notif-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.notif-content p {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.notif-time {
  font-size: 0.75rem;
  color: #94a3b8;
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
  margin-left: 80px;
  margin-top: 64px;
  padding: 2rem;
  min-height: calc(100vh - 64px);
  height: calc(100vh - 64px);
  width: calc(100vw - 80px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
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
  box-shadow: 0 2px  8px rgba(32, 201, 151, 0.3);
}

.dark ::-webkit-scrollbar-corner {
  background: #1a1d21;
}

/* Scroll to Top Button */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
  transition: all 0.2s;
  z-index: 900;
}

.scroll-to-top:hover {
  background: #2d6a5a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.4);
}

/* Content Styles */
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
  letter-spacing: -0.025em;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.breadcrumb-item {
  font-weight: 500;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.navbar-center {
  justify-content: center;
  max-width: 600px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  position: relative;
  font-size: 0.75rem;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: white;
  border-radius: 2px 2px 0 0;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.export-btn.create-quiz-btn {
  background: rgba(16, 185, 129, 0.9);
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.export-btn.create-quiz-btn:hover {
  background: #059669;
  border-color: #047857;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

/* Main Content */
.main-content {
  margin-top: 64px;
  padding: 1.5rem;
  width: 100%;
  min-height: calc(100vh - 64px);
  position: relative;
  background: #f8fafc;
  padding-bottom: 2rem;
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
  letter-spacing: -0.025em;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.breadcrumb-item {
  font-weight: 500;
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.view-quizzes-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dark .view-quizzes-page {
  background: #0f172a;
}

/* Header Section - Same as CreateQuiz */
.header-section {
  background: linear-gradient(135deg, #3D8D7A 0%, #2D6A5A 100%);
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.dark .header-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat-x;
  opacity: 0.5;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-wrapper {
  position: relative;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .header-icon {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-text h1.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.header-text p.header-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-item {
  font-weight: 500;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.6);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.primary {
  background: rgba(16, 185, 129, 0.9);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.action-btn.primary:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dark .action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Main Content Container - Same as CreateQuiz */
.main-container {
  flex: 1;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.dark .main-container {
  background: transparent;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Status Cards - Same as CreateQuiz Landing */
.status-card {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.5);
  padding: 3rem 2rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin: 2rem auto;
}

.dark .status-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.loading-card,
.empty-state-card {
  border-color: rgba(61, 141, 122, 0.3);
}

.error-card {
  border-color: rgba(239, 68, 68, 0.3);
}

.status-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #64748b;
}

.error-icon {
  color: #ef4444;
}

.dark .status-icon {
  color: #94a3b8;
}

.status-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  letter-spacing: -0.025em;
}

.dark .status-title {
  color: #f1f5f9;
}

.status-description {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
}

.dark .status-description {
  color: #94a3b8;
}

.status-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Spinner Animation */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .spinner {
  border-color: #1e293b;
  border-top-color: #10b981;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Create Quiz Button */
.create-quiz-btn {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
  border-radius: 10px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.15);
  min-width: 220px;
  justify-content: center;
}

.create-quiz-btn:hover {
  background: #059669;
  border-color: #047857;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
}

/* Buttons - Same as CreateQuiz */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.btn-primary:hover {
  background: #059669;
  border-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

/* Content Section */
.content-section {
  margin-top: 0;
}

/* Section Headers - Same as CreateQuiz */
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .section-header {
  border-bottom-color: #334155;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  flex-shrink: 0;
}

.dark .section-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.section-content {
  flex: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.dark .section-title {
  color: #f1f5f9;
}

.section-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.dark .section-subtitle {
  color: #94a3b8;
}

/* Modern Quizzes Grid */
.quizzes-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.quiz-card-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.quiz-card-modern:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
  transform: translateY(-4px);
}

.dark .quiz-card-modern {
  background: #1e293b;
  border-color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.dark .quiz-card-modern:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
}

/* Quiz Card Header */
.quiz-card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark .quiz-card-header {
  background: linear-gradient(135deg, #374151 0%, #1e293b 100%);
  border-bottom-color: #475569;
}

.quiz-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quiz-status-badge.published {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.quiz-status-badge.draft {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.quiz-status-badge.archived {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.quiz-menu {
  display: flex;
  gap: 0.5rem;
}

.menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-btn.danger {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.menu-btn.danger:hover {
  background: #ef4444;
  color: white;
}

.dark .menu-btn.danger {
  background: #7f1d1d;
  color: #fca5a5;
  border-color: #991b1b;
}

/* Quiz Card Body */
.quiz-card-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quiz-title-modern {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.dark .quiz-title-modern {
  color: #f1f5f9;
}

.quiz-code-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d4ed8;
  align-self: flex-start;
}

.dark .quiz-code-modern {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.code-icon {
  color: #3b82f6;
  display: flex;
  align-items: center;
}

.quiz-description-modern {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}

.dark .quiz-description-modern {
  color: #94a3b8;
}

.quiz-stats-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
}

.dark .quiz-stats-modern {
  background: #374151;
  border-color: #475569;
}

.stat-item-modern {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon-modern {
  width: 32px;
  height: 32px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  flex-shrink: 0;
}

.dark .stat-icon-modern {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.stat-content-modern {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number-modern {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.dark .stat-number-modern {
  color: #f1f5f9;
}

.stat-label-modern {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.dark .stat-label-modern {
  color: #94a3b8;
}

.quiz-meta-modern {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}

.dark .quiz-meta-modern {
  color: #94a3b8;
}

.meta-item-modern {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Quiz Card Footer */
.quiz-card-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dark .quiz-card-footer {
  background: #374151;
  border-top-color: #475569;
}

.action-btn-modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex: 1;
  justify-content: center;
  min-width: 100px;
}

.action-btn-modern.primary {
  background: #10b981;
  color: white;
}

.action-btn-modern.primary:hover {
  background: #059669;
  transform: translateY(-1px);
}

.action-btn-modern.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-btn-modern.secondary:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.action-btn-modern.success {
  background: #22c55e;
  color: white;
}

.action-btn-modern.success:hover {
  background: #16a34a;
}

.action-btn-modern.warning {
  background: #f59e0b;
  color: white;
}

.action-btn-modern.warning:hover {
  background: #d97706;
}

.dark .action-btn-modern.secondary {
  background: #475569;
  color: #d1d5db;
  border-color: #6b7280;
}

.dark .action-btn-modern.secondary:hover {
  background: #6b7280;
  color: #f3f4f6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    padding: 1.5rem 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .header-left {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-text h1.header-title {
    font-size: 1.5rem;
  }
  
  .header-text p.header-subtitle {
    font-size: 1rem;
  }
  
  .main-container {
    padding: 1.5rem 1rem;
  }

  .quizzes-grid-modern {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .quiz-stats-modern {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quiz-card-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-btn-modern {
    flex: none;
  }
  
  .status-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
}

/* =============================================== */
/* MODAL STYLES - Matching CreateQuiz Design */
/* =============================================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dark .modal-content {
  background: #1e293b;
  border-color: #374151;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.quiz-details-modal {
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.dark .modal-header {
  background: linear-gradient(135deg, #374151 0%, #1e293b 100%);
  border-bottom-color: #475569;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
  max-width: 500px;
}

.dark .modal-header h2 {
  color: #f1f5f9;
}

.close-btn {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.close-btn:hover {
  color: #ef4444;
  background: #fef2f2;
  border-color: #fecaca;
  transform: scale(1.05);
}

.dark .close-btn {
  background: #374151;
  border-color: #475569;
  color: #94a3b8;
}

.dark .close-btn:hover {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fca5a5;
}

.modal-body {
  padding: 2rem;
}

.quiz-overview {
  margin-bottom: 2rem;
}

.quiz-code-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .quiz-code-section {
  border-bottom-color: #374151;
}

.code-display-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #3b82f6;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
}

.dark .code-display-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.code-display-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.code-label-large {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
}

.dark .code-label-large {
  color: #94a3b8;
}

.code-value-large {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
  letter-spacing: 4px;
  text-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  position: relative;
  z-index: 1;
}

.dark .code-value-large {
  color: #60a5fa;
}

.quiz-description-modal {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.dark .quiz-description-modal {
  color: #94a3b8;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item:hover {
  border-color: #10b981;
}

.dark .stat-item {
  background: #374151;
  border-color: #475569;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.loading-questions {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dark .loading-questions {
  color: #94a3b8;
}

.loading-questions .loading-spinner-small {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0;
}

.no-questions {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-style: italic;
}

.dark .no-questions {
  color: #94a3b8;
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

/* Back Button */
.back-btn {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-btn:hover {
  background: #3D8D7A;
  border-color: #3D8D7A;
  color: white;
  transform: translateX(-2px);
}

/* Modal Body Scroll */
.modal-body {
  padding: 2rem;
  max-height: calc(85vh - 180px);
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Questions List Scroll */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.questions-list::-webkit-scrollbar {
  width: 6px;
}

.questions-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.questions-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.questions-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-tab {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background: #f8fafc;
  color: #1e293b;
}

.filter-tab.active {
  background: #10b981;
  color: white;
}

/* Assessment Type Badge */
.assessment-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.assessment-type-badge.quiz {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.assessment-type-badge.assignment {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

/* Assignment Type Badge in Card Body */
.assignment-type-badge {
  display: inline-flex;
  padding: 0.5rem 1rem;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Assignment Details in Modal */
.assignment-details {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.assignment-details h4 {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  color: #1e293b;
  font-weight: 500;
}
</style>