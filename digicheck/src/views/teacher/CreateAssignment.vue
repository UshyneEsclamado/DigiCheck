<template>
  <div class="dashboard-container">
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
        
        <!-- Right: User Profile and Actions -->
        <div class="navbar-right">
          <button @click="goBack" class="nav-icon-btn rounded-bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </button>

          <!-- Notification Bell -->
          <div class="notif-wrapper">
            <button class="nav-icon-btn rounded-bg" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
          
          <!-- User Profile -->
          <div class="user-profile-wrapper">
            <div class="user-profile rounded-bg">
              <div class="user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span class="user-name">{{ fullName }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar Navigation -->
    <aside class="sidebar" style="background:#3D8D7A; border-right:none;">
      <nav class="sidebar-nav">
        <router-link to="/teacher/dashboard" class="sidebar-item rounded-bg">
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
        <router-link to="/teacher/gradebook" class="sidebar-item rounded-bg">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 2v4M16 2v4" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Gradebook</span>
        </router-link>
        <router-link to="/teacher/analytics" class="sidebar-item rounded-bg">
          <div class="sidebar-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="12" width="4" height="8" />
              <rect x="10" y="8" width="4" height="12" />
              <rect x="17" y="4" width="4" height="16" />
            </svg>
          </div>
          <span class="sidebar-tooltip">Analytics</span>
        </router-link>
        <router-link to="/teacher/messages" class="sidebar-item rounded-bg">
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
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Create New Assignment</h1>
              <p class="header-subtitle">{{ subjectName }}<span v-if="sectionName"> - {{ sectionName }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="main-container">
        <div class="container">
        <!-- Assignment Form -->
        <div class="content-card slide-up">
          <div class="section-header">
            <div class="section-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <div class="section-content">
              <h2 class="section-title">Assignment Details</h2>
              <p class="section-subtitle">{{ subjectName }} - {{ sectionName }} • Grade {{ gradeLevel }}</p>
            </div>
          </div>
          
          <div class="form-section">
            <form @submit.prevent="createAssignment">
            <!-- Assignment Title -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z"/>
                    <path d="M14.5 5.5l4 4"/>
                  </svg>
                </span>
                Assignment Title *
              </label>
              <input
                type="text"
                id="title"
                v-model="formData.title"
                placeholder="e.g., Essay on Climate Change"
                class="form-input enhanced-input"
                required
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M8 7h8M8 12h8M8 17h4"/>
                  </svg>
                </span>
                Description / Instructions
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="4"
                placeholder="Provide detailed instructions for the assignment..."
                class="form-input form-textarea enhanced-input"
              ></textarea>
            </div>

            <!-- Two Column Layout -->
            <div class="form-grid">
              <!-- Total Points -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <text x="7" y="17" font-size="10" fill="#10b981">#</text>
                    </svg>
                  </span>
                  Total Points *
                </label>
                <input
                  type="number"
                  id="total_points"
                  v-model.number="formData.total_points"
                  min="1"
                  placeholder="100"
                  class="form-input enhanced-input"
                  required
                />
              </div>

              <!-- Due Date -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <rect x="4" y="4" width="16" height="16" rx="2"/>
                      <path d="M8 2v4m8-4v4"/>
                      <path d="M4 10h16"/>
                    </svg>
                  </span>
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  id="due_date"
                  v-model="formData.due_date"
                  :min="minDate"
                  class="form-input enhanced-input"
                  required
                />
              </div>
            </div>

            <!-- Two Column Layout for Type -->
            <div class="form-grid">
              <!-- Assignment Type -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </span>
                  Assignment Type *
                </label>
                <select 
                  id="assignment_type" 
                  v-model="formData.assignment_type" 
                  class="modern-select"
                  required
                >
                  <option value="">Select assignment type</option>
                  <option value="homework">Homework</option>
                  <option value="project">Project</option>
                  <option value="essay">Essay</option>
                  <option value="presentation">Presentation</option>
                  <option value="research">Research Paper</option>
                  <option value="lab">Lab Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Submission Type -->
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </span>
                  Submission Type *
                </label>
                <select 
                  id="submission_type" 
                  v-model="formData.submission_type" 
                  class="modern-select"
                  required
                >
                  <option value="">Select submission type</option>
                  <option value="file_upload">File Upload</option>
                  <option value="text_entry">Text Entry</option>
                  <option value="link">External Link</option>
                  <option value="physical">Physical Submission</option>
                </select>
              </div>
            </div>

            <!-- ✅ BULK ASSIGNMENT - Section Selection -->
            <div class="form-group bulk-section-selector">
              <div class="section-selector-header">
                <label class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M3 7l9-4 9 4" />
                    </svg>
                  </span>
                  Assign to Sections *
                  <span v-if="getSelectedSectionsCount > 0" class="selected-count-badge">
                    {{ getSelectedSectionsCount }} selected
                  </span>
                </label>
                
                <label class="checkbox-label select-all-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="allSectionsSelected" 
                    @change="toggleAllSections"
                  />
                  <span>Select All Sections</span>
                </label>
              </div>

              <!-- Academic Info Tags -->
              <div v-if="currentSchoolYear" class="academic-info-tags">
                <span class="info-tag school-year-tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                    <path d="M8 2v4m8-4v4M4 10h16"/>
                  </svg>
                  {{ currentSchoolYear.year_name }}
                </span>
              </div>

              <!-- Sections Grid -->
              <div class="sections-grid" v-if="teacherSections.length > 0">
                <div 
                  v-for="section in teacherSections" 
                  :key="section.id"
                  class="section-card"
                  :class="{ 'selected': isSectionSelected(section.id) }"
                  @click="toggleSectionSelection(section.id)"
                >
                  <div class="section-card-header">
                    <div class="section-checkbox">
                      <input 
                        type="checkbox" 
                        :checked="isSectionSelected(section.id)"
                        @click.stop="toggleSectionSelection(section.id)"
                      />
                    </div>
                    <div class="section-info">
                      <h4 class="section-name">{{ section.name }}</h4>
                      <p class="section-code">{{ section.section_code }}</p>
                    </div>
                  </div>
                  <div class="section-card-footer">
                    <span class="grade-badge">Grade {{ section.grade_level }}</span>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M3 7l9-4 9 4" />
                </svg>
                <p>No sections found for this subject</p>
                <p style="font-size: 0.75rem; margin-top: 0.5rem;">
                  Subject ID: {{ subject.id }}<br>
                  Sections Count: {{ teacherSections.length }}
                </p>
              </div>
            </div>

            <!-- Attachments Section -->
            <div class="form-group attachments-section">
              <label class="form-label">
                <span class="label-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </span>
                Attachments
                <span class="optional">(Optional)</span>
              </label>
              <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileSelect"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                  style="display: none"
                />
                <div class="upload-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p class="upload-text">Click to upload or drag and drop</p>
                  <p class="upload-hint">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, Images, ZIP (Max 10MB each)</p>
                </div>
              </div>

              <!-- Selected Files List -->
              <div v-if="selectedFiles.length > 0" class="files-list">
                <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                  <div class="file-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <div class="file-details">
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                  </div>
                  <button type="button" @click="removeFile(index)" class="remove-file-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Additional Settings -->
            <div class="settings-section">
              <h4>Additional Settings</h4>
              
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.allow_late_submission" />
                  <span>Allow late submissions</span>
                </label>
              </div>

              <div v-if="formData.allow_late_submission" class="form-group indent">
                <label for="late_penalty" class="form-label">
                  <span class="label-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </span>
                  Late Penalty (%)
                </label>
                <input
                  type="number"
                  id="late_penalty"
                  v-model.number="formData.late_penalty"
                  min="0"
                  max="100"
                  placeholder="10"
                  class="form-input enhanced-input"
                />
              </div>

              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.publish_immediately" />
                  <span>Publish immediately</span>
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" @click="goBack" class="btn-cancel" :disabled="isSubmitting">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
                Cancel
              </button>
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                <span v-if="!isSubmitting">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Create Assignment
                </span>
                <span v-else class="submitting">
                  <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  Creating...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3>Assignment Created Successfully!</h3>
        <p>Your assignment has been created and {{ formData.publish_immediately ? 'published' : 'draft' }}.</p>
        <div class="modal-actions">
          <button @click="createAnother" class="btn-secondary">Create Another</button>
          <button @click="goToAssignments" class="btn-primary">View Assignments</button>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
      <div class="modal-content error-modal" @click.stop>
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Error Creating Assignment</h3>
        <p>{{ errorMessage }}</p>
        <div class="modal-actions">
          <button @click="closeErrorModal" class="btn-primary">Try Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../supabase.js'
import { useDarkMode } from '../../composables/useDarkMode.js'

// Composables
const { isDarkMode, toggleDarkMode } = useDarkMode()
const router = useRouter()
const route = useRoute()

// Route params
const subjectId = ref(route.params.subjectId)
const sectionId = ref(route.params.sectionId)
const subjectName = ref(route.query.subjectName || '')
const sectionName = ref(route.query.sectionName || '')
const gradeLevel = ref(route.query.gradeLevel || '')

// Teacher info
const teacherId = ref(null)
const fullName = ref('Teacher')

// ✅ BULK ASSIGNMENT FEATURE - Section Management (matching CreateQuiz.vue)
const subject = ref({
  id: '',
  name: 'Subject'
})

const section = ref({
  id: '',
  name: ''
})

const teacherSections = ref([])
const selectedSections = ref([])
const allSectionsSelected = ref(false)
const currentSchoolYear = ref(null)

// Form data
const formData = ref({
  title: '',
  description: '',
  total_points: 100,
  due_date: '',
  assignment_type: '',
  submission_type: '',
  allow_late_submission: false,
  late_penalty: 10,
  publish_immediately: true
})

// File handling
const selectedFiles = ref([])
const fileInput = ref(null)

// UI states
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Computed
const minDate = computed(() => {
  // ✅ FIXED: Return current PH time as minimum date
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

// ✅✅✅ TAMANG LOAD TEACHER INFO - Para sa iyong DB structure
const loadTeacherInfo = async () => {
  try {
    console.log('🔍 Step 1: Getting authenticated user...')
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('Not authenticated')

    console.log('✅ Auth user ID:', user.id)

    // ✅ Step 2: Get profile using auth_user_id
    console.log('🔍 Step 2: Looking up profile...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, role, full_name, email')
      .eq('auth_user_id', user.id)  // ← auth_user_id = auth.uid()
      .single()

    if (profileError) {
      console.error('❌ Profile lookup error:', profileError)
      throw new Error('Profile not found: ' + profileError.message)
    }

    if (!profileData) {
      throw new Error('No profile found for this user')
    }

    console.log('✅ Profile found:', profileData)

    // Check if user is a teacher
    if (profileData.role !== 'teacher') {
      throw new Error('User is not a teacher')
    }

    // ✅ Step 3: Get teacher record using profile.id
    console.log('🔍 Step 3: Looking up teacher record...')
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('id, full_name, email, employee_id')
      .eq('profile_id', profileData.id)  // ← profile_id = profiles.id
      .single()

    if (teacherError) {
      console.error('❌ Teacher lookup error:', teacherError)
      throw new Error('Teacher record not found: ' + teacherError.message)
    }

    if (!teacherData) {
      throw new Error('Teacher record not found in database')
    }

    console.log('✅ Teacher record found:', teacherData)
    
    // Set teacher info
    teacherId.value = teacherData.id
    fullName.value = teacherData.full_name || profileData.full_name || 'Teacher'
    
    console.log('✅ Teacher ID set to:', teacherId.value)
    console.log('✅ Teacher name:', fullName.value)
    
    return true
  } catch (error) {
    console.error('❌ Error loading teacher info:', error)
    errorMessage.value = 'Failed to load teacher information: ' + error.message
    showErrorModal.value = true
    return false
  }
}

// ✅ BULK ASSIGNMENT - Fetch all sections for this subject (matching CreateQuiz.vue)
const fetchTeacherSections = async () => {
  try {
    if (!subject.value.id) {
      console.log('⚠️ No subject ID available yet');
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

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('📊 Raw data from database:', sectionsData);

    teacherSections.value = sectionsData.map(s => ({
      id: s.id,
      name: s.name,
      section_code: s.section_code,
      subject_id: s.subject_id,
      grade_level: s.subjects.grade_level,  // ✅ Get from subjects table
      subject_name: s.subjects.name
    }));

    console.log(`✅ Found ${teacherSections.value.length} sections for subject "${subject.value.name}"`);
    console.log('📋 Sections:', teacherSections.value);
    
    // Auto-select current section if we came from a specific section
    if (section.value.id) {
      selectedSections.value = [section.value.id];
      console.log(`✅ Auto-selected current section: ${section.value.name}`);
    }
  } catch (error) {
    console.error('❌ Error in fetchTeacherSections:', error);
    errorMessage.value = 'Failed to load sections: ' + error.message;
  }
};

// ✅ BULK ASSIGNMENT - Fetch current school year
const fetchCurrentSchoolYear = async () => {
  try {
    const { data, error } = await supabase
      .from('school_years')
      .select('*')
      .eq('is_current', true)
      .single()

    if (error) throw error
    
    currentSchoolYear.value = data
    console.log('✅ Current school year:', data?.year_name)
  } catch (error) {
    console.error('❌ Error fetching school year:', error)
  }
}

// ✅ BULK ASSIGNMENT - Toggle all sections selection
const toggleAllSections = () => {
  if (allSectionsSelected.value) {
    selectedSections.value = []
    allSectionsSelected.value = false
  } else {
    selectedSections.value = teacherSections.value.map(s => s.id)
    allSectionsSelected.value = true
  }
}

// ✅ BULK ASSIGNMENT - Toggle individual section selection
const toggleSectionSelection = (sectionId) => {
  const index = selectedSections.value.indexOf(sectionId)
  if (index > -1) {
    selectedSections.value.splice(index, 1)
  } else {
    selectedSections.value.push(sectionId)
  }
  
  // Update allSectionsSelected state
  allSectionsSelected.value = selectedSections.value.length === teacherSections.value.length
}

// ✅ BULK ASSIGNMENT - Check if section is selected
const isSectionSelected = (sectionId) => {
  return selectedSections.value.includes(sectionId)
}

// ✅ BULK ASSIGNMENT - Get selected sections count
const getSelectedSectionsCount = computed(() => {
  return selectedSections.value.length
})

// ✅ Load route parameters (matching CreateQuiz.vue - must run BEFORE fetchTeacherSections)
const loadRouteParams = () => {
  const subjectIdParam = route.params.subjectId;
  const sectionIdParam = route.params.sectionId;
  const subjectNameParam = route.query.subjectName || 'Subject';
  const sectionNameParam = route.query.sectionName || '';

  if (!subjectIdParam || !sectionIdParam) {
    console.error('❌ Missing required route parameters');
    return false;
  }

  subject.value = { id: subjectIdParam, name: subjectNameParam };
  section.value = { id: sectionIdParam, name: sectionNameParam };
  
  // Also set the old refs for compatibility
  subjectId.value = subjectIdParam;
  sectionId.value = sectionIdParam;
  subjectName.value = subjectNameParam;
  sectionName.value = sectionNameParam;
  gradeLevel.value = route.query.gradeLevel || '';

  console.log('✅ Route params loaded:', { 
    subject: subject.value, 
    section: section.value 
  });
  
  return true;
};

// Methods
const getSubjectColor = () => {
  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', 
    '#10B981', '#6366F1', '#EF4444', '#14B8A6'
  ]
  const index = (subjectName.value?.charCodeAt(0) || 0) % colors.length
  return colors[index]
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  addFiles(files)
}

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  addFiles(files)
}

const addFiles = (files) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const validFiles = files.filter(file => {
    if (file.size > maxSize) {
      alert(`${file.name} is too large. Maximum size is 10MB.`)
      return false
    }
    return true
  })
  selectedFiles.value.push(...validFiles)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const uploadFiles = async (assignmentId) => {
  const uploadedUrls = []
  
  for (const file of selectedFiles.value) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${assignmentId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('assignment-attachments')
      .upload(fileName, file)
    
    if (error) {
      console.error('Error uploading file:', error)
      continue
    }
    
    const { data: urlData } = supabase.storage
      .from('assignment-attachments')
      .getPublicUrl(fileName)
    
    uploadedUrls.push({
      name: file.name,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type
    })
  }
  
  return uploadedUrls
}

// Create assignment
const createAssignment = async () => {
  isSubmitting.value = true
  
  try {
    console.log('📝 Starting assignment creation...')
    
    // Ensure teacher is loaded
    if (!teacherId.value) {
      console.log('⚠️ Teacher ID not set, loading...')
      const loaded = await loadTeacherInfo()
      if (!loaded) {
        throw new Error('Failed to load teacher information')
      }
    }

    console.log('✅ Using teacher ID:', teacherId.value)

    // Validate required fields
    if (!formData.value.title.trim()) {
      throw new Error('Assignment title is required')
    }
    if (!formData.value.assignment_type) {
      throw new Error('Assignment type is required')
    }
    if (!formData.value.submission_type) {
      throw new Error('Submission type is required')
    }
    if (!formData.value.due_date) {
      throw new Error('Due date is required')
    }

    // ✅ BULK ASSIGNMENT - Validate section selection
    if (selectedSections.value.length === 0) {
      throw new Error('Please select at least one section')
    }

    console.log('📋 Selected sections:', selectedSections.value.length)

    // ✅ FIXED: Convert datetime-local to UTC for database storage
    const localDueDate = new Date(formData.value.due_date)
    const utcDueDate = localDueDate.toISOString()
    
    console.log('📅 Due date conversion:')
    console.log('  Local input:', formData.value.due_date)
    console.log('  Parsed local:', localDueDate.toString())
    console.log('  UTC for DB:', utcDueDate)

    // ✅ BULK ASSIGNMENT - Create assignment with section_id = null
    const assignmentData = {
      teacher_id: teacherId.value,
      subject_id: subjectId.value,
      section_id: null, // ← NULL for bulk assignments
      school_year_id: currentSchoolYear.value?.id || null,
      title: formData.value.title.trim(),
      description: formData.value.description?.trim() || null,
      total_points: formData.value.total_points,
      due_date: utcDueDate,
      assignment_type: formData.value.assignment_type,
      submission_type: formData.value.submission_type,
      allow_late_submission: formData.value.allow_late_submission,
      late_penalty: formData.value.allow_late_submission ? formData.value.late_penalty : 0,
      status: formData.value.publish_immediately ? 'published' : 'draft',
      published_at: formData.value.publish_immediately ? new Date().toISOString() : null,
      attachments: []
    }

    console.log('📋 Assignment data:', assignmentData)

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .insert(assignmentData)
      .select()
      .single()

    if (assignmentError) {
      console.error('❌ Assignment creation error:', assignmentError)
      throw assignmentError
    }

    console.log('✅ Assignment created successfully:', assignment)

    // ✅ BULK ASSIGNMENT - Direct insert to bulk_assignments table
    console.log('📋 Assigning to', selectedSections.value.length, 'sections...')
    
    const bulkAssignmentData = selectedSections.value.map(sectionId => ({
      assignment_id: assignment.id,
      section_id: sectionId
    }))

    const { error: bulkError } = await supabase
      .from('bulk_assignments')
      .insert(bulkAssignmentData)

    if (bulkError) {
      console.error('❌ Bulk assignment error:', bulkError)
      throw new Error('Failed to assign to sections: ' + bulkError.message)
    }

    console.log('✅ Assignment assigned to', selectedSections.value.length, 'sections')

    // Upload files if any
    if (selectedFiles.value.length > 0) {
      console.log('📎 Uploading files...')
      const attachments = await uploadFiles(assignment.id)
      
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ attachments })
        .eq('id', assignment.id)

      if (updateError) {
        console.error('⚠️ Error updating attachments:', updateError)
      } else {
        console.log('✅ Attachments uploaded:', attachments)
      }
    }

    console.log('🎉 Assignment creation complete!')
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('❌ Error creating assignment:', error)
    errorMessage.value = error.message || 'Failed to create assignment. Please try again.'
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  // Use router.back() to return to the previous page (section detail view)
  router.back()
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  goToAssignments()
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

const createAnother = () => {
  showSuccessModal.value = false
  formData.value = {
    title: '',
    description: '',
    total_points: 100,
    due_date: '',
    assignment_type: '',
    submission_type: '',
    allow_late_submission: false,
    late_penalty: 10,
    publish_immediately: true
  }
  selectedFiles.value = []
  
  // ✅ Set default due date to TODAY at current time
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const hours = String(today.getHours()).padStart(2, '0')
  const minutes = String(today.getMinutes()).padStart(2, '0')
  formData.value.due_date = `${year}-${month}-${day}T${hours}:${minutes}`
  
  console.log('📅 Set default due date to TODAY (PH time):', formData.value.due_date)
}

const goToAssignments = () => {
  router.push({
    name: 'ViewAssessments',
    params: {
      subjectId: subjectId.value,
      sectionId: sectionId.value
    },
    query: {
      subjectName: subjectName.value,
      sectionName: sectionName.value,
      gradeLevel: gradeLevel.value
    }
  })
}

const logout = () => {
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

onMounted(async () => {
  console.log('🚀 Component mounted')
  
  try {
    // Step 1: Load teacher info first
    const teacherLoaded = await loadTeacherInfo()
    if (!teacherLoaded) {
      console.error('❌ Failed to load teacher info')
      router.push('/login')
      return
    }

    // Step 2: Load route params BEFORE fetching sections
    const paramsLoaded = loadRouteParams()
    if (!paramsLoaded) {
      console.error('❌ Failed to load route params')
      alert('Missing information. Redirecting...')
      router.push('/teacher/subjects')
      return
    }
    
    // Step 3: Fetch current school year
    await fetchCurrentSchoolYear()
    
    // Step 4: Fetch teacher sections (AFTER route params are loaded)
    await fetchTeacherSections()
    
    // Step 5: Set default due date to TODAY at current time
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const hours = String(today.getHours()).padStart(2, '0')
    const minutes = String(today.getMinutes()).padStart(2, '0')
    formData.value.due_date = `${year}-${month}-${day}T${hours}:${minutes}`
    
    console.log('📅 Set default due date to TODAY (PH time):', formData.value.due_date)
    console.log('✅ Component initialization complete!')
  } catch (error) {
    console.error('❌ Initialization error:', error)
    alert('Failed to initialize page. Please refresh and try again.')
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dashboard-container {
  height: 100vh;
  width: 100vw;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Sidebar Navigation */
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

/* Sidebar Divider */
.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 12px;
}

/* Sidebar Logout Button */
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

/* Top Navigation Bar */
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

.rounded-bg {
  background: rgba(255,255,255,0.13);
  border-radius: 16px;
  transition: background 0.2s;
}

.rounded-bg:hover {
  background: rgba(255,255,255,0.22);
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

/* Main Container */
.main-container {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
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

/* Content Card */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 2px solid #e2e8f0;
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

/* Section Header */
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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

.section-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Form Section */
.form-section {
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

.label-icon {
  display: flex;
  align-items: center;
}

.optional {
  color: #9ca3af;
  font-weight: 400;
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.form-input,
.form-textarea,
.modern-select {
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

.enhanced-input {
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.07);
}

.form-input:focus,
.form-textarea:focus,
.modern-select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: #f9fafb;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.upload-content svg {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Files List */
.files-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.file-item:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-info svg {
  color: #6b7280;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.file-size {
  font-size: 0.75rem;
  color: #9ca3af;
}

.remove-file-btn {
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

.remove-file-btn:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
}

/* Settings Section */
.settings-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.settings-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.checkbox-group {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
}

.indent {
  margin-left: 1.75rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: 2px solid #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  border-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submitting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
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

.success-icon,
.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.error-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

/* Responsive */
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

  .content-card {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #059669, #047857);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #047857, #065f46);
}

* {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #f1f5f9;
}

/* ============================================ */
/* ✅ BULK ASSIGNMENT - Section Selector Styles */
/* ============================================ */

.bulk-section-selector {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.section-selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.select-all-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #10b981;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.05);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.select-all-checkbox:hover {
  background: rgba(16, 185, 129, 0.1);
}

.select-all-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
}

.selected-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

/* Academic Info Tags */
.academic-info-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.info-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  background: #f0f9ff;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.info-tag svg {
  flex-shrink: 0;
}

.school-year-tag {
  background: #f0f9ff;
  color: #0284c7;
  border-color: #bae6fd;
}

/* Sections Grid */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.section-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-card:hover {
  border-color: #10b981;
  background: #f0fdfa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.section-card.selected {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05));
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.section-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.section-checkbox {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.section-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
}

.section-info {
  flex: 1;
  min-width: 0;
}

.section-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.section-code {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.section-card-footer {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.grade-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.025em;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  margin-top: 1rem;
}

.empty-state svg {
  margin: 0 auto 1rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Responsive for Bulk Assignment */
@media (max-width: 768px) {
  .section-selector-header {
    flex-direction: column;
    align-items: stretch;
  }

  .select-all-checkbox {
    justify-content: center;
  }

  .sections-grid {
    grid-template-columns: 1fr;
  }
}
</style>

