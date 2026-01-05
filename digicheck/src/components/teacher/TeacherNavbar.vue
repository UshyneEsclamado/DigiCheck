<template>
  <nav class="teacher-navbar">
    <div class="navbar-content">
      <!-- Left: Logo and Brand -->
      <div class="navbar-left">
        <div class="brand-logo">
          <img src="@/assets/LOGO WAY BG.png" alt="IntelliGrade" class="logo-img" />
          <span class="brand-name">IntelliGrade</span>
        </div>
      </div>
      
      <!-- Center: Navigation Links -->
      <div class="navbar-center">
        <router-link 
          to="/teacher/dashboard" 
          class="nav-item"
          :class="{ 'active': isActive('/teacher/dashboard') }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link 
          to="/teacher/subjects" 
          class="nav-item"
          :class="{ 'active': isActive('/teacher/subjects') }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
          </svg>
          <span>Classes</span>
        </router-link>
        
        <router-link 
          to="/teacher/gradebook" 
          class="nav-item"
          :class="{ 'active': isActive('/teacher/gradebook') }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3Z" />
          </svg>
          <span>Gradebook</span>
        </router-link>
        
        <router-link 
          to="/teacher/analytics" 
          class="nav-item"
          :class="{ 'active': isActive('/teacher/analytics') }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
          </svg>
          <span>Analytics</span>
        </router-link>
        
        <router-link 
          to="/teacher/messages" 
          class="nav-item"
          :class="{ 'active': isActive('/teacher/messages') }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18"/>
          </svg>
          <span>Messages</span>
        </router-link>
      </div>
      
      <!-- Right: Actions and Profile -->
      <div class="navbar-right">
        <!-- Notification Bell -->
        <div class="notif-wrapper">
          <button class="nav-icon-btn" @click="toggleNotifications" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21" />
            </svg>
            <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </button>
          
          <!-- Notification Dropdown -->
          <transition name="dropdown">
            <div v-if="showNotifications" class="notification-dropdown">
              <div class="dropdown-header">
                <h3>Notifications</h3>
                <button v-if="notificationCount > 0" @click="clearNotifications" class="clear-all-btn">Clear all</button>
              </div>
              <div class="notification-list">
                <div v-if="notificationCount === 0" class="no-notifications">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                    <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.19 14,4.29 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19Z" />
                  </svg>
                  <p>No new notifications</p>
                </div>
                <div v-for="notif in notifications" :key="notif.id" class="notification-item">
                  <div class="notif-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                    </svg>
                  </div>
                  <div class="notif-content">
                    <h4>{{ notif.title }}</h4>
                    <p>{{ notif.message }}</p>
                    <span class="notif-time">{{ notif.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- Settings -->
        <router-link 
          to="/teacher/settings" 
          class="nav-icon-btn"
          :class="{ 'active': isActive('/teacher/settings') }"
          aria-label="Settings"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.56,6.23C16.04,5.82 15.5,5.47 14.87,5.19L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.19C8.5,5.47 7.96,5.82 7.44,6.23L4.9,5.12C4.71,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.71,18.97 4.9,18.88L7.44,17.77C7.96,18.18 8.5,18.53 9.13,18.81L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.81C15.5,18.53 16.04,18.18 16.56,17.77L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
        </router-link>
        
        <!-- User Profile -->
        <div class="user-profile-wrapper">
          <div class="user-profile" @click="toggleProfileMenu">
            <div class="user-avatar">
              <img 
                v-if="profilePic" 
                :src="profilePic" 
                :alt="fullName" 
                class="avatar-img"
                @error="handleImageError"
              >
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
            <span class="user-name">{{ fullName }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="dropdown-arrow">
              <path d="M7,10L12,15L17,10H7Z" />
            </svg>
          </div>
          
          <!-- Profile Dropdown -->
          <transition name="dropdown">
            <div v-if="showProfileMenu" class="profile-dropdown">
              <div class="dropdown-header profile-info">
                <div class="profile-avatar-large">
                  <img 
                    v-if="profilePic" 
                    :src="profilePic" 
                    :alt="fullName" 
                    class="avatar-img"
                  >
                  <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </div>
                <div class="profile-details">
                  <h4>{{ fullName }}</h4>
                  <p>{{ email }}</p>
                  <span class="role-badge" :class="{ 'dual-role': isAdmin }">
                    {{ isAdmin ? 'Admin • Teacher' : 'Teacher' }}
                  </span>
                </div>
              </div>
              
              <div class="dropdown-divider"></div>
              
              <div class="dropdown-menu">
                <!-- Admin Dashboard Link (if user is admin) -->
                <router-link 
                  v-if="isAdmin" 
                  to="/admin/dashboard" 
                  class="dropdown-item admin-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span>Switch to Admin Dashboard</span>
                </router-link>

                <router-link to="/teacher/settings" class="dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.56,6.23C16.04,5.82 15.5,5.47 14.87,5.19L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.19C8.5,5.47 7.96,5.82 7.44,6.23L4.9,5.12C4.71,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.71,18.97 4.9,18.88L7.44,17.77C7.96,18.18 8.5,18.53 9.13,18.81L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.81C15.5,18.53 16.04,18.18 16.56,17.77L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                  </svg>
                  <span>Profile & Settings</span>
                </router-link>
                
                <button @click="handleLogout" class="dropdown-item logout-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <transition name="modal">
      <div v-if="showLogoutModal" class="modal-overlay" @click="closeLogoutModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
            </div>
            <h3 class="modal-title">Confirm Logout</h3>
            <p class="modal-message">Are you sure you want to logout from your account?</p>
          </div>
          
          <div class="modal-actions">
            <button @click="closeLogoutModal" class="btn-cancel" :disabled="isLoggingOut">
              Cancel
            </button>
            <button @click="confirmLogout" class="btn-confirm" :disabled="isLoggingOut">
              <span v-if="!isLoggingOut">Yes, Logout</span>
              <span v-else class="loading-text">
                <div class="logout-spinner"></div>
                Logging out...
              </span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../../supabase.js'
import { useTeacherAuth } from '../../composables/useTeacherAuth.js'

const route = useRoute()

// Auth composable
const { teacherProfile, teacherInfo } = useTeacherAuth()

// State
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)
const notifications = ref([])

// Computed
const fullName = computed(() => {
  return teacherProfile.value?.full_name || 'Teacher'
})

const email = computed(() => {
  return teacherProfile.value?.email || ''
})

const profilePic = computed(() => {
  return teacherInfo.value?.profile_pic || null
})

const isAdmin = computed(() => {
  return teacherProfile.value?.role === 'admin'
})

const notificationCount = computed(() => notifications.value.length)

// Methods
const isActive = (path) => {
  if (path === '/teacher/dashboard') {
    return route.path === path || route.name === 'TeacherDashboardHome'
  }
  return route.path.startsWith(path)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showProfileMenu.value) showProfileMenu.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  if (showNotifications.value) showNotifications.value = false
}

const clearNotifications = () => {
  notifications.value = []
}

const handleImageError = () => {
  // Image loading failed, will show default avatar SVG
  console.warn('Failed to load profile image')
}

const handleLogout = () => {
  showProfileMenu.value = false
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  if (!isLoggingOut.value) {
    showLogoutModal.value = false
  }
}

const confirmLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  supabase.auth.signOut().catch(err => console.log('Signout error:', err))
  
  // Immediate redirect - no waiting!
  setTimeout(() => {
    window.location.assign('/login')
  }, 100)
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.notif-wrapper')) {
    showNotifications.value = false
  }
  if (!event.target.closest('.user-profile-wrapper')) {
    showProfileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.teacher-navbar {
  width: 100%;
  background: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 8px var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

/* Left Section */
.navbar-left {
  display: flex;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent-color);
  letter-spacing: -0.02em;
}

/* Center Section */
.navbar-center {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-accent);
  color: var(--accent-color);
}

.nav-item.active {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 8px rgba(95, 179, 160, 0.25);
}

.nav-item svg {
  flex-shrink: 0;
}

/* Right Section */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-icon-btn:hover {
  background: var(--bg-accent);
  color: var(--accent-color);
}

.nav-icon-btn.active {
  background: var(--bg-accent);
  color: var(--accent-color);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Dropdowns */
.notif-wrapper,
.user-profile-wrapper {
  position: relative;
}

.notification-dropdown,
.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 360px;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--shadow-strong);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  padding: 1rem 1.25rem;
  background: var(--bg-accent);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: rgba(95, 179, 160, 0.1);
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-muted);
}

.no-notifications svg {
  margin-bottom: 1rem;
}

.no-notifications p {
  font-size: 0.95rem;
  margin: 0;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
  cursor: pointer;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: var(--bg-accent);
}

.notif-icon {
  width: 36px;
  height: 36px;
  background: var(--accent-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.notif-content p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-profile:hover {
  background: var(--bg-accent);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

/* Profile Dropdown */
.profile-dropdown {
  width: 320px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
}

.profile-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-details {
  flex: 1;
  min-width: 0;
}

.profile-details h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-details p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: var(--accent-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
}

.role-badge.dual-role {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  padding: 0.3rem 0.75rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
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
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--bg-accent);
  color: var(--accent-color);
}

.dropdown-item.logout-btn {
  color: #ef4444;
}

.dropdown-item.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.dropdown-item.admin-link {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1), rgba(45, 106, 90, 0.1));
  border: 1px solid rgba(61, 141, 122, 0.3);
  color: #3D8D7A;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.dropdown-item.admin-link:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.2), rgba(45, 106, 90, 0.2));
  border-color: #3D8D7A;
  color: #2d6a5a;
  transform: translateX(4px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-container {
  background: var(--card-background);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px var(--shadow-strong);
  border: 1px solid var(--border-color);
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-light));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  box-shadow: 0 4px 20px rgba(95, 179, 160, 0.3);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.modal-message {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 110px;
}

.btn-cancel {
  background: rgba(95, 179, 160, 0.1);
  color: var(--accent-color);
  border: 1.5px solid rgba(95, 179, 160, 0.3);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(95, 179, 160, 0.15);
  border-color: var(--accent-color);
}

.btn-confirm {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 8px rgba(95, 179, 160, 0.25);
}

.btn-confirm:hover:not(:disabled) {
  background: var(--accent-hover);
  box-shadow: 0 4px 12px rgba(95, 179, 160, 0.3);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.logout-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(-20px);
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar-center {
    gap: 0.25rem;
  }
  
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    padding: 0.625rem;
  }
  
  .user-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 1rem;
    height: 60px;
  }
  
  .brand-name {
    display: none;
  }
  
  .notification-dropdown,
  .profile-dropdown {
    width: calc(100vw - 2rem);
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}
</style>
