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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.profile-completion-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
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

.profile-completion-card::before {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex: 1;
}

.icon-container {
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

.header-text h3 {
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.35rem 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.header-text p {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
}

.dismiss-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.dismiss-btn:hover:not(:disabled) {
  background: rgba(226, 232, 240, 0.9);
  color: #1e293b;
  transform: scale(1.05);
}

.dismiss-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.progress-bar-container {
  margin-bottom: 1.75rem;
}

.progress-bar {
  height: 10px;
  background: rgba(226, 232, 240, 0.6);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3D8D7A 0%, #5fb3a0 100%);
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.3);
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.2px;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checklist-item:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateX(4px);
}

.checklist-item.completed {
  background: rgba(95, 179, 160, 0.08);
  border-color: rgba(95, 179, 160, 0.4);
}

.checklist-item.completed:hover {
  background: rgba(95, 179, 160, 0.12);
  border-color: rgba(61, 141, 122, 0.5);
}

.checkbox {
  flex-shrink: 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checklist-item.completed .checkbox {
  color: #3D8D7A;
  transform: scale(1.1);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.item-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.2px;
  line-height: 1.3;
}

.item-description {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}

.action-btn {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  letter-spacing: -0.1px;
  flex-shrink: 0;
}

.action-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}

.action-btn:active {
  transform: translateY(0);
}

/* Celebration Overlay */
.celebration-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.97) 0%, rgba(95, 179, 160, 0.97) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

.celebration-content {
  text-align: center;
  color: white;
}

.confetti {
  font-size: 4.5rem;
  animation: bounce 0.6s ease-in-out infinite;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.celebration-content h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0.75rem 0 0.5rem 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.celebration-content p {
  font-size: 1rem;
  opacity: 0.95;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .profile-completion-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .card-header {
    flex-direction: row;
    align-items: center;
    gap: 0;
  }
  
  .header-left {
    gap: 0.875rem;
  }
  
  .dismiss-btn {
    margin-left: auto;
  }
  
  .icon-container {
    width: 48px;
    height: 48px;
  }
  
  .header-text h3 {
    font-size: 1.15rem;
  }

  .header-text p {
    font-size: 0.8rem;
  }
  
  .checklist-item {
    flex-wrap: wrap;
    padding: 1rem;
  }
  
  .action-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .celebration-content h2 {
    font-size: 1.5rem;
  }

  .confetti {
    font-size: 3.5rem;
  }
}

@media (max-width: 480px) {
  .profile-completion-card {
    padding: 1.25rem;
  }

  .icon-container {
    width: 44px;
    height: 44px;
  }

  .header-text h3 {
    font-size: 1.05rem;
  }

  .header-text p {
    font-size: 0.75rem;
  }

  .item-title {
    font-size: 0.9rem;
  }

  .item-description {
    font-size: 0.75rem;
  }
}
</style>