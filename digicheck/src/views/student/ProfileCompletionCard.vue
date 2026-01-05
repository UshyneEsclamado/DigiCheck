<template>
  <transition name="slide-down">
    <div v-if="shouldShowCard" class="profile-completion-card">
      <div class="card-header">
        <div class="header-left">
          <div class="icon-container">
            <svg v-if="completionPercentage < 100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
            </svg>
          </div>
          <div class="header-text">
            <h3>{{ cardTitle }}</h3>
            <p>{{ cardSubtitle }}</p>
          </div>
        </div>
        <button @click="dismissCard" class="dismiss-btn" :disabled="isComplete">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: completionPercentage + '%' }"></div>
        </div>
        <span class="progress-text">{{ completionPercentage }}% Complete</span>
      </div>

      <div class="checklist">
        <div 
          v-for="item in checklistItems" 
          :key="item.key"
          :class="['checklist-item', { 'completed': item.isComplete }]"
        >
          <div class="checkbox">
            <svg v-if="item.isComplete" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
          </div>
          <div class="item-content">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-description">{{ item.description }}</span>
          </div>
          <button 
            v-if="!item.isComplete && item.actionRoute" 
            @click.stop="navigateTo(item.actionRoute)"
            class="action-btn"
            type="button"
          >
            {{ item.actionText }}
          </button>
        </div>
      </div>

      <!-- Celebration Confetti -->
      <div v-if="showCelebration" class="celebration-overlay">
        <div class="celebration-content">
          <div class="confetti">🎉</div>
          <h2>Profile Complete!</h2>
          <p>You're all set to start using DigiCheck</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { supabase } from '../../supabase.js';

export default {
  name: 'ProfileCompletionCard',
  props: {
    studentData: {
      type: Object,
      required: true
    },
    profilePhoto: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isDismissed: false,
      showCelebration: false,
      hasProfilePhoto: false,
      hasChangedPassword: false,
      hasSetGender: false
    };
  },
  computed: {
    checklistItems() {
      return [
        {
          key: 'photo',
          title: 'Profile Photo',
          description: 'Upload your profile picture',
          isComplete: this.hasProfilePhoto,
          actionRoute: '/student/settings',
          actionText: 'Upload'
        },
        {
          key: 'password',
          title: 'Change Password',
          description: 'Update your default password',
          isComplete: this.hasChangedPassword,
          actionRoute: '/student/settings',
          actionText: 'Change'
        },
        {
          key: 'gender',
          title: 'Set Gender',
          description: 'Required by school (Male/Female)',
          isComplete: this.hasSetGender,
          actionRoute: '/student/settings',
          actionText: 'Set'
        }
      ];
    },
    completionPercentage() {
      const total = this.checklistItems.length;
      const completed = this.checklistItems.filter(item => item.isComplete).length;
      return Math.round((completed / total) * 100);
    },
    isComplete() {
      return this.completionPercentage === 100;
    },
    cardTitle() {
      return this.isComplete 
        ? '✨ Profile Complete!' 
        : '👋 Complete Your Profile';
    },
    cardSubtitle() {
      return this.isComplete
        ? 'Your profile is all set up!'
        : 'Help us personalize your experience';
    },
    shouldShowCard() {
      // Don't show if dismissed (unless complete)
      if (this.isDismissed && !this.isComplete) return false;
      
      // Always show if incomplete
      if (!this.isComplete) return true;
      
      // Show celebration for 5 seconds if just completed
      if (this.isComplete && this.showCelebration) return true;
      
      // Hide after celebration
      return false;
    }
  },
  watch: {
    isComplete(newVal) {
      if (newVal && !this.showCelebration) {
        this.triggerCelebration();
      }
    },
    studentData: {
      handler() {
        this.updateCompletionStatus();
      },
      deep: true
    },
    profilePhoto() {
      this.hasProfilePhoto = !!this.profilePhoto;
    }
  },
  mounted() {
    this.loadCompletionStatus();
  },
  methods: {
    async loadCompletionStatus() {
      try {
        // Check if card was dismissed
        this.isDismissed = this.studentData.profile_completion_dismissed || false;
        
        // Update completion statuses
        this.updateCompletionStatus();
      } catch (error) {
        console.error('Error loading completion status:', error);
      }
    },
    
    updateCompletionStatus() {
      this.hasProfilePhoto = !!this.profilePhoto;
      this.hasChangedPassword = this.studentData.password_changed_from_default || false;
      this.hasSetGender = !!this.studentData.gender;
    },
    
    async dismissCard() {
      if (this.isComplete) return; // Can't dismiss when complete
      
      try {
        const { error } = await supabase
          .from('students')
          .update({ profile_completion_dismissed: true })
          .eq('id', this.studentData.id);
        
        if (error) throw error;
        
        this.isDismissed = true;
      } catch (error) {
        console.error('Error dismissing card:', error);
      }
    },
    
    navigateTo(route) {
      console.log('📍 Navigating to:', route);
      try {
        this.$router.push(route);
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback to window.location if router fails
        window.location.href = route;
      }
    },
    
    triggerCelebration() {
      this.showCelebration = true;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        this.showCelebration = false;
        
        // Update dismissed status after celebration
        setTimeout(() => {
          this.isDismissed = true;
        }, 500);
      }, 5000);
    }
  }
};
</script>

<style scoped>
.profile-completion-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px var(--shadow-light);
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.header-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-container {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.header-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.header-text p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.dismiss-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.dismiss-btn:hover:not(:disabled) {
  background: var(--bg-accent);
  color: var(--text-primary);
}

.dismiss-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.progress-bar-container {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: var(--bg-accent);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color) 0%, var(--accent-light) 100%);
  border-radius: 8px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent-color);
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-accent);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.checklist-item.completed {
  background: rgba(95, 179, 160, 0.1);
  border-color: rgba(95, 179, 160, 0.3);
}

.checkbox {
  flex-shrink: 0;
  color: var(--text-muted);
}

.checklist-item.completed .checkbox {
  color: var(--accent-color);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.item-description {
  font-size: 0.813rem;
  color: var(--text-muted);
}

.action-btn {
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

/* Celebration Overlay */
.celebration-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(95, 179, 160, 0.95) 0%, rgba(163, 209, 198, 0.95) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  animation: fadeIn 0.3s ease-out;
}

.celebration-content {
  text-align: center;
  color: white;
}

.confetti {
  font-size: 4rem;
  animation: bounce 0.6s ease-in-out infinite;
}

.celebration-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.celebration-content p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .profile-completion-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dismiss-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .icon-container {
    width: 40px;
    height: 40px;
  }
  
  .header-text h3 {
    font-size: 1.1rem;
  }
  
  .checklist-item {
    flex-wrap: wrap;
  }
  
  .action-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>