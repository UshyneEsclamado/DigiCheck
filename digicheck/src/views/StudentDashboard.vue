<!-- UPDATED TEMPLATE SECTION WITH STRAND SUPPORT -->
<template>
  <div class="dashboard-container">
    <!-- Mobile Top Header -->
    <header class="mobile-header">
      <div class="header-left">
        <div class="profile-pic-container">
          <img 
            v-if="userProfile.profilePhoto" 
            :src="userProfile.profilePhoto" 
            alt="Profile Photo"
            class="profile-photo"
          />
          <div v-else class="profile-photo-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>
        </div>
        <div class="user-details">
          <h3 v-if="userProfile.fullName" class="user-name">
            {{ userProfile.fullName }}
          </h3>
          <h3 v-else class="no-name-text">
            Hi Student!
          </h3>
          <!-- Updated Grade Display with Strand -->
          <p v-if="userProfile.grade" class="grade">
            Grade {{ userProfile.grade }}
            <span v-if="isSeniorHigh && userProfile.strand" class="strand-badge">
              {{ userProfile.strand }}
            </span>
          </p>
        </div>
      </div>
      <div class="header-right">
        <button @click="toggleProfileMenu" class="profile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Profile Dropdown Menu -->
    <transition name="profile-menu">
      <div v-if="isProfileMenuOpen" class="profile-dropdown">
        <div class="profile-dropdown-content">
          <div class="profile-info">
            <div class="profile-pic-large">
              <img 
                v-if="userProfile.profilePhoto" 
                :src="userProfile.profilePhoto" 
                alt="Profile Photo"
              />
              <div v-else class="profile-photo-placeholder-large">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
            </div>
            <div class="profile-details">
              <h4 v-if="userProfile.fullName">{{ userProfile.fullName }}</h4>
              <h4 v-else>Student</h4>
              <p class="role-text">STUDENT</p>
              <!-- Gender Display in Dropdown -->
              <p v-if="userProfile.gender" class="gender-text">{{ userProfile.gender }}</p>
              <!-- Updated Grade Display with Strand in Dropdown -->
              <p v-if="userProfile.grade" class="grade-text">
                GRADE {{ userProfile.grade }}
                <span v-if="isSeniorHigh && userProfile.strand" class="strand-text">
                  - {{ userProfile.strand }}
                </span>
              </p>
              <p v-if="userProfile.schoolYear" class="school-year-text">S.Y. {{ userProfile.schoolYear }}</p>
              <p v-if="userProfile.studentId" class="student-id-text">ID: {{ userProfile.studentId }}</p>
            </div>
          </div>
          <div class="profile-actions">
            <router-link to="/student/settings" class="profile-action" @click="closeProfileMenu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.9,6C16.5,5.65 16.08,5.36 15.61,5.1L15.2,2.83C15.15,2.56 14.9,2.33 14.62,2.33L9.38,2.33C9.1,2.33 8.85,2.56 8.8,2.83L8.39,5.09C7.92,5.34 7.5,5.65 7.1,6L4.9,5.12C4.7,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.7,18.97 4.9,18.88L7.1,18C7.5,18.35 7.92,18.64 8.39,18.9L8.8,21.17C8.85,21.44 9.1,21.67 9.38,21.67L14.62,21.67C14.9,21.67 15.15,21.44 15.2,21.17L15.61,18.91C16.08,18.66 16.5,18.35 16.9,18L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
              <span>Settings</span>
            </router-link>
            <button @click="handleLogout" class="profile-action logout-action">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Desktop Sidebar (hidden on mobile) -->
    <aside class="sidebar desktop-only">
      <div class="user-info">
        <div class="profile-pic-container">
          <img 
            v-if="userProfile.profilePhoto" 
            :src="userProfile.profilePhoto" 
            alt="Profile Photo"
            class="profile-photo"
          />
          <div v-else class="profile-photo-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>
        </div>
        <div class="user-details">
          <h3 v-if="userProfile.fullName" class="user-name">
            {{ userProfile.fullName }}
          </h3>
          <h3 v-else class="no-name-text">
            Name not available
          </h3>
          
          <p class="role">STUDENT</p>
          
          <!-- Gender Display -->
          <p v-if="userProfile.gender" class="gender">
            {{ userProfile.gender }}
          </p>
          
          <!-- Updated Grade Display with Strand in Sidebar -->
          <p v-if="userProfile.grade" class="grade">
            GRADE {{ userProfile.grade }}
            <span v-if="isSeniorHigh && userProfile.strand" class="strand-inline">
              - {{ userProfile.strand }}
            </span>
          </p>
          <p v-else class="grade grade-missing">
            GRADE NOT SET
          </p>
          
          <!-- Display School Level -->
          <p v-if="userProfile.grade" class="school-level">
            {{ schoolLevel }}
          </p>
          
          <!-- Display School Year -->
          <p v-if="userProfile.schoolYear" class="school-year">
            S.Y. {{ userProfile.schoolYear }}
          </p>
          
          <p v-if="userProfile.studentId" class="student-id">
            STUDENT ID: {{ userProfile.studentId }}
          </p>
          <p v-else class="student-id student-id-missing">
            STUDENT ID: NOT SET
          </p>
        </div>
      </div>

      <nav class="nav-links">
        <router-link
          to="/student/dashboard"
          :class="['nav-item', { 'is-active': $route.name === 'StudentDashboardHome' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
          <span>Home</span>
        </router-link>
        <router-link
          to="/student/subjects"
          :class="['nav-item', { 'is-active': $route.name === 'StudentSubjects' || $route.name === 'TakeQuiz' || $route.name === 'StudentGrades' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,5.5V18.5A2.5,2.5 0 0,0 5.5,21A2.5,2.5 0 0,0 8,18.5V5.5A2.5,2.5 0 0,0 5.5,3A2.5,2.5 0 0,0 3,5.5M12,5.5V18.5A2.5,2.5 0 0,0 14.5,21A2.5,2.5 0 0,0 17,18.5V5.5A2.5,2.5 0 0,0 14.5,3A2.5,2.5 0 0,0 12,5.5M21,5.5V18.5A2.5,2.5 0 0,0 23.5,21A2.5,2.5 0 0,0 26,18.5V5.5A2.5,2.5 0 0,0 23.5,3A2.5,2.5 0 0,0 21,5.5Z" />
          </svg>
          <span>Subjects</span>
        </router-link>
        <router-link
          to="/student/calendar"
          :class="['nav-item', { 'is-active': $route.name === 'StudentCalendar' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,13.5H11V18.5H16.5V13.5Z" />
          </svg>
          <span>Calendar</span>
        </router-link>
        <router-link
          to="/student/messages"
          :class="['nav-item', { 'is-active': $route.name === 'StudentMessages' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="messages-icon">
            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zM4 6h16v.5l-8 5-8-5V6zm0 13.5V8l8 5 8-5v11.5H4z"/>
          </svg>
          <span>Messages</span>
        </router-link>
        <router-link
          to="/student/settings"
          :class="['nav-item', { 'is-active': $route.name === 'StudentSettings' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.9,6C16.5,5.65 16.08,5.36 15.61,5.1L15.2,2.83C15.15,2.56 14.9,2.33 14.62,2.33L9.38,2.33C9.1,2.33 8.85,2.56 8.8,2.83L8.39,5.09C7.92,5.34 7.5,5.65 7.1,6L4.9,5.12C4.7,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.7,18.97 4.9,18.88L7.1,18C7.5,18.35 7.92,18.64 8.39,18.9L8.8,21.17C8.85,21.44 9.1,21.67 9.38,21.67L14.62,21.67C14.9,21.67 15.15,21.44 15.2,21.17L15.61,18.91C16.08,18.66 16.5,18.35 16.9,18L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
          <span>Settings</span>
        </router-link>
      </nav>

      <button @click="showLogoutModal" class="logout-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
        </svg>
        <span>Logout</span>
      </button>
    </aside>

    <main class="main-content">
      <!-- Welcome Walkthrough Component -->
      <WelcomeWalkthrough 
        v-if="currentStudentData"
        :studentData="currentStudentData"
        @walkthrough-completed="handleWalkthroughCompleted"
      />
      
      <!-- Profile Completion Card Component -->
      <ProfileCompletionCard 
        v-if="currentStudentData"
        :studentData="currentStudentData"
        :profilePhoto="userProfile.profilePhoto"
      />
      
      <router-view />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-bottom-nav">
      <router-link
        to="/student/dashboard"
        :class="['mobile-nav-item', { 'is-active': $route.name === 'StudentDashboardHome' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
        <span>Home</span>
      </router-link>
      <router-link
        to="/student/subjects"
        :class="['mobile-nav-item', { 'is-active': $route.name === 'StudentSubjects' || $route.name === 'TakeQuiz' || $route.name === 'StudentGrades' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
        </svg>
        <span>Subjects</span>
      </router-link>
      <router-link
        to="/student/calendar"
        :class="['mobile-nav-item', { 'is-active': $route.name === 'StudentCalendar' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,13.5H11V18.5H16.5V13.5Z" />
        </svg>
        <span>Calendar</span>
      </router-link>
      <router-link
        to="/student/messages"
        :class="['mobile-nav-item', { 'is-active': $route.name === 'StudentMessages' }]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
        </svg>
        <span>Messages</span>
      </router-link>
    </nav>

    <!-- Floating Help & Support Button -->
    <button class="floating-help-btn" @click="toggleHelpMenu" title="Help & Support">
      <svg v-if="!isHelpMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z" />
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
      </svg>
    </button>

    <!-- Help Menu -->
    <transition name="help-menu">
      <div v-if="isHelpMenuOpen" class="help-menu">
        <div class="help-menu-header">
          <h3>Help & Support</h3>
          <p>How can we assist you today?</p>
        </div>
        <div class="help-menu-items">
          <a href="#" class="help-menu-item" @click.prevent="openGuide">
            <div class="help-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5Z" />
              </svg>
            </div>
            <div class="help-item-content">
              <h4>Student's Guide</h4>
              <p>Learn how to use IntelliGrade effectively</p>
            </div>
          </a>
          <a href="#" class="help-menu-item" @click.prevent="openFAQ">
            <div class="help-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18,15H6L2,19V3A1,1 0 0,1 3,2H18A1,1 0 0,1 19,3V14A1,1 0 0,1 18,15M23,9V23L19,19H8A1,1 0 0,1 7,18V17H20V8H21A1,1 0 0,1 22,9Z" />
              </svg>
            </div>
            <div class="help-item-content">
              <h4>FAQ</h4>
              <p>Find answers to common questions</p>
            </div>
          </a>
          <a href="#" class="help-menu-item" @click.prevent="contactSupport">
            <div class="help-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
              </svg>
            </div>
            <div class="help-item-content">
              <h4>Contact Support</h4>
              <p>Get help from our support team</p>
            </div>
          </a>
          <a href="#" class="help-menu-item" @click.prevent="reportIssue">
            <div class="help-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
              </svg>
            </div>
            <div class="help-item-content">
              <h4>Report an Issue</h4>
              <p>Let us know about any problems</p>
            </div>
          </a>
        </div>
      </div>
    </transition>

    <!-- Logout Confirmation Modal -->
    <div v-if="isLogoutModalVisible" class="modal-overlay" @click="hideLogoutModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <div class="modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,12L11,14.4L15,9.6M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z" />
            </svg>
          </div>
          <h3 class="modal-title">Confirm Logout</h3>
          <p class="modal-message">Are you sure you want to logout from your account?</p>
        </div>
        
        <div class="modal-actions">
          <button @click="hideLogoutModal" class="btn-cancel">
            Cancel
          </button>
          <button @click="confirmLogout" class="btn-confirm">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Logging Out Overlay -->
    <div v-if="isLoggingOut" class="logging-out-overlay">
      <div class="logging-out-content">
        <div class="spinner"></div>
        <p>Logging out...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase.js';
import WelcomeWalkthrough from './student/WelcomeWalkthrough.vue';
import ProfileCompletionCard from './student/ProfileCompletionCard.vue';

export default {
  name: 'StudentDashboard',
  components: {
    WelcomeWalkthrough,
    ProfileCompletionCard
  },
  data() {
    return {
      userProfile: {
        fullName: '',
        studentId: '',
        grade: null,
        strand: null,
        email: '',
        role: '',
        profilePhoto: null,
        schoolYear: '',
        gender: null,
        hasCompletedWalkthrough: false,
        profileCompletionDismissed: false,
        passwordChanged: false
      },
      currentStudentData: null,
      isLogoutModalVisible: false,
      isProfileMenuOpen: false,
      profileSubscription: null,
      studentSubscription: null,
      currentProfileId: null,
      isHelpMenuOpen: false,
      isLoggingOut: false,
      isLoadingProfile: true
    };
  },
  computed: {
    isSeniorHigh() {
      return this.userProfile.grade === 11 || this.userProfile.grade === 12;
    },
    
    schoolLevel() {
      if (!this.userProfile.grade) return '';
      return this.isSeniorHigh ? 'Senior High School' : 'Junior High School';
    },
    
    strandFullName() {
      if (!this.userProfile.strand) return '';
      
      const strandNames = {
        'STEM': 'Science, Technology, Engineering, Mathematics',
        'ABM': 'Accountancy, Business, Management',
        'HUMSS': 'Humanities and Social Sciences',
        'GAS': 'General Academic Strand'
      };
      
      return strandNames[this.userProfile.strand] || this.userProfile.strand;
    },
    
    gradeDisplay() {
      if (!this.userProfile.grade) return 'Grade not set';
      
      if (this.isSeniorHigh && this.userProfile.strand) {
        return `Grade ${this.userProfile.grade} - ${this.userProfile.strand}`;
      }
      
      return `Grade ${this.userProfile.grade}`;
    }
  },
  watch: {
    '$route'(to, from) {
      this.isProfileMenuOpen = false;
      this.isHelpMenuOpen = false;
    }
  },
  async mounted() {
    console.log('========================================');
    console.log('StudentDashboard Component Mounted');
    console.log('========================================');
    
    await this.loadUserProfile();
    this.setupRealtimeSubscription();
    this.initializeDarkMode();
    this.setupEventListeners();
  },
  beforeUnmount() {
    this.cleanupSubscriptions();
    this.removeEventListeners();
  },
  methods: {
    setupEventListeners() {
      window.addEventListener('studentProfileUpdated', this.handleProfileUpdate);
      document.addEventListener('click', this.handleClickOutside);
    },
    
    removeEventListeners() {
      window.removeEventListener('studentProfileUpdated', this.handleProfileUpdate);
      document.removeEventListener('click', this.handleClickOutside);
    },
    
    async loadUserProfile() {
      try {
        this.isLoadingProfile = true;
        console.log('📋 STEP 1: Getting authenticated user...');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('❌ Authentication Error:', authError);
          await this.$router.push('/login');
          return;
        }

        if (!user) {
          console.error('❌ No authenticated user found');
          await this.$router.push('/login');
          return;
        }

        console.log('✅ Authenticated User ID:', user.id);
        console.log('✅ User Email:', user.email);
        
        await this.fetchStudentProfile(user.id);

      } catch (error) {
        console.error('❌ FATAL ERROR in loadUserProfile:', error);
        console.error('Error details:', error.message);
        this.handleProfileError();
      } finally {
        this.isLoadingProfile = false;
      }
    },

    async fetchStudentProfile(userId) {
      try {
        console.log('');
        console.log('📋 STEP 2: Fetching profile from database...');
        console.log('Looking for auth_user_id:', userId);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', userId)
          .single();

        if (profileError) {
          console.error('❌ Profile Query Error:', profileError);
          throw profileError;
        }

        if (!profileData) {
          console.error('❌ No profile data returned from query');
          throw new Error('Profile not found in database');
        }

        console.log('✅ Profile Data Retrieved:', profileData);

        if (profileData.role !== 'student') {
          console.error('❌ Access Denied: User role is', profileData.role, 'not student');
          await this.$router.push('/login');
          return;
        }

        this.currentProfileId = profileData.id;
        console.log('✅ Profile ID stored:', this.currentProfileId);

        console.log('');
        console.log('📋 STEP 3: Fetching student record...');
        console.log('Looking for profile_id:', profileData.id);
        
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select(`
            *,
            school_years:school_year_enrolled(year_name)
          `)
          .eq('profile_id', profileData.id)
          .single();

        if (studentError) {
          console.error('❌ Student Query Error:', studentError);
          throw studentError;
        }

        if (!studentData) {
          console.error('❌ No student data returned from query');
          throw new Error('Student record not found');
        }

        console.log('✅ Student Data Retrieved:', studentData);

        console.log('');
        console.log('📋 STEP 4: Setting userProfile data...');
        
        // Store the complete student data for components
        this.currentStudentData = studentData;
        
        this.userProfile = {
          fullName: studentData.full_name || '',
          email: studentData.email || '',
          studentId: studentData.student_id || '',
          grade: studentData.grade_level,
          strand: studentData.strand || null,
          role: 'student',
          profilePhoto: profileData.profile_photo || null,
          schoolYear: studentData.school_years?.year_name || '',
          gender: studentData.gender || null,
          hasCompletedWalkthrough: studentData.has_completed_walkthrough || false,
          profileCompletionDismissed: studentData.profile_completion_dismissed || false,
          passwordChanged: studentData.password_changed_from_default || false
        };

        console.log('✅ ========================================');
        console.log('✅ USER PROFILE SUCCESSFULLY LOADED');
        console.log('✅ ========================================');
        console.log('Full Name:', this.userProfile.fullName);
        console.log('Student ID:', this.userProfile.studentId);
        console.log('Grade Level:', this.userProfile.grade);
        console.log('Strand:', this.userProfile.strand);
        console.log('School Level:', this.schoolLevel);
        console.log('Is Senior High:', this.isSeniorHigh);
        console.log('School Year:', this.userProfile.schoolYear);
        console.log('Gender:', this.userProfile.gender);
        console.log('Has Completed Walkthrough:', this.userProfile.hasCompletedWalkthrough);
        console.log('Password Changed:', this.userProfile.passwordChanged);
        console.log('Role:', this.userProfile.role);
        console.log('Email:', this.userProfile.email);
        console.log('Profile Photo:', this.userProfile.profilePhoto);
        console.log('========================================');

        await this.$nextTick();
        this.$forceUpdate();

      } catch (error) {
        console.error('');
        console.error('❌ ========================================');
        console.error('❌ ERROR in fetchStudentProfile');
        console.error('❌ ========================================');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        console.error('========================================');
        throw error;
      }
    },

    setupRealtimeSubscription() {
      if (!this.currentProfileId) {
        console.log('⚠️ No profile ID available - skipping real-time subscriptions');
        return;
      }

      console.log('🔔 Setting up real-time subscriptions...');

      this.profileSubscription = supabase
        .channel(`profile_${this.currentProfileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${this.currentProfileId}`
          },
          (payload) => {
            console.log('📢 Profile updated via real-time:', payload);
            if (payload.new) {
              this.userProfile.fullName = payload.new.full_name || this.userProfile.fullName;
              this.userProfile.email = payload.new.email || this.userProfile.email;
              // Explicitly check for profile_photo to avoid setting null
              if (payload.new.profile_photo !== undefined) {
                this.userProfile.profilePhoto = payload.new.profile_photo;
                console.log('✅ Profile photo updated via realtime:', payload.new.profile_photo);
              }
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('Profile subscription status:', status);
        });

      this.studentSubscription = supabase
        .channel(`student_${this.currentProfileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'students',
            filter: `profile_id=eq.${this.currentProfileId}`
          },
          (payload) => {
            console.log('📢 Student data updated via real-time:', payload);
            if (payload.new) {
              this.userProfile.studentId = payload.new.student_id || this.userProfile.studentId;
              this.userProfile.grade = payload.new.grade_level;
              this.userProfile.strand = payload.new.strand || null;
              this.userProfile.gender = payload.new.gender || null;
              this.userProfile.hasCompletedWalkthrough = payload.new.has_completed_walkthrough || false;
              this.userProfile.profileCompletionDismissed = payload.new.profile_completion_dismissed || false;
              this.userProfile.passwordChanged = payload.new.password_changed_from_default || false;
              
              // Update currentStudentData as well
              if (this.currentStudentData) {
                this.currentStudentData = { ...this.currentStudentData, ...payload.new };
              }
              
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('Student subscription status:', status);
        });
    },

    cleanupSubscriptions() {
      console.log('🧹 Cleaning up subscriptions...');
      
      if (this.profileSubscription) {
        try {
          supabase.removeChannel(this.profileSubscription);
          this.profileSubscription = null;
          console.log('✅ Profile subscription removed');
        } catch (error) {
          console.error('❌ Error removing profile subscription:', error);
        }
      }
      
      if (this.studentSubscription) {
        try {
          supabase.removeChannel(this.studentSubscription);
          this.studentSubscription = null;
          console.log('✅ Student subscription removed');
        } catch (error) {
          console.error('❌ Error removing student subscription:', error);
        }
      }
    },

    handleProfileError() {
      console.error('⚠️ Setting error state in userProfile');
      this.userProfile = {
        fullName: 'Error Loading',
        email: 'Check Console',
        studentId: 'ERROR',
        grade: null,
        strand: null,
        role: 'student',
        profilePhoto: null
      };
      this.$forceUpdate();
    },

    initializeDarkMode() {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === 'true') {
        document.documentElement.classList.add('dark');
      }
    },

    showLogoutModal() {
      this.isLogoutModalVisible = true;
      document.body.style.overflow = 'hidden';
    },

    hideLogoutModal() {
      this.isLogoutModalVisible = false;
      document.body.style.overflow = '';
    },

    async confirmLogout() {
      console.log('🚪 Starting logout process...');
      
      this.isLogoutModalVisible = false;
      document.body.style.overflow = '';
      this.isLoggingOut = true;
      
      try {
        console.log('Step 1: Cleaning up subscriptions');
        this.cleanupSubscriptions();
        
        console.log('Step 2: Removing event listeners');
        this.removeEventListeners();
        
        console.log('Step 3: Signing out from Supabase');
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        
        if (error) {
          console.error('❌ Logout error:', error);
          throw error;
        }
        
        console.log('✅ Logout successful');
        
        console.log('Step 4: Clearing storage');
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Step 5: Redirecting to login');
        window.location.href = '/login';
        
      } catch (error) {
        console.error('❌ Error during logout:', error);
        localStorage.clear();
        sessionStorage.clear();
        this.isLoggingOut = false;
        window.location.href = '/login';
      }
    },

    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
      if (this.isProfileMenuOpen) {
        this.isHelpMenuOpen = false;
      }
    },

    closeProfileMenu() {
      this.isProfileMenuOpen = false;
    },

    async handleLogout() {
      this.closeProfileMenu();
      await this.$nextTick();
      this.showLogoutModal();
    },

    handleClickOutside(event) {
      const profileDropdown = this.$el?.querySelector('.profile-dropdown');
      const profileMenuBtn = this.$el?.querySelector('.profile-menu-btn');
      
      if (this.isProfileMenuOpen && profileDropdown && profileMenuBtn &&
          !profileDropdown.contains(event.target) && 
          !profileMenuBtn.contains(event.target)) {
        this.closeProfileMenu();
      }
      
      const helpMenu = this.$el?.querySelector('.help-menu');
      const helpBtn = this.$el?.querySelector('.floating-help-btn');
      
      if (this.isHelpMenuOpen && helpMenu && helpBtn &&
          !helpMenu.contains(event.target) && 
          !helpBtn.contains(event.target)) {
        this.isHelpMenuOpen = false;
      }
    },

    toggleHelpMenu() {
      this.isHelpMenuOpen = !this.isHelpMenuOpen;
      if (this.isHelpMenuOpen) {
        this.isProfileMenuOpen = false;
      }
    },

    openGuide() {
      console.log('Opening Student Guide...');
      this.isHelpMenuOpen = false;
    },

    openFAQ() {
      console.log('Opening FAQ...');
      this.isHelpMenuOpen = false;
    },

    contactSupport() {
      console.log('Opening Contact Support...');
      this.isHelpMenuOpen = false;
    },

    reportIssue() {
      console.log('Opening Report Issue...');
      this.isHelpMenuOpen = false;
    },

    handleProfileUpdate(event) {
      console.log('📢 Handling profile update event:', event.detail);
      const { 
        gradeChanged, 
        nameChanged, 
        studentIdChanged, 
        strandChanged,
        photoChanged,
        newGrade, 
        newName, 
        newStudentId,
        newStrand,
        newPhoto
      } = event.detail || {};
      
      if (gradeChanged && newGrade !== undefined) {
        this.userProfile.grade = newGrade;
      }
      if (nameChanged && newName) {
        this.userProfile.fullName = newName;
      }
      if (studentIdChanged && newStudentId) {
        this.userProfile.studentId = newStudentId;
      }
      if (strandChanged !== undefined) {
        this.userProfile.strand = newStrand || null;
      }
      if (photoChanged && newPhoto !== undefined) {
        this.userProfile.profilePhoto = newPhoto;
        console.log('✅ Profile photo updated:', newPhoto);
      }
      
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    
    handleWalkthroughCompleted() {
      console.log('🎉 Walkthrough completed!');
      this.userProfile.hasCompletedWalkthrough = true;
      
      // Update currentStudentData as well
      if (this.currentStudentData) {
        this.currentStudentData.has_completed_walkthrough = true;
      }
      
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    }
  }
};
</script>

<style scoped>
/*
 * Imported fonts
 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/*
 * Student Dashboard Styles - Enhanced with better loading states
 */
.dashboard-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  font-size: 1.15rem;
}

.dashboard-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(61, 141, 122, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(179, 216, 168, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(163, 209, 198, 0.01) 0%, transparent 50%);
  z-index: 0;
  pointer-events: none;
}

.sidebar {
  width: 300px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  box-shadow: 
    0 8px 32px var(--shadow-medium),
    0 0 0 1px var(--border-color);
  overflow-y: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.user-info {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-accent);
  border-radius: 16px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-pic-container {
  margin-bottom: 0.75rem;
}

.profile-pic-placeholder {
  width: 60px;
  height: 60px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px var(--shadow-strong);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-pic-placeholder svg {
  width: 32px;
  height: 32px;
}

.user-details {
  width: 100%;
}

.user-info h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
  word-break: break-word;
  line-height: 1.2;
  min-height: 1.5rem;
}

.user-name {
  color: var(--accent-color);
  font-weight: 700;
}

.loading-text {
  color: var(--text-secondary);
  opacity: 0.7;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-name-text {
  color: var(--text-muted);
  opacity: 0.6;
  font-style: italic;
  font-weight: 500;
}

.user-info .role {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-accent);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
}

.user-info .gender {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-accent);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
  opacity: 0.85;
}

.user-info .grade {
  font-size: 0.85rem;
  color: var(--accent-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  word-break: break-word;
  min-height: 1rem;
}

.grade-missing {
  color: var(--text-muted) !important;
  opacity: 0.7;
  font-style: italic;
}

.grade-skeleton,
.student-id-skeleton {
  height: 1rem;
  background: var(--border-color);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.student-id-skeleton {
  height: 0.8rem;
  width: 80%;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.user-info .student-id {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0;
  opacity: 0.8;
  word-break: break-word;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  min-height: 0.8rem;
}

.user-info .school-year {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0.4rem 0;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  display: inline-block;
}

.student-id-missing {
  color: var(--text-muted) !important;
  opacity: 0.6;
  font-style: italic;
}

.nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-accent);
  border: 1px solid var(--border-color);
  cursor: pointer;
  width: 100%;
  text-align: left;
  position: relative;
  overflow: hidden;
  margin: 0;
  box-shadow: none;
  line-height: 1;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(179, 216, 168, 0.3) 0%, rgba(163, 209, 198, 0.2) 100%);
  transition: left 0.3s ease;
  z-index: 0;
}

.nav-item svg {
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  fill: #3D8D7A;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.nav-item span {
  position: relative;
  z-index: 1;
}

.nav-item:hover {
  transform: none;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  border-color: rgba(61, 141, 122, 0.15);
}

.nav-item:hover::before {
  left: 0;
}

.nav-item.is-active {
  background: rgba(95, 179, 160, 0.12);
  border-color: rgba(95, 179, 160, 0.3);
  box-shadow: 0 2px 8px rgba(95, 179, 160, 0.1);
  color: var(--accent-color);
  transform: none;
}

.nav-item.is-active svg {
  fill: var(--accent-color);
}

.nav-item.is-active span {
  color: var(--accent-color);
  font-weight: 600;
}

:root.dark .nav-item.is-active {
  background: rgba(95, 179, 160, 0.15);
  border-color: rgba(95, 179, 160, 0.35);
  box-shadow: 0 2px 8px rgba(95, 179, 160, 0.15);
}

.logout-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: var(--text-inverse);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--accent-color);
  border: 1px solid var(--accent-color);
  cursor: pointer;
  width: 100%;
  text-align: left;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;
  box-shadow: none;
  line-height: 1;
  gap: 0.75rem;
  justify-content: flex-start;
  box-sizing: border-box;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
}

.logout-btn:hover {
  background: var(--accent-hover);
  color: var(--text-inverse);
  border-color: var(--accent-hover);
  transform: none;
  box-shadow: 0 2px 8px rgba(24, 60, 46, 0.1);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: transparent;
  min-width: 0;
  position: relative;
  z-index: 1;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: modalSlideIn 0.3s ease-out;
  text-align: center;
}

:root.dark .modal-container {
  background: rgba(30, 35, 34, 0.95);
  border: 1px solid rgba(95, 179, 160, 0.2);
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(95, 179, 160, 0.1);
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #5FB3A0 0%, #A3D1C6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 4px 20px rgba(95, 179, 160, 0.3);
}

.modal-icon svg {
  width: 40px;
  height: 40px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.modal-message {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 110px;
  outline: none;
}

.btn-cancel {
  background: rgba(95, 179, 160, 0.1);
  color: var(--accent-color);
  border: 1.5px solid rgba(95, 179, 160, 0.3);
}

.btn-cancel:hover {
  background: rgba(95, 179, 160, 0.15);
  border-color: var(--accent-color);
}

.btn-confirm {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 8px rgba(95, 179, 160, 0.25);
}

.btn-confirm:hover {
  background: var(--accent-hover);
  box-shadow: 0 4px 12px rgba(95, 179, 160, 0.3);
}

:root.dark .btn-cancel {
  background: rgba(95, 179, 160, 0.1);
  color: var(--accent-color);
  border: 1.5px solid rgba(95, 179, 160, 0.3);
}

:root.dark .btn-cancel:hover {
  background: rgba(95, 179, 160, 0.18);
  border-color: var(--accent-color);
}

:root.dark .btn-confirm {
  background: var(--accent-color);
  color: white;
}

:root.dark .btn-cancel:hover {
  background: rgba(95, 179, 160, 0.2);
  border-color: var(--accent-color);
}

:root.dark .btn-confirm {
  background: var(--accent-color);
  color: white;
}

:root.dark .modal-title {
  color: var(--text-primary);
}

:root.dark .modal-message {
  color: var(--text-secondary);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { 
    opacity: 0; 
    transform: translateY(-30px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

/*
 * Responsive styles for mobile-first design
 */

/* Hide desktop sidebar on mobile */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
}

/* Show desktop sidebar only on larger screens */
@media (min-width: 769px) {
  .mobile-header,
  .mobile-bottom-nav,
  .profile-dropdown {
    display: none !important;
  }
}

/* Mobile Header Styles */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  box-shadow: 0 2px 12px var(--shadow-light);
}

@media (max-width: 768px) {
  .mobile-header {
    display: flex;
  }
  
  .dashboard-container {
    padding-top: 70px;
    padding-bottom: 80px;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-left .profile-pic-container {
  margin-bottom: 0;
}

.header-left .profile-photo-placeholder {
  width: 40px;
  height: 40px;
}

.header-left .profile-photo-placeholder svg {
  width: 20px;
  height: 20px;
}

.header-left .user-details {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.header-left .user-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.header-left .no-name-text {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.2;
}

.header-left .grade {
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-menu-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: var(--bg-accent);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.profile-menu-btn:hover {
  background: var(--accent-color);
  color: white;
  transform: scale(1.05);
}

/* Profile Dropdown Styles */
.profile-dropdown {
  position: fixed;
  top: 70px;
  right: 1rem;
  width: 280px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--shadow-medium);
  z-index: 99;
  overflow: hidden;
}

.profile-dropdown-content {
  padding: 1rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.profile-pic-large {
  flex-shrink: 0;
}

.profile-photo-placeholder-large {
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profile-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
}

.role-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.gender-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0.25rem 0 0 0;
  opacity: 0.85;
}

.grade-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0.25rem 0 0 0;
}

.student-id-text {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
}

.school-year-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-color);
  margin: 0.25rem 0;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.profile-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: var(--bg-accent);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.9rem;
}

.profile-action:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.logout-action:hover {
  background: #dc3545;
  border-color: #dc3545;
}

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--card-background);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -2px 12px var(--shadow-light);
}

@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 12px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  min-height: 60px;
  justify-content: center;
  flex: 1;
  max-width: 80px;
}

.mobile-nav-item svg {
  transition: all 0.2s ease;
}

.mobile-nav-item span {
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

.mobile-nav-item:hover {
  color: var(--accent-color);
  background: rgba(95, 179, 160, 0.1);
}

.mobile-nav-item.is-active {
  color: var(--accent-color);
  background: rgba(95, 179, 160, 0.15);
}

.mobile-nav-item.is-active svg {
  fill: var(--accent-color);
}

/* Profile Menu Transitions */
.profile-menu-enter-active,
.profile-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-menu-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.profile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Main content adjustments for mobile */
@media (max-width: 768px) {
  .main-content {
    padding-top: 0;
    height: calc(100vh - 150px);
    overflow-y: auto;
  }
}

/* iPhone 12 Pro specific optimizations */
@media (max-width: 390px) {
  .mobile-header {
    padding: 0 0.75rem;
  }
  
  .header-left .user-name,
  .header-left .no-name-text {
    font-size: 0.9rem;
  }
  
  .header-left .grade {
    font-size: 0.7rem;
  }
  
  .profile-dropdown {
    width: calc(100vw - 1.5rem);
    right: 0.75rem;
  }
  
  .mobile-nav-item span {
    font-size: 0.65rem;
  }
  
  .mobile-bottom-nav {
    padding: 0.25rem 0.5rem;
  }
}

/* Floating Help Button */
.floating-help-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--accent-color);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px var(--shadow-strong);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
}

.floating-help-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px var(--shadow-strong);
  background: var(--accent-hover);
}

.floating-help-btn:active {
  transform: scale(0.95);
}

/* Help Menu */
.help-menu {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 320px;
  background: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--shadow-strong);
  border: 1px solid var(--border-color);
  overflow: hidden;
  z-index: 998;
}

.help-menu-header {
  padding: 1.5rem;
  background: var(--bg-accent);
  border-bottom: 1px solid var(--border-color);
}

.help-menu-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.help-menu-header p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.help-menu-items {
  padding: 0.5rem;
}

.help-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.help-menu-item:last-child {
  margin-bottom: 0;
}

.help-menu-item:hover {
  background: var(--bg-accent);
}

.help-item-icon {
  width: 40px;
  height: 40px;
  background: var(--accent-color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.help-item-content {
  flex: 1;
}

.help-item-content h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.help-item-content p {
  font-size: 0.813rem;
  color: var(--text-muted);
  margin: 0;
}

/* Help Menu Transitions */
.help-menu-enter-active,
.help-menu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.help-menu-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.help-menu-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile floating help button adjustments */
@media (max-width: 768px) {
  .floating-help-btn {
    bottom: 10rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
  }
  
  .help-menu {
    bottom: 12rem;
    right: 1.5rem;
    left: 1.5rem;
    width: auto;
  }
}

@media (max-width: 480px) {
  .floating-help-btn {
    bottom: 10rem;
    right: 1rem;
    width: 52px;
    height: 52px;
  }
  
  .help-menu {
    bottom: 12rem;
    right: 1rem;
    left: 1rem;
  }
}

/* Logging Out Overlay */
.logging-out-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

.logging-out-content {
  text-align: center;
  color: white;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.logging-out-content p {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}
</style>

<style>
/* Global styles - same as teacher dashboard */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

/* CSS Variables for consistent theming */
:root {
  /* Light mode colors */
  --bg-primary: #f8faf9;
  --bg-secondary: #fefefe;
  --bg-accent: #f3f7f4;
  --bg-accent-hover: #e9f5ee;
  
  --card-background: #ffffff;
  --card-background-hover: #f8faf9;
  
  --accent-color: #33806b;
  --accent-hover: #2d6a57;
  --accent-light: #5FB3A0;
  --accent-lighter: #A3D1C6;
  
  --text-primary: #1a1a1a;
  --text-secondary: #3d8d7a;
  --text-muted: #7a9c8f;
  --text-inverse: #ffffff;
  
  --border-color: rgba(61, 141, 122, 0.12);
  --border-hover: rgba(61, 141, 122, 0.2);
  
  --shadow-light: rgba(61, 141, 122, 0.05);
  --shadow-medium: rgba(61, 141, 122, 0.1);
  --shadow-strong: rgba(61, 141, 122, 0.2);
}

/* Dark mode colors */
:root.dark {
  --bg-primary: #181c20;
  --bg-secondary: #23272b;
  --bg-accent: #23272b;
  --bg-accent-hover: #23272b;
  
  --card-background: #23272b;
  --card-background-hover: #181c20;
  
  --accent-color: #5FB3A0;
  --accent-hover: #33806b;
  --accent-light: #7BC4B5;
  --accent-lighter: #A3D1C6;
  
  --text-primary: #f0f0f0;
  --text-secondary: #A3D1C6;
  --text-muted: #7a9c8f;
  --text-inverse: #ffffff;
  
  --border-color: rgba(95, 179, 160, 0.15);
  --border-hover: rgba(95, 179, 160, 0.25);
  
  --shadow-light: rgba(0, 0, 0, 0.1);
  --shadow-medium: rgba(0, 0, 0, 0.2);
  --shadow-strong: rgba(0, 0, 0, 0.3);
}

.profile-photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 16px var(--shadow-strong);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-photo-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3D8D7A 0%, #5FB3A0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px var(--shadow-strong);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-photo-placeholder svg {
  width: 32px;
  height: 32px;
}

/* Update mobile responsive styles for profile photo */
@media (max-width: 768px) {
  .profile-photo,
  .profile-photo-placeholder {
    width: 50px;
    height: 50px;
  }
  
  .profile-photo-placeholder svg {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .profile-photo,
  .profile-photo-placeholder {
    width: 40px;
    height: 40px;
  }
  
  .profile-photo-placeholder svg {
    width: 24px;
    height: 24px;
  }
}

/* ============================================
   STRAND DISPLAY STYLES - ADD TO <style scoped>
   ============================================ */

/* Sidebar Grade with Strand Inline */
.user-info .grade {
  font-size: 0.85rem;
  color: var(--accent-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  word-break: break-word;
  min-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.strand-inline {
  color: var(--accent-light);
  font-weight: 600;
}

/* School Level Indicator */
.school-level {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

/* Mobile Header Grade with Strand Badge */
.header-left .grade {
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.strand-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(95, 179, 160, 0.2);
}

/* Profile Dropdown Strand Display */
.grade-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0.25rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.strand-text {
  color: var(--accent-light);
  font-weight: 600;
}

/* ============================================
   RESPONSIVE STYLES FOR MOBILE
   ============================================ */

/* Small Mobile Devices */
@media (max-width: 480px) {
  .strand-badge {
    font-size: 0.65rem;
    padding: 0.12rem 0.4rem;
  }
  
  .strand-inline {
    font-size: 0.8rem;
  }
}

/* iPhone 12 Pro and Similar */
@media (max-width: 390px) {
  .header-left .grade {
    font-size: 0.7rem;
  }
  
  .strand-badge {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }
}

/* ============================================
   DARK MODE ENHANCEMENTS (Optional)
   ============================================ */

:root.dark .strand-badge {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  box-shadow: 0 2px 4px rgba(95, 179, 160, 0.3);
}

:root.dark .strand-inline {
  color: var(--accent-light);
}

:root.dark .strand-text {
  color: var(--accent-light);
}

:root.dark .school-level {
  color: var(--text-muted);
  opacity: 0.9;
}
</style>