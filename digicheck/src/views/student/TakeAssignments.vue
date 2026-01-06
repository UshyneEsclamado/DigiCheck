<template>
  <div class="take-assignment-page">
    <!-- Header Section -->
    <div class="section-header-card">
      <div class="section-header-content">
        <div class="section-header-left">
          <div class="section-header-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          
          <div class="header-text">
            <h1 class="section-header-title">{{ subject.name }} - Assignments</h1>
            <p class="section-header-subtitle">{{ section.name }}</p>
            <p class="section-header-description">{{ studentInfo.full_name }} • Grade {{ studentInfo.grade_level }}</p>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="goBack" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            <span>Back to Subjects</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading assignments...</p>
    </div>

    <!-- Assignment List View -->
    <div v-else-if="!selectedAssignment" class="main-content">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ assignments.length }}</div>
          <div class="stat-label">Available Assignments</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ completedAssignments.length }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>

      <!-- Assignments Categories -->
      <div class="assignments-section">
        <!-- New Assignments -->
        <div v-if="newAssignments.length > 0" class="assignment-category">
          <div class="category-header">
            <h2 class="category-title">
              <span class="category-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              New Assignments
            </h2>
            <span class="category-count">{{ newAssignments.length }}</span>
          </div>
          <div class="assignment-grid">
            <div v-for="assignment in newAssignments" :key="assignment.id" class="assignment-card new-assignment">
              <div class="assignment-badge new-badge">New</div>
              <div class="assignment-header">
                <h3 class="assignment-title">{{ assignment.title }}</h3>
                <div class="assignment-type">
                  <span class="type-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <span>{{ formatAssignmentType(assignment.assignment_type) }}</span>
                </div>
              </div>
              <p class="assignment-description">{{ assignment.description || 'No description provided' }}</p>
              <div class="assignment-meta">
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ assignment.total_points }} Points</span>
                </div>
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ formatSubmissionType(assignment.submission_type) }}</span>
                </div>
              </div>
              <div class="assignment-due-date" :class="{ 'overdue': isOverdue(assignment.due_date) }">
                <span class="due-label">Due:</span>
                <span class="due-time">{{ formatPHTime(assignment.due_date) }}</span>
                <span v-if="isOverdue(assignment.due_date)" class="overdue-label">OVERDUE</span>
              </div>
              <div class="assignment-actions">
                <button @click="viewAssignmentDetails(assignment)" class="btn btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Assignment
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Assignments -->
        <div v-if="pastAssignments.length > 0" class="assignment-category">
          <div class="category-header">
            <h2 class="category-title">
              <span class="category-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              Past Assignments
            </h2>
            <span class="category-count">{{ pastAssignments.length }}</span>
          </div>
          <div class="assignment-grid">
            <div v-for="assignment in pastAssignments" :key="assignment.id" class="assignment-card past-assignment">
              <div v-if="getSubmissionStatus(assignment) === 'graded'" class="assignment-badge completed-badge">Completed</div>
              <div v-else-if="getSubmissionStatus(assignment) === 'submitted'" class="assignment-badge submitted-badge">Submitted</div>
              <div v-else-if="isOverdue(assignment.due_date)" class="assignment-badge overdue-badge">Overdue</div>
              <div class="assignment-header">
                <h3 class="assignment-title">{{ assignment.title }}</h3>
                <div class="assignment-type">
                  <span class="type-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <span>{{ formatAssignmentType(assignment.assignment_type) }}</span>
                </div>
              </div>
              <p class="assignment-description">{{ assignment.description || 'No description provided' }}</p>
              <div class="assignment-meta">
                <div class="meta-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{{ assignment.total_points }} Points</span>
                </div>
              </div>
              <div v-if="getSubmission(assignment.id)?.score !== null && getSubmission(assignment.id)?.score !== undefined" class="assignment-result">
                <div class="result-score">
                  <span class="score-label">Your Score:</span>
                  <span class="score-value">{{ calculatePercentage(getSubmission(assignment.id).score, assignment.total_points) }}%</span>
                </div>
                <div class="result-details">
                  <span>{{ getSubmission(assignment.id).score }} / {{ assignment.total_points }} points</span>
                </div>
              </div>
              <div class="assignment-actions">
                <button @click="viewAssignmentDetails(assignment)" class="btn btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="assignments.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3>No Assignments Available</h3>
          <p>There are no assignments available for this subject yet.</p>
        </div>
      </div>
    </div>

    <!-- Assignment Details View -->
    <div v-else-if="selectedAssignment" class="assignment-details-view">
      <div class="content-card slide-up">
        <div class="details-header">
          <button @click="selectedAssignment = null" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Assignments
          </button>
          <div class="assignment-status-badge" :class="getAssignmentStatusClass()">
            {{ getAssignmentStatusText() }}
          </div>
        </div>

        <div class="details-content">
          <div class="details-main">
            <div class="assignment-info-card">
              <h1 class="details-title">{{ selectedAssignment.title }}</h1>
              <div class="assignment-type-display">
                <div class="type-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="type-content">
                  <span class="type-label">Assignment Type</span>
                  <span class="type-value">{{ formatAssignmentType(selectedAssignment.assignment_type) }}</span>
                </div>
              </div>
              <p class="details-description">{{ selectedAssignment.description || 'No description provided' }}</p>
              
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Total Points</span>
                    <span class="info-value">{{ selectedAssignment.total_points }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Due Date</span>
                    <span class="info-value">{{ formatPHTime(selectedAssignment.due_date) }}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-label">Submission Type</span>
                    <span class="info-value">{{ formatSubmissionType(selectedAssignment.submission_type) }}</span>
                  </div>
                </div>
              </div>

              <!-- Teacher Attachments -->
              <div v-if="selectedAssignment.attachments && selectedAssignment.attachments.length > 0" class="attachments-section">
                <h3 class="attachments-title">Assignment Materials</h3>
                <div class="attachments-list">
                  <a 
                    v-for="(attachment, index) in selectedAssignment.attachments" 
                    :key="index"
                    :href="attachment.url"
                    target="_blank"
                    class="attachment-item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="attachment-name">{{ attachment.name }}</span>
                    <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
                  </a>
                </div>
              </div>

              <!-- Submission Section -->
              <div class="submission-section">
                <h3 class="submission-title">Your Submission</h3>
                
                <!-- Existing Submission -->
                <div v-if="currentSubmission" class="existing-submission">
                  <div class="submission-status-card" :class="currentSubmission.status">
                    <div class="status-header">
                      <span class="status-label">Status:</span>
                      <span class="status-value">{{ formatSubmissionStatus(currentSubmission.status) }}</span>
                    </div>
                    <div v-if="currentSubmission.submitted_at" class="submission-date">
                      Submitted: {{ formatPHTime(currentSubmission.submitted_at) }}
                    </div>
                    <div v-if="currentSubmission.is_late" class="late-notice">
                      ⚠️ Submitted late - {{ currentSubmission.late_days }} day(s) after deadline
                      <span v-if="currentSubmission.penalty_applied > 0" class="penalty-info">
                        ({{ currentSubmission.penalty_applied }}% penalty applied)
                      </span>
                    </div>
                  </div>

                  <!-- Display submitted content -->
                  <div v-if="currentSubmission.text_content" class="submitted-text">
                    <h4>Your Text Submission:</h4>
                    <div class="text-content">{{ currentSubmission.text_content }}</div>
                  </div>

                  <div v-if="currentSubmission.link_url" class="submitted-link">
                    <h4>Your Link Submission:</h4>
                    <a :href="currentSubmission.link_url" target="_blank" class="link-value">{{ currentSubmission.link_url }}</a>
                  </div>

                  <div v-if="currentSubmission.attachments && currentSubmission.attachments.length > 0" class="submitted-files">
                    <h4>Your Files:</h4>
                    <div class="files-list">
                      <a 
                        v-for="(file, index) in currentSubmission.attachments" 
                        :key="index"
                        :href="file.url"
                        target="_blank"
                        class="file-item"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ file.name }}</span>
                      </a>
                    </div>
                  </div>

                  <!-- Grading Info -->
                  <div v-if="currentSubmission.status === 'graded'" class="grading-section">
                    <div class="grade-display">
                      <div class="grade-score">
                        <span class="score-label">Your Score:</span>
                        <span class="score-value">{{ currentSubmission.score }} / {{ selectedAssignment.total_points }}</span>
                        <span class="score-percentage">({{ calculatePercentage(currentSubmission.score, selectedAssignment.total_points) }}%)</span>
                      </div>
                    </div>
                    <div v-if="currentSubmission.feedback" class="teacher-feedback">
                      <h4>Teacher's Feedback:</h4>
                      <div class="feedback-content">{{ currentSubmission.feedback }}</div>
                    </div>
                    <div v-if="currentSubmission.graded_at" class="graded-date">
                      Graded on: {{ formatPHTime(currentSubmission.graded_at) }}
                    </div>
                  </div>
                </div>

                <!-- New Submission Form -->
                <div v-else-if="!isOverdue(selectedAssignment.due_date) || selectedAssignment.allow_late_submission" class="submission-form">
                  <!-- Text Entry -->
                  <div v-if="selectedAssignment.submission_type === 'text_entry'" class="form-group">
                    <label>Your Answer:</label>
                    <textarea
                      v-model="submissionData.text_content"
                      rows="8"
                      placeholder="Type your answer here..."
                      class="text-input"
                    ></textarea>
                  </div>

                  <!-- Link Submission -->
                  <div v-if="selectedAssignment.submission_type === 'link'" class="form-group">
                    <label>External Link:</label>
                    <input
                      v-model="submissionData.link_url"
                      type="url"
                      placeholder="https://example.com/your-work"
                      class="link-input"
                    />
                  </div>

                  <!-- File Upload -->
                  <div v-if="selectedAssignment.submission_type === 'file_upload'" class="form-group">
                    <label>Upload Files:</label>
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
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p class="upload-text">Click to upload or drag and drop</p>
                        <p class="upload-hint">PDF, DOC, XLS, PPT, TXT, Images, ZIP (Max 10MB each)</p>
                      </div>
                    </div>

                    <!-- Selected Files -->
                    <div v-if="selectedFiles.length > 0" class="selected-files">
                      <div v-for="(file, index) in selectedFiles" :key="index" class="file-preview">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        <div class="file-info">
                          <span class="file-name">{{ file.name }}</span>
                          <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                        <button @click="removeFile(index)" class="remove-file">×</button>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <button 
                    @click="submitAssignment" 
                    :disabled="isSubmitting || !canSubmit"
                    class="btn btn-submit-assignment"
                  >
                    <div v-if="isSubmitting" class="spinner"></div>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ isSubmitting ? 'Submitting...' : 'Submit Assignment' }}</span>
                  </button>

                  <div v-if="isOverdue(selectedAssignment.due_date) && selectedAssignment.allow_late_submission" class="late-warning">
                    ⚠️ This assignment is past due. Late penalty: {{ selectedAssignment.late_penalty }}% per day
                  </div>
                </div>

                <!-- Overdue Message -->
                <div v-else class="overdue-message">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <h3>Assignment Overdue</h3>
                  <p>This assignment is past the due date and late submissions are not allowed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/supabase.js'

const router = useRouter()
const route = useRoute()

// State
const loading = ref(true)
const studentInfo = ref({ full_name: 'Loading...', grade_level: '', student_id: null })
const subject = ref({ id: '', name: 'Subject' })
const section = ref({ id: '', name: '' })
const assignments = ref([])
const selectedAssignment = ref(null)
const submissions = ref([])
const currentSubmission = ref(null)

// Submission form data
const submissionData = ref({
  text_content: '',
  link_url: ''
})
const selectedFiles = ref([])
const fileInput = ref(null)
const isSubmitting = ref(false)

// Real-time subscription
let assignmentSubscription = null

// Utility Functions
const formatPHTime = (dateString) => {
  if (!dateString) return 'Not set'
  try {
    // ✅ FIXED: Parse UTC date from database and convert to Philippine Time (UTC+8)
    const utcDate = new Date(dateString)
    
    console.log('🕐 Time conversion:')
    console.log('  UTC from DB:', dateString)
    console.log('  Parsed UTC:', utcDate.toISOString())
    
    // Format in Philippine Time (Asia/Manila timezone)
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila' // ✅ Force Philippine timezone
    }
    
    const formatted = utcDate.toLocaleString('en-US', options)
    console.log('  PH Time display:', formatted)
    
    return formatted
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid date'
  }
}

const formatAssignmentType = (type) => {
  const types = {
    'homework': 'Homework',
    'project': 'Project',
    'essay': 'Essay',
    'presentation': 'Presentation',
    'research': 'Research Paper',
    'lab': 'Lab Work',
    'other': 'Other'
  }
  return types[type] || type
}

const formatSubmissionType = (type) => {
  const types = {
    'file_upload': 'File Upload',
    'text_entry': 'Text Entry',
    'link': 'External Link',
    'physical': 'Physical Submission'
  }
  return types[type] || type
}

const formatSubmissionStatus = (status) => {
  const statuses = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'graded': 'Graded',
    'returned': 'Returned'
  }
  return statuses[status] || status
}

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const isOverdue = (dueDate) => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

const calculatePercentage = (score, total) => {
  if (!total || total === 0) return 0
  return Math.round((score / total) * 100)
}

// Helper Methods
const getSubmission = (assignmentId) => {
  return submissions.value.find(s => s.assignment_id === assignmentId)
}

const getSubmissionStatus = (assignment) => {
  const submission = getSubmission(assignment.id)
  if (!submission) return 'not_submitted'
  return submission.status
}

const getAssignmentStatusClass = () => {
  if (!selectedAssignment.value) return 'available'
  
  const submission = getSubmission(selectedAssignment.value.id)
  
  if (submission?.status === 'graded') return 'graded'
  if (submission?.status === 'submitted') return 'submitted'
  if (isOverdue(selectedAssignment.value.due_date)) {
    return selectedAssignment.value.allow_late_submission ? 'overdue-allowed' : 'overdue'
  }
  
  return 'available'
}

const getAssignmentStatusText = () => {
  if (!selectedAssignment.value) return 'Available'
  
  const submission = getSubmission(selectedAssignment.value.id)
  
  if (submission?.status === 'graded') return 'Graded'
  if (submission?.status === 'submitted') return 'Submitted - Awaiting Grade'
  if (isOverdue(selectedAssignment.value.due_date)) {
    return selectedAssignment.value.allow_late_submission 
      ? 'Overdue - Late Submission Allowed' 
      : 'Overdue - Closed'
  }
  
  return 'Available'
}

// Computed Properties
const newAssignments = computed(() => {
  const now = new Date()
  return assignments.value.filter(assignment => {
    const submission = getSubmission(assignment.id)
    const isNotSubmitted = !submission || submission.status === 'draft'
    const isNotOverdue = !assignment.due_date || new Date(assignment.due_date) > now
    return isNotSubmitted && isNotOverdue
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const pastAssignments = computed(() => {
  const now = new Date()
  return assignments.value.filter(assignment => {
    const submission = getSubmission(assignment.id)
    const isSubmitted = submission && submission.status !== 'draft'
    const isOverdue = assignment.due_date && new Date(assignment.due_date) <= now
    return isSubmitted || isOverdue
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const completedAssignments = computed(() => {
  return submissions.value.filter(s => s.status !== 'draft')
})

const canSubmit = computed(() => {
  if (!selectedAssignment.value) return false
  
  if (selectedAssignment.value.submission_type === 'text_entry') {
    return submissionData.value.text_content.trim().length > 0
  }
  if (selectedAssignment.value.submission_type === 'link') {
    return submissionData.value.link_url.trim().length > 0
  }
  if (selectedAssignment.value.submission_type === 'file_upload') {
    return selectedFiles.value.length > 0
  }
  return false
})

// Data Loading Methods
const loadStudentInfo = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push('/login')
      return false
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!profile || profile.role !== 'student') {
      alert('Student profile not found')
      return false
    }

    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('profile_id', profile.id)
      .single()

    if (!student) {
      alert('Student information not found')
      return false
    }

    studentInfo.value = {
      full_name: student.full_name,
      grade_level: student.grade_level,
      student_id: student.id
    }

    return true
  } catch (error) {
    console.error('Error loading student info:', error)
    return false
  }
}

const loadRouteParams = () => {
  const subjectId = route.params.subjectId
  const sectionId = route.params.sectionId
  const subjectName = route.query.subjectName || 'Subject'
  const sectionName = route.query.sectionName || ''

  if (!subjectId || !sectionId) {
    console.error('Missing required route parameters')
    return false
  }

  subject.value = { id: subjectId, name: subjectName }
  section.value = { id: sectionId, name: sectionName }

  return true
}

const loadAssignments = async () => {
  try {
    console.log('📚 Fetching assignments...')
    console.log('🔍 Section ID:', section.value.id)
    console.log('🔍 Student ID:', studentInfo.value.student_id)

    const { data: assignmentsData, error: assignmentsError } = await supabase
      .from('assignments')
      .select('*')
      .eq('section_id', section.value.id)
      .eq('subject_id', subject.value.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (assignmentsError) {
      console.error('❌ Error fetching assignments:', assignmentsError)
      throw assignmentsError
    }

    console.log('✅ Assignments fetched:', assignmentsData?.length || 0)
    console.log('📋 Assignments data:', assignmentsData)

    assignments.value = assignmentsData || []
    
    await loadSubmissions()
    
  } catch (error) {
    console.error('❌ Error loading assignments:', error)
    alert('Failed to load assignments: ' + error.message)
  }
}

const loadSubmissions = async () => {
  try {
    if (assignments.value.length === 0) {
      console.log('⚠️ No assignments to load submissions for')
      submissions.value = []
      return
    }

    if (!studentInfo.value.student_id) {
      console.error('❌ No student ID available')
      return
    }

    console.log('📝 Fetching submissions for student:', studentInfo.value.student_id)
    console.log('📋 Assignment IDs:', assignments.value.map(a => a.id))

    const { data: submissionsData, error: submissionsError } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('student_id', studentInfo.value.student_id)
      .in('assignment_id', assignments.value.map(a => a.id))

    if (submissionsError) {
      console.error('❌ Error fetching submissions:', submissionsError)
      throw submissionsError
    }

    console.log('✅ Submissions fetched:', submissionsData?.length || 0)
    console.log('📋 Submissions data:', submissionsData)

    submissions.value = submissionsData || []
    
  } catch (error) {
    console.error('❌ Error loading submissions:', error)
  }
}

// Real-time Subscription
const setupRealtimeSubscription = () => {
  if (!section.value.id || !subject.value.id) {
    console.warn('⚠️ Missing section or subject ID for subscription')
    return
  }

  console.log('📡 Setting up realtime subscription for section:', section.value.id)

  assignmentSubscription = supabase
    .channel(`section-${section.value.id}-assignments`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'assignments',
      filter: `section_id=eq.${section.value.id}`
    }, async (payload) => {
      console.log('📡 Assignment change detected:', payload.eventType)
      
      if (payload.eventType === 'INSERT') {
        if (payload.new.status === 'published') {
          console.log('✅ New published assignment added')
          assignments.value.unshift(payload.new)
        }
      } else if (payload.eventType === 'UPDATE') {
        const index = assignments.value.findIndex(a => a.id === payload.new.id)
        if (payload.new.status === 'published') {
          if (index !== -1) {
            console.log('✅ Assignment updated')
            assignments.value[index] = payload.new
          } else {
            console.log('✅ Assignment published, adding to list')
            assignments.value.unshift(payload.new)
          }
        } else {
          if (index !== -1) {
            console.log('⚠️ Assignment unpublished, removing from list')
            assignments.value.splice(index, 1)
          }
        }
      } else if (payload.eventType === 'DELETE') {
        console.log('🗑️ Assignment deleted')
        assignments.value = assignments.value.filter(a => a.id !== payload.old.id)
      }
      
      await loadSubmissions()
    })
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'assignment_submissions',
      filter: `student_id=eq.${studentInfo.value.student_id}`
    }, async (payload) => {
      console.log('📡 Submission change detected:', payload.eventType)
      await loadSubmissions()
    })
    .subscribe((status) => {
      console.log('📡 Subscription status:', status)
    })
}

// Navigation Methods
const goBack = () => {
  console.log('🔙 Navigating back to subjects...')
  
  // Force a fresh navigation using window.location
  // This ensures it works even after being on the page for a while
  window.location.href = '/student/subjects'
}

const viewAssignmentDetails = (assignment) => {
  selectedAssignment.value = assignment
  currentSubmission.value = getSubmission(assignment.id)
  
  submissionData.value = {
    text_content: '',
    link_url: ''
  }
  selectedFiles.value = []
}

// File Handling Methods
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
  const maxSize = 10 * 1024 * 1024
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

// File Upload Method
const uploadFiles = async () => {
  const uploadedFiles = []
  
  try {
    for (const file of selectedFiles.value) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${studentInfo.value.student_id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      console.log('📤 Uploading file:', fileName)
      
      const { data, error } = await supabase.storage
        .from('assignment-attachments')
        .upload(fileName, file)
      
      if (error) {
        console.error('❌ File upload error:', error)
        throw error
      }
      
      const { data: urlData } = supabase.storage
        .from('assignment-attachments')
        .getPublicUrl(fileName)
      
      uploadedFiles.push({
        name: file.name,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type
      })
      
      console.log('✅ File uploaded:', fileName)
    }
    
    return uploadedFiles
  } catch (error) {
    console.error('❌ Error uploading files:', error)
    throw error
  }
}

// Assignment Submission Method
const submitAssignment = async () => {
  if (!canSubmit.value || !selectedAssignment.value || !studentInfo.value.student_id) {
    alert('Cannot submit assignment')
    return
  }

  isSubmitting.value = true

  try {
    console.log('📤 Submitting assignment...')

    const submissionPayload = {
      assignment_id: selectedAssignment.value.id,
      student_id: studentInfo.value.student_id,
      submission_type: selectedAssignment.value.submission_type,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    }

    if (selectedAssignment.value.submission_type === 'text_entry') {
      submissionPayload.text_content = submissionData.value.text_content.trim()
    } else if (selectedAssignment.value.submission_type === 'link') {
      submissionPayload.link_url = submissionData.value.link_url.trim()
    } else if (selectedAssignment.value.submission_type === 'file_upload') {
      const attachments = await uploadFiles()
      submissionPayload.attachments = attachments
    }

    console.log('📋 Submission payload:', submissionPayload)

    const { data, error } = await supabase
      .from('assignment_submissions')
      .insert([submissionPayload])
      .select()
      .single()

    if (error) {
      console.error('❌ Submission error:', error)
      throw error
    }

    console.log('✅ Submission successful:', data)

    alert('✅ Assignment submitted successfully!')

    await loadSubmissions()
    selectedAssignment.value = null

  } catch (error) {
    console.error('❌ Error submitting assignment:', error)
    alert('Failed to submit assignment: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle Hooks
onMounted(async () => {
  console.log('🔧 Component mounted - initializing...')
  
  const studentLoaded = await loadStudentInfo()
  if (!studentLoaded) {
    console.error('❌ Failed to load student info')
    router.push('/login')
    return
  }

  const paramsLoaded = loadRouteParams()
  if (!paramsLoaded) {
    console.error('❌ Failed to load route params')
    alert('Missing information')
    window.location.href = '/student/subjects'
    return
  }

  console.log('📍 Route params:', {
    subjectId: subject.value.id,
    sectionId: section.value.id,
    subjectName: subject.value.name,
    sectionName: section.value.name
  })

  await loadAssignments()
  setupRealtimeSubscription()
  loading.value = false
  
  console.log('✅ Component initialization complete')
  console.log('📊 Final state:', {
    assignments: assignments.value.length,
    submissions: submissions.value.length
  })
})

onUnmounted(() => {
  console.log('🧹 Component unmounting - cleaning up...')
  
  if (assignmentSubscription) {
    supabase.removeChannel(assignmentSubscription)
    assignmentSubscription = null
  }
  
  console.log('✅ Cleanup complete')
})
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Main Container */
.take-assignment-page {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  padding: 1.5rem 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow-y: auto;
}

/* Custom Scrollbar */
.take-assignment-page::-webkit-scrollbar {
  width: 12px;
}

.take-assignment-page::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.take-assignment-page::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.take-assignment-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.dark .take-assignment-page {
  background: #181c20;
}

/* Header Section */
.section-header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1.5rem;
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

.section-header-card::before {
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

.dark .section-header-card {
  background: #23272b;
  border: 1px solid #3D8D7A;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.section-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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

.section-header-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.dark .section-header-title {
  color: #A3D1C6;
}

.section-header-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.dark .section-header-subtitle {
  color: #A3D1C6;
}

.section-header-description {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
}

.dark .section-header-description {
  color: #A3D1C6;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(61, 141, 122, 0.1);
  color: #3D8D7A;
  border: 2px solid rgba(61, 141, 122, 0.3);
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
  position: relative;
  overflow: hidden;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.back-btn:hover::before {
  left: 100%;
}

.back-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}

.back-btn svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover svg {
  transform: translateX(-2px);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(241, 245, 249, 0.5);
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-container p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 1rem 0 0 0;
  letter-spacing: 0.3px;
}

/* Main Content */
.main-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.dark .main-content {
  background: #23272b;
  border: 1px solid #3D8D7A;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(61, 141, 122, 0.3);
}

.dark .stat-card {
  background: #23272b;
  border: 1px solid #3D8D7A;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.dark .stat-value {
  color: #A3D1C6;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.dark .stat-label {
  color: #A3D1C6;
}

/* Assignments Section */
.assignments-section {
  padding: 1.5rem 2rem;
}

.assignment-category {
  margin-bottom: 2.5rem;
}

.assignment-category:last-child {
  margin-bottom: 0;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.3px;
}

.category-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.category-count {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  letter-spacing: 0.3px;
}

/* Assignment Grid */
.assignment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1rem;
}

.assignment-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.assignment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.assignment-card:hover::before {
  left: 100%;
}

.assignment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.assignment-card.new-assignment {
  border-color: rgba(61, 141, 122, 0.4);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
}

.assignment-card.new-assignment:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.15));
  border-color: #3D8D7A;
  box-shadow: 0 12px 28px rgba(61, 141, 122, 0.2);
}

.assignment-card.past-assignment {
  border-color: rgba(203, 213, 225, 0.8);
}

.assignment-card.past-assignment:hover {
  border-color: #94a3b8;
  background: rgba(248, 250, 252, 0.95);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
}

.assignment-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.new-badge {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.submitted-badge {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.graded-badge,
.completed-badge {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.overdue-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.assignment-header {
  margin-bottom: 1rem;
  padding-right: 80px;
}

.assignment-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

.assignment-type {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3D8D7A;
  font-weight: 600;
  font-size: 0.8rem;
}

.type-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assignment-description {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-weight: 500;
}

.assignment-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
}

.assignment-due-date {
  padding: 0.75rem;
  background: rgba(61, 141, 122, 0.08);
  border-radius: 8px;
  border-left: 4px solid #3D8D7A;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.assignment-due-date.overdue {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #dc2626;
}

.due-label {
  font-weight: 700;
  color: #64748b;
  margin-right: 8px;
}

.due-time {
  color: #1e293b;
  font-weight: 700;
}

.overdue-label {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 8px;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.assignment-score {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 0.9rem;
}

.score-label {
  color: #64748b;
}

.score-value {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
  font-weight: 800;
}

.score-percentage {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.assignment-result {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.result-score {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
  font-weight: 700;
  font-size: 0.9rem;
}

.result-score .score-label {
  color: #64748b;
}

.result-score .score-value {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
  font-weight: 800;
}

.result-details {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.assignment-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  text-decoration: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3d);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.95);
  color: #3D8D7A;
  border: 2px solid rgba(61, 141, 122, 0.3);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3.5rem 2rem;
  color: #94a3b8;
  gap: 1.25rem;
}

.empty-icon {
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: -0.2px;
}

.empty-state p {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

/* Assignment Details View */
.assignment-details-view {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.content-card {
  min-height: 100%;
}

.slide-up {
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

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
  background: rgba(248, 250, 252, 0.8);
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3D8D7A;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: rgba(61, 141, 122, 0.1);
  border: 2px solid rgba(61, 141, 122, 0.3);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.back-link:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  transform: translateX(-4px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}

.assignment-status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.assignment-status-badge.available {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.assignment-status-badge.submitted {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.assignment-status-badge.graded {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.assignment-status-badge.overdue {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.assignment-status-badge.overdue-allowed {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.details-content {
  padding: 2rem;
}

.assignment-info-card {
  max-width: 800px;
  margin: 0 auto;
}

.details-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.assignment-type-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.assignment-type-display:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
}

.assignment-type-display .type-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.type-content {
  flex: 1;
}

.type-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.type-value {
  display: block;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.details-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item:hover {
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.info-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.dark .info-label {
  color: #A3D1C6;
}

.info-value {
  display: block;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.dark .info-value {
  color: #A3D1C6;
}

/* Attachments Section */
.attachments-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.attachments-title {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.3px;
}

.attachments-title::before {
  content: '📎';
  font-size: 1.2rem;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(226, 232, 240, 0.5);
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.attachment-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(61, 141, 122, 0.1), transparent);
  transition: left 0.5s ease;
}

.attachment-item:hover::before {
  left: 100%;
}

.attachment-item:hover {
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.attachment-name {
  font-weight: 700;
  flex: 1;
  font-size: 0.9rem;
}

.attachment-size {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Submission Section */
.submission-section {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.submission-title {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.3px;
}

.submission-title::before {
  content: '📝';
  font-size: 1.3rem;
}

/* Existing Submission */
.existing-submission {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.submission-status-card {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
}

.submission-status-card.submitted {
  background: rgba(6, 182, 212, 0.1);
  border: 2px solid rgba(6, 182, 212, 0.3);
}

.submission-status-card.graded {
  background: rgba(139, 92, 246, 0.1);
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-label {
  font-weight: 700;
  color: #64748b;
  font-size: 0.9rem;
}

.status-value {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.9rem;
}

.submission-date {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 600;
}

.late-notice {
  color: #d97706;
  font-weight: 700;
  font-size: 0.85rem;
}

.penalty-info {
  color: #dc2626;
  font-weight: 800;
}

.submitted-text h4,
.submitted-link h4,
.submitted-files h4 {
  color: #64748b;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.text-content {
  background: rgba(247, 250, 252, 0.9);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  line-height: 1.6;
  color: #1e293b;
  white-space: pre-wrap;
  font-weight: 500;
}

.link-value {
  color: #3D8D7A;
  text-decoration: none;
  font-weight: 700;
  padding: 0.75rem 1rem;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 6px;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(61, 141, 122, 0.3);
}

.link-value:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.875rem 1rem;
  background: rgba(247, 250, 252, 0.9);
  border: 2px solid rgba(226, 232, 240, 0.5);
  border-radius: 8px;
  text-decoration: none;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
}

.file-item:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

/* Grading Section */
.grading-section {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
}

.grade-display {
  margin-bottom: 1rem;
}

.grade-score {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 700;
}

.score-label {
  color: #64748b;
}

.score-value {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.3rem;
  font-weight: 800;
}

.score-percentage {
  color: #64748b;
  font-weight: 600;
}

.teacher-feedback {
  margin-bottom: 1rem;
}

.teacher-feedback h4 {
  color: #64748b;
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.feedback-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  color: #1e293b;
  line-height: 1.6;
  font-style: italic;
  font-weight: 500;
}

.graded-date {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

/* Submission Form */
.submission-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  letter-spacing: -0.1px;
}

.text-input,
.link-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
}

.text-input:focus,
.link-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.text-input {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
}

/* Upload Area */
.upload-area {
  border: 3px dashed rgba(203, 213, 225, 0.8);
  border-radius: 12px;
  padding: 2.5rem 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(247, 250, 252, 0.9);
}

.upload-area:hover {
  border-color: #3D8D7A;
  background: rgba(241, 245, 249, 0.9);
}

.upload-area.dragover {
  border-color: #3D8D7A;
  background: rgba(61, 141, 122, 0.08);
}

.upload-content svg {
  margin-bottom: 1rem;
  color: #64748b;
}

.upload-text {
  font-size: 1rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.2px;
}

.upload-hint {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 600;
}

/* Selected Files */
.selected-files {
  margin-top: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 8px;
  padding: 1rem;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border: 2px solid rgba(226, 232, 240, 0.5);
}

.file-preview:last-child {
  margin-bottom: 0;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 700;
  color: #1e293b;
  display: block;
  font-size: 0.9rem;
  letter-spacing: -0.1px;
}

.file-size {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.remove-file {
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.remove-file:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  transform: scale(1.1);
}

/* Submit Button */
.btn-submit-assignment {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
  margin-bottom: 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-submit-assignment::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-submit-assignment:hover:not(:disabled)::before {
  left: 100%;
}

.btn-submit-assignment:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3d);
  border-color: #2d6a5a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.4);
}

.btn-submit-assignment:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.late-warning {
  background: rgba(251, 191, 36, 0.1);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #92400e;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.2px;
}

/* Overdue Message */
.overdue-message {
  text-align: center;
  padding: 2.5rem;
  background: rgba(254, 215, 215, 0.5);
  border: 2px solid rgba(252, 129, 129, 0.5);
  border-radius: 12px;
  color: #7f1d1d;
}

.overdue-message svg {
  margin-bottom: 1rem;
  color: #dc2626;
}

.overdue-message h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.3px;
}

.overdue-message p {
  font-size: 0.95rem;
  margin: 0;
  font-weight: 600;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .take-assignment-page {
    padding: 12px;
  }

  .section-header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 24px 20px;
  }

  .section-header-left {
    flex-direction: column;
    text-align: center;
  }

  .section-header-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .assignments-section {
    padding: 20px;
  }

  .assignment-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .assignment-card {
    padding: 20px;
  }

  .assignment-header {
    padding-right: 70px;
  }

  .assignment-title {
    font-size: 1.1rem;
  }

  .details-content {
    padding: 20px;
  }

  .details-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .submission-section {
    padding: 20px;
  }

  .upload-area {
    padding: 30px 15px;
  }

  .details-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .section-header-title {
    font-size: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .assignment-grid {
    gap: 12px;
  }

  .assignment-card {
    padding: 16px;
  }

  .assignment-badge {
    position: static;
    display: inline-block;
    margin-bottom: 12px;
  }

  .assignment-header {
    padding-right: 0;
  }

  .details-content {
    padding: 16px;
  }

  .submission-section {
    padding: 16px;
  }
}
</style>