<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isActive" class="walkthrough-container">
        <!-- Overlay Background -->
        <div class="walkthrough-overlay" @click="handleOverlayClick"></div>
        
        <!-- Spotlight Highlight -->
        <div 
          v-if="currentStep && currentStep.element"
          class="spotlight-highlight"
          :style="highlightStyle"
        ></div>
        
        <!-- Tooltip -->
        <transition name="tooltip">
          <div 
            v-if="currentStep"
            class="walkthrough-tooltip"
            :style="tooltipStyle"
            :class="tooltipPositionClass"
          >
            <div class="tooltip-header">
              <div class="step-indicator">
                Step {{ currentStepIndex + 1 }} of {{ steps.length }}
              </div>
              <button @click="skipWalkthrough" class="close-btn" aria-label="Close walkthrough">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
              </button>
            </div>
            
            <div class="tooltip-content">
              <h3>{{ currentStep.title }}</h3>
              <p>{{ currentStep.description }}</p>
              
              <div v-if="currentStep.tips" class="tips-section">
                <ul>
                  <li v-for="(tip, index) in currentStep.tips" :key="index">{{ tip }}</li>
                </ul>
              </div>
            </div>
            
            <div class="tooltip-actions">
              <button 
                v-if="currentStepIndex > 0"
                @click="previousStep"
                class="btn-secondary"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
                </svg>
                Previous
              </button>
              
              <button 
                v-if="!isLastStep"
                @click="nextStep"
                class="btn-primary"
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
              </button>
              
              <button 
                v-else
                @click="completeWalkthrough"
                class="btn-primary btn-complete"
              >
                Get Started!
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </button>
              
              <button 
                @click="skipWalkthrough"
                class="btn-skip"
              >
                Skip Tour
              </button>
            </div>
            
            <!-- Progress Dots -->
            <div class="progress-dots">
              <span 
                v-for="(step, index) in steps"
                :key="index"
                :class="['dot', { active: index === currentStepIndex, completed: index < currentStepIndex }]"
              ></span>
            </div>
            
            <!-- Arrow Pointer -->
            <div class="tooltip-arrow" :class="arrowPositionClass"></div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { supabase } from '../../supabase.js';

export default {
  name: 'WelcomeWalkthrough',
  props: {
    studentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      currentStepIndex: 0,
      highlightStyle: {},
      tooltipStyle: {},
      tooltipPositionClass: '',
      arrowPositionClass: '',
      steps: [
        {
          id: 'welcome',
          title: '👋 Welcome to DigiCheck!',
          description: 'Let\'s take a quick tour to help you get started. This will only take a minute!',
          element: null,
          position: 'center',
          tips: [
            'Access your subjects and assignments',
            'Check your grades and progress',
            'Stay updated with school calendar'
          ]
        },
        {
          id: 'navigation',
          title: '📚 Navigation Menu',
          description: 'Use this sidebar to navigate between different sections of the system.',
          element: '.sidebar .nav-links',
          position: 'right',
          tips: [
            'Home - Dashboard overview',
            'Subjects - Your enrolled classes',
            'Calendar - Important dates',
            'Messages - Communication hub'
          ]
        },
        {
          id: 'profile',
          title: '👤 Your Profile',
          description: 'This shows your student information, grade level, and school year.',
          element: '.sidebar .user-info',
          position: 'right'
        },
        {
          id: 'settings',
          title: '⚙️ Settings',
          description: 'Update your profile photo, change your password, and manage your preferences here.',
          element: '.nav-item[href="/student/settings"]',
          position: 'right',
          tips: [
            'Upload a profile photo',
            'Change your password',
            'Update personal information'
          ]
        },
        {
          id: 'help',
          title: '❓ Help & Support',
          description: 'Need assistance? Click this button anytime to access guides, FAQs, and contact support.',
          element: '.floating-help-btn',
          position: 'left'
        },
        {
          id: 'complete',
          title: '🎉 You\'re All Set!',
          description: 'You now know the basics of DigiCheck. Start exploring and don\'t hesitate to ask for help!',
          element: null,
          position: 'center',
          tips: [
            'Complete your profile for the best experience',
            'Check Messages regularly for updates',
            'Use the Help button if you get stuck'
          ]
        }
      ]
    };
  },
  computed: {
    currentStep() {
      return this.steps[this.currentStepIndex];
    },
    isLastStep() {
      return this.currentStepIndex === this.steps.length - 1;
    }
  },
  watch: {
    currentStepIndex() {
      this.$nextTick(() => {
        this.updateHighlightPosition();
      });
    },
    // Watch for changes in studentData to prevent re-showing
    'studentData.has_completed_walkthrough'(newValue) {
      if (newValue === true && this.isActive) {
        console.log('✅ Walkthrough marked as completed - closing');
        this.closeWalkthrough();
      }
    }
  },
  async mounted() {
    await this.checkAndStartWalkthrough();
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  },
  methods: {
    async checkAndStartWalkthrough() {
      try {
        // Check if walkthrough has been completed
        const hasCompleted = this.studentData.has_completed_walkthrough;
        
        // Also check localStorage as a backup
        const localStorageKey = `walkthrough_completed_${this.studentData.id}`;
        const hasCompletedLocally = localStorage.getItem(localStorageKey);
        
        // Only show walkthrough if it hasn't been completed in database OR localStorage
        if (!hasCompleted && !hasCompletedLocally) {
          // Wait a bit for the page to fully render
          setTimeout(() => {
            this.startWalkthrough();
          }, 500);
        } else {
          console.log('✅ Walkthrough already completed - skipping');
        }
      } catch (error) {
        console.error('Error checking walkthrough status:', error);
      }
    },
    
    startWalkthrough() {
      this.isActive = true;
      this.currentStepIndex = 0;
      document.body.style.overflow = 'hidden';
      this.$nextTick(() => {
        this.updateHighlightPosition();
      });
    },
    
    nextStep() {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
      }
    },
    
    previousStep() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
      }
    },
    
    handleOverlayClick() {
      // Allow users to click outside to skip (optional)
      // You can disable this if you want walkthrough to be mandatory
      // this.skipWalkthrough();
    },
    
    async skipWalkthrough() {
      try {
        // Save that user skipped the walkthrough in database
        const { error } = await supabase
          .from('students')
          .update({ has_completed_walkthrough: true })
          .eq('id', this.studentData.id);
        
        if (error) throw error;
        
        // Also save to localStorage as backup
        const localStorageKey = `walkthrough_completed_${this.studentData.id}`;
        localStorage.setItem(localStorageKey, 'true');
        
        console.log('⏭️ Walkthrough skipped and marked as completed');
        
        this.closeWalkthrough();
      } catch (error) {
        console.error('Error skipping walkthrough:', error);
        // Still save to localStorage even if database fails
        const localStorageKey = `walkthrough_completed_${this.studentData.id}`;
        localStorage.setItem(localStorageKey, 'true');
        this.closeWalkthrough();
      }
    },
    
    async completeWalkthrough() {
      try {
        // Mark walkthrough as completed in database
        const { error } = await supabase
          .from('students')
          .update({ has_completed_walkthrough: true })
          .eq('id', this.studentData.id);
        
        if (error) throw error;
        
        // Also save to localStorage as backup
        const localStorageKey = `walkthrough_completed_${this.studentData.id}`;
        localStorage.setItem(localStorageKey, 'true');
        
        console.log('🎉 Walkthrough completed successfully!');
        
        this.closeWalkthrough();
        
        // Emit event to parent
        this.$emit('walkthrough-completed');
      } catch (error) {
        console.error('Error completing walkthrough:', error);
        // Still save to localStorage even if database fails
        const localStorageKey = `walkthrough_completed_${this.studentData.id}`;
        localStorage.setItem(localStorageKey, 'true');
        this.closeWalkthrough();
      }
    },
    
    closeWalkthrough() {
      this.isActive = false;
      document.body.style.overflow = '';
    },
    
    updateHighlightPosition() {
      if (!this.currentStep) return;
      
      const step = this.currentStep;
      
      // Center position (for welcome and completion screens)
      if (step.position === 'center' || !step.element) {
        this.highlightStyle = {};
        this.tooltipStyle = {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10002
        };
        this.tooltipPositionClass = 'center';
        this.arrowPositionClass = '';
        return;
      }
      
      // Get element position
      const element = document.querySelector(step.element);
      if (!element) {
        console.warn(`Element not found: ${step.element}`);
        return;
      }
      
      const rect = element.getBoundingClientRect();
      const padding = 12;
      
      // Highlight style
      this.highlightStyle = {
        position: 'fixed',
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
        zIndex: 10001
      };
      
      // Tooltip dimensions
      const tooltipWidth = 420;
      const tooltipOffset = 24;
      const screenPadding = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let tooltipTop = rect.top;
      let tooltipLeft = rect.right + tooltipOffset;
      let position = 'right';
      let arrowPosition = 'left';
      
      // Determine best position based on step.position and available space
      if (step.position === 'left') {
        tooltipLeft = rect.left - tooltipWidth - tooltipOffset;
        position = 'left';
        arrowPosition = 'right';
      } else if (step.position === 'top') {
        tooltipTop = rect.top - tooltipOffset - 200; // Approximate tooltip height
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        position = 'top';
        arrowPosition = 'bottom';
      } else if (step.position === 'bottom') {
        tooltipTop = rect.bottom + tooltipOffset;
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        position = 'bottom';
        arrowPosition = 'top';
      }
      
      // Ensure tooltip stays within viewport bounds - Horizontal
      if (tooltipLeft < screenPadding) {
        tooltipLeft = screenPadding;
      } else if (tooltipLeft + tooltipWidth > viewportWidth - screenPadding) {
        tooltipLeft = viewportWidth - tooltipWidth - screenPadding;
      }
      
      // Ensure tooltip stays within viewport bounds - Vertical
      if (tooltipTop < screenPadding) {
        tooltipTop = screenPadding;
      } else if (tooltipTop > viewportHeight - 300) { // Approximate min space needed
        tooltipTop = Math.max(screenPadding, viewportHeight - 450);
      }
      
      this.tooltipStyle = {
        position: 'fixed',
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`,
        zIndex: 10002
      };
      
      this.tooltipPositionClass = position;
      this.arrowPositionClass = arrowPosition;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.walkthrough-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  pointer-events: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.walkthrough-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  pointer-events: all;
}

.spotlight-highlight {
  border-radius: 16px;
  box-shadow: 
    0 0 0 4px rgba(61, 141, 122, 0.6),
    0 0 0 9999px rgba(0, 0, 0, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.walkthrough-tooltip {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  width: 420px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
  pointer-events: all;
  position: fixed;
}

/* Custom Scrollbar for Tooltip */
.walkthrough-tooltip::-webkit-scrollbar {
  width: 6px;
}

.walkthrough-tooltip::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.3);
  border-radius: 10px;
}

.walkthrough-tooltip::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
}

.walkthrough-tooltip.center {
  max-width: 520px;
  width: calc(100vw - 40px);
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(226, 232, 240, 0.5);
  position: relative;
}

.tooltip-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3D8D7A, transparent);
  opacity: 0.3;
}

.step-indicator {
  font-size: 0.813rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  background: rgba(226, 232, 240, 0.9);
  color: #1e293b;
  transform: scale(1.05) rotate(90deg);
}

.tooltip-content h3 {
  font-size: 1.35rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.875rem 0;
  letter-spacing: -0.3px;
  line-height: 1.3;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.tooltip-content p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.tips-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 2px solid rgba(226, 232, 240, 0.5);
  position: relative;
}

.tips-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3D8D7A, transparent);
  opacity: 0.3;
}

.tips-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-section li {
  font-size: 0.875rem;
  color: #64748b;
  padding: 0.65rem 0;
  padding-left: 1.75rem;
  position: relative;
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.tips-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #3D8D7A;
  font-weight: 800;
  font-size: 1rem;
}

.tooltip-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn-primary,
.btn-secondary,
.btn-skip {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.1px;
}

.btn-primary {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  flex: 1;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}

.btn-complete {
  background: linear-gradient(135deg, #3D8D7A 0%, #5fb3a0 100%);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.3);
}

.btn-complete:hover {
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.4);
}

.btn-secondary {
  background: rgba(248, 250, 252, 0.8);
  color: #1e293b;
  border: 2px solid rgba(226, 232, 240, 0.8);
  min-width: 120px;
}

.btn-secondary:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(203, 213, 225, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-skip {
  background: transparent;
  color: #64748b;
  padding: 0.75rem 1rem;
  font-size: 0.813rem;
  font-weight: 600;
}

.btn-skip:hover {
  color: #1e293b;
  background: rgba(241, 245, 249, 0.5);
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 2px solid rgba(226, 232, 240, 0.5);
  position: relative;
}

.progress-dots::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3D8D7A, transparent);
  opacity: 0.3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.dot.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  transform: scale(1.4);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.4);
}

.dot.completed {
  background: #5fb3a0;
  border-color: #3D8D7A;
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 12px solid transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tooltip-arrow.left {
  left: -24px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: rgba(255, 255, 255, 0.98);
}

.tooltip-arrow.right {
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: rgba(255, 255, 255, 0.98);
}

.tooltip-arrow.top {
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: rgba(255, 255, 255, 0.98);
}

.tooltip-arrow.bottom {
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: rgba(255, 255, 255, 0.98);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .walkthrough-tooltip {
    position: fixed !important;
    bottom: 20px !important;
    left: 20px !important;
    right: 20px !important;
    top: auto !important;
    width: auto !important;
    max-width: calc(100vw - 40px) !important;
    transform: none !important;
    padding: 1.5rem;
    max-height: calc(100vh - 120px);
  }
  
  .tooltip-arrow {
    display: none;
  }
  
  .tooltip-content h3 {
    font-size: 1.2rem;
  }
  
  .tooltip-content p {
    font-size: 0.875rem;
  }
  
  .tooltip-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
    min-width: auto;
  }
  
  .btn-skip {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .walkthrough-tooltip {
    padding: 1.25rem;
    bottom: 10px !important;
    left: 10px !important;
    right: 10px !important;
    max-width: calc(100vw - 20px) !important;
  }
  
  .tooltip-content h3 {
    font-size: 1.1rem;
  }
  
  .tooltip-content p {
    font-size: 0.813rem;
  }
  
  .tips-section li {
    font-size: 0.813rem;
    padding: 0.5rem 0;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.25rem;
    font-size: 0.813rem;
  }
}

/* Landscape Mobile */
@media (max-width: 768px) and (max-height: 500px) {
  .walkthrough-tooltip {
    max-height: calc(100vh - 40px);
    bottom: 10px !important;
  }
}

/* Dark Mode Support */
:root.dark .spotlight-highlight {
  box-shadow: 
    0 0 0 4px rgba(61, 141, 122, 0.7),
    0 0 0 9999px rgba(0, 0, 0, 0.9);
}

:root.dark .walkthrough-tooltip {
  background: rgba(35, 39, 43, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
}

:root.dark .tooltip-arrow.left {
  border-right-color: rgba(35, 39, 43, 0.98);
}

:root.dark .tooltip-arrow.right {
  border-left-color: rgba(35, 39, 43, 0.98);
}

:root.dark .tooltip-arrow.top {
  border-bottom-color: rgba(35, 39, 43, 0.98);
}

:root.dark .tooltip-arrow.bottom {
  border-top-color: rgba(35, 39, 43, 0.98);
}
</style>    