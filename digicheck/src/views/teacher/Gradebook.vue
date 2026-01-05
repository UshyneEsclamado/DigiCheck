<template>
  <div class="dashboard-container" :class="{ 'dark': isDarkMode }">
    <!-- Top Navigation Bar -->
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

      <!-- Unified Gradebook Header -->
      <div class="gradebook-header">
        <div class="header-content-left">
          <div class="header-left">
            <div class="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Class Record</h1>
              <p class="header-subtitle">Manage student grades and performance tracking</p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="refreshData" class="refresh-btn grade-btn" :disabled="loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" :class="{ 'spinning': loading }">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Grade Level and Section Selection -->
      <div v-if="!loading || gradeLevels.length > 0" class="selection-container">
        <!-- Grade Level Selector -->
        <div class="grade-level-section">
          <div class="section-title-bar">
            <div class="title-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
              </svg>
              <h3>Select Grade Level</h3>
            </div>
            <span class="count-badge">{{ gradeLevels.length }} Grade{{ gradeLevels.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="grade-buttons-container">
            <button
              v-for="grade in gradeLevels"
              :key="grade"
              @click="selectGradeLevel(grade)"
              class="grade-level-btn"
              :class="{ 'active': selectedGradeLevel === grade }"
            >
              <div class="grade-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                </svg>
              </div>
              <div class="grade-content">
                <div class="grade-title">Grade {{ grade }}</div>
                <div class="grade-count">{{ getSectionCountForGrade(grade) }} Section{{ getSectionCountForGrade(grade) !== 1 ? 's' : '' }}</div>
              </div>
              <svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </button>
            <div v-if="gradeLevels.length === 0" class="empty-state-inline">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <p>No grade levels available</p>
            </div>
          </div>
        </div>

        <!-- Section Selector (shown when grade level is selected) -->
        <div v-if="selectedGradeLevel" class="sections-section">
          <div class="section-title-bar">
            <div class="title-content">
              <button @click="clearGradeSelection" class="back-btn-inline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
              </button>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M7,7H17V9H7V7M7,11H17V13H7V11M7,15H17V17H7V15Z" />
              </svg>
              <h3>Grade {{ selectedGradeLevel }} Sections</h3>
            </div>
            <span class="count-badge">{{ filteredSections.length }} Section{{ filteredSections.length !== 1 ? 's' : '' }}</span>
          </div>
          <div class="sections-grid">
            <button
              v-for="section in filteredSections"
              :key="section.id"
              @click="selectSection(section)"
              class="section-card-btn"
              :class="{ 'active': selectedSectionId === section.id }"
            >
              <div class="section-card-header">
                <div class="section-icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                </div>
                <div class="section-badge">{{ section.section_code || 'N/A' }}</div>
              </div>
              <div class="section-card-body">
                <h4>{{ section.name }}</h4>
                <p class="section-subject">{{ section.subject_name }}</p>
              </div>
              <div class="section-card-footer">
                <span class="section-stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />
                  </svg>
                  {{ section.student_count || 0 }} Students
                </span>
              </div>
            </button>
            <div v-if="filteredSections.length === 0" class="empty-state-inline">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <p>No sections available for Grade {{ selectedGradeLevel }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !selectedSectionId && gradeLevels.length === 0" class="loading-container">
        <div class="spinner-large"></div>
        <p>Loading sections...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
        </svg>
        <h3>Error Loading Data</h3>
        <p>{{ error }}</p>
        <button @click="refreshData" class="grade-btn">Retry</button>
      </div>

      <!-- Excel-Style Gradebook -->
      <div v-else class="gradebook-main">
        <!-- Mini Analytics Panel -->
        <div class="analytics-panel">
          <div class="analytics-header">
            <h3>{{ currentSectionInfo.name }} Analytics</h3>
            <div class="header-actions">
              <span class="student-count">{{ students.length }} Students</span>
              <button @click="exportToExcel" class="export-btn grade-btn" :disabled="!students.length">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Export to Excel
              </button>
            </div>
          </div>
          <div class="analytics-stats">
            <div class="stat-mini">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ analyticsData.averageScore }}%</div>
                <div class="stat-label">Avg Score</div>
              </div>
            </div>
            <div class="stat-mini">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,10L12,15L17,10H7Z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ analyticsData.highestScore }}%</div>
                <div class="stat-label">Highest</div>
              </div>
            </div>
            <div class="stat-mini">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,14L12,9L17,14H7Z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ analyticsData.lowestScore }}%</div>
                <div class="stat-label">Lowest</div>
              </div>
            </div>
            <div class="stat-mini">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ analyticsData.submissionRate }}%</div>
                <div class="stat-label">Submitted</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quarter Selection -->
        <div v-if="gradingPeriods.length > 0" class="quarter-selection-card">
          <div class="quarter-header">
            <div class="quarter-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" />
              </svg>
              <h3>Select Grading Period</h3>
            </div>
            <span v-if="currentSchoolYear" class="school-year-badge">S.Y. {{ currentSchoolYear.year_name }}</span>
          </div>
          <div class="quarter-buttons">
            <button
              v-for="quarter in gradingPeriods"
              :key="quarter.id"
              @click="selectQuarter(quarter)"
              class="quarter-btn"
              :class="{ 
                'active': selectedQuarter?.id === quarter.id,
                'completed': quarter.status === 'completed',
                'current': quarter.is_active
              }"
            >
              <div class="quarter-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                </svg>
              </div>
              <div class="quarter-content">
                <div class="quarter-name">{{ quarter.period_name }}</div>
                <div class="quarter-dates">
                  {{ new Date(quarter.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }} - 
                  {{ new Date(quarter.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                </div>
              </div>
              <span v-if="quarter.is_active" class="active-badge">Active</span>
              <span v-else-if="quarter.status === 'completed'" class="status-badge completed">Completed</span>
              <span v-else-if="quarter.status === 'upcoming'" class="status-badge upcoming">Upcoming</span>
            </button>
          </div>
        </div>

        <!-- Excel-Style Gradebook Table -->
        <div class="gradebook-container">
          <div class="gradebook-scroll">
            <table class="gradebook-table">
              <thead class="gradebook-header">
                <tr>
                  <th class="student-column sticky-col">
                    <div class="header-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8Z" />
                      </svg>
                      <div class="student-header-content">
                        <span class="header-title">Student</span>
                        <div class="sort-controls">
                          <button 
                            @click="changeSortOrder('surname')" 
                            class="sort-btn" 
                            :class="{ 'active': sortBy === 'surname' }"
                            title="Sort by Surname">
                            Last Name
                            <svg v-if="sortBy === 'surname'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDirection === 'desc' }">
                              <path d="M7 14l5-5 5 5z"/>
                            </svg>
                          </button>
                          <button 
                            @click="changeSortOrder('firstname')" 
                            class="sort-btn" 
                            :class="{ 'active': sortBy === 'firstname' }"
                            title="Sort by First Name">
                            First Name
                            <svg v-if="sortBy === 'firstname'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDirection === 'desc' }">
                              <path d="M7 14l5-5 5 5z"/>
                            </svg>
                          </button>
                          <button 
                            @click="changeSortOrder('student-id')" 
                            class="sort-btn" 
                            :class="{ 'active': sortBy === 'student-id' }"
                            title="Sort by Student ID">
                            ID
                            <svg v-if="sortBy === 'student-id'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': sortDirection === 'desc' }">
                              <path d="M7 14l5-5 5 5z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                  <th v-for="assessment in filteredAssessments" :key="assessment.id" class="assessment-column">
                    <div class="header-content">
                      <div class="assessment-title">{{ assessment.title }}</div>
                      <div class="assessment-info">
                        <span class="assessment-type">{{ getAssessmentTypeLabel(assessment.type) }}</span>
                        <span class="assessment-points">{{ assessment.max_score }}pts</span>
                      </div>
                    </div>
                  </th>
                  <th class="total-column">
                    <div class="header-content">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M7,7H17V9H7V7M7,11H17V13H7V11M7,15H17V17H7V15Z" />
                      </svg>
                      Total
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="gradebook-body">
                <template v-for="student in sortedStudents" :key="student.id">
                  <!-- Main Student Row -->
                  <tr class="student-row" :class="{ 'expanded': expandedStudent === student.id }">
                    <td class="student-cell sticky-col" @click="toggleStudentHistory(student.id)">
                      <div class="student-info">
                        <div class="student-avatar">{{ getInitials(student.full_name) }}</div>
                        <div class="student-details">
                          <div class="student-name">{{ student.full_name }}</div>
                          <div class="student-id">{{ student.student_id || 'N/A' }}</div>
                        </div>
                        <button class="expand-btn" :class="{ 'rotated': expandedStudent === student.id }">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td v-for="assessment in filteredAssessments" :key="assessment.id" class="score-cell">
                      <div class="score-input-wrapper">
                        <input 
                          v-if="assessment.type === 'manual'"
                          type="number"
                          :value="getStudentScore(student.id, assessment.id)"
                          @input="updateManualScore(student.id, assessment.id, $event.target.value)"
                          @blur="saveManualScore(student.id, assessment.id)"
                          class="score-input manual"
                          :max="assessment.max_score"
                          min="0"
                          step="0.5"
                          placeholder="--"
                        />
                        <div v-else class="score-display auto" :class="getScoreClass(getStudentPercentage(student.id, assessment.id))">
                          <span class="score-value">{{ getStudentScore(student.id, assessment.id) || '--' }}</span>
                          <span v-if="getStudentScore(student.id, assessment.id)" class="score-max">/ {{ assessment.max_score }}</span>
                        </div>
                        <div v-if="hasSubmissionPending(student.id, assessment.id)" class="pending-indicator" title="Pending Review">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td class="total-cell">
                      <div class="total-score" :class="getScoreClass(getStudentTotalPercentage(student.id))">
                        <span class="total-value">{{ getStudentTotal(student.id) }}</span>
                        <span class="total-max">/ {{ getTotalMaxScore() }}</span>
                        <div class="total-percentage">{{ getStudentTotalPercentage(student.id) }}%</div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Expandable Student History Row -->
                  <tr v-if="expandedStudent === student.id" class="student-history-row">
                    <td :colspan="assessments.length + 2" class="history-cell">
                      <div class="student-history-panel">
                        <div class="history-header">
                          <h4>{{ student.full_name }} - Detailed History</h4>
                        </div>
                        <div class="history-content">
                          <div v-for="assessment in filteredAssessments" :key="assessment.id" class="history-item">
                            <div class="history-assessment">
                              <div class="assessment-name">{{ assessment.title }}</div>
                              <div class="assessment-details">
                                <span class="score-info">
                                  Score: {{ getStudentScore(student.id, assessment.id) || 'Not taken' }}
                                  <span v-if="getStudentScore(student.id, assessment.id)">/ {{ assessment.max_score }}</span>
                                </span>
                                <span v-if="getStudentScore(student.id, assessment.id)" class="percentage-info">
                                  ({{ getStudentPercentage(student.id, assessment.id) }}%)
                                </span>
                              </div>
                              <div v-if="hasSubmissionPending(student.id, assessment.id)" class="status-pending">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                                </svg>
                                Pending Review
                              </div>
                              <button v-if="hasSubmissionToGrade(student.id, assessment.id)" 
                                @click="reviewStudentSubmission(student.id, assessment.id)"
                                class="review-btn">
                                Grade Submission
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Review/Grade Modal -->
      <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
        <div class="review-modal" @click.stop>
          <div class="modal-header">
            <div>
              <h3>{{ modalMode === 'view' ? 'View Submission' : 'Grade Submission' }}</h3>
              <p class="modal-subtitle" v-if="selectedSubmission">
                {{ selectedSubmission.student_name }} - {{ selectedSubmission.quiz_title }}
              </p>
            </div>
            <button @click="closeReviewModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-content">
            <div v-if="loadingQuestions" class="loading-questions">
              <div class="spinner-small"></div>
              <p>Loading questions...</p>
            </div>

            <div v-else-if="reviewQuestions.length === 0" class="no-questions">
              <p>No questions found for this quiz.</p>
            </div>

            <div v-else class="submission-review">
              <div class="review-summary">
                <div class="summary-stat">
                  <span class="stat-label">Score</span>
                  <span class="stat-value">{{ calculateReviewScore() }}/{{ maxReviewScore }}</span>
                </div>
                <div class="summary-stat">
                  <span class="stat-label">Percentage</span>
                  <span class="stat-value">{{ calculateReviewPercentage() }}%</span>
                </div>
                <div class="summary-stat">
                  <span class="stat-label">Correct</span>
                  <span class="stat-value">{{ correctAnswerCount }}/{{ reviewQuestions.length }}</span>
                </div>
              </div>

              <div class="questions-review">
                <div v-for="(question, index) in reviewQuestions" :key="question.id" class="question-review-item">
                  <div class="question-header">
                    <div class="question-number">Q{{ index + 1 }}</div>
                    <div class="question-result" :class="question.is_correct ? 'correct' : 'incorrect'">
                      {{ question.is_correct ? '✓ Correct' : '✗ Incorrect' }}
                    </div>
                    <div class="question-points" v-if="modalMode === 'grade'">
                      <input 
                        v-model.number="question.manualPoints"
                        type="number"
                        :max="question.points"
                        min="0"
                        step="0.5"
                        class="points-input"
                        @input="updateQuestionPoints(question)"
                      /> / {{ question.points }} pts
                    </div>
                    <div class="question-points" v-else>
                      {{ question.points_earned }} / {{ question.points }} pts
                    </div>
                  </div>

                  <div class="question-text">{{ question.question_text }}</div>

                  <!-- Multiple Choice -->
                  <div v-if="question.question_type === 'multiple_choice'" class="answer-section">
                    <div class="answer-key-label">
                      <strong>Answer Key:</strong> {{ getCorrectOptionLabel(question) }}
                    </div>
                    <div class="answer-key-label">
                      <strong>Student's Answer:</strong> 
                      <span v-if="question.selected_option_id">{{ getStudentOptionLabel(question) }}</span>
                      <span v-else-if="question.answer_text">{{ question.answer_text }}</span>
                      <span v-else style="color: #ef4444;">
                        No answer provided
                      </span>
                    </div>
                    <div class="options-grid">
                      <div 
                        v-for="option in question.options" 
                        :key="option.id" 
                        class="option-item"
                        :class="{
                          'selected': question.selected_option_id === option.id,
                          'correct': option.is_correct,
                          'incorrect': question.selected_option_id === option.id && !option.is_correct
                        }"
                      >
                        <div class="option-letter">{{ String.fromCharCode(65 + (option.option_number - 1)) }}</div>
                        <div class="option-content">
                          <div class="option-text">{{ option.option_text }}</div>
                          <div v-if="option.is_correct" class="correct-tag">✓ Correct Answer</div>
                          <div v-if="question.selected_option_id === option.id" class="selected-tag">Student's Answer</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- True/False -->
                  <div v-else-if="question.question_type === 'true_false'" class="answer-section">
                    <div class="answer-key-label">
                      <strong>Answer Key:</strong> {{ question.correct_answer }}
                    </div>
                    <div class="answer-key-label">
                      <strong>Student's Answer:</strong> 
                      <span v-if="question.answer_text" :class="question.is_correct ? 'text-green-600' : 'text-red-600'">
                        {{ question.answer_text }}
                      </span>
                      <span v-else style="color: #ef4444;">No answer provided</span>
                    </div>
                    <div class="true-false-options">
                      <div class="tf-option" :class="{ 
                        'student-selected': question.answer_text === 'true', 
                        'correct-answer': question.correct_answer === 'true',
                        'wrong-answer': question.answer_text === 'true' && question.correct_answer !== 'true'
                      }">
                        <strong>True</strong>
                        <span v-if="question.correct_answer === 'true'" class="correct-tag">✓ Correct</span>
                        <span v-if="question.answer_text === 'true'" class="selected-tag">Student's Answer</span>
                      </div>
                      <div class="tf-option" :class="{ 
                        'student-selected': question.answer_text === 'false', 
                        'correct-answer': question.correct_answer === 'false',
                        'wrong-answer': question.answer_text === 'false' && question.correct_answer !== 'false'
                      }">
                        <strong>False</strong>
                        <span v-if="question.correct_answer === 'false'" class="correct-tag">✓ Correct</span>
                        <span v-if="question.answer_text === 'false'" class="selected-tag">Student's Answer</span>
                      </div>
                    </div>
                  </div>

                  <!-- Fill in the Blank -->
                  <div v-else-if="question.question_type === 'fill_blank'" class="answer-section">
                    <div class="fill-blank-answers">
                      <div class="answer-key-box">
                        <div class="answer-label">Answer Key:</div>
                        <div class="answer-text correct">
                          {{ question.correct_answer }}
                        </div>
                      </div>
                      <div class="student-answer-box">
                        <div class="answer-label">Student's Answer:</div>
                        <div class="answer-text" :class="question.is_correct ? 'correct' : 'incorrect'">
                          {{ question.answer_text || 'No answer' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Teacher Comment -->
                  <div class="teacher-comment-section" v-if="modalMode === 'grade'">
                    <textarea 
                      v-model="question.teacherComment"
                      class="comment-input"
                      placeholder="Add feedback for this question..."
                      rows="2"
                    ></textarea>
                  </div>
                  <div class="teacher-comment-section" v-else-if="question.teacher_comment">
                    <div class="comment-display">
                      <strong>Teacher's Feedback:</strong>
                      <p>{{ question.teacher_comment }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Overall Feedback -->
              <div class="overall-feedback-section" v-if="modalMode === 'grade'">
                <h4>Overall Feedback</h4>
                <textarea 
                  v-model="reviewFeedback" 
                  class="feedback-textarea"
                  placeholder="Add overall feedback for the student..."
                  rows="3"
                ></textarea>
              </div>
              <div class="overall-feedback-section" v-else-if="selectedSubmission?.teacher_feedback">
                <h4>Overall Feedback</h4>
                <div class="feedback-display">
                  <p>{{ selectedSubmission.teacher_feedback }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="closeReviewModal" class="btn-modal cancel">Close</button>
            <button v-if="modalMode === 'grade'" @click="saveGrade" class="btn-modal primary" :disabled="savingGrade">
              {{ savingGrade ? 'Saving...' : 'Save Grade' }}
            </button>
          </div>
        </div>
      </div>
    </main>

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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase.js'
import { useDarkMode } from '@/composables/useDarkMode.js'
import * as XLSX from 'xlsx'

const { isDarkMode } = useDarkMode()
const router = useRouter()

const loading = ref(true)
const loadingQuestions = ref(false)
const savingGrade = ref(false)
const error = ref(null)
const teacherId = ref(null)

const subjects = ref([])
const selectedGradeLevel = ref(null)
const selectedSectionId = ref('')
const currentSectionInfo = ref({})
const students = ref([])
const assessments = ref([])
const gradebookData = ref({})
const submissions = ref([])
const expandedStudent = ref(null)

// Quarter management
const gradingPeriods = ref([])
const selectedQuarter = ref(null)
const currentSchoolYear = ref(null)

const showReviewModal = ref(false)
const selectedSubmission = ref(null)
const reviewQuestions = ref([])
const reviewFeedback = ref('')
const modalMode = ref('view')

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

const showNotifDropdown = ref(false)
const showProfileDropdown = ref(false)
const notifications = ref([])
const fullName = ref('Teacher')
const showScrollTop = ref(false)

const analyticsData = computed(() => {
  if (!students.value.length || !filteredAssessments.value.length) {
    return { averageScore: 0, highestScore: 0, lowestScore: 0, submissionRate: 0 }
  }

  const scores = []
  let totalSubmissions = 0
  let possibleSubmissions = students.value.length * filteredAssessments.value.length

  students.value.forEach(student => {
    filteredAssessments.value.forEach(assessment => {
      const score = getStudentScore(student.id, assessment.id)
      if (score !== null && score !== undefined && score !== '') {
        const percentage = (score / assessment.max_score) * 100
        scores.push(percentage)
        totalSubmissions++
      }
    })
  })

  const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0
  const highestScore = scores.length > 0 ? Math.round(Math.max(...scores)) : 0
  const lowestScore = scores.length > 0 ? Math.round(Math.min(...scores)) : 0
  const submissionRate = possibleSubmissions > 0 ? Math.round((totalSubmissions / possibleSubmissions) * 100) : 0

  return { averageScore, highestScore, lowestScore, submissionRate }
})

const correctAnswerCount = computed(() => reviewQuestions.value.filter(q => q.is_correct).length)
const maxReviewScore = computed(() => reviewQuestions.value.reduce((sum, q) => sum + (q.points || 1), 0))

// Filtered assessments by quarter
const filteredAssessments = computed(() => {
  if (!selectedQuarter.value) {
    return assessments.value
  }
  
  return assessments.value.filter(assessment => {
    return assessment.grading_period_id === selectedQuarter.value.id
  })
})

// Sorting state
const sortBy = ref('surname') // 'surname', 'firstname', 'student-id'
const sortDirection = ref('asc') // 'asc', 'desc'

// Computed property for sorted students by name
const sortedStudents = computed(() => {
  return [...students.value].sort((a, b) => {
    let valueA = ''
    let valueB = ''
    
    if (sortBy.value === 'surname') {
      // Sort by surname first, then by first name
      const nameA = a.full_name ? a.full_name.trim().split(' ') : ['']
      const nameB = b.full_name ? b.full_name.trim().split(' ') : ['']
      
      const surnameA = nameA.length > 1 ? nameA[nameA.length - 1] : nameA[0] || ''
      const surnameB = nameB.length > 1 ? nameB[nameB.length - 1] : nameB[0] || ''
      
      const surnameComparison = surnameA.toLowerCase().localeCompare(surnameB.toLowerCase())
      
      if (surnameComparison !== 0) {
        return sortDirection.value === 'asc' ? surnameComparison : -surnameComparison
      }
      
      // If surnames are the same, sort by first name
      const firstNameA = nameA[0] || ''
      const firstNameB = nameB[0] || ''
      
      const firstNameComparison = firstNameA.toLowerCase().localeCompare(firstNameB.toLowerCase())
      return sortDirection.value === 'asc' ? firstNameComparison : -firstNameComparison
      
    } else if (sortBy.value === 'firstname') {
      // Sort by first name first, then by surname
      const nameA = a.full_name ? a.full_name.trim().split(' ') : ['']
      const nameB = b.full_name ? b.full_name.trim().split(' ') : ['']
      
      const firstNameA = nameA[0] || ''
      const firstNameB = nameB[0] || ''
      
      const firstNameComparison = firstNameA.toLowerCase().localeCompare(firstNameB.toLowerCase())
      
      if (firstNameComparison !== 0) {
        return sortDirection.value === 'asc' ? firstNameComparison : -firstNameComparison
      }
      
      // If first names are the same, sort by surname
      const surnameA = nameA.length > 1 ? nameA[nameA.length - 1] : ''
      const surnameB = nameB.length > 1 ? nameB[nameB.length - 1] : ''
      
      const surnameComparison = surnameA.toLowerCase().localeCompare(surnameB.toLowerCase())
      return sortDirection.value === 'asc' ? surnameComparison : -surnameComparison
      
    } else if (sortBy.value === 'student-id') {
      // Sort by student ID
      valueA = a.student_id || ''
      valueB = b.student_id || ''
      
      const comparison = valueA.toLowerCase().localeCompare(valueB.toLowerCase())
      return sortDirection.value === 'asc' ? comparison : -comparison
    }
    
    return 0
  })
})

// Sort function
const changeSortOrder = (newSortBy) => {
  if (sortBy.value === newSortBy) {
    // Toggle direction if same sort field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Change sort field and reset to ascending
    sortBy.value = newSortBy
    sortDirection.value = 'asc'
  }
}

// Computed properties for grade level organization
const gradeLevels = computed(() => {
  const levels = new Set()
  subjects.value.forEach(subject => {
    if (subject.grade_level) {
      levels.add(subject.grade_level)
    }
  })
  return Array.from(levels).sort((a, b) => a - b)
})

const filteredSections = computed(() => {
  if (!selectedGradeLevel.value) return []
  
  const sections = []
  subjects.value.forEach(subject => {
    if (subject.grade_level === selectedGradeLevel.value) {
      subject.sections.forEach(section => {
        sections.push({
          ...section,
          subject_name: subject.name,
          grade_level: subject.grade_level
        })
      })
    }
  })
  return sections
})

const getSectionCountForGrade = (gradeLevel) => {
  let count = 0
  subjects.value.forEach(subject => {
    if (subject.grade_level === gradeLevel) {
      count += subject.sections?.length || 0
    }
  })
  return count
}

const selectGradeLevel = (grade) => {
  selectedGradeLevel.value = grade
  selectedSectionId.value = ''
  currentSectionInfo.value = {}
  students.value = []
  assessments.value = []
  gradebookData.value = {}
}

const clearGradeSelection = () => {
  selectedGradeLevel.value = null
  selectedSectionId.value = ''
  currentSectionInfo.value = {}
  students.value = []
  assessments.value = []
  gradebookData.value = {}
}

const selectSection = async (section) => {
  selectedSectionId.value = section.id
  await onSectionChange()
}

const getTeacherInfo = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      error.value = 'Authentication error'
      return false
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (profileError || !profile || profile.role !== 'teacher') {
      error.value = 'Teacher access required'
      return false
    }

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id, full_name')
      .eq('profile_id', profile.id)
      .maybeSingle()

    if (teacherError || !teacher) {
      error.value = 'Teacher record not found'
      return false
    }

    teacherId.value = teacher.id
    fullName.value = teacher.full_name || 'Teacher'
    return true
  } catch (err) {
    error.value = err.message
    return false
  }
}

const fetchSubjects = async () => {
  try {
    loading.value = true
    error.value = null

    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select(`
        id, 
        name, 
        grade_level, 
        sections(
          id, 
          name, 
          section_code,
          enrollments(count)
        )
      `)
      .eq('teacher_id', teacherId.value)
      .eq('is_active', true)

    if (subjectsError) throw subjectsError

    subjects.value = subjectsData?.map(subject => ({
      id: subject.id,
      name: subject.name,
      grade_level: subject.grade_level,
      sections: (subject.sections || []).map(section => ({
        id: section.id,
        name: section.name,
        section_code: section.section_code,
        student_count: section.enrollments?.[0]?.count || 0
      }))
    })) || []
  } catch (err) {
    error.value = `Failed to load subjects: ${err.message}`
  } finally {
    loading.value = false
  }
}

const onSectionChange = async () => {
  if (!selectedSectionId.value) {
    currentSectionInfo.value = {}
    students.value = []
    assessments.value = []
    gradebookData.value = {}
    return
  }

  try {
    loading.value = true
    error.value = null
    await fetchGradebookData(selectedSectionId.value)
  } catch (err) {
    error.value = `Failed to load gradebook data: ${err.message}`
  } finally {
    loading.value = false
  }
}

const fetchGradebookData = async (sectionId) => {
  console.log('🔄 Fetching REAL-TIME gradebook data for section:', sectionId)

  // Get section info
  const { data: sectionInfo, error: sectionError } = await supabase
    .from('sections')
    .select('id, name, section_code, subject_id, subjects(name, grade_level)')
    .eq('id', sectionId)
    .single()

  if (sectionError) throw sectionError
  currentSectionInfo.value = sectionInfo

  // Get students
  const { data: studentsData, error: studentsError } = await supabase
    .from('enrollments')
    .select('student_id, students(id, full_name, email, student_id)')
    .eq('section_id', sectionId)
    .eq('status', 'active')

  if (studentsError) throw studentsError
  students.value = studentsData?.map(enrollment => enrollment.students) || []

  console.log('📚 Students loaded:', students.value.length)

  // Initialize gradebook data
  const newGradebookData = {}
  students.value.forEach(student => {
    newGradebookData[student.id] = {}
  })

  // ONLY REAL DATA - NO FAKE ASSESSMENTS
  const allAssessments = []

  // Get REAL QUIZZES from database
  const { data: quizzesData, error: quizzesError } = await supabase
    .from('quizzes')
    .select('id, title, number_of_questions, created_at, status, grading_period_id')
    .eq('section_id', sectionId)
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (quizzesError) {
    console.error('❌ Quiz fetch error:', quizzesError)
  } else {
    console.log('📝 REAL Quizzes found:', quizzesData?.length || 0, quizzesData)
    
    // Add ONLY real quizzes
    if (quizzesData && quizzesData.length > 0) {
      quizzesData.forEach(quiz => {
        allAssessments.push({
          id: quiz.id,
          title: quiz.title,
          type: 'quiz',
          max_score: quiz.number_of_questions || 1,
          created_at: quiz.created_at,
          grading_period_id: quiz.grading_period_id
        })
      })
    }
  }

  // Get REAL ASSIGNMENTS from database
  const { data: assignmentsData, error: assignmentsError } = await supabase
    .from('assignments')
    .select('id, title, total_points, created_at, status, published_at, grading_period_id')
    .eq('section_id', sectionId)
    .eq('status', 'published')
    .order('created_at', { ascending: true })

  if (assignmentsError) {
    console.error('❌ Assignment fetch error:', assignmentsError)
  } else {
    console.log('📋 REAL Assignments found:', assignmentsData?.length || 0, assignmentsData)
    
    // Add ONLY real assignments
    if (assignmentsData && assignmentsData.length > 0) {
      assignmentsData.forEach(assignment => {
        allAssessments.push({
          id: assignment.id,
          title: assignment.title,
          type: 'assignment',
          max_score: assignment.total_points || 100,
          created_at: assignment.published_at || assignment.created_at,
          grading_period_id: assignment.grading_period_id
        })
      })
    }
  }

  // Sort by creation date
  allAssessments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  assessments.value = allAssessments

  console.log('📊 Total REAL assessments:', assessments.value.length, assessments.value)

  // Get REAL quiz scores
  if (quizzesData && quizzesData.length > 0) {
    const quizIds = quizzesData.map(q => q.id)
    const { data: attemptsData, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('student_id, quiz_id, total_score, status, submitted_at')
      .in('quiz_id', quizIds)
      .in('student_id', students.value.map(s => s.id))
      .order('submitted_at', { ascending: false })

    if (attemptsError) {
      console.error('❌ Quiz attempts error:', attemptsError)
    } else {
      console.log('✅ REAL Quiz attempts loaded:', attemptsData?.length || 0, attemptsData)
      
      attemptsData?.forEach(attempt => {
        if (attempt.status === 'submitted' || attempt.status === 'graded') {
          if (!newGradebookData[attempt.student_id][attempt.quiz_id]) {
            newGradebookData[attempt.student_id][attempt.quiz_id] = attempt.total_score
            console.log(`✅ Quiz score added: Student ${attempt.student_id}, Quiz ${attempt.quiz_id}, Score ${attempt.total_score}`)
          }
        }
      })
    }
  }

  // Get REAL assignment scores
  if (assignmentsData && assignmentsData.length > 0) {
    const assignmentIds = assignmentsData.map(a => a.id)
    const { data: submissionsData, error: submissionsError } = await supabase
      .from('assignment_submissions')
      .select('student_id, assignment_id, score, status, graded_at, submitted_at')
      .in('assignment_id', assignmentIds)
      .in('student_id', students.value.map(s => s.id))
      .order('submitted_at', { ascending: false })

    if (submissionsError) {
      console.error('❌ Assignment submissions error:', submissionsError)
    } else {
      console.log('✅ REAL Assignment submissions loaded:', submissionsData?.length || 0, submissionsData)
      
      submissionsData?.forEach(submission => {
        // Show scores for graded OR submitted assignments
        if (submission.score !== null && (submission.status === 'graded' || submission.status === 'submitted')) {
          if (!newGradebookData[submission.student_id][submission.assignment_id]) {
            newGradebookData[submission.student_id][submission.assignment_id] = submission.score
            console.log(`✅ Assignment score added: Student ${submission.student_id}, Assignment ${submission.assignment_id}, Score ${submission.score}`)
          }
        }
      })
    }
  }

  gradebookData.value = newGradebookData

  console.log('✅ REAL-TIME Gradebook loaded:', {
    section: sectionInfo.name,
    students: students.value.length,
    quizzes: quizzesData?.length || 0,
    assignments: assignmentsData?.length || 0,
    totalAssessments: assessments.value.length,
    gradebookEntries: Object.keys(newGradebookData).length
  })
}

const getStudentScore = (studentId, assessmentId) => gradebookData.value[studentId]?.[assessmentId] || null
const getStudentPercentage = (studentId, assessmentId) => {
  const score = getStudentScore(studentId, assessmentId)
  const assessment = assessments.value.find(a => a.id === assessmentId)
  if (!score || !assessment) return 0
  return Math.round((score / assessment.max_score) * 100)
}
const getStudentTotal = (studentId) => {
  let total = 0
  assessments.value.forEach(assessment => {
    const score = getStudentScore(studentId, assessment.id)
    if (score) total += score
  })
  return total
}
const getTotalMaxScore = () => assessments.value.reduce((sum, assessment) => sum + assessment.max_score, 0)
const getStudentTotalPercentage = (studentId) => {
  const total = getStudentTotal(studentId)
  const maxTotal = getTotalMaxScore()
  return maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100)
}
const getAssessmentTypeLabel = (type) => {
  if (type === 'quiz') return 'Quiz'
  if (type === 'assignment') return 'Assignment'
  return 'Manual'
}
const hasSubmissionPending = (studentId, assessmentId) => submissions.value.some(s => s.student_id === studentId && s.quiz_id === assessmentId && s.status === 'submitted')
const hasSubmissionToGrade = (studentId, assessmentId) => hasSubmissionPending(studentId, assessmentId)
const toggleStudentHistory = (studentId) => expandedStudent.value = expandedStudent.value === studentId ? null : studentId
const updateManualScore = (studentId, assessmentId, value) => {
  if (!gradebookData.value[studentId]) gradebookData.value[studentId] = {}
  gradebookData.value[studentId][assessmentId] = parseFloat(value) || null
}
const saveManualScore = async (studentId, assessmentId) => {
  console.log('💾 Saving manual score')
}
const refreshData = async () => {
  loading.value = true
  try {
    await fetchSubjects()
    if (selectedSectionId.value) await fetchGradebookData(selectedSectionId.value)
  } finally {
    loading.value = false
  }
}

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?'
const getScoreClass = (percentage) => {
  if (percentage >= 90) return 'excellent'
  if (percentage >= 80) return 'good'
  if (percentage >= 70) return 'average'
  return 'needs-improvement'
}

const toggleNotifDropdown = () => {
  showNotifDropdown.value = !showNotifDropdown.value
  showProfileDropdown.value = false
}
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifDropdown.value = false
}
const handleNotificationClick = (notif) => console.log('Notification clicked:', notif)
const closeLogoutModal = () => showLogoutModal.value = false
const confirmLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  supabase.auth.signOut()
  setTimeout(() => window.location.assign('/login'), 100)
}
const logout = () => showLogoutModal.value = true
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const exportToExcel = () => {
  if (!selectedSectionId.value || !students.value.length) {
    alert('Please select a section with students to export')
    return
  }

  const exportData = []
  const headers = ['Student Name', 'Student ID']
  assessments.value.forEach(a => headers.push(`${a.title} (${a.max_score}pts)`))
  headers.push('Total', 'Percentage')
  exportData.push(headers)
  
  sortedStudents.value.forEach(student => {
    const row = [student.full_name, student.student_id || 'N/A']
    assessments.value.forEach(a => row.push(getStudentScore(student.id, a.id) || '--'))
    row.push(getStudentTotal(student.id))
    row.push(`${getStudentTotalPercentage(student.id)}%`)
    exportData.push(row)
  })
  
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(exportData)
  XLSX.utils.book_append_sheet(wb, ws, 'Gradebook')
  XLSX.writeFile(wb, `Gradebook_${new Date().toISOString().split('T')[0]}.xlsx`)
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedSubmission.value = null
  reviewQuestions.value = []
  reviewFeedback.value = ''
  modalMode.value = 'view'
}

const calculateReviewScore = () => {
  return reviewQuestions.value.reduce((sum, q) => sum + (q.points_earned || 0), 0)
}

const calculateReviewPercentage = () => {
  const max = maxReviewScore.value
  if (max === 0) return 0
  return Math.round((calculateReviewScore() / max) * 100)
}

const getCorrectOptionLabel = (question) => {
  const correctOption = question.options?.find(opt => opt.is_correct)
  return correctOption ? String.fromCharCode(65 + (correctOption.option_number - 1)) : 'N/A'
}

const getStudentOptionLabel = (question) => {
  if (!question.selected_option_id) return 'N/A'
  const selectedOption = question.options?.find(opt => opt.id === question.selected_option_id)
  return selectedOption ? String.fromCharCode(65 + (selectedOption.option_number - 1)) : 'N/A'
}

// Fetch grading periods for current school year
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
    
    // Auto-select active quarter or first quarter
    const activeQuarter = periods?.find(p => p.is_active)
    selectedQuarter.value = activeQuarter || (periods && periods.length > 0 ? periods[0] : null)
    
    console.log('📅 Grading periods loaded:', gradingPeriods.value)
    console.log('✅ Selected quarter:', selectedQuarter.value?.period_name)
  } catch (err) {
    console.error('Error in fetchGradingPeriods:', err)
  }
}

const selectQuarter = (quarter) => {
  selectedQuarter.value = quarter
  console.log('📅 Quarter selected:', quarter.period_name)
}

onMounted(async () => {
  const success = await getTeacherInfo()
  if (success) {
    await fetchGradingPeriods()
    await fetchSubjects()
    window.addEventListener('scroll', () => showScrollTop.value = window.scrollY > 300)
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Reset and Hide Parent Layouts */
body, html {
  overflow-x: hidden !important;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}
.dark .dashboard-container {
  background: #0f172a;
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

/* Rounded semi-transparent backgrounds for sidebar and navbar icons/buttons */
.rounded-bg {
  background: rgba(255,255,255,0.13);
  border-radius: 16px;
  transition: background 0.2s;
}
.rounded-bg:hover {
  background: rgba(255,255,255,0.22);
}

/* Notification dropdown styles */
.notif-wrapper {
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #3D8D7A;
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
  cursor: pointer;
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

.profile-dropdown .dropdown-header {
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
  transition: all 0.2s ease;
  z-index: 1000;
}

.scroll-to-top:hover {
  background: #2d6a5a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.4);
}

/* Main Content */
.main-content {
  margin-left: 80px;
  margin-top: 64px;
  padding: 1.5rem;
  width: calc(100% - 80px);
  min-height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
  background: #f8fafc;
  padding-bottom: 2rem;
}

/* Uniform Scrollbar */
.main-content::-webkit-scrollbar {
  width: 12px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 16px;
}

.main-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #20c997);
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #18a577);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.3);
}

.dark .main-content {
  background: #151821;
}

.dark .main-content::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark .main-content::-webkit-scrollbar-thumb {
  border-color: #1e293b;
}

/* Content Wrapper */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.page-header:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #3D8D7A;
  transform: translateY(-1px);
}

.page-header {
  animation: fadeIn 0.5s ease-out;
}

.dark .page-header {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.header-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  font-size: 0.95rem;
  color: #64748b;
}

/* ================================================ */
/* GRADE LEVEL AND SECTION SELECTION STYLES */
/* ================================================ */

/* Grade Level and Section Selection Container */
.selection-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  animation: slideUp 0.3s ease-out;
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

/* Grade Level Section */
.grade-level-section,
.sections-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.dark .grade-level-section,
.dark .sections-section {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.section-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.dark .section-title-bar {
  border-bottom-color: #334155;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-content svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.dark .title-content svg {
  color: #10b981;
}

.title-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark .title-content h3 {
  color: #f1f5f9;
}

.count-badge {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.dark .count-badge {
  background: linear-gradient(135deg, #10b981, #059669);
}

/* Back Button */
.back-btn-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(61, 141, 122, 0.1);
  border: 1px solid rgba(61, 141, 122, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #3D8D7A;
}

.back-btn-inline:hover {
  background: rgba(61, 141, 122, 0.2);
  border-color: #3D8D7A;
  transform: translateX(-2px);
}

.dark .back-btn-inline {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.dark .back-btn-inline:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

/* Grade Level Buttons */
.grade-buttons-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.grade-level-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.grade-level-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(61, 141, 122, 0.1), transparent);
  transition: left 0.5s ease;
}

.grade-level-btn:hover::before {
  left: 100%;
}

.grade-level-btn:hover {
  border-color: #3D8D7A;
  background: rgba(61, 141, 122, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.grade-level-btn.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}

.dark .grade-level-btn {
  background: #334155;
  border-color: #475569;
}

.dark .grade-level-btn:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.dark .grade-level-btn.active {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

.grade-icon {
  width: 48px;
  height: 48px;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3D8D7A;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.grade-level-btn.active .grade-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.dark .grade-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .grade-level-btn.active .grade-icon {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.grade-content {
  flex: 1;
}

.grade-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.grade-level-btn.active .grade-title {
  color: white;
}

.dark .grade-title {
  color: #f1f5f9;
}

.grade-count {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.grade-level-btn.active .grade-count {
  color: rgba(255, 255, 255, 0.9);
}

.dark .grade-count {
  color: #94a3b8;
}

.arrow-icon {
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.grade-level-btn:hover .arrow-icon {
  transform: translateX(4px);
  color: #3D8D7A;
}

.grade-level-btn.active .arrow-icon {
  color: white;
}

.dark .grade-level-btn:hover .arrow-icon {
  color: #10b981;
}

/* Sections Grid */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.section-card-btn {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.section-card-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.section-card-btn:hover::before {
  transform: scaleY(1);
}

.section-card-btn:hover {
  border-color: #3D8D7A;
  background: rgba(61, 141, 122, 0.03);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.section-card-btn.active {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1), rgba(45, 106, 90, 0.1));
  border-color: #3D8D7A;
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.2);
}

.section-card-btn.active::before {
  transform: scaleY(1);
}

.dark .section-card-btn {
  background: #334155;
  border-color: #475569;
}

.dark .section-card-btn:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.dark .section-card-btn.active {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
  border-color: #10b981;
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3D8D7A;
}

.section-card-btn.active .section-icon-wrapper {
  background: #3D8D7A;
  color: white;
}

.dark .section-icon-wrapper {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.dark .section-card-btn.active .section-icon-wrapper {
  background: #10b981;
  color: white;
}

.section-badge {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.dark .section-badge {
  background: linear-gradient(135deg, #10b981, #059669);
}

.section-card-body h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.375rem 0;
}

.dark .section-card-body h4 {
  color: #f1f5f9;
}

.section-subject {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.dark .section-subject {
  color: #94a3b8;
}

.section-card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.dark .section-card-footer {
  border-top-color: #475569;
}

.section-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.section-stat svg {
  color: #3D8D7A;
}

.dark .section-stat {
  color: #94a3b8;
}

.dark .section-stat svg {
  color: #10b981;
}

/* Empty State Inline */
.empty-state-inline {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-state-inline svg {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.dark .empty-state-inline svg {
  color: #475569;
}

.empty-state-inline p {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
}

.dark .empty-state-inline p {
  color: #94a3b8;
}

/* ================================================ */
/* END GRADE LEVEL AND SECTION SELECTION STYLES */
/* ================================================ */

/* Search Box in Navbar */
.search-box {
  position: relative;
  min-width: 280px;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.2s;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-box input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

/* Quarter Selection Card */
.quarter-selection-card {
  background: white;
  border: 1.5px solid #3D8D7A;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
}

.dark .quarter-selection-card {
  background: #23272b;
  border: 1.5px solid #A3D1C6;
  box-shadow: 0 2px 8px rgba(163, 209, 198, 0.1);
}

.quarter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.dark .quarter-header {
  border-bottom-color: #3a3f44;
}

.quarter-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quarter-title svg {
  color: #3D8D7A;
}

.dark .quarter-title svg {
  color: #A3D1C6;
}

.quarter-title h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dark .quarter-title h3 {
  color: #f9fafb;
}

.school-year-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3D8D7A 0%, #2d6d5f 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(61, 141, 122, 0.2);
}

.dark .school-year-badge {
  background: linear-gradient(135deg, #A3D1C6 0%, #8bb5a8 100%);
  color: #1f2937;
}

.quarter-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.quarter-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.quarter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
  border-color: #3D8D7A;
}

.quarter-btn.active {
  background: linear-gradient(135deg, #3D8D7A 0%, #2d6d5f 100%);
  border-color: #3D8D7A;
  color: white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.quarter-btn.current:not(.active) {
  border-color: #10b981;
  background: #ecfdf5;
}

.quarter-btn.completed:not(.active) {
  opacity: 0.7;
}

.dark .quarter-btn {
  background: #2d3236;
  border-color: #3a3f44;
}

.dark .quarter-btn:hover {
  border-color: #A3D1C6;
  box-shadow: 0 4px 12px rgba(163, 209, 198, 0.15);
}

.dark .quarter-btn.active {
  background: linear-gradient(135deg, #A3D1C6 0%, #8bb5a8 100%);
  border-color: #A3D1C6;
  color: #1f2937;
}

.dark .quarter-btn.current:not(.active) {
  border-color: #34d399;
  background: #064e3b;
}

.quarter-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 10px;
}

.quarter-btn.active .quarter-icon {
  background: rgba(255, 255, 255, 0.2);
}

.quarter-icon svg {
  color: #3D8D7A;
}

.quarter-btn.active .quarter-icon svg {
  color: white;
}

.dark .quarter-icon {
  background: rgba(163, 209, 198, 0.1);
}

.dark .quarter-icon svg {
  color: #A3D1C6;
}

.dark .quarter-btn.active .quarter-icon svg {
  color: #1f2937;
}

.quarter-content {
  flex: 1;
  text-align: left;
}

.quarter-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.quarter-btn.active .quarter-name {
  color: white;
}

.dark .quarter-name {
  color: #f9fafb;
}

.dark .quarter-btn.active .quarter-name {
  color: #1f2937;
}

.quarter-dates {
  font-size: 0.875rem;
  color: #6b7280;
}

.quarter-btn.active .quarter-dates {
  color: rgba(255, 255, 255, 0.9);
}

.dark .quarter-dates {
  color: #9ca3af;
}

.dark .quarter-btn.active .quarter-dates {
  color: rgba(31, 41, 55, 0.8);
}

.active-badge,
.status-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.active-badge {
  background: #10b981;
  color: white;
}

.status-badge.completed {
  background: #6b7280;
  color: white;
}

.status-badge.upcoming {
  background: #f59e0b;
  color: white;
}

.quarter-btn.active .active-badge,
.quarter-btn.active .status-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.gradebook-container {
  min-height: 100vh;
  background: #FBFFE4;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
}
.dark .gradebook-container {
  background: #181c20;
}

/* Header */
.header-card {
  background: white;
  border: 1.5px solid #3D8D7A;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
}
.dark .header-card {
  background: #23272b;
  border: 1.5px solid #A3D1C6;
  box-shadow: 0 2px 8px rgba(163, 209, 198, 0.1);
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
  background: #3D8D7A;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
}
.dark .header-title {
  color: #A3D1C6;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}
.dark .header-subtitle {
  color: #A3D1C6;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  min-width: 280px;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #A3D1C6;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;
}
.dark .search-box input {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.search-box input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 246, 0.1);
}

.grade-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.grade-btn:hover:not(:disabled) {
  background: #2d6b5c;
  box-shadow: 0 2px 6px rgba(61, 141, 122, 0.15);
}

.grade-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn {
  min-width: auto;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.1;
  }
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Enhanced Subject Filter Buttons */
.subject-filters {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.subject-filters:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #3D8D7A;
  transform: translateY(-1px);
}

.dark .subject-filters {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.dark .subject-filters:hover {
  border-color: #34d399;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-header {
  border-bottom: 1px solid rgba(61, 141, 122, 0.1);
  padding-bottom: 1rem;
}
.dark .filter-header {
  border-bottom-color: #3D8D7A;
}

.filter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}
.dark .filter-title {
  color: #f3f4f6;
}

.filter-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}
.dark .filter-subtitle {
  color: #9ca3af;
}

.filter-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.filter-btn.modern {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  position: relative;
  overflow: hidden;
}
.dark .filter-btn.modern {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.filter-btn.modern:hover {
  background: #f9fafb;
  border-color: var(--filter-color, #3D8D7A);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}
.dark .filter-btn.modern:hover {
  background: #4b5563;
  border-color: var(--filter-color, #A3D1C6);
}

.filter-btn.modern.active {
  background: var(--filter-color, #3D8D7A);
  border-color: var(--filter-color, #3D8D7A);
  color: white;
  box-shadow: 0 4px 15px rgba(61, 141, 122, 0.3);
  transform: translateY(-1px);
}

.filter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.filter-text {
  font-weight: 600;
}

/* All button special styling */
.filter-btn.modern:first-child {
  --filter-color: #3D8D7A;
}

/* Breadcrumb Navigation */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.breadcrumb-nav:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-color: #3D8D7A;
}

.dark .breadcrumb-nav {
  background: #23272b;
  border: 1px solid #374151;
}

.dark .breadcrumb-nav:hover {
  border-color: #20c997;
}

.breadcrumb-btn {
  background: none;
  border: none;
  color: #3D8D7A;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}
.dark .breadcrumb-btn {
  color: #A3D1C6;
}

.breadcrumb-btn:hover {
  background: #B3D8A8;
  color: #1f2937;
}
.dark .breadcrumb-btn:hover {
  background: #3D8D7A;
  color: white;
}

.breadcrumb-current {
  color: #1f2937;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1rem;
}
.dark .breadcrumb-current {
  color: #A3D1C6;
}

.breadcrumb-separator {
  color: #6b7280;
  font-size: 1rem;
}
.dark .breadcrumb-separator {
  color: #A3D1C6;
}

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
}
.dark .loading-container {
  color: #A3D1C6;
}

.error-container {
  color: #dc2626;
  text-align: center;
  padding: 2rem;
}

.error-container svg {
  margin-bottom: 1rem;
    margin-bottom: -20rem; 
}

.error-container h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #991b1b;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #B3D8A8;
  border-top: 4px solid #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

/* Enhanced Main Content */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.content-card.modern {
  margin-top: 0;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 1.5rem auto;
  position: relative;
  box-sizing: border-box;
  min-height: 120px;
  transition: all 0.2s ease;
}

.content-card.modern:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #3D8D7A;
  transform: translateY(-2px);
}

.content-card.modern {
  animation: slideUp 0.6s ease-out;
}

.dark .content-card.modern {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.dark .content-card.modern:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border-color: #34d399;
}

.card-header.enhanced {
  padding: 0;
  background: transparent;
  border-bottom: none;
  display: none;
}
/* Removed duplicated and misplaced CSS block causing errors */
.dark .card-title-section h3 {
  background: linear-gradient(135deg, #A3D1C6, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-title-section .card-desc {
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5;
}

.card-stats .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 80px;
}
.dark .card-stats .stat-item {
  background: #1f2937;
}

.card-stats .stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #3D8D7A;
  line-height: 1;
}
.dark .card-stats .stat-number {
  color: #A3D1C6;
}

.card-stats .stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}
.dark .card-stats .stat-label {
  color: #9ca3af;
}

/* Enhanced Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  margin-top: 0.25rem;
}

/* Modern Stat Cards */
.stat-card.modern {
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.dark .stat-card.modern {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 1px solid rgba(75, 85, 99, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Hover Effects */
.stat-card.modern:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.dark .stat-card.modern:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Card Type Specific Styling */
.stat-card.modern.pending {
  border-left: 4px solid #f59e0b;
}

.stat-card.modern.pending:hover {
  box-shadow: 0 20px 60px rgba(245, 158, 11, 0.2);
}

/* Unified Gradebook Header */
.gradebook-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.gradebook-header:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #3D8D7A;
  transform: translateY(-1px);
}

.dark .gradebook-header {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Section Selector */
.section-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-selector label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  min-width: fit-content;
}

.dark .section-selector label {
  color: #f1f5f9;
}

.section-select {
  padding: 0.625rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  background: white;
  color: #1e293b;
  min-width: 280px;
  transition: all 0.2s;
  cursor: pointer;
}

.section-select:hover {
  border-color: #3D8D7A;
}

.section-select:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.dark .section-select {
  background: #374151;
  border-color: #4b5563;
  color: #f1f5f9;
}

/* Loading and Empty States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
}

.spinner-large {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #dc2626;
  text-align: center;
}

.no-section-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.no-section-state .empty-icon {
  margin-bottom: 1.5rem;
  color: #94a3b8;
}

.no-section-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.no-section-state p {
  color: #64748b;
  font-size: 1rem;
}

.dark .no-section-state {
  background: #23272b;
  border-color: #374151;
}

.dark .no-section-state h3 {
  color: #f1f5f9;
}

.dark .no-section-state p {
  color: #94a3b8;
}

/* Excel-Style Gradebook */
.gradebook-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Mini Analytics Panel */
.analytics-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 1rem;
}

.analytics-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
}

.analytics-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.student-count {
  font-size: 0.875rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.analytics-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-mini .stat-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3D8D7A;
  color: white;
  border-radius: 6px;
}

.stat-mini .stat-content {
  display: flex;
  flex-direction: column;
}

.stat-mini .stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-mini .stat-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .analytics-panel {
  background: #23272b;
  border-color: #374151;
}

.dark .analytics-header h3 {
  color: #f1f5f9;
}

.dark .student-count {
  background: #374151;
  color: #9ca3af;
}

.dark .stat-mini {
  background: #374151;
  border-color: #4b5563;
}

.dark .stat-mini .stat-value {
  color: #f1f5f9;
}

.dark .stat-mini .stat-label {
  color: #9ca3af;
}

/* Excel-Style Gradebook Table Container */
.gradebook-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.gradebook-scroll {
  overflow: auto;
  max-height: 70vh;
}

.gradebook-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}

/* Sticky Headers */
.gradebook-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  padding: 1rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.gradebook-table thead th.sticky-col {
  position: sticky;
  left: 0;
  z-index: 11;
  background: #f1f5f9;
  border-right: 2px solid #e2e8f0;
}

/* Table Headers */
.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Student Header with Sorting Controls */
.student-header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.header-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.sort-controls {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: #f1f5f9;
  color: #475569;
  border-color: #cbd5e1;
}

.sort-btn.active {
  background: #3D8D7A;
  color: white;
  border-color: #3D8D7A;
}

.sort-btn svg {
  transition: transform 0.2s ease;
}

.sort-btn svg.rotate-180 {
  transform: rotate(180deg);
}

.assessment-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.assessment-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.assessment-type {
  background: #3D8D7A;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.assessment-points {
  font-weight: 500;
}

/* Student Rows */
.student-row {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
}

.student-row:hover {
  background: #f8fafc;
}

.student-row.expanded {
  background: #f0f9ff;
  border-color: #3D8D7A;
}

.student-cell {
  position: sticky;
  left: 0;
  z-index: 5;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 0.75rem;
  min-width: 200px;
}

.student-row:hover .student-cell {
  background: #f8fafc;
}

.student-row.expanded .student-cell {
  background: #f0f9ff;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.student-avatar {
  width: 36px;
  height: 36px;
  background: #3D8D7A;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.student-id {
  font-size: 0.75rem;
  color: #64748b;
}

.expand-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.expand-btn:hover {
  background: #f1f5f9;
  color: #3D8D7A;
}

.expand-btn.rotated {
  transform: rotate(90deg);
  color: #3D8D7A;
}

/* Score Cells */
.score-cell {
  padding: 0.75rem;
  border-right: 1px solid #f1f5f9;
  text-align: center;
  position: relative;
}

.score-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.score-input {
  width: 70px;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.score-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 2px rgba(61, 141, 122, 0.1);
}

.score-input.manual {
  background: #fefce8;
  border-color: #facc15;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.score-value {
  font-weight: 600;
  font-size: 0.875rem;
}

.score-max {
  font-size: 0.75rem;
  color: #64748b;
}

.pending-indicator {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  color: #f59e0b;
  animation: pulse 2s infinite;
}

/* Score Color Classes */
.excellent .score-value { color: #059669; }
.good .score-value { color: #0891b2; }
.average .score-value { color: #d97706; }
.needs-improvement .score-value { color: #dc2626; }

/* Total Column */
.total-cell {
  padding: 0.75rem;
  text-align: center;
  background: #f8fafc;
  border-left: 2px solid #e2e8f0;
  font-weight: 600;
}

.total-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.total-value {
  font-size: 1rem;
  font-weight: 700;
}

.total-max {
  font-size: 0.75rem;
  color: #64748b;
}

.total-percentage {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
}

.total-score.excellent .total-percentage {
  background: #dcfce7;
  color: #059669;
}

.total-score.good .total-percentage {
  background: #cffafe;
  color: #0891b2;
}

.total-score.average .total-percentage {
  background: #fed7aa;
  color: #d97706;
}

.total-score.needs-improvement .total-percentage {
  background: #fecaca;
  color: #dc2626;
}

/* Student History Panel */
.student-history-row {
  background: #f0f9ff;
  border-bottom: 2px solid #3D8D7A;
}

.history-cell {
  padding: 0;
}

.student-history-panel {
  padding: 1.5rem;
  background: #f0f9ff;
  border-left: 4px solid #3D8D7A;
}

.history-header {
  margin-bottom: 1rem;
}

.history-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.history-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.history-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.history-assessment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.assessment-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.assessment-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #64748b;
}

.score-info {
  color: #374151;
  font-weight: 500;
}

.percentage-info {
  color: #64748b;
  font-style: italic;
}

.status-pending {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #f59e0b;
  font-size: 0.75rem;
  font-weight: 500;
}

.review-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.review-btn:hover {
  background: #2d6a5a;
  transform: translateY(-1px);
}

/* Dark Mode for Gradebook */
.dark .gradebook-container {
  background: #23272b;
  border-color: #374151;
}

.dark .gradebook-table thead th {
  background: #374151;
  border-color: #4b5563;
  color: #f1f5f9;
}

.dark .gradebook-table thead th.sticky-col {
  background: #1f2937;
  border-color: #374151;
}

/* Dark Mode Sorting Controls */
.dark .header-title {
  color: #f1f5f9;
}

.dark .sort-btn {
  color: #9ca3af;
  background: #374151;
  border-color: #4b5563;
}

.dark .sort-btn:hover {
  background: #4b5563;
  color: #e5e7eb;
  border-color: #6b7280;
}

.dark .sort-btn.active {
  background: #3D8D7A;
  color: white;
  border-color: #3D8D7A;
}

.dark .student-row {
  border-color: #374151;
}

.dark .student-row:hover {
  background: #374151;
}

.dark .student-row.expanded {
  background: #1e3a8a;
}

.dark .student-cell {
  background: #23272b;
  border-color: #374151;
}

.dark .student-row:hover .student-cell {
  background: #374151;
}

.dark .student-row.expanded .student-cell {
  background: #1e3a8a;
}

.dark .student-name {
  color: #f1f5f9;
}

.dark .student-id {
  color: #9ca3af;
}

.dark .score-cell {
  border-color: #374151;
}

.dark .score-input {
  background: #374151;
  border-color: #4b5563;
  color: #f1f5f9;
}

.dark .score-input.manual {
  background: #451a03;
  border-color: #92400e;
}

.dark .score-max {
  color: #9ca3af;
}

.dark .total-cell {
  background: #374151;
  border-color: #4b5563;
}

.dark .total-max {
  color: #9ca3af;
}

.dark .total-percentage {
  background: #4b5563;
  color: #9ca3af;
}

.dark .student-history-panel {
  background: #1e3a8a;
  border-color: #60a5fa;
}

.dark .history-header h4 {
  color: #f1f5f9;
}

.dark .history-item {
  background: #374151;
  border-color: #4b5563;
}

.dark .assessment-name {
  color: #f1f5f9;
}

.dark .score-info {
  color: #d1d5db;
}

.dark .percentage-info {
  color: #9ca3af;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #d1d5db;
}

.stat-description {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 400;
  opacity: 0.8;
}

.dark .stat-description {
  color: #9ca3af;
}

/* Card Background Patterns */
.stat-card.modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.3s ease;
}

.dark .stat-card.modern::before {
  background: linear-gradient(135deg, rgba(75, 85, 99, 0.2), rgba(55, 65, 81, 0.1));
}

.stat-card.modern:hover::before {
  transform: translate(20px, -20px) scale(1.2);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .gradebook-scroll {
    max-height: 50vh;
  }
  
  .history-content {
    grid-template-columns: 1fr;
  }
  
  .section-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .section-select {
    min-width: 100%;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
}

.stat-card.modern.graded {
  border-left: 4px solid #10b981;
}

.stat-card.modern.graded:hover {
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
}

.stat-card.modern.total {
  border-left: 4px solid #3b82f6;
}

.stat-card.modern.total:hover {
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
}

.stat-card.modern.average {
  border-left: 4px solid #8b5cf6;
}

.stat-card.modern.average:hover {
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2);
}

/* Icon Wrapper with Animation */
.stat-icon-wrapper {
  position: relative;
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
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.stat-icon.pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.stat-icon.graded { 
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.stat-icon.total { 
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.stat-icon.average { 
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Pulsing Animation Behind Icons */
.stat-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 12px;
  opacity: 0.3;
  animation: pulse-animation 2s infinite;
}

.stat-pulse.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-pulse.graded {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-pulse.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-pulse.average {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
}

/* Stat Content */
.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #1f2937, #374151);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .stat-number {
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark .section-card.modern:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(139, 92, 246, 0.4);
}

.section-card.modern:hover:before {
  opacity: 0.03;
}
.dark .section-card.modern:hover:before {
  opacity: 0.08;
}

.section-icon.modern {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 600;
  color: #fff;
  margin-right: 1.25rem;
  box-shadow: 0 2px 6px rgba(61, 141, 122, 0.12);
  background: linear-gradient(135deg, #3D8D7A 0%, #10b981 100%);
}
.dark .section-icon.modern {
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);
  background: linear-gradient(135deg, #059669 0%, #20c997 100%);
}

.section-info.enhanced {
  flex: 1;
  min-width: 0;
}

.section-info.enhanced h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}
.dark .section-info.enhanced h4 {
  color: #f9fafb;
}

.section-stats.enhanced {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-stats.enhanced .stat-item.modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 8px;
  transition: all 0.2s ease;
}
.dark .section-stats.enhanced .stat-item.modern {
  color: #9ca3af;
  background: rgba(139, 92, 246, 0.15);
}

.section-stats.enhanced .stat-item.modern.pending {
  background: rgba(245, 101, 101, 0.1);
  color: #ef4444;
}
.dark .section-stats.enhanced .stat-item.modern.pending {
  background: rgba(245, 101, 101, 0.2);
  color: #fca5a5;
}

.empty-state.modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  grid-column: 1 / -1;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.empty-state.modern:hover {
  border-color: #3D8D7A;
  background: linear-gradient(135deg, #f8fdfa 0%, #ecfdf5 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.1);
}

.empty-state.modern:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(61, 141, 122, 0.03) 0%, transparent 70%);
  animation: pulse 4s ease-in-out infinite;
}

.dark .empty-state.modern {
  background: linear-gradient(135deg, #23272b 0%, #2a2f33 100%);
  border-color: #374151;
}

.dark .empty-state.modern:hover {
  border-color: #20c997;
  background: linear-gradient(135deg, #2a2f33 0%, #1f2937 100%);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
}
.dark .empty-icon {
  background: linear-gradient(135deg, #4b5563, #6b7280);
  color: #9ca3af;
}

.empty-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}
.dark .empty-content h3 {
  color: #d1d5db;
}

.empty-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
.dark .empty-content p {
  color: #9ca3af;
}

.card-arrow.modern {
  color: #9ca3af;
  transition: all 0.3s ease;
  transform: translateX(0);
}
.dark .card-arrow.modern {
  color: #6b7280;
}

.subject-card.modern:hover .card-arrow.modern,
.section-card.modern:hover .card-arrow.modern {
  color: #3D8D7A;
  transform: translateX(4px);
}
.dark .subject-card.modern:hover .card-arrow.modern,
.dark .section-card.modern:hover .card-arrow.modern {
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

/* Main content scroll behavior */
.main-content {
  scroll-behavior: smooth;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>