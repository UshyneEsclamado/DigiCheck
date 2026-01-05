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
        
        if (!hasCompleted) {
          // Wait a bit for the page to fully render
          setTimeout(() => {
            this.startWalkthrough();
          }, 500);
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
        // Save that user skipped the walkthrough
        const { error } = await supabase
          .from('students')
          .update({ has_completed_walkthrough: true })
          .eq('id', this.studentData.id);
        
        if (error) throw error;
        
        this.closeWalkthrough();
      } catch (error) {
        console.error('Error skipping walkthrough:', error);
        this.closeWalkthrough();
      }
    },
    
    async completeWalkthrough() {
      try {
        // Mark walkthrough as completed
        const { error } = await supabase
          .from('students')
          .update({ has_completed_walkthrough: true })
          .eq('id', this.studentData.id);
        
        if (error) throw error;
        
        this.closeWalkthrough();
        
        // Emit event to parent
        this.$emit('walkthrough-completed');
      } catch (error) {
        console.error('Error completing walkthrough:', error);
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
      const padding = 8;
      
      // Highlight style
      this.highlightStyle = {
        position: 'fixed',
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`,
        zIndex: 10001
      };
      
      // Tooltip position
      const tooltipWidth = 360;
      const tooltipOffset = 20;
      
      let tooltipTop = rect.top;
      let tooltipLeft = rect.right + tooltipOffset;
      let position = 'right';
      let arrowPosition = 'left';
      
      // Determine best position based on step.position
      if (step.position === 'left') {
        tooltipLeft = rect.left - tooltipWidth - tooltipOffset;
        position = 'left';
        arrowPosition = 'right';
      } else if (step.position === 'top') {
        tooltipTop = rect.top - tooltipOffset;
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        position = 'top';
        arrowPosition = 'bottom';
      } else if (step.position === 'bottom') {
        tooltipTop = rect.bottom + tooltipOffset;
        tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        position = 'bottom';
        arrowPosition = 'top';
      }
      
      // Check if tooltip goes off screen
      if (tooltipLeft < 20) {
        tooltipLeft = 20;
      } else if (tooltipLeft + tooltipWidth > window.innerWidth - 20) {
        tooltipLeft = window.innerWidth - tooltipWidth - 20;
      }
      
      if (tooltipTop < 20) {
        tooltipTop = 20;
      } else if (tooltipTop > window.innerHeight - 200) {
        tooltipTop = window.innerHeight - 200;
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
.walkthrough-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  pointer-events: none;
}

.walkthrough-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 10000;
  pointer-events: all;
}

.spotlight-highlight {
  border-radius: 12px;
  box-shadow: 
    0 0 0 4px rgba(95, 179, 160, 0.5),
    0 0 0 9999px rgba(0, 0, 0, 0.75);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.walkthrough-tooltip {
  background: var(--card-background);
  border-radius: 16px;
  padding: 1.5rem;
  width: 360px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  pointer-events: all;
}

.walkthrough-tooltip.center {
  max-width: 480px;
  width: 90%;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.step-indicator {
  font-size: 0.813rem;
  font-weight: 600;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.close-btn {
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

.close-btn:hover {
  background: var(--bg-accent);
  color: var(--text-primary);
}

.tooltip-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.tooltip-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.tips-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.tips-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-section li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tips-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-weight: bold;
}

.tooltip-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-skip {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-complete {
  background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-light) 100%);
}

.btn-secondary {
  background: var(--bg-accent);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-accent-hover);
}

.btn-skip {
  background: transparent;
  color: var(--text-muted);
  padding: 0.75rem;
  font-size: 0.813rem;
}

.btn-skip:hover {
  color: var(--text-primary);
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--accent-color);
  transform: scale(1.3);
}

.dot.completed {
  background: var(--accent-light);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid transparent;
}

.tooltip-arrow.left {
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: var(--card-background);
}

.tooltip-arrow.right {
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: var(--card-background);
}

.tooltip-arrow.top {
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: var(--card-background);
}

.tooltip-arrow.bottom {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: var(--card-background);
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
    transform: none !important;
  }
  
  .tooltip-arrow {
    display: none;
  }
  
  .tooltip-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .walkthrough-tooltip {
    padding: 1.25rem;
  }
  
  .tooltip-content h3 {
    font-size: 1.1rem;
  }
  
  .tooltip-content p {
    font-size: 0.875rem;
  }
}

/* Dark Mode Support */
:root.dark .spotlight-highlight {
  box-shadow: 
    0 0 0 4px rgba(95, 179, 160, 0.6),
    0 0 0 9999px rgba(0, 0, 0, 0.85);
}
</style>    