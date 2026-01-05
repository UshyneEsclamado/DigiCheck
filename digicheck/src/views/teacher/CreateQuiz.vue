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
        
        <!-- Right: User Profile and Actions -->
        <div class="navbar-right">
          <button @click="goBack" class="nav-icon-btn rounded-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </button>

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
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Create New Quiz</h1>
              <p class="header-subtitle">{{ subject.name }}<span v-if="section.name"> - {{ section.name }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="main-container">
      <div class="container">
        <!-- Enhanced Progress Steps -->
        <div v-if="currentStep !== 'landing'" class="progress-container">
          <div class="progress-card">
            <div class="progress-track">
              <div v-for="(step, index) in steps" :key="index" class="progress-step">
                <div class="step-line" :class="{ 'completed': getStepIndex(currentStep) > index }"></div>
                <div class="step-indicator" :class="{ 
                  'active': getStepIndex(currentStep) >= index,
                  'completed': getStepIndex(currentStep) > index 
                }">
                  <div class="step-circle">
                    <span v-if="getStepIndex(currentStep) > index" class="checkmark">✓</span>
                    <span v-else class="step-number">{{ index + 1 }}</span>
                  </div>
                </div>
                <span class="step-label">{{ step }}</span>
              </div>
            </div>
          </div>
        </div>
      <!-- =============================================== -->
      <!-- LANDING PAGE: Dynamic Quiz Status Display -->
      <!-- =============================================== -->
      <div v-if="currentStep === 'landing'" class="landing-section">
        
        <!-- Loading State -->
        <div v-if="isLoadingQuizzes" class="status-card loading-card">
          <div class="status-icon">
            <div class="spinner"></div>
          </div>
          <h3 class="status-title">Loading Quiz Data...</h3>
          <p class="status-description">Please wait while we check your existing quizzes.</p>
        </div>

        <!-- No Quizzes State -->
        <div v-else-if="existingQuizzesCount === 0" class="status-card empty-state-card">
          <div class="status-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 class="status-title">No Quizzes Available</h3>
          <p class="status-description">You haven't created any quizzes for this section yet.</p>
          <div class="status-actions">
            <button @click="currentStep = 'details'" class="create-quiz-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Create Your First Quiz
            </button>
          </div>
        </div>

        <!-- Existing Quizzes State -->
        <div v-else class="status-card existing-quizzes-card">
          <div class="status-icon success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 class="status-title">
            {{ existingQuizzesCount }} Quiz{{ existingQuizzesCount > 1 ? 'es' : '' }} Created
          </h3>
          <p class="status-description">
            You have successfully created {{ existingQuizzesCount }} quiz{{ existingQuizzesCount > 1 ? 'es' : '' }} for <strong>{{ section.name }}</strong>.
            <br>Create another quiz or go back to manage existing ones.
          </p>
          <div class="status-actions">
            <button @click="goBackToQuizzes" class="btn btn-secondary manage-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
              Manage Quizzes
            </button>
            <button @click="currentStep = 'details'" class="create-quiz-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Create Another Quiz
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Details with Enhanced Design -->
      <div v-if="currentStep === 'details'" class="content-card slide-up">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="section-content">
            <h2 class="section-title">Quiz Details</h2>
            <p class="section-subtitle">Set up the basic information for your quiz</p>
          </div>
        </div>
        
        <div class="form-section">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><path d="M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/></svg>
                </span>
                Quiz Title *
              </label>
              <input v-model="quiz.title" type="text" placeholder="e.g., Biology Chapter 5 Quiz" class="form-input enhanced-input" />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><text x="7" y="17" font-size="10" fill="#20c997">#</text></svg>
                </span>
                Number of Questions *
              </label>
              <input v-model.number="quiz.numberOfQuestions" type="number" min="1" max="50" placeholder="e.g., 10" class="form-input enhanced-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4m8-4v4"/><path d="M4 10h16"/></svg>
              </span>
              Description / Instructions
            </label>
            <textarea v-model="quiz.description" rows="4" placeholder="Add instructions or context for this quiz..." class="form-input form-textarea enhanced-input"></textarea>
          </div>

          <div class="action-buttons">
            <button @click="currentStep = 'landing'" class="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <button @click="proceedToQuestions" class="btn btn-primary">
              Continue to Questions
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add Questions with Clean Design -->
      <div v-if="currentStep === 'questions'" class="content-card slide-up">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="section-content">
            <h2 class="section-title">Build Your Questions</h2>
            <div class="question-counter">
              <div class="counter-badge">
                <span class="counter-text">{{ quiz.questions.length }} / {{ quiz.numberOfQuestions }} Questions</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (quiz.questions.length / quiz.numberOfQuestions) * 100 + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions Container -->
        <div class="questions-wrapper">
          <!-- Question Cards -->
          <div v-for="(question, index) in quiz.questions" :key="index" class="question-card-modern">
            <div class="question-card-header">
              <div class="question-badge-modern">{{ index + 1 }}</div>
              <h3 class="question-title-modern">Question {{ index + 1 }}</h3>
              <button @click="removeQuestion(index)" class="remove-question-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
              </button>
            </div>

            <div class="question-card-body">
              <!-- Question Type Selection -->
              <div class="form-field">
                <label class="field-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                  </svg>
                  Question Type
                </label>
                <select 
                  v-model="question.type" 
                  @change="handleQuestionTypeChange(question, question.type)"
                  class="modern-select"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="fill_blank">Fill in the Blanks</option>
                </select>
              </div>

              <!-- Question Text -->
              <div class="form-field">
                <label class="field-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Question Text
                </label>
                <textarea 
                  v-model="question.text" 
                  rows="3" 
                  placeholder="Enter your question here..." 
                  class="modern-textarea"
                ></textarea>
              </div>

              <!-- Multiple Choice Options -->
              <div v-if="question.type === 'multiple_choice'" class="options-section">
                <label class="field-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                  </svg>
                  Answer Options
                </label>
                
                <div class="options-list">
                  <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-row">
                    <div class="option-controls">
                      <input 
                        type="radio" 
                        :name="'correct-' + index" 
                        :checked="question.correctAnswer === optIndex" 
                        @change="question.correctAnswer = optIndex" 
                        class="option-radio-modern"
                      />
                      <div class="option-letter-modern">{{ String.fromCharCode(65 + optIndex) }}</div>
                    </div>
                    <input 
                      v-model="question.options[optIndex]" 
                      type="text" 
                      :placeholder="'Enter option ' + String.fromCharCode(65 + optIndex)" 
                      class="option-input-modern"
                    />
                    <button 
                      v-if="question.options.length > 2" 
                      @click="removeOption(index, optIndex)" 
                      class="remove-option-modern"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button @click="addOption(index)" class="add-option-modern">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                  Add Option
                </button>
              </div>

              <!-- True/False Options -->
              <div v-if="question.type === 'true_false'" class="tf-section">
                <label class="field-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                  </svg>
                  Correct Answer
                </label>
                
                <div class="tf-options-modern">
                  <label class="tf-option-modern" :class="{ active: question.correctAnswer === 'true' }">
                    <input type="radio" v-model="question.correctAnswer" value="true" class="tf-radio-hidden" />
                    <div class="tf-icon-modern true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                      </svg>
                    </div>
                    <span class="tf-label-modern">True</span>
                  </label>
                  
                  <label class="tf-option-modern" :class="{ active: question.correctAnswer === 'false' }">
                    <input type="radio" v-model="question.correctAnswer" value="false" class="tf-radio-hidden" />
                    <div class="tf-icon-modern false">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                      </svg>
                    </div>
                    <span class="tf-label-modern">False</span>
                  </label>
                </div>
              </div>

              <!-- Fill in the Blanks -->
              <div v-if="question.type === 'fill_blank'" class="form-field">
                <label class="field-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  Correct Answer
                </label>
                <input 
                  v-model="question.correctAnswer" 
                  type="text" 
                  placeholder="Enter the exact answer..." 
                  class="modern-input"
                />
                
                <!-- Case Sensitivity Toggle -->
                <div class="case-sensitivity-toggle">
                  <label class="toggle-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11,7H13A1,1 0 0,1 14,8V16A1,1 0 0,1 13,17H11A1,1 0 0,1 10,16V8A1,1 0 0,1 11,7M11,9V15H13V9H11M8,11H9V13H8V15H6V13C6,11.89 6.9,11 8,11Z"/>
                    </svg>
                    <span class="toggle-text">Case Sensitive</span>
                    <div class="toggle-switch">
                      <input 
                        v-model="question.caseSensitive" 
                        type="checkbox" 
                        class="toggle-input"
                      />
                      <div class="toggle-slider"></div>
                    </div>
                  </label>
                  <p class="toggle-description">
                    When enabled, answers must match exactly (e.g., "Apple" ≠ "apple")
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Question Button -->
          <div v-if="quiz.questions.length < quiz.numberOfQuestions" class="add-question-modern" @click="addQuestion">
            <div class="add-question-content-modern">
              <div class="add-icon-modern">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                </svg>
              </div>
              <h4>Add Question {{ quiz.questions.length + 1 }}</h4>
              <p>Click to create a new question</p>
            </div>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="action-buttons-modern">
          <button @click="currentStep = 'details'" class="btn-modern btn-secondary-modern">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
            </svg>
            Back
          </button>
          <button 
            v-if="quiz.questions.length > 0" 
            @click="currentStep = 'settings'" 
            class="btn-modern btn-primary-modern"
          >
            Continue to Settings
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quiz Settings with Enhanced Design -->
      <div v-if="currentStep === 'settings'" class="content-card slide-up">
        <div class="section-header">
          <div class="section-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63Z"/>
            </svg>
          </div>
          <div class="section-content">
            <h2 class="section-title">Quiz Settings</h2>
            <p class="section-subtitle">Configure how your quiz will work</p>
          </div>
        </div>

        <div class="settings-grid">
          <!-- Time Limit Setting -->
          <div class="setting-card enhanced-setting">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Time Limit</h3>
                  <p>Set a time constraint for this quiz</p>
                </div>
              </div>
              <label class="toggle-switch">
                <input v-model="quiz.settings.hasTimeLimit" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div v-if="quiz.settings.hasTimeLimit" class="setting-content">
              <div class="time-input-group">
                <input v-model.number="quiz.settings.timeLimit" type="number" min="1" max="180" placeholder="30" class="form-input time-input" />
                <span class="time-unit">minutes</span>
              </div>
            </div>
          </div>

          <!-- Attempts Setting -->
          <div class="setting-card enhanced-setting">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <polyline points="1 4 1 10 7 10"/>
                    <polyline points="23 20 23 14 17 14"/>
                    <path d="M20.49 9A9 9 0 0 0 5.51 15M3.51 9A9 9 0 0 1 18.49 15"/>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Attempts Allowed</h3>
                  <p>How many times can students retake?</p>
                </div>
              </div>
            </div>
            <div class="setting-content">
              <div class="attempts-options">
                <label class="attempt-option" :class="quiz.settings.attemptsAllowed === 1 ? 'selected' : ''">
                  <input type="radio" v-model.number="quiz.settings.attemptsAllowed" :value="1" class="hidden" />
                  <span class="attempt-number">1</span>
                  <span class="attempt-label">Once</span>
                </label>
                <label class="attempt-option" :class="quiz.settings.attemptsAllowed === 2 ? 'selected' : ''">
                  <input type="radio" v-model.number="quiz.settings.attemptsAllowed" :value="2" class="hidden" />
                  <span class="attempt-number">2</span>
                  <span class="attempt-label">Twice</span>
                </label>
                <label class="attempt-option" :class="quiz.settings.attemptsAllowed === 999 ? 'selected' : ''">
                  <input type="radio" v-model.number="quiz.settings.attemptsAllowed" :value="999" class="hidden" />
                  <span class="attempt-number">∞</span>
                  <span class="attempt-label">Unlimited</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Shuffle Setting -->
          <div class="setting-card enhanced-setting">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <polyline points="16 3 21 3 21 8"/>
                    <line x1="4" y1="20" x2="21" y2="3"/>
                    <polyline points="21 16 21 21 16 21"/>
                    <line x1="15" y1="15" x2="21" y2="21"/>
                    <line x1="4" y1="4" x2="9" y2="9"/>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Shuffle Questions</h3>
                  <p>Randomize question and answer order</p>
                </div>
              </div>
              <label class="toggle-switch">
                <input v-model="quiz.settings.shuffle" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Section Assignment (Bulk) -->
          <div class="setting-card enhanced-setting full-width">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Assign to Sections</h3>
                  <p>Select which sections can access this quiz</p>
                  <div v-if="currentSchoolYear && selectedGradingPeriod" class="academic-tags">
                    <span class="academic-tag">{{ currentSchoolYear.year_name }}</span>
                    <span class="quarter-tag">{{ selectedGradingPeriod.period_name }}</span>
                  </div>
                </div>
              </div>
              <div class="selected-count">
                <span class="count-badge">{{ getSelectedSectionsCount }} / {{ teacherSections.length }}</span>
              </div>
            </div>
            
            <div class="setting-content">
              <!-- Select All Option -->
              <div class="section-select-all">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="allSectionsSelected" 
                    @change="toggleAllSections"
                  />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">Select All Sections</span>
                </label>
              </div>
              
              <!-- Sections Grid -->
              <div class="sections-grid">
                <div 
                  v-for="section in teacherSections" 
                  :key="section.id"
                  class="section-checkbox-card"
                  :class="{ 'selected': isSectionSelected(section.id) }"
                  @click="toggleSectionSelection(section.id)"
                >
                  <div class="section-card-content">
                    <div class="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        :checked="isSectionSelected(section.id)"
                        @click.stop
                        @change="toggleSectionSelection(section.id)"
                      />
                      <span class="checkbox-visual"></span>
                    </div>
                    <div class="section-info">
                      <div class="section-name">{{ section.name }}</div>
                      <div class="section-meta">
                        <span class="section-code">{{ section.section_code }}</span>
                        <span class="section-subject">{{ section.subject_name }}</span>
                        <span class="section-grade">Grade {{ section.grade_level }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- No Sections Message -->
              <div v-if="teacherSections.length === 0" class="no-sections-message">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p>No sections available</p>
              </div>
            </div>
          </div>

          <!-- Grading Period Selector -->
          <div v-if="gradingPeriods.length > 0" class="setting-card enhanced-setting full-width">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Grading Period</h3>
                  <p>Assign this quiz to a specific quarter</p>
                </div>
              </div>
            </div>
            
            <div class="setting-content">
              <div class="grading-period-selector">
                <label 
                  v-for="period in gradingPeriods" 
                  :key="period.id"
                  class="period-option"
                  :class="{ 'selected': selectedGradingPeriod?.id === period.id, 'active-period': period.is_active }"
                >
                  <input 
                    type="radio" 
                    :value="period" 
                    v-model="selectedGradingPeriod"
                    name="gradingPeriod"
                  />
                  <span class="period-content">
                    <span class="period-name">{{ period.period_name }}</span>
                    <span v-if="period.is_active" class="active-badge">Active</span>
                    <span class="period-dates">
                      {{ new Date(period.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }} - 
                      {{ new Date(period.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Schedule Setting -->
          <div class="setting-card enhanced-setting schedule-card">
            <div class="setting-header">
              <div class="setting-info">
                <span class="setting-emoji">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <div class="setting-details">
                  <h3>Schedule</h3>
                  <p>Set when students can access this quiz</p>
                </div>
              </div>
            </div>
            <div class="setting-content">
              <div class="schedule-grid">
                <div class="form-group">
                  <label class="form-label-small">
                    <span class="label-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </span>
                    Start Date & Time (PHT)
                  </label>
                  <input v-model="quiz.settings.startDate" type="datetime-local" class="form-input enhanced-input" />
                  <small class="timezone-note">Philippines Time (UTC+8) - This will be saved as UTC in database</small>
                </div>
                <div class="form-group">
                  <label class="form-label-small">
                    <span class="label-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 12 12 18 18 18"/>
                      </svg>
                    </span>
                    End Date & Time (PHT)
                  </label>
                  <input v-model="quiz.settings.endDate" type="datetime-local" class="form-input enhanced-input" />
                  <small class="timezone-note">Philippines Time (UTC+8) - This will be saved as UTC in database</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="currentStep = 'questions'" class="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <button @click="currentStep = 'preview'" class="btn btn-primary">
            Preview Quiz
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview with Enhanced Design -->
      <div v-if="currentStep === 'preview'" class="content-card slide-up">
        <div class="preview-header">
          <div class="preview-badge">
            <span class="badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="6"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            PREVIEW MODE
          </div>
          <h2 class="preview-title">{{ quiz.title }}</h2>
          <p class="preview-description">{{ quiz.description }}</p>
          <div class="preview-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="stat-value">
                <span v-if="quiz.settings.hasTimeLimit">{{ quiz.settings.timeLimit }} min</span>
                <span v-else>No limit</span>
              </div>
              <div class="stat-label">Time</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><path d="M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/></svg>
              </div>
              <div class="stat-value">{{ quiz.questions.length }}</div>
              <div class="stat-label">Questions</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.51 15M3.51 9A9 9 0 0 1 18.49 15"/></svg>
              </div>
              <div class="stat-value">{{ quiz.settings.attemptsAllowed === 999 ? '∞' : quiz.settings.attemptsAllowed }}</div>
              <div class="stat-label">Attempts</div>
            </div>
          </div>
        </div>

        <div class="preview-questions">
          <div v-for="(question, index) in quiz.questions" :key="index" class="preview-card enhanced-preview">
            <div class="preview-question-header">
              <div class="preview-question-number">{{ index + 1 }}</div>
              <div class="question-type-badge" :class="question.type">
                <span v-if="question.type === 'multiple_choice'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2" style="vertical-align:middle;"><path d="M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/></svg> MCQ
                </span>
                <span v-else-if="question.type === 'true_false'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2" style="vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg> T/F
                </span>
                <span v-else>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2" style="vertical-align:middle;"><path d="M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/></svg> Fill
                </span>
              </div>
            </div>
            <h3 class="preview-question-text">{{ question.text }}</h3>
            
            <!-- MCQ Preview -->
            <div v-if="question.type === 'multiple_choice'" class="preview-options">
              <div v-for="(option, optIndex) in question.options" :key="optIndex" 
                   :class="['preview-option', question.correctAnswer === optIndex ? 'correct-option' : '']">
                <div class="option-marker">{{ String.fromCharCode(65 + optIndex) }}</div>
                <span class="option-text">{{ option }}</span>
                <span v-if="question.correctAnswer === optIndex" class="correct-mark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </div>
            </div>

            <!-- True/False Preview -->
            <div v-if="question.type === 'true_false'" class="preview-options">
              <div :class="['preview-option', question.correctAnswer === 'true' ? 'correct-option' : '']">
                <div class="option-marker">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span class="option-text">True</span>
                <span v-if="question.correctAnswer === 'true'" class="correct-mark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </div>
              <div :class="['preview-option', question.correctAnswer === 'false' ? 'correct-option' : '']">
                <div class="option-marker">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </div>
                <span class="option-text">False</span>
                <span v-if="question.correctAnswer === 'false'" class="correct-mark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
              </div>
            </div>

            <!-- Fill Blank Preview -->
            <div v-if="question.type === 'fill_blank'" class="preview-fill-blank">
              <div class="fill-blank-input">
                <input type="text" disabled placeholder="Student answer here..." class="form-input" />
              </div>
              <div class="correct-answer-display">
                <span class="correct-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#20c997" stroke-width="2" style="vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg> Correct Answer:
                </span>
                <span class="correct-text">{{ question.correctAnswer }}</span>
              </div>
              <div class="case-sensitivity-display">
                <span class="case-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11,7H13A1,1 0 0,1 14,8V16A1,1 0 0,1 13,17H11A1,1 0 0,1 10,16V8A1,1 0 0,1 11,7M11,9V15H13V9H11M8,11H9V13H8V15H6V13C6,11.89 6.9,11 8,11Z"/>
                  </svg>
                  Case Sensitive: 
                </span>
                <span :class="['case-status', question.caseSensitive ? 'enabled' : 'disabled']">
                  {{ question.caseSensitive ? 'Yes' : 'No' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="currentStep = 'settings'" class="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
            </svg>
            Edit Quiz
          </button>
          <button @click="publishQuiz" :disabled="isPublishing" class="btn btn-publish">
            <svg v-if="!isPublishing" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div v-else class="spinner"></div>
            <span>{{ isPublishing ? 'Publishing...' : 'Publish Quiz Now' }}</span>
            <svg v-if="!isPublishing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
          </button>
        </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/supabase.js';

const router = useRouter();
const route = useRoute();

// ===============================================
// REACTIVE STATE
// ===============================================
const currentStep = ref('landing');
const steps = ['Details', 'Questions', 'Settings', 'Preview'];
const isPublishing = ref(false);
const isLoadingQuizzes = ref(false);
const existingQuizzesCount = ref(0);
const isInitializing = ref(true); // NEW: Track initialization state

// Real-time subscription
let quizSubscription = null;

// Teacher info and UI state
const teacherInfo = ref({
  full_name: 'Teacher',
  email: '',
  role: 'teacher',
  teacher_id: null
});

// Scroll-to-top functionality
const showScrollTop = ref(false);
const showNotifDropdown = ref(false);
const showProfileDropdown = ref(false);
const notifications = ref([]);

// Logout modal states
const showLogoutModal = ref(false);
const isLoggingOut = ref(false);

// Dynamic teacher name
const fullName = computed(() => teacherInfo.value?.full_name || 'Teacher');

function handleScroll() {
  showScrollTop.value = window.scrollY > 200;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Profile and notification dropdown functions
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
  if (showProfileDropdown.value) {
    showNotifDropdown.value = false
  }
}

const toggleNotifDropdown = () => {
  showNotifDropdown.value = !showNotifDropdown.value
  if (showNotifDropdown.value) {
    showProfileDropdown.value = false
  }
}

const handleNotificationClick = (notification) => {
  console.log('Notification clicked:', notification)
}

// Logout confirmation modal functions
const openLogoutModal = () => {
  showLogoutModal.value = true;
};

const closeLogoutModal = () => {
  showLogoutModal.value = false;
};

const confirmLogout = () => {
  console.log('🚪 Logging out...');
  
  // Clear storage immediately
  localStorage.clear();
  sessionStorage.clear();
  
  // Sign out from Supabase (don't wait)
  supabase.auth.signOut().catch(err => console.log('Signout error:', err));
  
  // Immediate redirect - no waiting!
  setTimeout(() => {
    window.location.assign('/login');
  }, 100);
  
  console.log('✅ Logout initiated');
};

const logout = () => {
  openLogoutModal();
};

const subject = ref({
  id: '',
  name: 'Subject'
});

const section = ref({
  id: '',
  name: ''
});

// Bulk section assignment
const teacherSections = ref([]);
const selectedSections = ref([]);
const allSectionsSelected = ref(false);
const gradingPeriods = ref([]);
const selectedGradingPeriod = ref(null);
const currentSchoolYear = ref(null);

const quiz = ref({
  title: '',
  description: '',
  numberOfQuestions: null,
  questions: [],
  settings: {
    hasTimeLimit: false,
    timeLimit: 30,
    attemptsAllowed: 1,
    shuffle: false,
    startDate: '',
    endDate: ''
  }
});

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

// TIMEZONE UTILITY FUNCTIONS
const formatPHTime = (utcDateString) => {
  if (!utcDateString) return 'Not set';
  try {
    const utcDate = new Date(utcDateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila',
      hour12: true
    };
    return utcDate.toLocaleString('en-PH', options) + ' PHT';
  } catch (error) {
    console.error('Error formatting PH time:', error);
    return 'Invalid date';
  }
};

const convertPHTimeToUTC = (phDateString) => {
  if (!phDateString) return null;
  try {
    const localDate = new Date(phDateString);
    const phOffset = -8 * 60;
    const localOffset = localDate.getTimezoneOffset();
    const offsetDiff = localOffset - phOffset;
    const utcTime = new Date(localDate.getTime() + (offsetDiff * 60 * 1000));
    
    console.log('🕐 Converting PH to UTC:', {
      input: phDateString,
      output: utcTime.toISOString()
    });
    
    return utcTime.toISOString();
  } catch (error) {
    console.error('Error converting PH time to UTC:', error);
    return null;
  }
};

const convertUTCtoPHForInput = (utcDateString) => {
  if (!utcDateString) return '';
  try {
    const utcDate = new Date(utcDateString);
    const phTime = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(utcDate).replace(' ', 'T');
    
    return phTime;
  } catch (error) {
    console.error('Error converting UTC to PH for input:', error);
    return '';
  }
};

const getStepIndex = (step) => {
  const stepMap = {
    'landing': -1,
    'details': 0,
    'questions': 1,
    'settings': 2,
    'preview': 3
  };
  return stepMap[step];
};

// ===============================================
// DATA LOADING FUNCTIONS
// ===============================================

const loadTeacherInfo = async () => {
  try {
    console.log('📋 Loading teacher info...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      console.error('No session found:', sessionError);
      router.push('/login');
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('auth_user_id', session.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      alert('Failed to load profile. Please try logging in again.');
      return false;
    }

    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (teacherError || !teacher) {
      console.error('Teacher error:', teacherError);
      alert('Teacher profile not found. Please contact support.');
      return false;
    }

    teacherInfo.value = {
      full_name: teacher.full_name,
      email: teacher.email,
      role: profile.role,
      teacher_id: teacher.id
    };

    console.log('✅ Teacher info loaded:', teacherInfo.value);
    return true;
  } catch (error) {
    console.error('Error loading teacher info:', error);
    alert('Failed to load teacher information. Please refresh the page.');
    return false;
  }
};

const loadRouteParams = () => {
  const subjectId = route.params.subjectId;
  const sectionId = route.params.sectionId;
  const subjectName = route.query.subjectName || 'Subject';
  const sectionName = route.query.sectionName || '';

  if (!subjectId || !sectionId) {
    console.error('Missing required route parameters');
    return false;
  }

  subject.value = { id: subjectId, name: subjectName };
  section.value = { id: sectionId, name: sectionName };

  console.log('✅ Route params loaded:', { subject: subject.value, section: section.value });
  return true;
};

const loadExistingQuizzes = async () => {
  try {
    if (!teacherInfo.value.teacher_id || !subject.value.id || !section.value.id) {
      console.warn('⚠️ Missing required info for loading quizzes');
      return;
    }

    console.log('📊 Loading existing quizzes for section:', section.value.name);
    
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('id, title, created_at')
      .eq('teacher_id', teacherInfo.value.teacher_id)
      .eq('subject_id', subject.value.id)
      .eq('section_id', section.value.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error loading quizzes:', error);
      existingQuizzesCount.value = 0;
    } else {
      existingQuizzesCount.value = quizzes ? quizzes.length : 0;
      console.log(`✅ Found ${existingQuizzesCount.value} existing quizzes`);
    }
  } catch (error) {
    console.error('❌ Exception while loading quizzes:', error);
    existingQuizzesCount.value = 0;
  } finally {
    isLoadingQuizzes.value = false;
  }
};

const fetchTeacherSections = async () => {
  try {
    if (!subject.value.id) {
      console.log('No subject ID available yet');
      return;
    }

    console.log('📚 Fetching sections for subject:', subject.value.id);

    // Fetch all sections that belong to the same subject
    const { data: sectionsData, error } = await supabase
      .from('sections')
      .select(`
        id,
        name,
        section_code,
        subject_id,
        subjects!inner (
          id,
          name,
          grade_level
        )
      `)
      .eq('subject_id', subject.value.id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    teacherSections.value = sectionsData.map(s => ({
      id: s.id,
      name: s.name,
      section_code: s.section_code,
      subject_id: s.subject_id,
      subject_name: s.subjects.name,
      grade_level: s.subjects.grade_level
    }));

    console.log(`✅ Found ${teacherSections.value.length} sections for subject "${subject.value.name}"`);
    console.log('Sections:', teacherSections.value);
    
    // Auto-select current section if we came from a specific section
    if (section.value.id) {
      selectedSections.value = [section.value.id];
      console.log(`✅ Auto-selected current section: ${section.value.name}`);
    }
    
  } catch (error) {
    console.error('Error fetching sections:', error);
  }
};

const fetchGradingPeriods = async () => {
  try {
    // Get active school year
    const { data: schoolYear, error: syError } = await supabase
      .from('school_years')
      .select('id, year_name')
      .eq('is_active', true)
      .single();
    
    if (syError) {
      console.log('No active school year found');
      return;
    }
    
    currentSchoolYear.value = schoolYear;
    
    // Get grading periods
    const { data: periods, error: periodsError } = await supabase
      .from('grading_periods')
      .select('*')
      .eq('school_year_id', schoolYear.id)
      .order('period_number', { ascending: true });
    
    if (periodsError) throw periodsError;
    
    gradingPeriods.value = periods || [];
    
    // Auto-select active period
    const activePeriod = periods?.find(p => p.is_active);
    selectedGradingPeriod.value = activePeriod || (periods?.[0] || null);
    
    console.log('📅 Grading periods loaded:', periods?.length);
  } catch (error) {
    console.error('Error fetching grading periods:', error);
  }
};

const toggleAllSections = () => {
  if (allSectionsSelected.value) {
    selectedSections.value = teacherSections.value.map(s => s.id);
  } else {
    selectedSections.value = [];
  }
};

const toggleSectionSelection = (sectionId) => {
  const index = selectedSections.value.indexOf(sectionId);
  if (index > -1) {
    selectedSections.value.splice(index, 1);
  } else {
    selectedSections.value.push(sectionId);
  }
  
  // Update "select all" checkbox state
  allSectionsSelected.value = selectedSections.value.length === teacherSections.value.length;
};

const isSectionSelected = (sectionId) => {
  return selectedSections.value.includes(sectionId);
};

const getSelectedSectionsCount = computed(() => {
  return selectedSections.value.length;
});

// ===============================================
// NAVIGATION FUNCTIONS
// ===============================================

const goBack = () => {
  // Use router.back() to return to the previous page (section detail view)
  router.back()
};

const goBackToQuizzes = () => {
  router.push({
    name: 'ViewAssessments',
    params: {
      subjectId: subject.value.id,
      sectionId: section.value.id
    },
    query: {
      subjectName: subject.value.name,
      sectionName: section.value.name,
      gradeLevel: route.query.gradeLevel,
      sectionCode: route.query.sectionCode
    }
  });
};

const proceedToQuestions = () => {
  // Check if teacher info is loaded
  if (!teacherInfo.value.teacher_id) {
    alert('⚠️ System is still initializing. Please wait a moment and try again.');
    console.error('Teacher ID not loaded yet');
    return;
  }

  if (!quiz.value.title || !quiz.value.title.trim()) {
    alert('Please enter a quiz title');
    return;
  }
  if (!quiz.value.numberOfQuestions) {
    alert('Please enter the number of questions');
    return;
  }
  if (quiz.value.numberOfQuestions < 1 || quiz.value.numberOfQuestions > 50) {
    alert('Number of questions must be between 1 and 50');
    return;
  }
  currentStep.value = 'questions';
};

// ===============================================
// QUESTION MANAGEMENT FUNCTIONS
// ===============================================

const addQuestion = () => {
  if (quiz.value.questions.length >= quiz.value.numberOfQuestions) {
    alert(`You can only add ${quiz.value.numberOfQuestions} questions`);
    return;
  }
  quiz.value.questions.push({
    type: 'multiple_choice',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: null,
    caseSensitive: false // Default to case insensitive, will be set to true when type is fill_blank
  });
};

const removeQuestion = (index) => {
  if (confirm('Are you sure you want to remove this question?')) {
    quiz.value.questions.splice(index, 1);
  }
};

const addOption = (questionIndex) => {
  if (quiz.value.questions[questionIndex].options.length < 6) {
    quiz.value.questions[questionIndex].options.push('');
  } else {
    alert('Maximum 6 options allowed per question');
  }
};

const removeOption = (questionIndex, optionIndex) => {
  if (quiz.value.questions[questionIndex].options.length > 2) {
    quiz.value.questions[questionIndex].options.splice(optionIndex, 1);
    if (quiz.value.questions[questionIndex].correctAnswer === optionIndex) {
      quiz.value.questions[questionIndex].correctAnswer = null;
    } else if (quiz.value.questions[questionIndex].correctAnswer > optionIndex) {
      quiz.value.questions[questionIndex].correctAnswer--;
    }
  } else {
    alert('A question must have at least 2 options');
  }
};

const handleQuestionTypeChange = (question, newType) => {
  // Reset question type-specific properties
  if (newType === 'multiple_choice') {
    question.options = ['', '', '', ''];
    question.correctAnswer = null;
    question.caseSensitive = false;
  } else if (newType === 'true_false') {
    question.options = [];
    question.correctAnswer = null;
    question.caseSensitive = false;
  } else if (newType === 'fill_blank') {
    question.options = [];
    question.correctAnswer = '';
    question.caseSensitive = false; // Default to case insensitive for better user experience
  }
};

// ===============================================
// QUIZ VALIDATION FUNCTIONS
// ===============================================

const validateQuiz = () => {
  if (!quiz.value.title.trim()) {
    alert('Please enter a quiz title');
    currentStep.value = 'details';
    return false;
  }

  // Validate sections selected
  if (selectedSections.value.length === 0) {
    alert('⚠️ Please select at least one section for this quiz.');
    currentStep.value = 'settings';
    return false;
  }

  if (quiz.value.questions.length === 0) {
    alert('Please add at least one question');
    currentStep.value = 'questions';
    return false;
  }

  for (let i = 0; i < quiz.value.questions.length; i++) {
    const q = quiz.value.questions[i];
    
    if (!q.text.trim()) {
      alert(`Question ${i + 1}: Please enter question text`);
      currentStep.value = 'questions';
      return false;
    }

    if (q.type === 'multiple_choice') {
      const emptyOptions = q.options.filter(opt => !opt.trim());
      if (emptyOptions.length > 0) {
        alert(`Question ${i + 1}: All answer options must be filled`);
        currentStep.value = 'questions';
        return false;
      }

      if (q.correctAnswer === null || q.correctAnswer === undefined) {
        alert(`Question ${i + 1}: Please select the correct answer`);
        currentStep.value = 'questions';
        return false;
      }
    } else if (q.type === 'true_false') {
      if (!q.correctAnswer) {
        alert(`Question ${i + 1}: Please select True or False as the correct answer`);
        currentStep.value = 'questions';
        return false;
      }
    } else if (q.type === 'fill_blank') {
      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        alert(`Question ${i + 1}: Please enter the correct answer`);
        currentStep.value = 'questions';
        return false;
      }
    }
  }

  if (quiz.value.settings.hasTimeLimit) {
    if (!quiz.value.settings.timeLimit || quiz.value.settings.timeLimit < 1) {
      alert('Please enter a valid time limit (at least 1 minute)');
      currentStep.value = 'settings';
      return false;
    }
  }

  if (quiz.value.settings.startDate && quiz.value.settings.endDate) {
    const startDate = new Date(quiz.value.settings.startDate);
    const endDate = new Date(quiz.value.settings.endDate);
    const now = new Date();
    
    if (endDate <= startDate) {
      alert('End date must be after start date');
      currentStep.value = 'settings';
      return false;
    }
    
    if (startDate < now) {
      const proceed = confirm(
        'The start date is in the past. Students will be able to take this quiz immediately.\n\n' +
        `Start: ${new Date(quiz.value.settings.startDate).toLocaleString()}\n` +
        `Now: ${now.toLocaleString()}\n\n` +
        'Do you want to continue?'
      );
      if (!proceed) {
        currentStep.value = 'settings';
        return false;
      }
    }
  }

  return true;
};

// ===============================================
// REAL-TIME SUBSCRIPTION SETUP
// ===============================================

const setupRealtimeSubscription = () => {
  if (!teacherInfo.value.teacher_id) {
    console.warn('⚠️ Cannot setup realtime: teacher_id not available');
    return;
  }
  
  quizSubscription = supabase
    .channel('quiz-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'quizzes',
        filter: `teacher_id=eq.${teacherInfo.value.teacher_id}`
      },
      (payload) => {
        console.log('📡 Real-time: New quiz created:', payload.new);
        if (payload.new.subject_id === subject.value.id && payload.new.section_id === section.value.id) {
          existingQuizzesCount.value++;
        }
      }
    )
    .subscribe((status) => {
      console.log('📡 Subscription status:', status);
    });
};

// ===============================================
// FIXED QUIZ PUBLISHING FUNCTION
// ===============================================

const publishQuiz = async () => {
  // Validate sections selected
  if (selectedSections.value.length === 0) {
    alert('⚠️ Please select at least one section for this quiz.');
    return;
  }

  // CRITICAL: Check if teacher info is loaded
  if (!teacherInfo.value.teacher_id) {
    alert('⚠️ System Error: Teacher information not loaded.\n\nPlease refresh the page and try again.');
    console.error('❌ Publish blocked: teacher_id not available');
    return;
  }

  // Validation first
  if (!validateQuiz()) {
    console.log('❌ Validation failed');
    return;
  }

  const sectionCount = selectedSections.value.length;
  const sectionText = sectionCount === 1 ? '1 section' : `${sectionCount} sections`;
  
  if (!confirm(`Publish "${quiz.value.title}" to ${sectionText}?\n\nStudents in the selected sections will be able to see and take this quiz immediately.`)) {
    return;
  }

  isPublishing.value = true;
  console.log('🚀 Starting bulk quiz publication...');

  try {
    console.log('✅ Teacher verified:', teacherInfo.value.teacher_id);
    console.log(`📚 Publishing to ${sectionCount} section(s)`);

    // === STEP 1: Create Quiz (WITHOUT section_id) ===
    const startDateUTC = convertPHTimeToUTC(quiz.value.settings.startDate);
    const endDateUTC = convertPHTimeToUTC(quiz.value.settings.endDate);
    
    console.log('🕐 Timezone conversion:', {
      startInput: quiz.value.settings.startDate,
      startUTC: startDateUTC,
      endInput: quiz.value.settings.endDate,
      endUTC: endDateUTC
    });

    const quizData = {
      subject_id: subject.value.id,
      // NOTE: section_id is now nullable - we use bulk_quizzes instead
      section_id: null,
      teacher_id: teacherInfo.value.teacher_id,
      title: quiz.value.title.trim(),
      description: quiz.value.description.trim() || null,
      number_of_questions: parseInt(quiz.value.numberOfQuestions),
      has_time_limit: quiz.value.settings.hasTimeLimit,
      time_limit_minutes: quiz.value.settings.hasTimeLimit ? parseInt(quiz.value.settings.timeLimit) : null,
      attempts_allowed: parseInt(quiz.value.settings.attemptsAllowed),
      shuffle_questions: quiz.value.settings.shuffle,
      shuffle_options: quiz.value.settings.shuffle,
      start_date: startDateUTC,
      end_date: endDateUTC,
      status: 'published',
      // Academic period tracking
      school_year_id: currentSchoolYear.value?.id || null,
      grading_period_id: selectedGradingPeriod.value?.id || null
    };

    console.log('📝 Quiz data prepared:', quizData);
    console.log('📤 Step 1: Creating quiz...');

    const { data: newQuiz, error: quizError } = await supabase
      .from('quizzes')
      .insert([quizData])
      .select()
      .single();

    if (quizError) {
      console.error('❌ Quiz creation failed:', quizError);
      throw new Error(`Failed to create quiz: ${quizError.message}`);
    }

    if (!newQuiz?.id) {
      throw new Error('Quiz created but no ID returned');
    }

    console.log('✅ Step 1 complete: Quiz created with ID:', newQuiz.id);

    // === STEP 1.5: Assign Quiz to Multiple Sections ===
    console.log('📤 Step 1.5: Assigning quiz to sections...');
    console.log('Selected sections:', selectedSections.value);
    
    // Create bulk_quizzes entries for each selected section
    const bulkQuizData = selectedSections.value.map(sectionId => ({
      quiz_id: newQuiz.id,
      section_id: sectionId
    }));

    console.log('Bulk quiz data:', bulkQuizData);

    const { data: bulkResult, error: bulkError } = await supabase
      .from('bulk_quizzes')
      .insert(bulkQuizData)
      .select();

    if (bulkError) {
      console.error('❌ Bulk quiz assignment failed:', bulkError);
      throw new Error(`Failed to assign quiz to sections: ${bulkError.message}`);
    }

    console.log(`✅ Step 1.5 complete: Quiz assigned to ${bulkResult.length} section(s)`);

    // === STEP 2: Insert Questions ===
    console.log('📝 Step 2: Preparing questions...');
    
    const questionsData = quiz.value.questions.map((q, index) => ({
      quiz_id: newQuiz.id,
      question_number: index + 1,
      question_type: q.type,
      question_text: q.text.trim(),
      points: 1.00
    }));

    console.log(`✅ Prepared ${questionsData.length} questions`);
    console.log('📤 Step 2: Inserting questions...');

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsData)
      .select();

    if (questionsError) {
      console.error('❌ Questions insertion failed:', questionsError);
      throw new Error(`Failed to insert questions: ${questionsError.message}`);
    }

    if (!insertedQuestions || insertedQuestions.length !== questionsData.length) {
      throw new Error(`Expected ${questionsData.length} questions, got ${insertedQuestions?.length || 0}`);
    }

    console.log(`✅ Step 2 complete: ${insertedQuestions.length} questions inserted`);

    // === STEP 3: Insert Options and Answers ONE BY ONE ===
    console.log('📝 Step 3: Inserting options and answers one by one...');
    
    let totalOptionsInserted = 0;
    let totalAnswersInserted = 0;

    for (let i = 0; i < quiz.value.questions.length; i++) {
      const question = quiz.value.questions[i];
      const questionId = insertedQuestions[i].id;

      console.log(`Processing question ${i + 1}/${quiz.value.questions.length} (ID: ${questionId})`);

      if (question.type === 'multiple_choice') {
        // Insert options one by one
        for (let optIndex = 0; optIndex < question.options.length; optIndex++) {
          const optionData = {
            question_id: questionId,
            option_number: optIndex + 1,
            option_text: question.options[optIndex].trim(),
            is_correct: question.correctAnswer === optIndex
          };

          console.log(`  Inserting option ${optIndex + 1}:`, optionData);

          const { error: optionError } = await supabase
            .from('question_options')
            .insert([optionData]);

          if (optionError) {
            console.error(`❌ Failed to insert option ${optIndex + 1}:`, optionError);
            throw new Error(`Failed to insert option ${optIndex + 1} for question ${i + 1}: ${optionError.message}`);
          }

          totalOptionsInserted++;
          console.log(`  ✅ Option ${optIndex + 1} inserted successfully`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } else if (question.type === 'true_false' || question.type === 'fill_blank') {
        // Insert answer
        const answerData = {
          question_id: questionId,
          correct_answer: String(question.correctAnswer).trim(),
          case_sensitive: question.type === 'fill_blank' ? (question.caseSensitive ?? false) : false
        };

        console.log(`  Inserting answer:`, answerData);

        const { error: answerError } = await supabase
          .from('question_answers')
          .insert([answerData]);

        if (answerError) {
          console.error(`❌ Failed to insert answer:`, answerError);
          throw new Error(`Failed to insert answer for question ${i + 1}: ${answerError.message}`);
        }

        totalAnswersInserted++;
        console.log(`  ✅ Answer inserted successfully`);
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    console.log(`✅ Step 3 complete: ${totalOptionsInserted} options and ${totalAnswersInserted} answers inserted`);

    // === SUCCESS ===
    console.log('🎉 Quiz published successfully to multiple sections!');
    console.log('Quiz details:', {
      id: newQuiz.id,
      code: newQuiz.quiz_code,
      title: newQuiz.title,
      questions: insertedQuestions.length,
      options: totalOptionsInserted,
      answers: totalAnswersInserted,
      sections: selectedSections.value.length
    });

    // Show success message
    alert(`✅ Quiz Published Successfully!\n\n📝 ${newQuiz.title}\n🔑 Quiz Code: ${newQuiz.quiz_code}\n📊 ${insertedQuestions.length} questions\n📚 Assigned to ${sectionCount} section(s)\n\n✨ Students can now take this quiz!`);

    // Redirect to view assessments
    router.push({
      name: 'ViewAssessments',
      params: {
        subjectId: subject.value.id,
        sectionId: section.value.id
      },
      query: {
        subjectName: subject.value.name,
        sectionName: section.value.name,
        gradeLevel: route.query.gradeLevel,
        sectionCode: route.query.sectionCode
      }
    });

  } catch (error) {
    console.error('❌ Publication error:', error);

    let errorMessage = '❌ Failed to Publish Quiz\n\n';

    if (error.code === '23505') {
      errorMessage += '⚠️ A quiz with this title already exists in this section.\nPlease use a different title.';
    } else if (error.code === '23503') {
      errorMessage += '⚠️ Invalid reference detected.\nPlease refresh the page and try again.';
    } else if (error.code === 'PGRST116') {
      errorMessage += '⚠️ Database connection issue.\nPlease check your internet connection and try again.';
    } else if (error.code === '42501' || error.message.includes('row-level security')) {
      errorMessage += '⚠️ Permission error while saving quiz data.\n\nThis usually means there\'s an issue with database permissions.\nPlease contact your system administrator or try logging out and back in.';
    } else if (error.message) {
      errorMessage += `Error: ${error.message}`;
    } else {
      errorMessage += '⚠️ An unexpected error occurred.\nPlease try again or contact support if the problem persists.';
    }

    alert(errorMessage);

  } finally {
    isPublishing.value = false;
    console.log('🏁 Publishing process completed');
  }
};

// ===============================================
// LIFECYCLE HOOKS
// ===============================================

onMounted(async () => {
  console.log('🔧 Component mounted');
  isInitializing.value = true;
  
  try {
    // Step 1: Load teacher info first
    const teacherLoaded = await loadTeacherInfo();
    if (!teacherLoaded) {
      console.error('❌ Failed to load teacher info');
      router.push('/login');
      return;
    }

    // Step 2: Load route params BEFORE fetching sections
    const paramsLoaded = loadRouteParams();
    if (!paramsLoaded) {
      console.error('❌ Failed to load route params');
      alert('Missing information. Redirecting...');
      router.push('/teacher/subjects');
      return;
    }

    // Step 3: Fetch grading periods
    await fetchGradingPeriods();
    
    // Step 4: Fetch teacher sections (AFTER route params are loaded)
    await fetchTeacherSections();

    // Step 5: Load existing quizzes
    await loadExistingQuizzes();
    
    // Step 6: Setup realtime subscription
    setupRealtimeSubscription();
    
    console.log('✅ Component initialization complete');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    alert('Failed to initialize page. Please refresh and try again.');
  } finally {
    isInitializing.value = false;
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  console.log('🧹 Component unmounting');
  window.removeEventListener('scroll', handleScroll);
  if (quizSubscription) {
    supabase.removeChannel(quizSubscription);
    console.log('✅ Realtime subscription cleaned up');
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Reset and Dashboard Container */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  height: 100vh;
  width: 100vw;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Sidebar Navigation - Matching DashboardHome.vue */
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
  display: block !important;
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

/* Top Navigation Bar - Matching DashboardHome.vue */
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

/* Rounded semi-transparent backgrounds */
.rounded-bg {
  background: rgba(255,255,255,0.13);
  border-radius: 16px;
  transition: background 0.2s;
}
.rounded-bg:hover {
  background: rgba(255,255,255,0.22);
}

/* Notification and Profile Dropdowns */
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

.notification-dropdown, .profile-dropdown {
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

.notification-dropdown {
  width: 360px;
}

.dropdown-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fafafa;
}

.profile-dropdown .dropdown-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
}

.dropdown-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.profile-dropdown .dropdown-header h3 {
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

/* Main Content Area */
.main-content {
  margin-top: 64px;
  margin-left: 80px;
  padding: 1.5rem;
  width: calc(100% - 80px);
  height: calc(100vh - 64px);
  position: relative;
  background: #f8fafc;
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
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3);
}

.dark ::-webkit-scrollbar-corner {
  background: #1a1d21;
}

/* Scroll to top button */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.4);
  background: linear-gradient(135deg, #2d6a5a, #3D8D7A);
}

.scroll-to-top:active {
  transform: translateY(0);
}

/* Hide any parent layout elements */
body, html {
  overflow-x: hidden !important;
}

/* Top Navigation Bar (Same as Dashboard) */
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

/* Main Content */
.main-content {
  margin-top: 64px;
  margin-left: 80px;
  padding: 1.5rem;
  width: calc(100vw - 80px);
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
}

.header-subtitle {
  font-size: 0.95rem;
  color: #64748b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.create-quiz-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dark .create-quiz-page {
  background: #0f172a;
}

/* Header Section - Same as MySubjects */
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
  background: linear-gradient(135deg, var(--accent-color, #4F8CFF) 0%, var(--accent-light, #6DD5FA) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(79, 140, 255, 0.15);
  border: none;
}

.dark .header-icon {
  background: linear-gradient(135deg, var(--accent-dark, #232a3b) 0%, var(--accent-color, #4F8CFF) 100%);
  box-shadow: 0 8px 32px rgba(79, 140, 255, 0.25);
  border: none;
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

/* Main Content Container - Same as MySubjects */
.main-container {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
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
  padding: 0;
  background: transparent;
}

/* Responsive Header */
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
}
/* Progress & Content Cards */
.progress-card,
.content-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.5);
}

.dark .progress-card,
.dark .content-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Section Headers */
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
  background: linear-gradient(135deg, #3D8D7A 0%, #2D6A5A 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.2);
  flex-shrink: 0;
}

.dark .section-icon {
  background: linear-gradient(135deg, #3D8D7A 0%, #2D6A5A 100%);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
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
/* Progress Steps */
.progress-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 50%;
  right: -50%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
  transition: all 0.3s ease;
}

.progress-step:last-child .step-line {
  right: 50%;
}

.step-line.completed {
  background: #3D8D7A;
}

.step-indicator {
  position: relative;
  z-index: 2;
  margin-bottom: 0.75rem;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: #e5e7eb;
  color: #6b7280;
}

.step-indicator.active .step-circle,
.step-indicator.completed .step-circle {
  background: #3D8D7A;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

.dark .step-label {
  color: #94a3b8;
}

.step-indicator.active + .step-label,
.step-indicator.completed + .step-label {
  color: #3D8D7A;
  font-weight: 600;
}

.dark .step-indicator.active + .step-label,
.dark .step-indicator.completed + .step-label {
  color: #3D8D7A;
}


/* =============================================== */
/* LANDING SECTION STYLES - Same as MySubjects */
/* =============================================== */

.landing-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

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

.existing-quizzes-card {
  border-color: rgba(61, 141, 122, 0.5);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dark .existing-quizzes-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.status-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #64748b;
}

.success-icon {
  color: #3D8D7A;
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
  margin-top: 1rem;
}

/* Enhanced Create Quiz Button */
.create-quiz-btn {
  background: #3D8D7A;
  color: white;
  border: 1px solid #3D8D7A;
  border-radius: 10px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 12px rgba(61, 141, 122, 0.15);
  min-width: 220px;
  justify-content: center;
}

.create-quiz-btn svg {
  color: white !important;
  fill: white !important;
}

.create-quiz-btn:hover {
  background: #2D6A5A;
  border-color: #2D6A5A;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(61, 141, 122, 0.25);
}

.manage-btn {
  min-width: 180px;
  justify-content: center;
}

/* Spinner Animation */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f1f5f9;
  border-top: 3px solid #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark .spinner {
  border-color: #1e293b;
  border-top-color: #3D8D7A;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design for Landing */
@media (max-width: 768px) {
  .landing-section {
    padding: 1rem 0.5rem;
  }
  
  .status-card {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
  
  .status-title {
    font-size: 1.25rem;
  }
  
  .status-description {
    font-size: 0.95rem;
  }
  
  .status-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .create-quiz-btn,
  .manage-btn {
    width: 100%;
    min-width: unset;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .create-quiz-page {
    padding: 1rem;
  }
  .section-header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .section-header-left {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .main-content {
    gap: 1rem;
  }
}

/* Form Elements - Same as MySubjects */
.form-section {
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-label {
  color: #f1f5f9;
}

.label-icon {
  display: flex;
  align-items: center;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  color: #374151;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.dark .form-input,
.dark .form-textarea,
.dark .form-select {
  background: #1e293b;
  border-color: #475569;
  color: #f1f5f9;
}

.dark .form-input:focus,
.dark .form-textarea:focus,
.dark .form-select:focus {
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Buttons - Same as MySubjects */
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
  background: #3D8D7A;
  color: white;
  border: 1px solid #3D8D7A;
}

.btn-primary:hover {
  background: #2D6A5A;
  border-color: #2D6A5A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.btn-secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

.dark .btn-secondary {
  color: #94a3b8;
  border-color: #475569;
}

.dark .btn-secondary:hover {
  background: #334155;
  border-color: #64748b;
  color: #f1f5f9;
}

.btn-success {
  background: #10b981;
  color: white;
  border: 1px solid #10b981;
}

.btn-success:hover {
  background: #059669;
  border-color: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-publish {
  background: #3D8D7A;
  color: white;
  border: 1px solid #3D8D7A;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
}

.btn-publish:hover {
  background: #2D6A5A;
  border-color: #2D6A5A;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(61, 141, 122, 0.3);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.dark .action-buttons {
  border-top-color: #374151;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .action-buttons .btn {
    width: 100%;
    justify-content: center;
  }
}

/* DateTime Local Calendar Styling */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%233D8D7A'%3e%3cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd'/%3e%3c/svg%3e") no-repeat center;
  background-size: 16px 16px;
  cursor: pointer;
  opacity: 1;
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
}

.dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23A3D1C6'%3e%3cpath fill-rule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clip-rule='evenodd'/%3e%3c/svg%3e") no-repeat center;
  background-size: 16px 16px;
}

input[type="datetime-local"]::-webkit-datetime-edit {
  color: #3D8D7A;
  font-family: 'Inter', sans-serif;
}

.dark input[type="datetime-local"]::-webkit-datetime-edit {
  color: #A3D1C6;
}

input[type="datetime-local"]::-webkit-datetime-edit-text {
  color: #6b7280;
  padding: 0 0.25rem;
}

.dark input[type="datetime-local"]::-webkit-datetime-edit-text {
  color: #A3D1C6;
}

input[type="datetime-local"]::-webkit-datetime-edit-month-field,
input[type="datetime-local"]::-webkit-datetime-edit-day-field,
input[type="datetime-local"]::-webkit-datetime-edit-year-field,
input[type="datetime-local"]::-webkit-datetime-edit-hour-field,
input[type="datetime-local"]::-webkit-datetime-edit-minute-field {
  background: transparent;
  color: #3D8D7A;
  font-weight: 500;
  padding: 0.1rem 0.2rem;
  border-radius: 4px;
  border: none;
}

.dark input[type="datetime-local"]::-webkit-datetime-edit-month-field,
.dark input[type="datetime-local"]::-webkit-datetime-edit-day-field,
.dark input[type="datetime-local"]::-webkit-datetime-edit-year-field,
.dark input[type="datetime-local"]::-webkit-datetime-edit-hour-field,
.dark input[type="datetime-local"]::-webkit-datetime-edit-minute-field {
  color: #A3D1C6;
}

input[type="datetime-local"]::-webkit-datetime-edit-month-field:focus,
input[type="datetime-local"]::-webkit-datetime-edit-day-field:focus,
input[type="datetime-local"]::-webkit-datetime-edit-year-field:focus,
input[type="datetime-local"]::-webkit-datetime-edit-hour-field:focus,
input[type="datetime-local"]::-webkit-datetime-edit-minute-field:focus {
  background: rgba(61, 141, 122, 0.1);
  outline: none;
}

.dark input[type="datetime-local"]::-webkit-datetime-edit-month-field:focus,
.dark input[type="datetime-local"]::-webkit-datetime-edit-day-field:focus,
.dark input[type="datetime-local"]::-webkit-datetime-edit-year-field:focus,
.dark input[type="datetime-local"]::-webkit-datetime-edit-hour-field:focus,
.dark input[type="datetime-local"]::-webkit-datetime-edit-minute-field:focus {
  background: rgba(163, 209, 198, 0.1);
}

/* Custom calendar popup styling for supported browsers */
input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(61, 141, 122, 0.1);
  border-radius: 4px;
}

.dark input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(163, 209, 198, 0.1);
}

/* Enhanced Calendar Popup Styling */
/* Force calendar to use appropriate color scheme */
input[type="datetime-local"] {
  color-scheme: light;
  accent-color: #3D8D7A;
}

.dark input[type="datetime-local"] {
  color-scheme: dark;
  accent-color: #A3D1C6;
}

/* Style the calendar popup directly where browsers support it */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233D8D7A'%3e%3cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px 18px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  opacity: 1;
  padding: 2px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A3D1C6'%3e%3cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z'/%3e%3c/svg%3e");
}

/* Enhanced hover and active states */
input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(61, 141, 122, 0.1);
}

.dark input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
  background-color: rgba(163, 209, 198, 0.1);
}

input[type="datetime-local"]::-webkit-calendar-picker-indicator:active {
  background-color: rgba(61, 141, 122, 0.2);
  transform: scale(0.95);
}

.dark input[type="datetime-local"]::-webkit-calendar-picker-indicator:active {
  background-color: rgba(163, 209, 198, 0.2);
}

/* Additional webkit calendar styling */
input[type="datetime-local"]::-webkit-inner-spin-button {
  display: none;
}

input[type="datetime-local"]::-webkit-clear-button {
  display: none;
}

/* Force the calendar popup to respect dark mode */
@media (prefers-color-scheme: dark) {
  .dark input[type="datetime-local"] {
    color-scheme: dark;
  }
}

@media (prefers-color-scheme: light) {
  input[type="datetime-local"] {
    color-scheme: light;
  }
}
.enhanced-input {
  box-shadow: 0 1px 4px rgba(61, 141, 122, 0.07);
}
.form-textarea {
  resize: vertical;
  min-height: 80px;
  max-height: 200px;
}

/* Timezone Note Styling */
.timezone-note {
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.25rem;
  display: block;
}
.dark .timezone-note {
  color: #A3D1C6;
}

.form-label-small {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3D8D7A;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.dark .form-label-small {
  color: #A3D1C6;
}

.label-icon {
  font-size: 1rem;
}
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1.1rem;
    margin-top: 2rem;
  }
  .action-buttons .btn-primary {
    min-width: 220px;
    justify-content: center;
  }
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
}

/* =============================================== */
/* MODERN QUESTIONS SECTION STYLES */
/* =============================================== */

.question-counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
}

.counter-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #10b981;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  min-width: 200px;
}

.dark .counter-badge {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #10b981;
}

.counter-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
}

.dark .counter-text {
  color: #34d399;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.dark .progress-bar {
  background: #374151;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Questions Wrapper */
.questions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

/* Modern Question Card */
.question-card-modern {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.question-card-modern:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}

.dark .question-card-modern {
  background: #1e293b;
  border-color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.dark .question-card-modern:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
}

/* Question Card Header */
.question-card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark .question-card-header {
  background: linear-gradient(135deg, #374151 0%, #1e293b 100%);
  border-bottom-color: #475569;
}

.question-badge-modern {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  margin-right: 1rem;
}

.question-title-modern {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.dark .question-title-modern {
  color: #f1f5f9;
}

.remove-question-btn {
  width: 36px;
  height: 36px;
  background: #fef2f2;
  border: 2px solid #fecaca;
  color: #ef4444;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-question-btn:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
  transform: scale(1.05);
}

.dark .remove-question-btn {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fca5a5;
}

.dark .remove-question-btn:hover {
  background: #dc2626;
  border-color: #b91c1c;
  color: white;
}

/* Question Card Body */
.question-card-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Field */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.dark .field-label {
  color: #d1d5db;
}

.field-label svg {
  color: #10b981;
}

/* Modern Form Controls */
.modern-select,
.modern-textarea,
.modern-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  color: #1f2937;
  transition: all 0.2s ease;
}

.modern-select:focus,
.modern-textarea:focus,
.modern-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: #f9fafb;
}

.dark .modern-select,
.dark .modern-textarea,
.dark .modern-input {
  background: #374151;
  border-color: #475569;
  color: #f1f5f9;
}

.dark .modern-select:focus,
.dark .modern-textarea:focus,
.dark .modern-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  background: #1e293b;
}

.modern-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Options Section */
.options-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.option-row:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.dark .option-row {
  background: #374151;
  border-color: #475569;
}

.dark .option-row:hover {
  border-color: #10b981;
  background: #1e293b;
}

.option-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.option-radio-modern {
  width: 18px;
  height: 18px;
  accent-color: #10b981;
  cursor: pointer;
}

.option-letter-modern {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.option-input-modern {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  color: #1f2937;
  transition: all 0.2s ease;
}

.option-input-modern:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.dark .option-input-modern {
  background: #1e293b;
  border-color: #374151;
  color: #f1f5f9;
}

.dark .option-input-modern:focus {
  border-color: #10b981;
}

.remove-option-modern {
  width: 28px;
  height: 28px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-option-modern:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
}

.dark .remove-option-modern {
  background: #7f1d1d;
  border-color: #991b1b;
  color: #fca5a5;
}

.add-option-modern {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #ecfdf5;
  border: 2px solid #10b981;
  color: #059669;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-option-modern:hover {
  background: #10b981;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.dark .add-option-modern {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #34d399;
}

.dark .add-option-modern:hover {
  background: #10b981;
  color: white;
}

/* True/False Section */
.tf-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tf-options-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tf-option-modern {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tf-option-modern:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.tf-option-modern.active {
  border-color: #10b981;
  background: #ecfdf5;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.dark .tf-option-modern {
  background: #374151;
  border-color: #475569;
}

.dark .tf-option-modern:hover,
.dark .tf-option-modern.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.tf-radio-hidden {
  display: none;
}

.tf-icon-modern {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tf-icon-modern.true {
  background: #d1fae5;
  color: #059669;
}

.tf-icon-modern.false {
  background: #fee2e2;
  color: #dc2626;
}

.tf-option-modern.active .tf-icon-modern.true {
  background: #059669;
  color: white;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.tf-option-modern.active .tf-icon-modern.false {
  background: #dc2626;
  color: white;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.tf-label-modern {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.dark .tf-label-modern {
  color: #d1d5db;
}

/* Add Question Button */
.add-question-modern {
  background: white;
  border: 3px dashed #cbd5e1;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.add-question-modern:hover {
  border-color: #10b981;
  background: #f0fdfa;
  transform: translateY(-2px);
}

.dark .add-question-modern {
  background: #1e293b;
  border-color: #475569;
}

.dark .add-question-modern:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.add-question-content-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.add-icon-modern {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  transition: all 0.2s ease;
}

.add-question-modern:hover .add-icon-modern {
  background: #10b981;
  color: white;
  transform: scale(1.05);
}

.dark .add-icon-modern {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #34d399;
}

.add-question-content-modern h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.dark .add-question-content-modern h4 {
  color: #f1f5f9;
}

.add-question-content-modern p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.dark .add-question-content-modern p {
  color: #94a3b8;
}

/* Modern Action Buttons */
.action-buttons-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.dark .action-buttons-modern {
  border-top-color: #374151;
}

.btn-modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn-secondary-modern {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary-modern:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.dark .btn-secondary-modern {
  background: #374151;
  color: #94a3b8;
  border-color: #475569;
}

.dark .btn-secondary-modern:hover {
  background: #475569;
  border-color: #64748b;
  color: #f1f5f9;
}

.btn-primary-modern {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 2px solid #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.btn-primary-modern:hover {
  background: linear-gradient(135deg, #059669, #047857);
  border-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

@media (max-width: 768px) {
  .tf-options-modern {
    grid-template-columns: 1fr;
  }
  
  .option-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .option-controls {
    justify-content: flex-start;
  }
  
  .action-buttons-modern {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .btn-modern {
    width: 100%;
    justify-content: center;
  }
  
  .question-card-header {
    padding: 1rem 1.5rem;
  }
  
  .question-card-body {
    padding: 1.5rem;
  }
}

/* =============================================== */
/* SETTINGS SECTION STYLES */
/* =============================================== */

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 0;
}

.setting-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.setting-card:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
}

.dark .setting-card {
  background: #1e293b;
  border-color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.dark .setting-card:hover {
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.setting-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.setting-emoji {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .setting-emoji {
  background: rgba(16, 185, 129, 0.1);
}

.setting-details h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.dark .setting-details h3 {
  color: #f1f5f9;
}

.setting-details p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.dark .setting-details p {
  color: #94a3b8;
}

.setting-content {
  margin-top: 1rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: 0.3s;
  border-radius: 28px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #10b981;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.toggle-switch input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

/* Case Sensitivity Toggle */
.case-sensitivity-toggle {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dark .case-sensitivity-toggle {
  background: #1e293b;
  border-color: #374151;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.toggle-text {
  flex: 1;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.dark .toggle-text {
  color: #d1d5db;
}

.toggle-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

.dark .toggle-description {
  color: #9ca3af;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Time Input Group */
.time-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-input {
  width: 80px;
  text-align: center;
  font-weight: 600;
}

.time-unit {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark .time-unit {
  color: #94a3b8;
}

/* Attempts Options */
.attempts-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.attempt-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 80px;
}

.attempt-option:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.attempt-option.selected {
  border-color: #10b981;
  background: #ecfdf5;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.dark .attempt-option {
  background: #374151;
  border-color: #475569;
}

.dark .attempt-option:hover,
.dark .attempt-option.selected {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.attempt-option input {
  display: none;
}

.attempt-number {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.attempt-option.selected .attempt-number {
  background: #10b981;
  color: white;
}

.attempt-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.attempt-option.selected .attempt-label {
  color: #10b981;
}

.dark .attempt-label {
  color: #94a3b8;
}

.dark .attempt-option.selected .attempt-label {
  color: #34d399;
}

/* Schedule Card */
.schedule-card {
  grid-column: 1 / -1;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-label-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-label-small {
  color: #d1d5db;
}

.timezone-note {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
  margin-top: 0.25rem;
  display: block;
}

.dark .timezone-note {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  
  .attempts-options {
    flex-direction: column;
  }
  
  .attempt-option {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.75rem;
  }
}

/* Preview Section Styles */
.preview-header {
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%);
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.dark .preview-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-color: #374151;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ecfdf5;
  color: #059669;
  border: 2px solid #10b981;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.dark .preview-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
}

.badge-icon {
  display: flex;
  align-items: center;
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.dark .preview-title {
  color: #f1f5f9;
}

.preview-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.dark .preview-description {
  color: #94a3b8;
}

.preview-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  min-width: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark .stat-card {
  background: #374151;
  border-color: #475569;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.stat-icon {
  color: #10b981;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.dark .stat-value {
  color: #f1f5f9;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark .stat-label {
  color: #94a3b8;
}

.preview-questions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.preview-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
}

.dark .preview-card {
  background: #1e293b;
  border-color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.dark .preview-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
}

.preview-question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark .preview-question-header {
  border-bottom-color: #374151;
}

.preview-question-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.question-type-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.dark .question-type-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
}

.preview-question-text {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.dark .preview-question-text {
  color: #f1f5f9;
}

.preview-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.preview-option.correct-option {
  background: #ecfdf5;
  border-color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.dark .preview-option {
  background: #374151;
  border-color: #475569;
}

.dark .preview-option.correct-option {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
}

.option-marker {
  width: 24px;
  height: 24px;
  background: #64748b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.preview-option.correct-option .option-marker {
  background: #10b981;
}

.option-text {
  flex: 1;
  font-size: 0.875rem;
  color: #1f2937;
}

.dark .option-text {
  color: #d1d5db;
}

.correct-mark {
  color: #10b981;
  display: flex;
  align-items: center;
}

.preview-fill-blank {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fill-blank-input {
  position: relative;
}

.fill-blank-input input {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
}

.dark .fill-blank-input input {
  background: #374151;
  border-color: #475569;
  color: #94a3b8;
}

.correct-answer-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #ecfdf5;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 0.75rem;
}

.dark .correct-answer-display {
  background: rgba(16, 185, 129, 0.1);
}

.correct-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dark .correct-label {
  color: #34d399;
}

.correct-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  background: white;
  border: 1px solid #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.dark .correct-text {
  background: #1e293b;
  color: #f1f5f9;
}

/* Case Sensitivity Display */
.case-sensitivity-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
}

.dark .case-sensitivity-display {
  background: #374151;
  border-color: #4b5563;
}

.case-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dark .case-label {
  color: #94a3b8;
}

.case-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.case-status.enabled {
  background: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.case-status.disabled {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.dark .case-status.enabled {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.2);
}

.dark .case-status.disabled {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .preview-stats {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .stat-card {
    min-width: 200px;
  }
  
  .preview-question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .preview-option {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .option-marker {
    align-self: center;
  }
}

/* Custom Modal Styles */
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSlideIn 0.3s ease-out;
}
.dark .modal-content {
  background: #23272b;
  border: 1px solid #3D8D7A;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.dark .modal-header {
  border-bottom-color: #3D8D7A;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}
.dark .modal-header h3 {
  color: #A3D1C6;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}
.dark .modal-close {
  color: #A3D1C6;
}
.dark .modal-close:hover {
  background: rgba(163, 209, 198, 0.1);
  color: #A3D1C6;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.modal-icon {
  color: #3D8D7A;
  flex-shrink: 0;
}
.dark .modal-icon {
  color: #A3D1C6;
}

.modal-text {
  flex: 1;
}

.modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
}
.dark .modal-title {
  color: #A3D1C6;
}

.modal-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}
.dark .modal-description {
  color: #A3D1C6;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}
.dark .modal-actions {
  border-top-color: #3D8D7A;
}

.modal-actions .btn {
  min-width: 80px;
  justify-content: center;
}

@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-body {
    flex-direction: column;
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}

/* Compact Landing Design */
.compact-landing {
  max-width: 720px !important;
  margin: 0 auto;
  padding: 2.5rem 2rem !important;
}

.compact-title {
  font-size: 2rem !important;
  margin: 1.5rem 0 1rem 0 !important;
}

.compact-desc {
  font-size: 1rem !important;
  margin: 0 0 2rem 0 !important;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.compact-features {
  gap: 1.5rem !important;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0 !important;
}

.compact-feature {
  flex: none !important;
  min-width: 140px;
  text-align: center;
}

.compact-btn {
  padding: 0.875rem 2rem !important;
  font-size: 1rem !important;
  max-width: 280px;
  margin: 0 auto;
}

/* Centered Button Content */
.centered-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .main-content {
    padding: 1.5rem;
  }
}

@media (max-width: 1024px) {
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

/* Bulk Section Assignment Styles */
.full-width {
  grid-column: 1 / -1;
}

.academic-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.academic-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.quarter-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #3D8D7A 0%, #2d6d5f 100%);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-count {
  display: flex;
  align-items: center;
}

.count-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
}

.section-select-all {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #1f2937;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

.checkbox-text {
  font-size: 1rem;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.section-checkbox-card {
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.section-checkbox-card:hover {
  border-color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.section-checkbox-card.selected {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.section-card-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.checkbox-wrapper {
  position: relative;
  flex-shrink: 0;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
}

.section-info {
  flex: 1;
}

.section-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-code,
.section-subject,
.section-grade {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.section-checkbox-card.selected .section-code,
.section-checkbox-card.selected .section-subject,
.section-checkbox-card.selected .section-grade {
  background: #10b981;
  color: white;
}

.no-sections-message {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.no-sections-message svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.grading-period-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.period-option {
  position: relative;
  display: block;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-option:hover {
  border-color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.period-option.selected {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.period-option.active-period {
  border-color: #3b82f6;
}

.period-option input[type="radio"] {
  position: absolute;
  opacity: 0;
}

.period-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.period-name {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
}

.active-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  width: fit-content;
}

.period-dates {
  font-size: 0.875rem;
  color: #6b7280;
}

</style>
