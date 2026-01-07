<template>
  <div class="grades-page">
    <!-- Header Section -->
    <div class="section-header-card">
      <div class="section-header-content">
        <div class="section-header-left">
          <div class="section-header-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          
          <div class="header-text">
            <h1 class="section-header-title">{{ subject.name }} - Grades</h1>
            <p class="section-header-subtitle">{{ section.name }}</p>
            <p class="section-header-description">{{ studentInfo.full_name }} • Grade {{ studentInfo.grade_level }}</p>
            <div class="academic-info">
              <span class="academic-year">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                S.Y. {{ currentSchoolYear }}
              </span>
              <span class="quarter-badge">{{ currentQuarter }}</span>
            </div>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="goBack" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            Back to Subjects
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading grades...</p>
    </div>

    <!-- Grades Overview -->
    <div v-else class="main-content">
      <!-- Stats Overview -->
      <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ averageGrade }}%</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedQuizzes + completedAssignments }}</div>
            <div class="stat-label">Graded Items</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ highestGrade }}%</div>
            <div class="stat-label">Highest Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ lowestGrade }}%</div>
            <div class="stat-label">Lowest Score</div>
          </div>
      </div>

      <!-- Quarter Filter Section -->
      <div class="quarter-filter-section">
        <div class="filter-header">
          <h3 class="filter-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Filter by Quarter
          </h3>
        </div>
        <div class="quarter-pills">
          <button 
            @click="selectedQuarterId = null"
            :class="['quarter-pill', { 'active': selectedQuarterId === null }]"
          >
            <span class="pill-label">All Quarters</span>
            <span class="pill-count">{{ allGrades.length }}</span>
          </button>
          <button 
            v-for="period in availableGradingPeriods" 
            :key="period.id"
            @click="selectedQuarterId = period.id"
            :class="['quarter-pill', { 'active': selectedQuarterId === period.id }]"
          >
            <span class="pill-label">{{ period.period_name }}</span>
            <span class="pill-count">{{ getGradesCountByQuarter(period.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Grades List -->
      <div class="grades-section">
        <!-- Recent Quizzes -->
        <div v-if="recentQuizzes.length > 0" class="quiz-category">
          <div class="category-header">
            <h2 class="category-title">
              <span class="category-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
              Recent Submissions
            </h2>
            <span class="category-count">{{ recentQuizzes.length }}</span>
          </div>
          <div class="grades-list">
            <div v-for="item in recentQuizzes" :key="item.id" class="grade-card recent-grade">
              <div class="grade-header">
                <div class="quiz-info">
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <span class="item-type-badge" :class="item.type === 'quiz' ? 'type-quiz' : 'type-assignment'">
                      {{ item.type === 'quiz' ? 'Quiz' : 'Assignment' }}
                    </span>
                    <span v-if="item.quarter_info" class="quarter-info-badge" :title="item.quarter_info.school_year">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      {{ item.quarter_info.period_name }} • {{ item.quarter_info.school_year }}
                    </span>
                    <h3 class="quiz-title">{{ item.title }}</h3>
                  </div>
                  <div class="quiz-code">
                    <span class="code-label">{{ item.type === 'quiz' ? 'Code:' : 'Type:' }}</span>
                    <span class="code-value">{{ item.quiz_code }}</span>
                  </div>
                </div>
                <div class="grade-status" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </div>
              </div>

              <div class="grade-content">
                <div class="grade-info">
                  <div v-if="item.best_percentage !== null" class="score-display">
                    <div class="score-circle" :class="getScoreClass(item.best_percentage)">
                      <span class="score-value">{{ item.best_percentage }}%</span>
                    </div>
                    <div class="score-details">
                      <div class="score-fraction">
                        {{ item.type === 'quiz' ? calculateScore(item.best_percentage, item.number_of_questions) : Math.round(item.best_percentage * item.total_points / 100) }} 
                        / 
                        {{ item.type === 'quiz' ? item.number_of_questions : item.total_points }}
                      </div>
                      <div class="score-label">{{ item.type === 'quiz' ? 'Questions Correct' : 'Points Earned' }}</div>
                    </div>
                  </div>
                  <div v-else class="score-pending">
                    <div class="pending-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div class="pending-text">Grade Pending</div>
                  </div>
                </div>

                <div class="submission-info">
                  <div class="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Submitted: {{ formatPHTime(item.latest_attempt_date) }}</span>
                  </div>
                  <div v-if="item.type === 'quiz'" class="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span>{{ item.total_attempts }} attempt(s)</span>
                  </div>
                  <div v-if="item.type === 'quiz' && item.time_taken_minutes" class="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ item.time_taken_minutes }} minutes</span>
                  </div>
                  <div v-if="item.type === 'assignment' && item.is_late" class="info-item late-warning">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span>Late Submission ({{ item.penalty_applied }}% penalty)</span>
                  </div>
                </div>
              </div>

              <div class="grade-actions">
                <button v-if="item.type === 'quiz' && (item.status === 'completed' || item.status === 'submitted')" @click="viewQuizPreview(item)" class="btn btn-view pending">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  View Submitted Quiz
                </button>
                <button v-else-if="item.type === 'quiz' && (item.status === 'graded' || item.status === 'reviewed')" @click="viewQuizPreview(item)" class="btn btn-view graded">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  View Answers & Results
                </button>
                <button v-else-if="item.type === 'assignment' && item.status === 'graded'" @click="viewAssignmentFeedback(item)" class="btn btn-view graded">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  View Feedback
                </button>
                <button v-else-if="item.type === 'assignment'" @click="viewAssignmentFeedback(item)" class="btn btn-view pending">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  View Submission
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- All Grades History -->
        <div v-if="allGrades.length > 0" class="quiz-category">
          <div class="category-header">
            <h2 class="category-title">
              <span class="category-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </span>
              Grade History
            </h2>
            <span class="category-count">{{ allGrades.length }}</span>
          </div>
          <div class="grades-table-container">
            <table class="grades-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Quarter</th>
                  <th class="center-header">Score</th>
                  <th class="center-header">Status</th>
                  <th>Submitted</th>
                  <th class="center-header">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredGrades" :key="item.type + '-' + item.id" class="grade-row">
                  <td class="type-cell">
                    <span class="item-type-badge-small" :class="item.type === 'quiz' ? 'type-quiz' : 'type-assignment'">
                      {{ item.type === 'quiz' ? 'Quiz' : 'Assignment' }}
                    </span>
                  </td>
                  <td class="quiz-cell">
                    <div class="quiz-name">{{ item.title }}</div>
                    <div class="quiz-code-small">{{ item.quiz_code }}</div>
                  </td>
                  <td class="quarter-cell">
                    <div v-if="item.quarter_info" class="quarter-info-small">
                      <div class="quarter-name">{{ item.quarter_info.period_name }}</div>
                      <div class="school-year-small">{{ item.quarter_info.school_year }}</div>
                    </div>
                    <div v-else class="quarter-info-small">
                      <div class="quarter-name text-muted">Not assigned</div>
                    </div>
                  </td>
                  <td class="score-cell">
                    <div v-if="item.best_percentage !== null" class="score-badge" :class="getScoreClass(item.best_percentage)">
                      {{ item.best_percentage }}%
                    </div>
                    <div v-else class="score-pending-small">Pending</div>
                  </td>
                  <td class="status-cell">
                    <div class="status-badge" :class="getStatusClass(item.status)">
                      {{ getStatusText(item.status) }}
                    </div>
                  </td>
                  <td class="date-cell">
                    <div v-if="item.latest_attempt_date" class="date-text">
                      {{ formatShortDate(item.latest_attempt_date) }}
                    </div>
                    <div v-else class="date-text">-</div>
                  </td>
                  <td class="actions-cell">
                    <button v-if="item.type === 'quiz' && (item.status === 'completed' || item.status === 'submitted')" @click="viewQuizPreview(item)" class="btn-table pending" title="View Submitted Quiz">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="btn-text">View Submitted</span>
                    </button>
                    <button v-else-if="item.type === 'quiz' && (item.status === 'graded' || item.status === 'reviewed')" @click="viewQuizPreview(item)" class="btn-table graded" title="View Answers & Results">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="btn-text">View Results</span>
                    </button>
                    <button v-else-if="item.type === 'assignment' && item.status === 'graded'" @click="viewAssignmentFeedback(item)" class="btn-table graded" title="View Assignment Feedback">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span class="btn-text">View Feedback</span>
                    </button>
                    <button v-else-if="item.type === 'assignment'" @click="viewAssignmentFeedback(item)" class="btn-table pending" title="View Submission">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span class="btn-text">View Submission</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="allGrades.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 17H7v-2a3 3 0 013-3h4a3 3 0 013 3v2h-2v-2a1 1 0 00-1-1h-4a1 1 0 00-1 1v2zM6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3zm0 2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1H6z"/>
            </svg>
          </div>
          <h3>No Grades Yet</h3>
          <p>You haven't submitted any quizzes or assignments for this subject yet.</p>
          <button @click="goBack" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            Back to Subject
          </button>
        </div>
      </div>
    </div>

    <!-- Quiz Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click.self="showPreviewModal = false">
      <div class="preview-modal">
        <div class="modal-header">
          <h3>{{ selectedQuiz?.title }} - {{ modalTitle }}</h3>
          <button @click="showPreviewModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingPreview" class="loading-answers">
            <div class="spinner"></div>
            <p>Loading quiz preview...</p>
          </div>
          <div v-else class="preview-content">
            <!-- Score Summary -->
            <div class="preview-summary">
              <div class="summary-item">
                <span class="summary-label">Your Score:</span>
                <span class="summary-value" :class="getScoreClass(selectedQuiz.best_percentage)">
                  {{ selectedQuiz.best_percentage !== null ? `${selectedQuiz.best_percentage}% (${calculateScore(selectedQuiz.best_percentage, selectedQuiz.number_of_questions)}/${selectedQuiz.number_of_questions})` : 'Pending' }}
                </span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Status:</span>
                <span class="summary-value">{{ getStatusText(selectedQuiz.status) }}</span>
              </div>
              <div v-if="selectedQuiz.latest_attempt_date" class="summary-item">
                <span class="summary-label">Submitted:</span>
                <span class="summary-value">{{ formatPHTime(selectedQuiz.latest_attempt_date) }}</span>
              </div>
              <div v-if="selectedAttempt?.teacher_feedback" class="summary-item full-width">
                <span class="summary-label">Overall Teacher Feedback:</span>
                <div class="teacher-feedback-box">{{ selectedAttempt.teacher_feedback }}</div>
              </div>
            </div>

            <!-- Questions and Answers -->
            <div v-for="answer in previewAnswers" :key="answer.question_id" class="answer-item">
              <div class="answer-header">
                <div class="question-number">Q{{ answer.question_number }}</div>
                <div v-if="isGraded" class="answer-result" :class="answer.is_correct ? 'correct' : 'incorrect'">
                  {{ answer.is_correct ? '✓ Correct' : '✗ Incorrect' }}
                </div>
              </div>
              <div class="question-text">{{ answer.question_text }}</div>
              
              <!-- Student's Answer -->
              <div class="student-answer">
                <div class="answer-label">Your Answer:</div>
                <div class="answer-content" :class="isGraded ? (answer.is_correct ? 'correct-answer' : 'wrong-answer') : 'submitted-answer'">
                  {{ getStudentAnswerText(answer) }}
                </div>
              </div>

              <!-- Correct Answer (if graded and wrong) -->
              <div v-if="isGraded && !answer.is_correct" class="correct-answer-section">
                <div class="answer-label">Correct Answer:</div>
                <div class="answer-content correct-answer">
                  {{ getCorrectAnswerText(answer) }}
                </div>
              </div>

              <!-- Teacher Comment (if any) -->
              <div v-if="answer.teacher_comment && answer.teacher_comment.trim() !== ''" class="teacher-comment">
                <div class="comment-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; margin-right: 0.25rem;">
                    <path d="M8 10h8M8 14h8M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                  </svg>
                  Teacher Comment:
                </div>
                <div class="comment-text">{{ answer.teacher_comment }}</div>
              </div>
            </div>

            <!-- No answers message -->
            <div v-if="previewAnswers.length === 0" class="no-answers">
              <p>No answers found for this quiz attempt.</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showPreviewModal = false" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/supabase.js';

export default {
  name: 'StudentGrades',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const loading = ref(true);
    const studentInfo = ref({ full_name: 'Loading...', grade_level: '', student_id: null });
    const subject = ref({ id: '', name: 'Subject' });
    const section = ref({ id: '', name: '' });
    const grades = ref([]);
    const showPreviewModal = ref(false);
    const selectedQuiz = ref(null);
    const selectedAttempt = ref(null);
    const previewAnswers = ref([]);
    const loadingPreview = ref(false);
    
    // School Year and Quarter Management
    const currentSchoolYear = ref('');
    const currentQuarter = ref('');
    const availableGradingPeriods = ref([]);
    const selectedQuarterId = ref(null);
    let schoolYearSubscription = null;
    let gradingPeriodSubscription = null;

    let gradesSubscription = null;

    // Computed
    const recentQuizzes = computed(() => {
      return grades.value
        .filter(g => g.latest_attempt_date)
        .sort((a, b) => new Date(b.latest_attempt_date) - new Date(a.latest_attempt_date))
        .slice(0, 5);
    });

    const allGrades = computed(() => {
      return [...grades.value]
        .sort((a, b) => new Date(b.latest_attempt_date || 0) - new Date(a.latest_attempt_date || 0));
    });

    const filteredGrades = computed(() => {
      if (selectedQuarterId.value === null) {
        return allGrades.value;
      }
      return allGrades.value.filter(grade => 
        grade.grading_period_id === selectedQuarterId.value
      );
    });

    const getGradesCountByQuarter = (quarterId) => {
      return grades.value.filter(grade => grade.grading_period_id === quarterId).length;
    };

    const completedQuizzes = computed(() => {
      return grades.value.filter(g => g.status === 'completed' || g.status === 'graded').length;
    });

    const completedAssignments = computed(() => {
      return grades.value.filter(g => g.type === 'assignment' && (g.status === 'completed' || g.status === 'graded')).length;
    });

    const averageGrade = computed(() => {
      const completed = grades.value.filter(g => g.best_percentage !== null);
      if (completed.length === 0) return 0;
      const sum = completed.reduce((acc, g) => acc + g.best_percentage, 0);
      return Math.round(sum / completed.length);
    });

    const highestGrade = computed(() => {
      const scores = grades.value.filter(g => g.best_percentage !== null).map(g => g.best_percentage);
      return scores.length > 0 ? Math.max(...scores) : 0;
    });

    const lowestGrade = computed(() => {
      const scores = grades.value.filter(g => g.best_percentage !== null).map(g => g.best_percentage);
      return scores.length > 0 ? Math.min(...scores) : 0;
    });

    const isGraded = computed(() => {
      return selectedQuiz.value && (selectedQuiz.value.status === 'graded' || selectedQuiz.value.status === 'reviewed');
    });

    const modalTitle = computed(() => {
      if (!selectedQuiz.value) return '';
      return isGraded.value ? 'Answers & Results' : 'Submitted Quiz';
    });

    // Utility Functions
    const formatPHTime = (utcDateString) => {
      if (!utcDateString) return 'Not available';
      const date = new Date(utcDateString);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Manila'
      };
      return date.toLocaleString('en-PH', options) + ' PHT';
    };

    const formatShortDate = (utcDateString) => {
      if (!utcDateString) return '-';
      const date = new Date(utcDateString);
      const options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' };
      return date.toLocaleString('en-PH', options);
    };

    // Auto-grading function
    const autoGradeAttempt = async (attemptId) => {
      try {
        console.log('Auto-grading attempt:', attemptId);

        // Get the attempt details
        const { data: attempt, error: attemptError } = await supabase
          .from('quiz_attempts')
          .select('*, quizzes(*)')
          .eq('id', attemptId)
          .single();

        if (attemptError) throw attemptError;

        // Get all student answers for this attempt
        const { data: studentAnswers, error: answersError } = await supabase
          .from('student_answers')
          .select('*')
          .eq('attempt_id', attemptId);

        if (answersError) throw answersError;

        let totalScore = 0;
        const maxScore = attempt.max_score;
        const gradedAnswers = [];

        // Grade each answer
        for (const answer of studentAnswers) {
          let isCorrect = false;
          let pointsEarned = 0;

          // Get question details
          const { data: question, error: questionError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('id', answer.question_id)
            .single();

          if (questionError) {
            console.error('Error fetching question:', questionError);
            continue;
          }

          // Grade based on question type
          if (question.question_type === 'multiple_choice') {
            // Get the selected option
            const { data: selectedOption, error: optionError } = await supabase
              .from('question_options')
              .select('*')
              .eq('id', answer.selected_option_id)
              .single();

            if (!optionError && selectedOption) {
              isCorrect = selectedOption.is_correct === true;
              pointsEarned = isCorrect ? answer.points_possible : 0;
            }
          } else if (question.question_type === 'true_false' || question.question_type === 'fill_blank') {
            // Get correct answer
            const { data: correctAnswer, error: correctError } = await supabase
              .from('question_answers')
              .select('*')
              .eq('question_id', answer.question_id)
              .single();

            if (!correctError && correctAnswer) {
              const studentAns = (answer.answer_text || '').trim();
              const correctAns = correctAnswer.correct_answer.trim();

              if (correctAnswer.case_sensitive) {
                isCorrect = studentAns === correctAns;
              } else {
                isCorrect = studentAns.toLowerCase() === correctAns.toLowerCase();
              }

              pointsEarned = isCorrect ? answer.points_possible : 0;
            }
          }

          totalScore += pointsEarned;

          // Update student answer with grading
          gradedAnswers.push({
            id: answer.id,
            is_correct: isCorrect,
            points_earned: pointsEarned
          });
        }

        // Update all student answers
        for (const gradedAnswer of gradedAnswers) {
          await supabase
            .from('student_answers')
            .update({
              is_correct: gradedAnswer.is_correct,
              points_earned: gradedAnswer.points_earned
            })
            .eq('id', gradedAnswer.id);
        }

        // Calculate percentage
        const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

        // Update quiz attempt with auto-graded status
        const { error: updateError } = await supabase
          .from('quiz_attempts')
          .update({
            total_score: totalScore,
            percentage: Math.round(percentage * 100) / 100,
            status: 'graded',
            auto_graded: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', attemptId);

        if (updateError) throw updateError;

        console.log('Auto-grading completed:', {
          attemptId,
          totalScore,
          maxScore,
          percentage
        });

        return { success: true, totalScore, percentage };
      } catch (error) {
        console.error('Error in auto-grading:', error);
        return { success: false, error };
      }
    };

    // Helper function to check if answer is correct
    const checkIfAnswerIsCorrect = (answer, studentAnswer, correctAnswerData) => {
      if (studentAnswer.points_earned >= studentAnswer.points_possible) {
        return true;
      }

      if (studentAnswer.points_earned === 0) {
        return false;
      }

      if (answer.question_type === 'multiple_choice') {
        const selectedOption = answer.options.find(opt => opt.id === studentAnswer.selected_option_id);
        return selectedOption ? selectedOption.is_correct === true : false;
      } else if (answer.question_type === 'true_false' || answer.question_type === 'fill_blank') {
        if (!correctAnswerData) return false;
        
        const studentAns = (studentAnswer.answer_text || '').trim();
        const correctAns = correctAnswerData.correct_answer.trim();
        
        if (correctAnswerData.case_sensitive) {
          return studentAns === correctAns;
        } else {
          return studentAns.toLowerCase() === correctAns.toLowerCase();
        }
      }

      return studentAnswer.is_correct === true;
    };

    // Load Functions
    const loadStudentInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login');
          return false;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('auth_user_id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          alert('Failed to load profile');
          return false;
        }

        if (!profile || profile.role !== 'student') {
          alert('Student profile not found');
          return false;
        }

        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', profile.id)
          .single();

        if (studentError) {
          console.error('Student error:', studentError);
          alert('Student information not found');
          return false;
        }

        if (!student) {
          alert('Student information not found');
          return false;
        }

        studentInfo.value = {
          full_name: student.full_name,
          grade_level: student.grade_level,
          student_id: student.id
        };

        console.log('Loaded student info:', studentInfo.value);
        return true;
      } catch (error) {
        console.error('Error loading student info:', error);
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
      
      console.log('Route params loaded:', { subject: subject.value, section: section.value });
      return true;
    };

    const fetchSchoolYearAndQuarter = async () => {
      try {
        console.log('📅 Fetching active school year and quarter from database...');
        
        // Fetch active school year
        const { data: activeSchoolYear, error: schoolYearError } = await supabase
          .from('school_years')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();

        if (schoolYearError) {
          console.error('❌ Error fetching school year:', schoolYearError);
          currentSchoolYear.value = 'N/A';
        } else if (activeSchoolYear) {
          currentSchoolYear.value = activeSchoolYear.year_name;
          console.log('✅ Active School Year:', currentSchoolYear.value);

          // Fetch active grading period for this school year
          const { data: activeGradingPeriod, error: gradingPeriodError } = await supabase
            .from('grading_periods')
            .select('*')
            .eq('school_year_id', activeSchoolYear.id)
            .eq('is_active', true)
            .maybeSingle();

          if (gradingPeriodError) {
            console.error('❌ Error fetching grading period:', gradingPeriodError);
            currentQuarter.value = 'N/A';
          } else if (activeGradingPeriod) {
            currentQuarter.value = activeGradingPeriod.period_name;
            console.log('✅ Active Quarter:', currentQuarter.value);
          } else {
            console.warn('⚠️ No active grading period found');
            currentQuarter.value = 'No Active Quarter';
          }

          // Fetch all grading periods for this school year (for filter options)
          const { data: allPeriods, error: periodsError } = await supabase
            .from('grading_periods')
            .select('*')
            .eq('school_year_id', activeSchoolYear.id)
            .order('period_number', { ascending: true });

          if (!periodsError && allPeriods) {
            availableGradingPeriods.value = allPeriods.map(period => ({
              id: period.id,
              period_name: period.period_name,
              period_number: period.period_number,
              school_year: activeSchoolYear.year_name
            }));
            console.log('✅ Available grading periods:', availableGradingPeriods.value.length);
          }
        } else {
          console.warn('⚠️ No active school year found');
          currentSchoolYear.value = 'No Active Year';
          currentQuarter.value = 'N/A';
        }

        console.log(`📅 School Year: ${currentSchoolYear.value}, Quarter: ${currentQuarter.value}`);
      } catch (error) {
        console.error('❌ Error in fetchSchoolYearAndQuarter:', error);
        currentSchoolYear.value = 'Error';
        currentQuarter.value = 'Error';
      }
    };

    const setupSchoolYearSubscription = () => {
      try {
        console.log('🔔 Setting up real-time subscription for school year updates...');

        // Subscribe to school_years table changes
        schoolYearSubscription = supabase
          .channel('school_years_changes_grades')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'school_years'
            },
            (payload) => {
              console.log('🔔 School year changed:', payload);
              fetchSchoolYearAndQuarter();
            }
          )
          .subscribe();

        // Subscribe to grading_periods table changes
        gradingPeriodSubscription = supabase
          .channel('grading_periods_changes_grades')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'grading_periods'
            },
            (payload) => {
              console.log('🔔 Grading period changed:', payload);
              fetchSchoolYearAndQuarter();
            }
          )
          .subscribe();

        console.log('✅ Real-time subscriptions established');
      } catch (error) {
        console.error('❌ Error setting up school year subscription:', error);
      }
    };

    const cleanupSchoolYearSubscription = () => {
      console.log('🔄 Cleaning up school year subscriptions...');
      
      if (schoolYearSubscription) {
        supabase.removeChannel(schoolYearSubscription);
        schoolYearSubscription = null;
      }
      
      if (gradingPeriodSubscription) {
        supabase.removeChannel(gradingPeriodSubscription);
        gradingPeriodSubscription = null;
      }
    };

    const loadGrades = async () => {
      try {
        if (!studentInfo.value.student_id) {
          console.error('No student ID available');
          return;
        }

        if (!section.value.id) {
          console.error('No section ID available');
          return;
        }

        console.log('Loading grades for student:', studentInfo.value.student_id, 'section:', section.value.id);

        const processedGrades = [];

        // ============ LOAD QUIZZES ============
        const { data: sectionQuizzes, error: quizzesError } = await supabase
          .from('quizzes')
          .select('id, title, quiz_code, description, number_of_questions, attempts_allowed, section_id, grading_period_id')
          .eq('section_id', section.value.id)
          .eq('status', 'published');

        if (quizzesError) {
          console.error('Error loading quizzes:', quizzesError);
        } else {
          console.log('Found quizzes for section:', sectionQuizzes?.length || 0);

          if (sectionQuizzes && sectionQuizzes.length > 0) {
            const quizIds = sectionQuizzes.map(q => q.id);

            // Get ALL attempts for this student (that have been submitted)
            const { data: attempts, error: attemptsError } = await supabase
              .from('quiz_attempts')
              .select('*')
              .eq('student_id', studentInfo.value.student_id)
              .in('quiz_id', quizIds)
              .in('status', ['submitted', 'graded', 'reviewed'])
              .order('created_at', { ascending: false });

            if (attemptsError) {
              console.error('Error loading attempts:', attemptsError);
            } else {
              console.log('Found quiz attempts:', attempts?.length || 0);
              
              if (attempts && attempts.length > 0) {
                console.log('Quiz attempts details:', attempts.map(a => ({
                  id: a.id,
                  quiz_id: a.quiz_id,
                  status: a.status,
                  submitted_at: a.submitted_at,
                  percentage: a.percentage
                })));
              }

              // Auto-grade any submitted attempts that haven't been graded
              if (attempts && attempts.length > 0) {
                for (const attempt of attempts) {
                  if (attempt.status === 'submitted' && !attempt.auto_graded) {
                    console.log('Found ungraded attempt, auto-grading:', attempt.id);
                    await autoGradeAttempt(attempt.id);
                  }
                }

                // Reload attempts after auto-grading
                const { data: updatedAttempts, error: reloadError } = await supabase
                  .from('quiz_attempts')
                  .select('*')
                  .eq('student_id', studentInfo.value.student_id)
                  .in('quiz_id', quizIds)
                  .in('status', ['submitted', 'graded', 'reviewed'])
                  .order('created_at', { ascending: false });

                if (!reloadError && updatedAttempts) {
                  attempts.length = 0;
                  attempts.push(...updatedAttempts);
                  console.log('Reloaded quiz attempts after auto-grading:', updatedAttempts.length);
                }
              }

              if (attempts && attempts.length > 0) {
                // Build a map of quizzes
                const quizMap = {};
                sectionQuizzes.forEach(quiz => {
                  quizMap[quiz.id] = {
                    quiz: quiz,
                    attempts: []
                  };
                });

                // Group attempts by quiz
                attempts.forEach(attempt => {
                  if (quizMap[attempt.quiz_id]) {
                    quizMap[attempt.quiz_id].attempts.push(attempt);
                  }
                });

                // Process each quiz
                Object.values(quizMap).forEach(quizData => {
                  if (quizData.attempts.length === 0) return;

                  const { quiz, attempts: quizAttempts } = quizData;

                  // Find best percentage
                  let bestAttempt = quizAttempts[0];
                  quizAttempts.forEach(attempt => {
                    if (attempt.percentage !== null && attempt.percentage !== undefined) {
                      if (bestAttempt.percentage === null || bestAttempt.percentage === undefined) {
                        bestAttempt = attempt;
                      } else if (attempt.percentage > bestAttempt.percentage) {
                        bestAttempt = attempt;
                      }
                    }
                  });

                  // Find latest attempt
                  const latestAttempt = quizAttempts[0];

                  // Determine status
                  let resultStatus = 'completed';
                  if (latestAttempt.status === 'graded' || latestAttempt.status === 'reviewed') {
                    resultStatus = 'graded';
                  } else if (latestAttempt.status === 'submitted') {
                    resultStatus = 'submitted';
                  }

                  // Find the quarter info for this quiz
                  let quarterInfo = null;
                  if (quiz.grading_period_id) {
                    const period = availableGradingPeriods.value.find(p => p.id === quiz.grading_period_id);
                    if (period) {
                      quarterInfo = {
                        period_name: period.period_name,
                        period_number: period.period_number,
                        school_year: period.school_year
                      };
                    }
                  }

                  processedGrades.push({
                    type: 'quiz',
                    id: quiz.id,
                    title: quiz.title,
                    quiz_code: quiz.quiz_code,
                    description: quiz.description,
                    number_of_questions: quiz.number_of_questions || 1,
                    attempts_allowed: quiz.attempts_allowed || 999,
                    best_percentage: bestAttempt.percentage !== null ? bestAttempt.percentage : null,
                    total_attempts: quizAttempts.length,
                    latest_attempt_date: latestAttempt.submitted_at,
                    status: resultStatus,
                    time_taken_minutes: latestAttempt.time_taken_minutes,
                    visible_to_student: true,
                    grading_period_id: quiz.grading_period_id,
                    quarter_info: quarterInfo
                  });
                });
              }
            }
          }
        }

        // ============ LOAD ASSIGNMENTS ============
        const { data: sectionAssignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select('id, title, description, total_points, due_date, assignment_type, section_id, grading_period_id')
          .eq('section_id', section.value.id)
          .eq('status', 'published');

        if (assignmentsError) {
          console.error('Error loading assignments:', assignmentsError);
        } else {
          console.log('Found assignments for section:', sectionAssignments?.length || 0);

          if (sectionAssignments && sectionAssignments.length > 0) {
            const assignmentIds = sectionAssignments.map(a => a.id);

            // Get all submissions for this student
            const { data: submissions, error: submissionsError } = await supabase
              .from('assignment_submissions')
              .select('*')
              .eq('student_id', studentInfo.value.student_id)
              .in('assignment_id', assignmentIds)
              .in('status', ['submitted', 'graded', 'returned'])
              .order('submitted_at', { ascending: false });

            if (submissionsError) {
              console.error('Error loading submissions:', submissionsError);
            } else {
              console.log('Found assignment submissions:', submissions?.length || 0);

              if (submissions && submissions.length > 0) {
                // Build a map of assignments
                const assignmentMap = {};
                sectionAssignments.forEach(assignment => {
                  assignmentMap[assignment.id] = {
                    assignment: assignment,
                    submission: null
                  };
                });

                // Map submissions to assignments (only one submission per assignment)
                submissions.forEach(submission => {
                  if (assignmentMap[submission.assignment_id]) {
                    // Keep the latest submission
                    if (!assignmentMap[submission.assignment_id].submission ||
                        new Date(submission.submitted_at) > new Date(assignmentMap[submission.assignment_id].submission.submitted_at)) {
                      assignmentMap[submission.assignment_id].submission = submission;
                    }
                  }
                });

                // Process each assignment that has a submission
                Object.values(assignmentMap).forEach(assignmentData => {
                  if (!assignmentData.submission) return;

                  const { assignment, submission } = assignmentData;

                  // Calculate percentage
                  let percentage = null;
                  if (submission.score !== null && submission.score !== undefined) {
                    percentage = assignment.total_points > 0 
                      ? Math.round((submission.score / assignment.total_points) * 100 * 100) / 100
                      : 0;
                  }

                  // Determine status
                  let resultStatus = 'submitted';
                  if (submission.status === 'graded' || submission.status === 'returned') {
                    resultStatus = 'graded';
                  }

                  // Find the quarter info for this assignment
                  let quarterInfo = null;
                  if (assignment.grading_period_id) {
                    const period = availableGradingPeriods.value.find(p => p.id === assignment.grading_period_id);
                    if (period) {
                      quarterInfo = {
                        period_name: period.period_name,
                        period_number: period.period_number,
                        school_year: period.school_year
                      };
                    }
                  }

                  processedGrades.push({
                    type: 'assignment',
                    id: assignment.id,
                    title: assignment.title,
                    quiz_code: assignment.assignment_type.toUpperCase(), // Use assignment type as code
                    description: assignment.description,
                    total_points: assignment.total_points,
                    number_of_questions: assignment.total_points, // Use total points for display
                    attempts_allowed: 1, // Assignments typically allow one submission
                    best_percentage: percentage,
                    total_attempts: 1, // Only one submission
                    latest_attempt_date: submission.submitted_at,
                    status: resultStatus,
                    submission_id: submission.id,
                    feedback: submission.feedback,
                    is_late: submission.is_late,
                    penalty_applied: submission.penalty_applied,
                    visible_to_student: true,
                    grading_period_id: assignment.grading_period_id,
                    quarter_info: quarterInfo
                  });
                });
              }
            }
          }
        }

        grades.value = processedGrades;
        console.log('Processed total grades (quizzes + assignments):', grades.value.length, grades.value);

      } catch (error) {
        console.error('Error loading grades:', error);
        alert('Failed to load grades. Please try refreshing the page.');
      }
    };

    const setupRealtimeSubscription = () => {
      if (!studentInfo.value.student_id) return;

      console.log('Setting up realtime subscription for student:', studentInfo.value.student_id);

      gradesSubscription = supabase
        .channel(`student-${studentInfo.value.student_id}-grades`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'quiz_attempts',
          filter: `student_id=eq.${studentInfo.value.student_id}`
        }, async (payload) => {
          console.log('Quiz attempt changed:', payload);
          
          // If a new attempt was submitted, auto-grade it
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const attempt = payload.new;
            if (attempt.status === 'submitted' && !attempt.auto_graded) {
              console.log('New submitted attempt detected, auto-grading:', attempt.id);
              await autoGradeAttempt(attempt.id);
            }
          }
          
          await loadGrades();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'assignment_submissions',
          filter: `student_id=eq.${studentInfo.value.student_id}`
        }, async (payload) => {
          console.log('Assignment submission changed:', payload);
          await loadGrades();
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    };

    // Status & Score Functions
    const getStatusClass = (status) => {
      const classes = {
        'not_taken': 'status-not-taken',
        'in_progress': 'status-in-progress',
        'completed': 'status-completed',
        'submitted': 'status-completed',
        'pending_review': 'status-pending',
        'graded': 'status-graded',
        'reviewed': 'status-graded'
      };
      return classes[status] || 'status-unknown';
    };

    const getStatusText = (status) => {
      const texts = {
        'not_taken': 'Not Taken',
        'in_progress': 'In Progress',
        'completed': 'Submitted',
        'submitted': 'Submitted',
        'pending_review': 'Under Review',
        'graded': 'Graded',
        'reviewed': 'Graded'
      };
      return texts[status] || 'Unknown';
    };

    const getScoreClass = (percentage) => {
      if (percentage >= 90) return 'score-excellent';
      if (percentage >= 80) return 'score-good';
      if (percentage >= 70) return 'score-average';
      if (percentage >= 60) return 'score-below-average';
      return 'score-poor';
    };

    const calculateScore = (percentage, totalQuestions) => {
      return Math.round((percentage / 100) * totalQuestions);
    };

    // Quiz Preview
    const viewQuizPreview = async (quiz) => {
      selectedQuiz.value = quiz;
      selectedAttempt.value = null;
      showPreviewModal.value = true;
      loadingPreview.value = true;

      try {
        // Get latest attempt (no need to fetch teacher_feedback)
        const { data: attempts, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('id, quiz_id, student_id, attempt_number, started_at, submitted_at, time_taken_minutes, total_score, max_score, percentage, status')
          .eq('quiz_id', quiz.id)
          .eq('student_id', studentInfo.value.student_id)
          .in('status', ['submitted', 'graded', 'reviewed'])
          .order('attempt_number', { ascending: false })
          .limit(1);

        if (attemptsError) throw attemptsError;

        if (!attempts || attempts.length === 0) {
          throw new Error('No quiz attempt found');
        }

        const attempt = attempts[0];
        selectedAttempt.value = attempt;
        const attemptId = attempt.id;
        
        console.log('Loading preview for attempt:', attemptId);

        // Get student answers (no need for teacher_comment)
        const { data: answers, error: answersError } = await supabase
          .from('student_answers')
          .select('id, attempt_id, question_id, selected_option_id, answer_text, is_correct, points_earned, points_possible, answered_at')
          .eq('attempt_id', attemptId)
          .order('id');

        if (answersError) throw answersError;

        if (!answers || answers.length === 0) {
          previewAnswers.value = [];
          loadingPreview.value = false;
          return;
        }

        const questionIds = answers.map(a => a.question_id);

        // Get questions
        const { data: questions, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('id, question_number, question_type, question_text')
          .in('id', questionIds);

        if (questionsError) throw questionsError;

        // Get options
        const { data: options, error: optionsError } = await supabase
          .from('question_options')
          .select('id, question_id, option_number, option_text, is_correct')
          .in('question_id', questionIds);

        if (optionsError) throw optionsError;

        // Get correct answers
        const { data: correctAnswers, error: correctAnswersError } = await supabase
          .from('question_answers')
          .select('question_id, correct_answer, case_sensitive')
          .in('question_id', questionIds);

        if (correctAnswersError) throw correctAnswersError;

        // Build maps
        const questionsMap = {};
        (questions || []).forEach(q => {
          questionsMap[q.id] = q;
        });

        const optionsMap = {};
        (options || []).forEach(opt => {
          if (!optionsMap[opt.question_id]) {
            optionsMap[opt.question_id] = [];
          }
          optionsMap[opt.question_id].push(opt);
        });

        const correctAnswersMap = {};
        (correctAnswers || []).forEach(ca => {
          correctAnswersMap[ca.question_id] = ca;
        });

        // Build preview (no teacher comments)
        previewAnswers.value = answers.map(answer => {
          const question = questionsMap[answer.question_id] || {};
          const questionOptions = optionsMap[answer.question_id] || [];
          const correctAnswerData = correctAnswersMap[answer.question_id];

          const isCorrect = checkIfAnswerIsCorrect(
            { question_type: question.question_type, options: questionOptions },
            answer,
            correctAnswerData
          );

          return {
            question_id: answer.question_id,
            question_number: question.question_number || 0,
            question_type: question.question_type || 'multiple_choice',
            question_text: question.question_text || 'Question',
            is_correct: isCorrect,
            selected_option_id: answer.selected_option_id,
            answer_text: answer.answer_text,
            points_earned: answer.points_earned || 0,
            points_possible: answer.points_possible || 1,
            options: questionOptions,
            correct_answer_data: correctAnswerData
          };
        }).sort((a, b) => a.question_number - b.question_number);

        console.log('Preview answers loaded:', previewAnswers.value.length);

      } catch (error) {
        console.error('Error loading quiz preview:', error);
        alert('Failed to load quiz preview');
        previewAnswers.value = [];
      } finally {
        loadingPreview.value = false;
      }
    };

    const getStudentAnswerText = (answer) => {
      if (answer.selected_option_id && answer.options.length > 0) {
        const option = answer.options.find(opt => opt.id === answer.selected_option_id);
        if (option) {
          return `${String.fromCharCode(65 + option.option_number - 1)}. ${option.option_text}`;
        }
        return 'Unknown option';
      }
      return answer.answer_text || 'No answer provided';
    };

    const getCorrectAnswerText = (answer) => {
      if (answer.question_type === 'multiple_choice' && answer.options.length > 0) {
        const correctOption = answer.options.find(opt => opt.is_correct);
        if (correctOption) {
          return `${String.fromCharCode(65 + correctOption.option_number - 1)}. ${correctOption.option_text}`;
        }
        return 'Unknown';
      }
      
      if (answer.correct_answer_data) {
        return answer.correct_answer_data.correct_answer;
      }
      
      return 'See correct answer above';
    };

    // Assignment Feedback
    const viewAssignmentFeedback = (assignment) => {
      // For now, show a simple alert with the feedback
      // You can expand this to a modal similar to quiz preview
      if (assignment.feedback) {
        alert(`Assignment Feedback:\n\n${assignment.feedback}`);
      } else if (assignment.status === 'graded') {
        alert(`Score: ${assignment.best_percentage}%\n\nNo additional feedback provided.`);
      } else {
        alert('Your assignment has been submitted and is awaiting grading.');
      }
    };

    // Navigation
    const goBack = () => {
      router.push({ name: 'StudentSubjects' });
    };

    const goToQuizzes = () => {
      router.push({
        name: 'TakeQuiz',
        params: { 
          subjectId: subject.value.id, 
          sectionId: section.value.id 
        },
        query: {
          subjectName: subject.value.name,
          sectionName: section.value.name,
          gradeLevel: route.query.gradeLevel
        }
      });
    };

    // Lifecycle
    onMounted(async () => {
      console.log('StudentGrades component mounted');
      
      // Fetch school year and quarter info first
      await fetchSchoolYearAndQuarter();
      
      const studentLoaded = await loadStudentInfo();
      if (!studentLoaded) {
        console.error('Failed to load student info');
        router.push('/login');
        return;
      }

      const paramsLoaded = loadRouteParams();
      if (!paramsLoaded) {
        console.error('Failed to load route params');
        alert('Missing information');
        router.push('/student/subjects');
        return;
      }

      await loadGrades();
      setupRealtimeSubscription();
      setupSchoolYearSubscription();
      loading.value = false;
    });

    onUnmounted(() => {
      if (gradesSubscription) {
        console.log('Removing subscription');
        supabase.removeChannel(gradesSubscription);
      }
      cleanupSchoolYearSubscription();
    });

    return {
      loading, studentInfo, subject, section, grades, recentQuizzes, allGrades, filteredGrades,
      completedQuizzes, completedAssignments, averageGrade, highestGrade, lowestGrade, showPreviewModal,
      selectedQuiz, selectedAttempt, previewAnswers, loadingPreview, isGraded, modalTitle,
      currentSchoolYear, currentQuarter, availableGradingPeriods, selectedQuarterId, getGradesCountByQuarter,
      formatPHTime, formatShortDate, getStatusClass, getStatusText, getScoreClass, 
      calculateScore, viewQuizPreview, viewAssignmentFeedback, getStudentAnswerText, getCorrectAnswerText,
      goBack, goToQuizzes
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.grades-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  padding: 1.5rem 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  width: 100%;
  margin: 0;
  position: relative;
  overflow-y: auto;
}

.dark .grades-page {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a32 100%);
}

.main-content {
  width: 100%;
}

/* Custom Scrollbar */
.grades-page::-webkit-scrollbar {
  width: 12px;
}

.grades-page::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.grades-page::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.grades-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* ============================================
   HEADER SECTION
   ============================================ */

.section-header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
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
  background: rgba(35, 39, 43, 0.95);
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
              0 2px 8px rgba(0, 0, 0, 0.2);
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

.header-text {
  flex: 1;
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
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.dark .section-header-subtitle {
  color: #94a3b8;
}

.section-header-description {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}

.dark .section-header-description {
  color: #94a3b8;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(61, 141, 122, 0.3);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
  color: #3D8D7A;
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

.dark .back-btn {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.15));
  color: #A3D1C6;
  border-color: rgba(163, 209, 198, 0.3);
}

.dark .back-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
}

/* ============================================
   LOADING STATE
   ============================================ */

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================================
   STATS GRID
   ============================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.dark .stat-value {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-align: center;
}

.dark .stat-label {
  color: #94a3b8;
}

/* ============================================
   ACADEMIC INFO (School Year & Quarter)
   ============================================ */

.academic-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.academic-year {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
}

.academic-year svg {
  flex-shrink: 0;
}

.quarter-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  background: rgba(255, 255, 255, 0.95);
  color: #3D8D7A;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 2px solid #3D8D7A;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.15);
}

.dark .quarter-badge {
  background: rgba(61, 141, 122, 0.15);
  color: #A3D1C6;
  border-color: #A3D1C6;
}

/* ============================================
   QUARTER FILTER SECTION
   ============================================ */

.quarter-filter-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.dark .quarter-filter-section {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.filter-header {
  margin-bottom: 1rem;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.2px;
}

.dark .filter-title {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-title svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.dark .filter-title svg {
  color: #A3D1C6;
}

.quarter-pills {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.quarter-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background: rgba(248, 250, 252, 0.95);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.quarter-pill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.quarter-pill:hover::before {
  left: 100%;
}

.quarter-pill:hover {
  background: rgba(241, 245, 249, 0.95);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.quarter-pill.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.dark .quarter-pill {
  background: rgba(44, 49, 54, 0.95);
  border-color: rgba(53, 58, 64, 0.8);
  color: #9ca3af;
}

.dark .quarter-pill:hover {
  background: rgba(53, 58, 64, 0.95);
  border-color: #A3D1C6;
  color: #A3D1C6;
}

.dark .quarter-pill.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
}

.pill-label {
  font-weight: inherit;
}

.pill-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.quarter-pill.active .pill-count {
  background: rgba(255, 255, 255, 0.25);
}

/* ============================================
   QUARTER INFO BADGE (in Grade Cards)
   ============================================ */

.quarter-info-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
  color: #065f46;
  border: 2px solid #10b981;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
}

.dark .quarter-info-badge {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
  color: #A3D1C6;
  border-color: #A3D1C6;
}

.quarter-info-badge svg {
  flex-shrink: 0;
}

/* Quarter info in table */
.quarter-cell {
  padding: 0.75rem 1rem;
}

.quarter-info-small {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.quarter-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #065f46;
  letter-spacing: 0.2px;
}

.dark .quarter-name {
  color: #A3D1C6;
}

.school-year-small {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
}

.dark .school-year-small {
  color: #94a3b8;
}

.text-muted {
  color: #9ca3af !important;
  font-style: italic;
}

.dark .text-muted {
  color: #6b7280 !important;
}

/* ============================================
   GRADES SECTION
   ============================================ */

.grades-section {
  width: 100%;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.quiz-category {
  margin-bottom: 2.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.dark .category-title {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.category-icon {
  font-size: 1.75rem;
}

.category-count {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
}

/* ============================================
   GRADES LIST
   ============================================ */

.grades-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.grade-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.grade-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.grade-card:hover::before {
  left: 100%;
}

.grade-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(61, 141, 122, 0.4);
}

.dark .grade-card {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.grade-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.quiz-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.2px;
}

.dark .quiz-info h3 {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Type Badges */
.item-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.type-quiz {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.type-assignment {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.item-type-badge-small {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 10px;
  font-size: 0.688rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.type-cell {
  text-align: center;
  vertical-align: middle;
}

.late-warning {
  color: #f59e0b !important;
  font-weight: 600;
}

.dark .late-warning {
  color: #fbbf24 !important;
}

.quiz-code {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.code-label {
  color: #64748b;
  font-weight: 600;
}

.dark .code-label {
  color: #94a3b8;
}

.code-value {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.1), rgba(45, 106, 90, 0.05));
  color: #3D8D7A;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', monospace;
  border: 1px solid rgba(61, 141, 122, 0.2);
  letter-spacing: 0.5px;
}

.dark .code-value {
  background: rgba(61, 141, 122, 0.15);
  color: #A3D1C6;
  border-color: rgba(163, 209, 198, 0.2);
}

.grade-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.status-completed {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.status-pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.status-graded {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
}

.status-not-taken {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  color: white;
  box-shadow: 0 2px 8px rgba(148, 163, 184, 0.2);
}

.grade-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.grade-info {
  flex: 1;
  min-width: 150px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 4px solid;
  flex-shrink: 0;
}

.score-excellent {
  background: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
  color: #16a34a;
}

.score-good {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #2563eb;
}

.score-average {
  background: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #d97706;
}

.score-below-average {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
  color: #ea580c;
}

.score-poor {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #dc2626;
}

.score-value {
  font-size: 1.25rem;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.score-fraction {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.2px;
}

.dark .score-fraction {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.dark .score-label {
  color: #94a3b8;
}

.score-pending {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.pending-icon {
  font-size: 3rem;
}

.pending-text {
  font-size: 1rem;
  font-weight: 700;
  color: #64748b;
}

.dark .pending-text {
  color: #94a3b8;
}

.submission-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.dark .info-item {
  color: #94a3b8;
}

.grade-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
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
  border-color: #3D8D7A;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.95);
  color: #3D8D7A;
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
  border-color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.2);
}

.dark .btn-secondary {
  background: rgba(35, 39, 43, 0.95);
  color: #A3D1C6;
  border-color: rgba(163, 209, 198, 0.3);
}

.dark .btn-secondary:hover {
  background: rgba(61, 141, 122, 0.15);
  border-color: #A3D1C6;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* ============================================
   GRADES TABLE
   ============================================ */

.grades-table-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 14px;
  overflow: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.dark .grades-table-container {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.grades-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.grades-table th {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.05));
  color: #1e293b;
  font-weight: 800;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid rgba(61, 141, 122, 0.2);
  font-size: 0.875rem;
  vertical-align: middle;
  letter-spacing: 0.3px;
}

.grades-table th.center-header {
  text-align: center;
}

.dark .grades-table th {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.1));
  color: #A3D1C6;
  border-bottom-color: rgba(61, 141, 122, 0.3);
}

.grades-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  vertical-align: middle;
}

.dark .grades-table td {
  border-bottom-color: rgba(61, 141, 122, 0.15);
}

.grade-row {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.grade-row:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
}

.dark .grade-row:hover {
  background: rgba(61, 141, 122, 0.1);
}

.quiz-cell {
  font-weight: 600;
  color: #1e293b;
}

.dark .quiz-cell {
  color: #A3D1C6;
}

.quiz-name {
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: -0.2px;
}

.quiz-code-small {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 500;
}

.dark .quiz-code-small {
  color: #94a3b8;
}

.score-cell {
  text-align: center;
  vertical-align: middle;
}

.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 80px;
  padding: 0 18px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2;
  box-sizing: border-box;
}

.score-pending-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 80px;
  padding: 0 18px;
  border-radius: 18px;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2;
  box-sizing: border-box;
}

.status-cell {
  text-align: center;
  vertical-align: middle;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 80px;
  padding: 0 18px;
  border-radius: 18px;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2;
  box-sizing: border-box;
}

.date-cell {
  text-align: center;
  color: #6b7280;
}

.dark .date-cell {
  color: #A3D1C6;
}

.date-text {
  font-size: 0.875rem;
}

.attempts-cell {
  text-align: center;
  font-weight: 600;
  color: #3D8D7A;
}

.dark .attempts-cell {
  color: #A3D1C6;
}

.actions-cell {
  text-align: center;
}

.table-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: #f0f9f7;
  color: #3D8D7A;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .btn-icon {
  background: rgba(61, 141, 122, 0.1);
  color: #A3D1C6;
}

.btn-icon:hover:not(:disabled) {
  background: #3D8D7A;
  color: white;
}

.dark .btn-icon:hover:not(:disabled) {
  background: #A3D1C6;
  color: #23272b;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ============================================
   EMPTY STATE
   ============================================ */

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  border: 2px dashed #A3D1C6;
}

.dark .empty-state {
  background: #23272b;
  border-color: #3D8D7A;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.dark .empty-state h3 {
  color: #A3D1C6;
}

.empty-state p {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.dark .empty-state p {
  color: #A3D1C6;
}

/* ============================================
   PREVIEW MODAL
   ============================================ */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.preview-modal {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
              0 8px 16px rgba(0, 0, 0, 0.1);
  animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.dark .preview-modal {
  background: rgba(35, 39, 43, 0.98);
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
              0 8px 16px rgba(0, 0, 0, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 2px solid rgba(61, 141, 122, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.dark .modal-header h3 {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.6);
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.modal-close:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-color: #dc2626;
  transform: scale(1.05);
}

.dark .modal-close {
  background: rgba(53, 58, 64, 0.8);
  color: #A3D1C6;
  border-color: rgba(163, 209, 198, 0.2);
}

.dark .modal-close:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-color: #dc2626;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
  flex: 1;
}

.loading-answers {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-summary {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.05));
  border: 2px solid rgba(61, 141, 122, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
}

.dark .preview-summary {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.1));
  border-color: rgba(61, 141, 122, 0.3);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-label {
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.2px;
}

.dark .summary-label {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.summary-value {
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.2px;
}

.dark .summary-value {
  color: #A3D1C6;
}

.answer-item {
  background: #FBFFE4;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #3D8D7A;
}

.dark .answer-item {
  background: #181c20;
  border-color: #3D8D7A;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.question-number {
  background: #3D8D7A;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

.answer-result {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
}

.answer-result.correct {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.answer-result.incorrect {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.question-text {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.dark .question-text {
  color: #A3D1C6;
}

.student-answer,
.correct-answer-section,
.teacher-comment {
  margin-bottom: 1rem;
}

.answer-label,
.comment-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.dark .answer-label,
.dark .comment-label {
  color: #A3D1C6;
}

.answer-content {
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
}

.answer-content.correct-answer {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid #22c55e;
}

.answer-content.wrong-answer {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid #ef4444;
}

.correct-answer {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid #22c55e;
}

.comment-text {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  line-height: 1.5;
}

.dark .comment-text {
  background: #23272b;
  color: #A3D1C6;
  border-color: #3D8D7A;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 2px solid #3D8D7A;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 480px) {
  .grades-page {
    padding: 0;
    min-height: calc(100vh - 150px);
    width: 100%;
    margin: 0;
  }

  

  .section-header-card {
    margin: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
  }

  .section-header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .section-header-left {
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 0.75rem;
  }

  .section-header-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
  }

  .section-header-title {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .section-header-subtitle,
  .section-header-description {
    font-size: 0.9rem;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    display: flex;
  }

  .back-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 0 1rem 1.5rem 1rem;
  }

  .stat-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .grades-section {
    width: 100%;
    margin: 0 1rem;
    box-sizing: border-box;
    padding: 0;
    overflow-x: hidden;
  }

  .quiz-category {
    margin-bottom: 1.5rem;
  }

  .category-header {
    padding: 1rem 0 0.75rem 0;
    margin-bottom: 0.75rem;
  }

  .category-title {
    font-size: 1.1rem;
  }

  .category-count {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  .grades-list {
    gap: 1rem;
  }

  .grade-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .grade-header {
    margin-bottom: 1rem;
  }

  .quiz-info h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .quiz-code {
    margin-bottom: 0.75rem;
  }

  .code-label {
    font-size: 0.75rem;
  }

  .code-value {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  .grade-status {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .grade-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .grade-info {
    width: 100%;
  }

  .score-display {
    justify-content: center;
    margin-bottom: 1rem;
  }

  .score-circle {
    width: 80px;
    height: 80px;
  }

  .score-value {
    font-size: 1.5rem;
  }

  .score-details {
    text-align: center;
  }

  .score-fraction {
    font-size: 0.85rem;
  }

  .score-label {
    font-size: 0.75rem;
  }

  .submission-info {
    gap: 0.75rem;
    flex-direction: column;
  }

  .info-item {
    font-size: 0.8rem;
  }

  .grade-actions {
    justify-content: flex-start;
    width: 100%;
    gap: 0.75rem;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    min-width: auto;
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
    min-height: 48px;
  }

  .grades-table-container {
    margin: 1rem;
    border-radius: 12px;
    overflow: hidden;
  }

  .grades-table {
    font-size: 0.813rem;
  }

  .grades-table th,
  .grades-table td {
    padding: 0.75rem 0.5rem;
  }

  .grades-table th {
    font-size: 0.75rem;
  }

  .quiz-name {
    font-size: 0.85rem;
  }

  .quiz-code-small {
    font-size: 0.7rem;
  }

  .score-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .status-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }

  .date-text {
    font-size: 0.75rem;
  }

  .btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .empty-state {
    margin: 0 1rem 1.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    max-width: none;
    width: calc(100% - 2rem);
    box-sizing: border-box;
    padding: 1.5rem;
    border-radius: 16px;
    background: #fff;
    border: 2px solid #A3D1C6;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  }

  .empty-icon {
    width: 80px;
    height: 80px;
  }

  .empty-state h3 {
    font-size: 1.1rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .preview-modal {
    max-height: 85vh;
    width: 100%;
    max-width: none;
    margin: 0;
    border-radius: 16px;
  }

  .modal-header {
    padding: 1rem;
    border-radius: 16px 16px 0 0;
  }

  .modal-header h3 {
    font-size: 1.125rem;
  }

  .modal-close {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .modal-body {
    padding: 1rem;
    max-height: 60vh;
  }

  .preview-content {
    gap: 1rem;
  }

  .preview-summary {
    padding: 1rem;
    border-radius: 12px;
    gap: 1rem;
  }

  .summary-item {
    text-align: center;
  }

  .summary-value {
    font-size: 1.25rem;
  }

  .summary-label {
    font-size: 0.8rem;
  }

  .answers-section {
    gap: 1rem;
  }

  .answer-item {
    padding: 1rem;
    border-radius: 12px;
  }

  .question-header {
    margin-bottom: 0.75rem;
  }

  .question-number {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  .question-text {
    font-size: 0.9rem;
  }

  .answer-content {
    gap: 0.75rem;
  }

  .student-answer,
  .correct-answer {
    padding: 0.875rem;
    border-radius: 10px;
  }

  .answer-label {
    font-size: 0.75rem;
  }

  .answer-text {
    font-size: 0.85rem;
  }

  .answer-status {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }

  .modal-actions {
    padding: 1rem;
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .modal-actions .btn {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .grades-page {
    padding: 0;
    min-height: calc(100vh - 150px);
  }

  .section-header-card {
    margin: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.25rem;
    border-radius: 14px;
  }

  .section-header-content {
    gap: 1.25rem;
  }

  .section-header-left {
    gap: 1rem;
  }

  .section-header-icon {
    width: 55px;
    height: 55px;
    border-radius: 14px;
  }

  .section-header-title {
    font-size: 1.375rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
    margin: 0 1.5rem 2rem 1.5rem;
  }

  .stat-card {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .grades-section {
    margin: 0 1.5rem;
  }

  .grade-content {
    flex-direction: column;
    gap: 1.25rem;
  }

  .grade-card {
    padding: 1.25rem;
    border-radius: 14px;
  }

  .grade-actions {
    flex-direction: row;
    gap: 1rem;
  }

  .btn {
    flex: 1;
    min-width: 140px;
    padding: 0.875rem 1.25rem;
    border-radius: 12px;
  }

  .grades-table-container {
    margin: 1.5rem;
    border-radius: 14px;
  }

  .empty-state {
    margin: 1.5rem;
    padding: 2.5rem 1.5rem;
    border-radius: 16px;
  }

  .modal-overlay {
    padding: 1.5rem;
  }

  .preview-modal {
    max-width: 90vw;
    border-radius: 16px;
  }

  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 1.25rem;
  }
}

@media (min-width: 769px) {
  .grades-page {
    padding: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .grades-list {
    gap: 2rem;
  }

  .grade-content {
    flex-direction: row;
  }

  .preview-modal {
    max-width: 900px;
  }
}

@media (min-width: 1200px) {
  .grades-page {
    padding: 2rem 3%;
  }

  .stats-grid {
    gap: 2rem;
  }

  .grades-list {
    gap: 2.5rem;
  }
}

@media (min-width: 1400px) {
  .section-header-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}

/* ============================================
   NEW BUTTON STYLES FOR VIEW ACTIONS
   ============================================ */

/* View Button Styles - Card Actions */
.btn-view {
  width: 100%;
  justify-content: center;
}

.btn-view.pending {
  background: #fbbf24;
  color: #1f2937;
  border: 2px solid #fbbf24;
}

.btn-view.pending:hover {
  background: #f59e0b;
  border-color: #f59e0b;
  color: #1f2937;
}

.btn-view.graded {
  background: #3D8D7A;
  color: white;
  border: 2px solid #3D8D7A;
}

.btn-view.graded:hover {
  background: #2d6b5e;
  border-color: #2d6b5e;
  color: white;
}

.dark .btn-view.pending {
  background: #fbbf24;
  color: #1f2937;
  border-color: #fbbf24;
}

.dark .btn-view.pending:hover {
  background: #f59e0b;
  border-color: #f59e0b;
}

.dark .btn-view.graded {
  background: #3D8D7A;
  color: white;
  border-color: #3D8D7A;
}

.dark .btn-view.graded:hover {
  background: #A3D1C6;
  color: #23272b;
  border-color: #A3D1C6;
}

/* Table Button Styles */
.btn-table {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 0.813rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-table.pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.btn-table.pending:hover {
  background: #fbbf24;
  color: #1f2937;
}

.btn-table.graded {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #3D8D7A;
}

.btn-table.graded:hover {
  background: #3D8D7A;
  color: white;
}

.dark .btn-table.pending {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border-color: #fbbf24;
}

.dark .btn-table.pending:hover {
  background: #fbbf24;
  color: #1f2937;
}

.dark .btn-table.graded {
  background: rgba(61, 141, 122, 0.1);
  color: #A3D1C6;
  border-color: #3D8D7A;
}

.dark .btn-table.graded:hover {
  background: #3D8D7A;
  color: white;
}

.btn-table svg {
  flex-shrink: 0;
}

/* Submitted Answer Style (for non-graded) */
.submitted-answer {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #d1d5db;
}

.dark .submitted-answer {
  background: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}

/* ============================================
   RESPONSIVE UPDATES FOR NEW BUTTONS
   ============================================ */

@media (max-width: 480px) {
  .btn-table {
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
    width: 100%;
  }

  .btn-text {
    display: inline;
  }

  .actions-cell {
    min-width: 140px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .btn-table {
    padding: 0.5rem 1rem;
    font-size: 0.813rem;
  }
}

@media (max-width: 768px) {
  .btn-view {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
  }
}

/* Teacher Feedback Styles */
.summary-item.full-width {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.teacher-feedback-box {
  width: 100%;
  background: #fff7ed;
  border: 2px solid #fb923c;
  border-radius: 8px;
  padding: 1rem;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: 0.5rem;
}

.dark .teacher-feedback-box {
  background: rgba(251, 146, 60, 0.1);
  border-color: #fb923c;
  color: #A3D1C6;
}

.teacher-comment {
  background: #fef3c7;
  border: 2px solid #fbbf24;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
}

.dark .teacher-comment {
  background: rgba(251, 191, 36, 0.1);
  border-color: #fbbf24;
}

.comment-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.dark .comment-label {
  color: #fbbf24;
}

.comment-text {
  background: white;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  border: 1px solid #fde68a;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.dark .comment-text {
  background: #23272b;
  color: #e5e7eb;
  border-color: rgba(251, 191, 36, 0.3);
}

/* No answers state */
.no-answers {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.dark .no-answers {
  color: #9ca3af;
}

.no-answers p {
  font-size: 1rem;
  font-style: italic;
}

/* Responsive adjustments for feedback */
@media (max-width: 480px) {
  .teacher-feedback-box {
    padding: 0.875rem;
    font-size: 0.813rem;
  }

  .teacher-comment {
    padding: 0.875rem;
    margin-top: 0.875rem;
  }

  .comment-label {
    font-size: 0.813rem;
  }

  .comment-text {
    padding: 0.75rem;
    font-size: 0.813rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .teacher-feedback-box {
    padding: 0.95rem;
  }

  .teacher-comment {
    padding: 0.95rem;
  }
}
</style>
