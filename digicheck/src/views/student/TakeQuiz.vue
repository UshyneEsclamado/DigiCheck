  <template>
    <div class="take-quiz-page">
      <!-- Header Section -->
      <div class="section-header-card">
        <div class="section-header-content">
          <div class="section-header-left">
            <div class="section-header-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
            </div>
            
            <div class="header-text">
              <h1 class="section-header-title">{{ subject.name }} - Quizzes</h1>
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
        <p>Loading quizzes...</p>
      </div>

      <!-- Quiz List View -->
      <div v-else-if="!selectedQuiz && !takingQuiz" class="main-content">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ quizzes.length }}</div>
            <div class="stat-label">Available Quizzes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedQuizzes.length }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <!-- Quizzes Categories -->
        <div class="quizzes-section">
          <!-- New Quizzes -->
          <div v-if="newQuizzes.length > 0" class="quiz-category">
            <div class="category-header">
              <h2 class="category-title">
                <span class="category-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                New Quizzes
              </h2>
              <span class="category-count">{{ newQuizzes.length }}</span>
            </div>
            <div class="quiz-grid">
              <div v-for="quiz in newQuizzes" :key="quiz.id" class="quiz-card new-quiz">
                <div class="quiz-badge new-badge">New</div>
                <div class="quiz-header">
                  <h3 class="quiz-title">{{ quiz.title }}</h3>
                  <div class="quiz-code">
                    <span class="code-label">Code:</span>
                    <span class="code-value">{{ quiz.quiz_code }}</span>
                  </div>
                </div>
                <p class="quiz-description">{{ quiz.description || 'No description provided' }}</p>
                <div class="quiz-meta">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ quiz.number_of_questions }} Questions</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ quiz.has_time_limit ? `${quiz.time_limit_minutes} min` : 'No limit' }}</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span>{{ quiz.attempts_allowed === 999 ? 'Unlimited' : `${quiz.attempts_allowed} attempt(s)` }}</span>
                  </div>
                </div>
                <div class="quiz-schedule" v-if="quiz.start_date || quiz.end_date">
                  <div v-if="quiz.start_date" class="schedule-item">
                    <span class="schedule-label">Starts:</span>
                    <span class="schedule-time">{{ formatPHTime(quiz.start_date) }}</span>
                  </div>
                  <div v-if="quiz.end_date" class="schedule-item">
                    <span class="schedule-label">Ends:</span>
                    <span class="schedule-time">{{ formatPHTime(quiz.end_date) }}</span>
                  </div>
                </div>
                <div class="quiz-actions">
                  <button @click="viewQuizDetails(quiz)" class="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    View Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Past Quizzes -->
          <div v-if="pastQuizzes.length > 0" class="quiz-category">
            <div class="category-header">
              <h2 class="category-title">
                <span class="category-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Past Quizzes
              </h2>
              <span class="category-count">{{ pastQuizzes.length }}</span>
            </div>
            <div class="quiz-grid">
              <div v-for="quiz in pastQuizzes" :key="quiz.id" class="quiz-card past-quiz">
                <div v-if="getQuizStatus(quiz) === 'completed'" class="quiz-badge completed-badge">Completed</div>
                <div v-else-if="getQuizStatus(quiz) === 'expired'" class="quiz-badge expired-badge">Expired</div>
                <div class="quiz-header">
                  <h3 class="quiz-title">{{ quiz.title }}</h3>
                  <div class="quiz-code">
                    <span class="code-label">Code:</span>
                    <span class="code-value">{{ quiz.quiz_code }}</span>
                  </div>
                </div>
                <p class="quiz-description">{{ quiz.description || 'No description provided' }}</p>
                <div class="quiz-meta">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ quiz.number_of_questions }} Questions</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{{ quiz.has_time_limit ? `${quiz.time_limit_minutes} min` : 'No limit' }}</span>
                  </div>
                </div>
                <div v-if="getQuizResult(quiz.id)" class="quiz-result">
                  <div class="result-score">
                    <span class="score-label">Your Score:</span>
                    <span class="score-value">{{ getQuizResult(quiz.id).best_percentage }}%</span>
                  </div>
                  <div class="result-attempts">
                    <span>{{ getQuizResult(quiz.id).total_attempts }} attempt(s)</span>
                  </div>
                </div>
                <div class="quiz-actions">
                  <button @click="viewQuizDetails(quiz)" class="btn btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="quizzes.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>No Quizzes Available</h3>
            <p>There are no quizzes available for this subject yet.</p>
          </div>
        </div>
      </div>

      <!-- Quiz Details View -->
      <div v-else-if="selectedQuiz && !takingQuiz" class="quiz-details-view">
        <div class="content-card slide-up">
          <div class="details-header">
            <button @click="selectedQuiz = null" class="back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Quizzes
            </button>
            <div class="quiz-status-badge" :class="getQuizAvailabilityClass()">
              {{ getQuizAvailabilityText() }}
            </div>
          </div>

          <div class="details-content">
            <div class="details-main">
              <div class="quiz-info-card">
                <h1 class="details-title">{{ selectedQuiz.title }}</h1>
                <div class="quiz-code-display">
                  <span class="code-label">Quiz Code:</span>
                  <span class="code-value">{{ selectedQuiz.quiz_code }}</span>
                </div>
                <p class="details-description">{{ selectedQuiz.description || 'No description provided' }}</p>
                
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Questions</span>
                      <span class="info-value">{{ selectedQuiz.number_of_questions }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Time Limit</span>
                      <span class="info-value">{{ selectedQuiz.has_time_limit ? `${selectedQuiz.time_limit_minutes} minutes` : 'No limit' }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Attempts</span>
                      <span class="info-value">{{ selectedQuiz.attempts_allowed === 999 ? 'Unlimited' : selectedQuiz.attempts_allowed }}</span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Remaining Attempts</span>
                      <span class="info-value">{{ remainingAttempts === 999 ? 'Unlimited' : remainingAttempts }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedQuiz.start_date || selectedQuiz.end_date" class="schedule-info">
                  <h3 class="schedule-title">Schedule</h3>
                  <div class="schedule-details">
                    <div v-if="selectedQuiz.start_date" class="schedule-row">
                      <span class="schedule-icon">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span class="schedule-label">Available from:</span>
                      <span class="schedule-value">{{ formatPHTime(selectedQuiz.start_date) }}</span>
                    </div>
                    <div v-if="selectedQuiz.end_date" class="schedule-row">
                      <span class="schedule-icon">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <span class="schedule-label">Available until:</span>
                      <span class="schedule-value">{{ formatPHTime(selectedQuiz.end_date) }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="previousAttempts.length > 0" class="attempts-history">
                  <h3 class="attempts-title">Your Previous Attempts</h3>
                  <div class="attempts-list">
                    <div v-for="attempt in previousAttempts" :key="attempt.id" class="attempt-item">
                      <div class="attempt-number">Attempt {{ attempt.attempt_number }}</div>
                      <div class="attempt-score">{{ attempt.percentage }}%</div>
                      <div class="attempt-date">{{ formatPHTime(attempt.submitted_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="action-card">
                <div v-if="!canTakeCurrentQuiz" class="warning-message">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>{{ quizUnavailableReason }}</span>
                </div>
                <button 
                  v-else
                  @click="startQuiz" 
                  :disabled="isStarting"
                  class="btn btn-start-quiz"
                >
                  <svg v-if="!isStarting" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div v-else class="spinner"></div>
                  <span>{{ isStarting ? 'Starting Quiz...' : 'Start Quiz Now' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Taking View -->
      <div v-else-if="takingQuiz && currentAttempt" class="quiz-taking-view">
        <!-- Quiz Timer Header -->
        <div class="quiz-timer-header">
          <div class="timer-info">
            <div class="timer-label">Time Remaining:</div>
            <div class="timer-display" :class="{ 'timer-warning': timeRemaining < 300 }">
              {{ formatTime(timeRemaining) }}
            </div>
          </div>
          <div class="progress-info">
            <span>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Question Display -->
        <div class="question-container">
          <div class="question-card" v-if="questions[currentQuestionIndex]">
            <div class="question-header">
              <div class="question-number-badge">
                Question {{ currentQuestionIndex + 1 }}
              </div>
              <div class="question-type-badge" :class="questions[currentQuestionIndex].question_type">
                {{ getQuestionTypeLabel(questions[currentQuestionIndex].question_type) }}
              </div>
            </div>

            <h2 class="question-text">{{ questions[currentQuestionIndex].question_text }}</h2>

            <!-- Multiple Choice -->
            <div v-if="questions[currentQuestionIndex].question_type === 'multiple_choice'" class="answer-options">
              <div 
                v-for="option in questions[currentQuestionIndex].options" 
                :key="option.id"
                :class="['option-item', { 'selected': studentAnswers[questions[currentQuestionIndex].id]?.selected_option_id === option.id }]"
                @click="selectOption(questions[currentQuestionIndex].id, option.id)"
              >
                <div class="option-radio"></div>
                <div class="option-letter">{{ String.fromCharCode(65 + option.option_number - 1) }}</div>
                <div class="option-text">{{ option.option_text }}</div>
              </div>
            </div>

            <!-- True/False -->
            <div v-else-if="questions[currentQuestionIndex].question_type === 'true_false'" class="answer-options tf-options">
              <div 
                :class="['tf-option', { 'selected': studentAnswers[questions[currentQuestionIndex].id]?.answer_text === 'true' }]"
                @click="selectTrueFalse(questions[currentQuestionIndex].id, 'true')"
              >
                <div class="tf-icon">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="tf-label">True</div>
              </div>
              <div 
                :class="['tf-option', { 'selected': studentAnswers[questions[currentQuestionIndex].id]?.answer_text === 'false' }]"
                @click="selectTrueFalse(questions[currentQuestionIndex].id, 'false')"
              >
                <div class="tf-icon">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="tf-label">False</div>
              </div>
            </div>

            <!-- Fill in the Blank -->
            <div v-else-if="questions[currentQuestionIndex].question_type === 'fill_blank'" class="answer-input">
              <input 
                v-model="studentAnswers[questions[currentQuestionIndex].id].answer_text"
                @input="autoSaveAnswer(questions[currentQuestionIndex].id)"
                type="text" 
                placeholder="Type your answer here..."
                class="fill-blank-input"
              />
            </div>
          </div>

          <!-- Navigation -->
          <div class="question-navigation">
            <button 
              @click="previousQuestion" 
              :disabled="currentQuestionIndex === 0"
              class="btn btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 19l-7-7 7-7"/>
              </svg>
              Previous
            </button>

            <div class="question-indicators">
              <div 
                v-for="(q, index) in questions" 
                :key="q.id"
                :class="['indicator-dot', { 
                  'active': index === currentQuestionIndex,
                  'answered': studentAnswers[q.id] && (studentAnswers[q.id].selected_option_id || studentAnswers[q.id].answer_text)
                }]"
                @click="goToQuestion(index)"
              ></div>
            </div>

            <button 
              v-if="currentQuestionIndex < questions.length - 1"
              @click="nextQuestion" 
              class="btn btn-primary"
            >
              Next
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button 
              v-else
              @click="showSubmitConfirmation" 
              class="btn btn-submit"
            >
              Submit Quiz
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Confirmation Modal -->
      <div v-if="showSubmitModal" class="modal-overlay" @click.self="showSubmitModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Submit Quiz?</h3>
            <button @click="showSubmitModal = false" class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <div class="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="modal-text">
              <p class="modal-title">Are you sure you want to submit?</p>
              <p class="modal-description">
                You have answered {{ answeredCount }} out of {{ questions.length }} questions.
                {{ unansweredCount > 0 ? `${unansweredCount} question(s) remain unanswered.` : '' }}
              </p>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="showSubmitModal = false" class="btn btn-secondary">Cancel</button>
            <button @click="submitQuiz" :disabled="isSubmitting" class="btn btn-primary">
              <div v-if="isSubmitting" class="spinner"></div>
              <span>{{ isSubmitting ? 'Submitting...' : 'Yes, Submit' }}</span>
            </button>
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
    name: 'TakeQuiz',
    setup() {
      const router = useRouter();
      const route = useRoute();

      const loading = ref(true);
      const studentInfo = ref({ full_name: 'Loading...', grade_level: '', student_id: null });
      const subject = ref({ id: '', name: 'Subject' });
      const section = ref({ id: '', name: '' });
      const quizzes = ref([]);
      const selectedQuiz = ref(null);
      const takingQuiz = ref(false);
      const showingResults = ref(false);
      const currentAttempt = ref(null);
      const questions = ref([]);
      const studentAnswers = ref({});
      const currentQuestionIndex = ref(0);
      const timeRemaining = ref(0);
      const timerInterval = ref(null);
      const startTime = ref(null);
      const previousAttempts = ref([]);
      const quizResults = ref([]);
      const canTakeCurrentQuiz = ref(true);
      const quizUnavailableReason = ref('');
      const isStarting = ref(false);
      const showSubmitModal = ref(false);
      const isSubmitting = ref(false);
      const submittedAttempt = ref(null);
      let saveTimeout = null;

      let quizSubscription = null;

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

      const getCurrentUTCTime = () => {
        return new Date();
      };

      const formatTime = (seconds) => {
        if (!seconds || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const newQuizzes = computed(() => {
        const now = getCurrentUTCTime();
        return quizzes.value.filter(quiz => {
          const result = quizResults.value.find(r => r.quiz_id === quiz.id);
          const isNotTaken = !result || result.total_attempts === 0;
          const isNotExpired = !quiz.end_date || new Date(quiz.end_date) > now;
          return isNotTaken && isNotExpired;
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

      const pastQuizzes = computed(() => {
        const now = getCurrentUTCTime();
        return quizzes.value.filter(quiz => {
          const result = quizResults.value.find(r => r.quiz_id === quiz.id);
          const isTaken = result && result.total_attempts > 0;
          const isExpired = quiz.end_date && new Date(quiz.end_date) <= now;
          return isTaken || isExpired;
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

      const completedQuizzes = computed(() => {
        return quizResults.value.filter(r => r.total_attempts > 0);
      });

      const answeredCount = computed(() => {
        return Object.keys(studentAnswers.value).filter(qId => {
          const answer = studentAnswers.value[qId];
          return answer.selected_option_id || (answer.answer_text && answer.answer_text.trim());
        }).length;
      });

      const unansweredCount = computed(() => {
        return questions.value.length - answeredCount.value;
      });

      const remainingAttempts = computed(() => {
        if (!selectedQuiz.value) return 0;
        if (selectedQuiz.value.attempts_allowed === 999) return 999;
        
        const result = quizResults.value.find(r => r.quiz_id === selectedQuiz.value.id);
        const usedAttempts = result ? result.total_attempts : 0;
        return Math.max(0, selectedQuiz.value.attempts_allowed - usedAttempts);
      });

      const loadStudentInfo = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            router.push('/login');
            return false;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('auth_user_id', session.user.id)
            .single();

          if (!profile || profile.role !== 'student') {
            alert('Student profile not found');
            return false;
          }

          const { data: student } = await supabase
            .from('students')
            .select('*')
            .eq('profile_id', profile.id)
            .single();

          if (!student) {
            alert('Student information not found');
            return false;
          }

          studentInfo.value = {
            full_name: student.full_name,
            grade_level: student.grade_level,
            student_id: student.id
          };

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

        return true;
      };

      const loadQuizzes = async () => {
        try {
          console.log('📚 Loading quizzes for section:', section.value.id)
          
          // Fetch only published quizzes for this section
          const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('section_id', section.value.id)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('❌ Error loading quizzes:', error)
            throw error
          }

          console.log('📝 Loaded', data?.length || 0, 'quizzes')
          quizzes.value = data || [];
          await loadQuizResults();
        } catch (error) {
          console.error('Error loading quizzes:', error);
          quizzes.value = [];
        }
      };

      const loadQuizResults = async () => {
        try {
          if (quizzes.value.length === 0) {
            quizResults.value = [];
            return;
          }

          const { data: results } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('student_id', studentInfo.value.student_id)
            .in('quiz_id', quizzes.value.map(q => q.id));

          const { data: attempts } = await supabase
            .from('quiz_attempts')
            .select('quiz_id, id, status')
            .eq('student_id', studentInfo.value.student_id)
            .in('quiz_id', quizzes.value.map(q => q.id))
            .in('status', ['submitted', 'graded', 'reviewed']);

          const resultsMap = new Map();
          
          for (const quiz of quizzes.value) {
            const existingResult = results?.find(r => r.quiz_id === quiz.id);
            const quizAttempts = attempts?.filter(a => a.quiz_id === quiz.id) || [];
            const totalAttempts = quizAttempts.length;

            resultsMap.set(quiz.id, {
              quiz_id: quiz.id,
              student_id: studentInfo.value.student_id,
              total_attempts: totalAttempts,
              best_percentage: existingResult?.best_percentage || 0,
              best_score: existingResult?.best_score || 0,
              status: totalAttempts > 0 ? 'completed' : 'not_started'
            });
          }

          quizResults.value = Array.from(resultsMap.values());
        } catch (error) {
          console.error('Error loading quiz results:', error);
        }
      };

      const setupRealtimeSubscription = () => {
        if (!section.value.id) return;

        quizSubscription = supabase
          .channel(`section-${section.value.id}-quizzes`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'quizzes',
            filter: `section_id=eq.${section.value.id}`
          }, async (payload) => {
            if (payload.eventType === 'INSERT') {
              quizzes.value.unshift(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              const index = quizzes.value.findIndex(q => q.id === payload.new.id);
              if (index !== -1) quizzes.value[index] = payload.new;
            } else if (payload.eventType === 'DELETE') {
              quizzes.value = quizzes.value.filter(q => q.id !== payload.old.id);
            }
            await loadQuizResults();
          })
          .subscribe();
      };

      const getQuizStatus = (quiz) => {
        const result = quizResults.value.find(r => r.quiz_id === quiz.id);
        const now = getCurrentUTCTime();
        
        if (result && result.total_attempts > 0) return 'completed';
        if (quiz.end_date && new Date(quiz.end_date) <= now) return 'expired';
        return 'available';
      };

      const getQuizResult = (quizId) => {
        return quizResults.value.find(r => r.quiz_id === quizId);
      };

      const getQuizAvailabilityClass = () => {
        if (!selectedQuiz.value) return '';
        const now = getCurrentUTCTime();
        
        if (selectedQuiz.value.start_date && new Date(selectedQuiz.value.start_date) > now) {
          return 'not-started';
        }
        if (selectedQuiz.value.end_date && new Date(selectedQuiz.value.end_date) <= now) {
          return 'expired';
        }
        
        const result = quizResults.value.find(r => r.quiz_id === selectedQuiz.value.id);
        const usedAttempts = result ? result.total_attempts : 0;
        if (selectedQuiz.value.attempts_allowed !== 999 && usedAttempts >= selectedQuiz.value.attempts_allowed) {
          return 'expired';
        }
        
        return 'available';
      };

      const getQuizAvailabilityText = () => {
        if (!selectedQuiz.value) return '';
        const now = getCurrentUTCTime();
        
        if (selectedQuiz.value.start_date && new Date(selectedQuiz.value.start_date) > now) {
          return 'Not Yet Available';
        }
        if (selectedQuiz.value.end_date && new Date(selectedQuiz.value.end_date) <= now) {
          return 'Quiz Expired';
        }
        
        const result = quizResults.value.find(r => r.quiz_id === selectedQuiz.value.id);
        const usedAttempts = result ? result.total_attempts : 0;
        if (selectedQuiz.value.attempts_allowed !== 999 && usedAttempts >= selectedQuiz.value.attempts_allowed) {
          return 'No Attempts Remaining';
        }
        
        return 'Available Now';
      };

      const viewQuizDetails = async (quiz) => {
        selectedQuiz.value = quiz;
        await checkQuizEligibility(quiz);
        await loadPreviousAttempts(quiz.id);
      };

      const checkQuizEligibility = async (quiz) => {
        const now = getCurrentUTCTime();
        
        if (quiz.start_date && new Date(quiz.start_date) > now) {
          canTakeCurrentQuiz.value = false;
          quizUnavailableReason.value = 'This quiz is not yet available.';
          return;
        }
        
        if (quiz.end_date && new Date(quiz.end_date) <= now) {
          canTakeCurrentQuiz.value = false;
          quizUnavailableReason.value = 'This quiz has expired.';
          return;
        }
        
        const { data: completedAttempts } = await supabase
          .from('quiz_attempts')
          .select('id')
          .eq('quiz_id', quiz.id)
          .eq('student_id', studentInfo.value.student_id)
          .in('status', ['submitted', 'graded', 'reviewed']);

        const usedAttempts = completedAttempts ? completedAttempts.length : 0;
        
        if (quiz.attempts_allowed !== 999) {
          if (usedAttempts >= quiz.attempts_allowed) {
            canTakeCurrentQuiz.value = false;
            quizUnavailableReason.value = `You have used all ${quiz.attempts_allowed} attempt(s). No more attempts remaining.`;
            return;
          }
        }
        
        canTakeCurrentQuiz.value = true;
        quizUnavailableReason.value = '';
      };

      const loadPreviousAttempts = async (quizId) => {
        try {
          const { data } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('quiz_id', quizId)
            .eq('student_id', studentInfo.value.student_id)
            .in('status', ['submitted', 'graded', 'reviewed'])
            .order('attempt_number', { ascending: false });

          previousAttempts.value = data || [];
        } catch (error) {
          console.error('Error loading previous attempts:', error);
        }
      };

      const startQuiz = async () => {
        if (!canTakeCurrentQuiz.value || isStarting.value) return;
        
        isStarting.value = true;
        console.log('🚀 Starting quiz:', selectedQuiz.value.id);
        
        try {
          await supabase
            .from('quiz_attempts')
            .delete()
            .eq('quiz_id', selectedQuiz.value.id)
            .eq('student_id', studentInfo.value.student_id)
            .eq('status', 'in_progress');

          console.log('✅ Cleaned up old attempts');

          console.log('📥 Loading questions...');
          const { data: questionsData, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, question_number, question_type, question_text, points')
            .eq('quiz_id', selectedQuiz.value.id)
            .order('question_number');

          if (questionsError) {
            console.error('❌ Questions error:', questionsError);
            throw new Error('Failed to load questions: ' + questionsError.message);
          }

          if (!questionsData || questionsData.length === 0) {
            throw new Error('No questions found for this quiz');
          }

          console.log(`✅ Loaded ${questionsData.length} questions`);

          const questionsWithOptions = await Promise.all(
            questionsData.map(async (question) => {
              console.log(`📝 Processing Q${question.question_number}: ${question.question_type}`);
              
              if (question.question_type === 'multiple_choice') {
                const { data: options, error: optionsError } = await supabase
                  .from('question_options')
                  .select('id, option_number, option_text, is_correct')
                  .eq('question_id', question.id)
                  .order('option_number');

                if (optionsError) {
                  console.error(`❌ Options error for Q${question.id}:`, optionsError);
                  return { ...question, options: [] };
                }

                console.log(`   ✅ Loaded ${options?.length || 0} options`);

                let finalOptions = options || [];
                if (selectedQuiz.value.shuffle_options && finalOptions.length > 0) {
                  finalOptions = shuffleArray(finalOptions);
                  console.log(`   🔀 Shuffled options`);
                }

                return { ...question, options: finalOptions };
              } else if (question.question_type === 'true_false' || question.question_type === 'fill_blank') {
                const { data: answer } = await supabase
                  .from('question_answers')
                  .select('correct_answer, case_sensitive')
                  .eq('question_id', question.id)
                  .single();

                // Debug logging for answer loading
                console.log(`📋 Loaded answer for Q${question.question_number} (${question.question_type}):`);
                console.log(`   Answer: "${answer?.correct_answer}"`);
                console.log(`   Case sensitive: ${answer?.case_sensitive}`);

                return { ...question, correct_answer: answer };
              }
              
              return { ...question, options: [] };
            })
          );

          if (selectedQuiz.value.shuffle_questions) {
            questions.value = shuffleArray(questionsWithOptions);
            console.log('🔀 Questions shuffled');
          } else {
            questions.value = questionsWithOptions;
          }

          if (questions.value.length === 0) {
            throw new Error('No questions loaded');
          }

          const maxScore = questions.value.reduce((sum, q) => sum + (q.points || 1), 0);

          const { data: allAttempts } = await supabase
            .from('quiz_attempts')
            .select('attempt_number')
            .eq('quiz_id', selectedQuiz.value.id)
            .eq('student_id', studentInfo.value.student_id)
            .order('attempt_number', { ascending: false })
            .limit(1);

          const nextAttemptNumber = allAttempts && allAttempts.length > 0 
            ? allAttempts[0].attempt_number + 1 
            : 1;

          console.log('📝 Creating attempt #' + nextAttemptNumber);

          let attempt = null;
          let retryCount = 0;
          const maxRetries = 3;

          while (!attempt && retryCount < maxRetries) {
            try {
              const { data: attemptData, error: attemptError } = await supabase
                .from('quiz_attempts')
                .insert({
                  quiz_id: selectedQuiz.value.id,
                  student_id: studentInfo.value.student_id,
                  attempt_number: nextAttemptNumber,
                  max_score: maxScore,
                  status: 'in_progress'
                })
                .select()
                .single();

              if (attemptError) {
                throw attemptError;
              }

              attempt = attemptData;
            } catch (error) {
              retryCount++;
              console.log(`⚠️ Attempt creation retry ${retryCount}/${maxRetries}`);
              if (retryCount >= maxRetries) {
                throw new Error('Failed to create quiz attempt after retries: ' + error.message);
              }
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }

          if (!attempt) {
            throw new Error('Failed to create quiz attempt');
          }

          currentAttempt.value = attempt;
          console.log('✅ Attempt created:', attempt.id);

          const { data: verifyAttempt, error: verifyError } = await supabase
            .from('quiz_attempts')
            .select('id, status')
            .eq('id', attempt.id)
            .single();

          if (verifyError || !verifyAttempt) {
            throw new Error('Failed to verify attempt creation');
          }

          console.log('✅ Attempt verified:', verifyAttempt.id);

          studentAnswers.value = {};
          questions.value.forEach(q => {
            studentAnswers.value[q.id] = {
              selected_option_id: null,
              answer_text: '',
              attempt_id: attempt.id
            };
          });

          console.log('✅ Initialized answers for', questions.value.length, 'questions');

          if (selectedQuiz.value.has_time_limit) {
            timeRemaining.value = selectedQuiz.value.time_limit_minutes * 60;
            startTimer();
            console.log('⏱️ Timer started:', selectedQuiz.value.time_limit_minutes, 'minutes');
          }

          startTime.value = Date.now();
          currentQuestionIndex.value = 0;
          takingQuiz.value = true;

          console.log('🎉 Quiz started successfully!');

        } catch (error) {
          console.error('❌ Error starting quiz:', error);
          alert(`Failed to start quiz: ${error.message}`);
          currentAttempt.value = null;
          questions.value = [];
          studentAnswers.value = {};
          takingQuiz.value = false;
        } finally {
          isStarting.value = false;
        }
      };

      const startTimer = () => {
        if (timerInterval.value) clearInterval(timerInterval.value);

        timerInterval.value = setInterval(() => {
          timeRemaining.value--;
          if (timeRemaining.value <= 0) {
            clearInterval(timerInterval.value);
            alert('Time is up!');
            submitQuiz();
          }
        }, 1000);
      };

      const saveAnswer = async (questionId) => {
        try {
          if (!currentAttempt.value || !currentAttempt.value.id) {
            console.error('❌ No active attempt - cannot save answer');
            return false;
          }

          const question = questions.value.find(q => q.id === questionId);
          if (!question) {
            console.error('❌ Question not found:', questionId);
            return false;
          }

          const answer = studentAnswers.value[questionId];
          if (!answer) {
            console.error('❌ No answer data for question:', questionId);
            return false;
          }

          console.log('💾 Saving answer for Q' + question.question_number);

          const answerData = {
            attempt_id: currentAttempt.value.id,
            question_id: questionId,
            selected_option_id: answer.selected_option_id || null,
            answer_text: answer.answer_text && answer.answer_text.trim() ? answer.answer_text.trim() : null,
            points_possible: parseFloat(question.points) || 1.00,
            is_correct: false,
            points_earned: 0
          };

          let saved = false;
          let retryCount = 0;
          const maxRetries = 3;

          while (!saved && retryCount < maxRetries) {
            try {
              const { data, error } = await supabase
                .from('student_answers')
                .upsert(answerData, { 
                  onConflict: 'attempt_id,question_id'
                })
                .select();

              if (error) {
                throw error;
              }

              saved = true;
              console.log('✅ Answer saved to student_answers table');
            } catch (error) {
              retryCount++;
              console.log(`⚠️ Save answer retry ${retryCount}/${maxRetries}:`, error.message);
              if (retryCount >= maxRetries) {
                console.error('❌ Error saving answer after retries:', error.message);
                return false;
              }
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }

          return saved;

        } catch (error) {
          console.error('❌ Exception saving answer:', error);
          return false;
        }
      };

      const selectOption = async (questionId, optionId) => {
        console.log('✅ Selected option:', { questionId, optionId });
        studentAnswers.value[questionId].selected_option_id = optionId;
        studentAnswers.value[questionId].answer_text = '';
        await saveAnswer(questionId);
      };

      const selectTrueFalse = async (questionId, value) => {
        console.log('✅ Selected true/false:', { questionId, value });
        studentAnswers.value[questionId].answer_text = value;
        studentAnswers.value[questionId].selected_option_id = null;
        await saveAnswer(questionId);
      };

      const autoSaveAnswer = (questionId) => {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          console.log('⏱️ Auto-saving answer for Q' + questionId);
          saveAnswer(questionId);
        }, 500);
      };

      const previousQuestion = () => {
        if (currentQuestionIndex.value > 0) {
          currentQuestionIndex.value--;
        }
      };

      const nextQuestion = () => {
        if (currentQuestionIndex.value < questions.value.length - 1) {
          currentQuestionIndex.value++;
        }
      };

      const goToQuestion = (index) => {
        currentQuestionIndex.value = index;
      };

      const showSubmitConfirmation = () => {
        console.log('📋 Showing submit confirmation...');
        showSubmitModal.value = true;
      };

      const submitQuiz = async () => {
        if (isSubmitting.value) {
          console.log('⚠️ Already submitting, ignoring duplicate request');
          return;
        }
        
        isSubmitting.value = true;
        showSubmitModal.value = false;

        console.log('📤 Starting quiz submission with AUTO-GRADING...');

        try {
          if (timerInterval.value) {
            clearInterval(timerInterval.value);
            timerInterval.value = null;
            console.log('⏹️ Timer stopped');
          }

          const timeTaken = Math.floor((Date.now() - startTime.value) / 1000);
          const timeTakenMinutes = Math.ceil(timeTaken / 60);
          console.log(`⏱️ Time taken: ${timeTakenMinutes} minutes`);

          if (!currentAttempt.value || !currentAttempt.value.id) {
            throw new Error('No active quiz attempt found');
          }

          console.log('🔍 Attempt ID:', currentAttempt.value.id);

          const { data: attemptCheck, error: checkError } = await supabase
            .from('quiz_attempts')
            .select('id, status')
            .eq('id', currentAttempt.value.id)
            .single();

          if (checkError || !attemptCheck) {
            throw new Error('Quiz attempt not found in database');
          }

          console.log('✅ Attempt verified in database:', attemptCheck.id);
          console.log('📊 Answers submitted:', answeredCount.value, 'out of', questions.value.length);

          await new Promise(resolve => setTimeout(resolve, 500));

          console.log('🎯 AUTO-GRADING: Starting automatic grading process...');

          let totalScore = 0;
          let gradedAnswers = [];

          for (const question of questions.value) {
            const studentAnswer = studentAnswers.value[question.id];
            let isCorrect = false;
            let pointsEarned = 0;

            if (question.question_type === 'multiple_choice') {
              if (studentAnswer.selected_option_id) {
                const selectedOption = question.options.find(opt => opt.id === studentAnswer.selected_option_id);
                isCorrect = selectedOption ? selectedOption.is_correct : false;
                pointsEarned = isCorrect ? question.points : 0;
              }
            } else if (question.question_type === 'true_false') {
              if (studentAnswer.answer_text && question.correct_answer) {
                const studentAns = studentAnswer.answer_text.toLowerCase().trim();
                const correctAns = question.correct_answer.correct_answer.toLowerCase().trim();
                isCorrect = studentAns === correctAns;
                pointsEarned = isCorrect ? question.points : 0;
              }
            } else if (question.question_type === 'fill_blank') {
              if (studentAnswer.answer_text && question.correct_answer) {
                // Debug logging
                console.log(`🔍 Fill-in-the-blank validation for Q${question.question_number}:`);
                console.log(`   Student answer: "${studentAnswer.answer_text}"`);
                console.log(`   Correct answer: "${question.correct_answer.correct_answer}"`);
                console.log(`   Case sensitive (raw): ${question.correct_answer.case_sensitive}`);
                
                // Handle case sensitivity - default to false if null/undefined
                const isCaseSensitive = question.correct_answer.case_sensitive === true;
                console.log(`   Case sensitive (processed): ${isCaseSensitive}`);
                
                const studentAns = isCaseSensitive 
                  ? studentAnswer.answer_text.trim()
                  : studentAnswer.answer_text.toLowerCase().trim();
                const correctAns = isCaseSensitive
                  ? question.correct_answer.correct_answer.trim()
                  : question.correct_answer.correct_answer.toLowerCase().trim();
                  
                console.log(`   Student (processed): "${studentAns}"`);
                console.log(`   Correct (processed): "${correctAns}"`);
                
                isCorrect = studentAns === correctAns;
                pointsEarned = isCorrect ? question.points : 0;
                
                console.log(`   Match result: ${isCorrect} (${pointsEarned}/${question.points} pts)`);
              }
            }

            totalScore += pointsEarned;

            gradedAnswers.push({
              attempt_id: currentAttempt.value.id,
              question_id: question.id,
              is_correct: isCorrect,
              points_earned: pointsEarned
            });

            console.log(`   Q${question.question_number}: ${isCorrect ? '✅' : '❌'} ${pointsEarned}/${question.points} pts`);
          }

          console.log(`🎯 Total Score: ${totalScore}/${currentAttempt.value.max_score}`);

          const percentage = (totalScore / currentAttempt.value.max_score) * 100;
          console.log(`📊 Percentage: ${percentage.toFixed(2)}%`);

          for (const gradedAnswer of gradedAnswers) {
            await supabase
              .from('student_answers')
              .update({
                is_correct: gradedAnswer.is_correct,
                points_earned: gradedAnswer.points_earned
              })
              .eq('attempt_id', gradedAnswer.attempt_id)
              .eq('question_id', gradedAnswer.question_id);
          }

          console.log('✅ All answers graded and updated');

          const { error: attemptUpdateError } = await supabase
            .from('quiz_attempts')
            .update({
              submitted_at: new Date().toISOString(),
              time_taken_minutes: timeTakenMinutes,
              total_score: totalScore,
              percentage: percentage,
              status: 'graded',
              auto_graded: true,
              graded_at: new Date().toISOString()
            })
            .eq('id', currentAttempt.value.id);

          if (attemptUpdateError) {
            throw new Error('Failed to update attempt: ' + attemptUpdateError.message);
          }

          console.log('✅ Quiz attempt updated to GRADED status');

          const { data: existingResult } =await supabase
  .from('quiz_results')
  .select('*')
  .eq('quiz_id', selectedQuiz.value.id)
  .eq('student_id', studentInfo.value.student_id)
  .single();
      const { data: allAttempts } = await supabase
        .from('quiz_attempts')
        .select('id, total_score, percentage')
        .eq('quiz_id', selectedQuiz.value.id)
        .eq('student_id', studentInfo.value.student_id)
        .in('status', ['submitted', 'graded', 'reviewed'])
        .order('percentage', { ascending: false });

      const bestAttempt = allAttempts && allAttempts.length > 0 ? allAttempts[0] : null;
      const totalAttempts = allAttempts ? allAttempts.length : 0;

      if (existingResult) {
        await supabase
          .from('quiz_results')
          .update({
            best_attempt_id: bestAttempt?.id,
            best_score: bestAttempt?.total_score || 0,
            best_percentage: bestAttempt?.percentage || 0,
            total_attempts: totalAttempts,
            latest_attempt_date: new Date().toISOString(),
            status: 'graded',
            visible_to_student: true
          })
          .eq('quiz_id', selectedQuiz.value.id)
          .eq('student_id', studentInfo.value.student_id);
      } else {
        await supabase
          .from('quiz_results')
          .insert({
            quiz_id: selectedQuiz.value.id,
            student_id: studentInfo.value.student_id,
            best_attempt_id: bestAttempt?.id,
            best_score: bestAttempt?.total_score || 0,
            best_percentage: bestAttempt?.percentage || 0,
            total_attempts: totalAttempts,
            latest_attempt_date: new Date().toISOString(),
            status: 'graded',
            visible_to_student: true
          });
      }

      console.log('✅ Quiz results updated');

      const { data: finalAttempt } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('id', currentAttempt.value.id)
        .single();

      submittedAttempt.value = finalAttempt;

      console.log('✅ Quiz AUTO-GRADED and submitted successfully!');

      alert(`🎉 Quiz submitted and graded automatically!\n\nYour Score: ${totalScore.toFixed(2)}/${currentAttempt.value.max_score}\nPercentage: ${percentage.toFixed(2)}%\n\nYour responses have been saved.`);

      const completedQuizId = selectedQuiz.value.id;
      takingQuiz.value = false;
      currentAttempt.value = null;
      questions.value = [];
      studentAnswers.value = {};
      currentQuestionIndex.value = 0;
      startTime.value = null;
      timeRemaining.value = 0;

      console.log('🔄 Reloading quizzes...');
      await loadQuizzes();
      
      selectedQuiz.value = null;
      
      console.log('✅ Submission complete - returned to quiz list');

    } catch (error) {
      console.error('❌ Submission error:', error);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to submit and grade quiz.\n\n';
      if (error.message.includes('not found')) {
        errorMessage += 'Your quiz attempt could not be found. Please contact your teacher.';
      } else if (error.message.includes('connection')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else if (error.message.includes('database')) {
        errorMessage += 'Database error. Please contact your teacher.';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
      
      if (selectedQuiz.value?.has_time_limit && takingQuiz.value) {
        console.log('🔄 Restarting timer...');
        startTimer();
      }

    } finally {
      isSubmitting.value = false;
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'multiple_choice': 'Multiple Choice',
      'true_false': 'True/False',
      'fill_blank': 'Fill in the Blank'
    };
    return labels[type] || type;
  };

  const goBack = () => {
    if (takingQuiz.value) {
      if (confirm('Leave quiz? Progress will be lost.')) {
        if (timerInterval.value) clearInterval(timerInterval.value);
        takingQuiz.value = false;
        currentAttempt.value = null;
        questions.value = [];
        studentAnswers.value = {};
        selectedQuiz.value = null;
      }
    } else {
      router.back();
    }
  };

  onMounted(async () => {
    console.log('🔧 Component mounted - initializing...');
    
    const studentLoaded = await loadStudentInfo();
    if (!studentLoaded) {
      console.error('❌ Failed to load student info');
      router.push('/login');
      return;
    }

    const paramsLoaded = loadRouteParams();
    if (!paramsLoaded) {
      console.error('❌ Failed to load route params');
      alert('Missing information');
      router.push('/student/subjects');
      return;
    }

    await loadQuizzes();
    setupRealtimeSubscription();
    loading.value = false;
    
    console.log('✅ Component initialization complete');
  });

  onUnmounted(() => {
    console.log('🧹 Component unmounting - cleaning up...');
    
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
    
    if (quizSubscription) {
      supabase.removeChannel(quizSubscription);
      quizSubscription = null;
    }
    
    console.log('✅ Cleanup complete');
  });

  return {
    loading, studentInfo, subject, section, quizzes, newQuizzes, pastQuizzes,
    completedQuizzes, selectedQuiz, takingQuiz, currentAttempt,
    questions, studentAnswers, currentQuestionIndex, timeRemaining, previousAttempts,
    canTakeCurrentQuiz, quizUnavailableReason, isStarting, showSubmitModal,
    isSubmitting, answeredCount, unansweredCount, remainingAttempts, showingResults,
    submittedAttempt,
    formatPHTime, formatTime,
    getQuizStatus, getQuizResult, getQuizAvailabilityClass, getQuizAvailabilityText,
    viewQuizDetails, startQuiz, selectOption, selectTrueFalse, autoSaveAnswer,
    previousQuestion, nextQuestion, goToQuestion, showSubmitConfirmation,
    submitQuiz, getQuestionTypeLabel, goBack
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

  .take-quiz-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
    padding: 1.5rem 2rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    overflow-y: auto;
  }

  /* Custom Scrollbar */
  .take-quiz-page::-webkit-scrollbar {
    width: 12px;
  }

  .take-quiz-page::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 10px;
  }

  .take-quiz-page::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .take-quiz-page::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  }

  .dark .take-quiz-page {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  }

  /* Header */
  .section-header-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 1.5rem 2rem;
    margin-bottom: 1.5rem;
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
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
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
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
    transition: all 0.3s ease;
  }

  .section-header-icon:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(61, 141, 122, 0.4);
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
    line-height: 1.2;
  }

  .dark .section-header-title {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-header-subtitle {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    line-height: 1.4;
  }

  .dark .section-header-subtitle {
    color: #94a3b8;
  }

  .section-header-description {
    font-size: 0.813rem;
    font-weight: 500;
    color: #94a3b8;
    line-height: 1.4;
  }

  .dark .section-header-description {
    color: #94a3b8;
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 2px solid transparent;
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .back-btn:hover::before {
    left: 100%;
  }

  .back-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 141, 122, 0.35);
    background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  }

  .dark .back-btn {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    border-color: transparent;
  }

  .dark .back-btn:hover {
    background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  }

  /* Loading */
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

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(61, 141, 122, 0.2);
    border-radius: 16px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3D8D7A, #2d6a5a);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
    border-color: #3D8D7A;
  }

  .stat-card:hover::before {
    transform: scaleX(1);
  }

  .dark .stat-card {
    background: rgba(35, 39, 43, 0.95);
    backdrop-filter: blur(20px);
    border-color: rgba(61, 141, 122, 0.3);
  }

  .stat-icon {
    font-size: 2.5rem;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .dark .stat-value {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    text-align: center;
  }

  .dark .stat-label {
    color: #94a3b8;
  }

  /* Quiz Categories */
  .quiz-category {
    margin-bottom: 2.5rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .category-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #3D8D7A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .dark .category-title {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dark .category-title {
    color: #A3D1C6;
  }

  .category-icon {
    font-size: 1.75rem;
  }

  .category-count {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    padding: 0.35rem 0.9rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
  }

  /* Quiz Grid */
  .quiz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .quiz-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Quiz Cards */
  .quiz-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(61, 141, 122, 0.2);
    border-radius: 16px;
    padding: 1.75rem;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .quiz-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3D8D7A, #2d6a5a);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .quiz-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
    border-color: #3D8D7A;
  }

  .quiz-card:hover::before {
    transform: scaleX(1);
  }

  .dark .quiz-card {
    background: rgba(35, 39, 43, 0.95);
    backdrop-filter: blur(20px);
    border-color: rgba(61, 141, 122, 0.3);
  }

  .quiz-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.35rem 0.9rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .new-badge {
    background: linear-gradient(135deg, #B3D8A8, #8ac17e);
    color: #1f2937;
  }

  .completed-badge {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
  }

  .expired-badge {
    background: #ef4444;
    color: white;
  }

  .quiz-header {
    margin-bottom: 1rem;
  }

  .quiz-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    letter-spacing: -0.3px;
  }

  .dark .quiz-title {
    color: #e2e8f0;
  }

  .quiz-code {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .code-label {
    color: #64748b;
    font-weight: 600;
  }

  .dark .code-label {
    color: #94a3b8;
  }

  .code-value {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    color: #3D8D7A;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    font-weight: 700;
    font-family: 'Monaco', 'Courier New', monospace;
    border: 1px solid rgba(61, 141, 122, 0.2);
    letter-spacing: 0.5px;
  }

  .dark .code-value {
    background: linear-gradient(135deg, #1e293b, #334155);
    color: #A3D1C6;
    border-color: rgba(163, 209, 198, 0.3);
  }

  .quiz-description {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .dark .quiz-description {
    color: #94a3b8;
  }

  .quiz-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .quiz-meta {
    border-bottom-color: #3D8D7A;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.813rem;
    color: #6b7280;
  }

  .dark .meta-item {
    color: #A3D1C6;
  }

  .quiz-schedule {
    background: #FBFFE4;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dark .quiz-schedule {
    background: #181c20;
  }

  .schedule-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.813rem;
  }

  .schedule-label {
    color: #6b7280;
    font-weight: 500;
  }

  .dark .schedule-label {
    color: #A3D1C6;
  }

  .schedule-time {
    color: #3D8D7A;
    font-weight: 600;
  }

  .dark .schedule-time {
    color: #A3D1C6;
  }

  .quiz-result {
    background: #FBFFE4;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 1rem;
  }

  .dark .quiz-result {
    background: #181c20;
  }

  .result-score {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .score-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .dark .score-label {
    color: #A3D1C6;
  }

  .score-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #3D8D7A;
  }

  .dark .score-value {
    color: #A3D1C6;
  }

  .result-attempts {
    font-size: 0.813rem;
    color: #6b7280;
  }

  .dark .result-attempts {
    color: #A3D1C6;
  }

  .quiz-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    flex: 1;
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 141, 122, 0.35);
    background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #3D8D7A;
    border: 2px solid #3D8D7A;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
  }

  .btn-secondary:hover {
    background: rgba(61, 141, 122, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
  }

  .dark .btn-secondary {
    background: rgba(35, 39, 43, 0.9);
    color: #A3D1C6;
    border-color: #A3D1C6;
  }

  .dark .btn-secondary:hover {
    background: rgba(163, 209, 198, 0.1);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn:disabled::before {
    display: none;
  }

  .btn:disabled:hover {
    transform: none;
    box-shadow: none;
  }

  /* Empty State */
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
  }

  .empty-state h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .dark .empty-state h3 {
    color: #A3D1C6;
  }

  .empty-state p {
    font-size: 1rem;
    color: #6b7280;
  }

  .dark .empty-state p {
    color: #A3D1C6;
  }

  /* Quiz Details View */
  .content-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .dark .content-card {
    background: #23272b;
    border: 1px solid #3D8D7A;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: transparent;
    color: #3D8D7A;
  }

  .back-link:hover {
    background: rgba(61, 141, 122, 0.1);
  }

  .dark .back-link {
    color: #A3D1C6;
  }

  .quiz-status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .quiz-status-badge.available {
    background: #B3D8A8;
    color: #1f2937;
  }

  .quiz-status-badge.not-started {
    background: #fbbf24;
    color: #1f2937;
  }

  .quiz-status-badge.expired {
    background: #ef4444;
    color: white;
  }

  .quiz-info-card {
    background: #FBFFE4;
    border: 1px solid #A3D1C6;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
  }

  .dark .quiz-info-card {
    background: #181c20;
    border-color: #3D8D7A;
  }

  .details-title {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #3D8D7A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  .dark .details-title {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .quiz-code-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    border: 2px solid #3D8D7A;
  }

  .dark .quiz-code-display {
    background: #23272b;
    border-color: #3D8D7A;
  }

  .quiz-code-display .code-label {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 600;
  }

  .dark .quiz-code-display .code-label {
    color: #A3D1C6;
  }

  .quiz-code-display .code-value {
    font-size: 1.25rem;
    background: #FBFFE4;
    color: #3D8D7A;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.1em;
  }

  .dark .quiz-code-display .code-value {
    background: #181c20;
    color: #A3D1C6;
  }

  .details-description {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .dark .details-description {
    color: #A3D1C6;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #A3D1C6;
  }

  .dark .info-item {
    background: #23272b;
    border-color: #3D8D7A;
  }

  .info-icon {
    font-size: 2rem;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
  }

  .dark .info-label {
    color: #A3D1C6;
  }

  .info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #3D8D7A;
  }

  .dark .info-value {
    color: #A3D1C6;
  }

  .schedule-info {
    margin-bottom: 2rem;
  }

  .schedule-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .dark .schedule-title {
    color: #A3D1C6;
  }

  .schedule-details {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid #A3D1C6;
  }

  .dark .schedule-details {
    background: #23272b;
    border-color: #3D8D7A;
  }

  .schedule-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    font-size: 0.875rem;
  }

  .schedule-row:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .schedule-row:not(:last-child) {
    border-bottom-color: #3D8D7A;
  }

  .schedule-icon {
    font-size: 1.25rem;
  }

  .schedule-row .schedule-label {
    flex: 0 0 120px;
  }

  .schedule-row .schedule-value {
    font-weight: 600;
  }

  .attempts-history {
    margin-top: 2rem;
  }

  .attempts-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .dark .attempts-title {
    color: #A3D1C6;
  }

  .attempts-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .attempt-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    border: 1px solid #A3D1C6;
  }

  .dark .attempt-item {
    background: #23272b;
    border-color: #3D8D7A;
  }

  .attempt-number {
    font-weight: 600;
    color: #3D8D7A;
  }

  .dark .attempt-number {
    color: #A3D1C6;
  }

  .attempt-score {
    font-size: 1.25rem;
    font-weight: 700;
    color: #3D8D7A;
  }

  .dark .attempt-score {
    color: #A3D1C6;
  }

  .attempt-date {
    font-size: 0.813rem;
    color: #6b7280;
  }

  .dark .attempt-date {
    color: #A3D1C6;
  }

  .action-card {
    background: #FBFFE4;
    border: 2px solid #3D8D7A;
    border-radius: 12px;
    padding: 2rem;
  }

  .dark .action-card {
    background: #181c20;
    border-color: #3D8D7A;
  }

  .warning-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #fef3c7;
    border: 2px solid #fbbf24;
    border-radius: 8px;
    color: #92400e;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .dark .warning-message {
    background: rgba(251, 191, 36, 0.1);
    border-color: #fbbf24;
    color: #fbbf24;
  }

  .btn-start-quiz {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 700;
    background: #20c997;
    color: #181c20;
    border: 2px solid #20c997;
  }

  .btn-start-quiz:hover {
    background: #A3D1C6;
    color: #23272b;
    border-color: #20c997;
    transform: translateY(-2px);
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* Quiz Taking View */
  .quiz-taking-view {
    max-width: 900px;
    margin: 0 auto;
  }

  .quiz-timer-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(61, 141, 122, 0.2);
    border-radius: 16px;
    padding: 1.75rem 2rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }

  .quiz-timer-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3D8D7A, #2d6a5a);
  }

  .dark .quiz-timer-header {
    background: rgba(35, 39, 43, 0.95);
    backdrop-filter: blur(20px);
    border-color: rgba(61, 141, 122, 0.3);
  }

  .timer-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .timer-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .dark .timer-label {
    color: #94a3b8;
  }

  .timer-display {
    font-size: 2.25rem;
    font-weight: 800;
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: 'Monaco', 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .dark .timer-display {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .timer-warning {
    color: #ef4444 !important;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .progress-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;
  }

  .progress-info > span {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 600;
    text-align: right;
  }

  .dark .progress-info > span {
    color: #A3D1C6;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .dark .progress-bar {
    background: #3D8D7A;
  }

  .progress-fill {
    height: 100%;
    background: #3D8D7A;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .dark .progress-fill {
    background: #A3D1C6;
  }

  /* Question Container */
  .question-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(61, 141, 122, 0.2);
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
  }

  .question-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3D8D7A, #2d6a5a);
  }

  .dark .question-container {
    background: rgba(35, 39, 43, 0.95);
    backdrop-filter: blur(20px);
    border-color: rgba(61, 141, 122, 0.3);
  }

  .question-card {
    margin-bottom: 2rem;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .question-number-badge {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    padding: 0.5rem 1.25rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.875rem;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
    letter-spacing: 0.3px;
  }

  .question-type-badge {
    padding: 0.5rem 1.25rem;
    border-radius: 20px;
    font-size: 0.813rem;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .question-type-badge.multiple_choice {
    background: #B3D8A8;
    color: #1f2937;
  }

  .question-type-badge.true_false {
    background: #A3D1C6;
    color: #1f2937;
  }

  .question-type-badge.fill_blank {
    background: #FBFFE4;
    color: #1f2937;
    border: 2px solid #A3D1C6;
  }

  .question-text {
    font-size: 1.35rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 2rem;
    line-height: 1.6;
    letter-spacing: -0.3px;
  }

  .dark .question-text {
    color: #e2e8f0;
  }

  /* Answer Options */
  .answer-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .option-item {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem 1.75rem;
    background: rgba(255, 255, 255, 0.7);
    border: 2px solid rgba(61, 141, 122, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .option-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    border-radius: 12px 0 0 12px;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  .option-item:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3D8D7A;
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
  }

  .option-item:hover::before {
    transform: scaleY(1);
  }

  .option-item.selected {
    background: rgba(255, 255, 255, 0.95);
    border-color: #3D8D7A;
    box-shadow: 0 4px 16px rgba(61, 141, 122, 0.15);
  }

  .option-item.selected::before {
    transform: scaleY(1);
  }

  .dark .option-item {
    background: rgba(24, 28, 32, 0.7);
    border-color: rgba(61, 141, 122, 0.3);
  }

  .dark .option-item:hover,
  .dark .option-item.selected {
    background: rgba(35, 39, 43, 0.95);
    border-color: #A3D1C6;
    box-shadow: 0 4px 16px rgba(163, 209, 198, 0.15);
  }

  .option-radio {
    width: 22px;
    height: 22px;
    border: 3px solid #cbd5e1;
    border-radius: 50%;
    position: relative;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  .option-item:hover .option-radio {
    border-color: #3D8D7A;
  }

  .option-item.selected .option-radio {
    border-color: #3D8D7A;
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  }

  .option-item.selected .option-radio::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: 900;
  }

  .dark .option-item.selected .option-radio {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
  }

  .option-letter {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.875rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
  }

  .option-text {
    flex: 1;
    font-size: 1.05rem;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.5;
  }

  .dark .option-text {
    color: #e2e8f0;
  }

  /* True/False Options */
  .tf-options {
    flex-direction: row;
    gap: 1.5rem;
  }

  .tf-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem 1rem;
    background: #FBFFE4;
    border: 2px solid #A3D1C6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tf-option:hover {
    background: white;
    border-color: #3D8D7A;
    transform: scale(1.05);
  }

  .tf-option.selected {
    background: white;
    border-color: #3D8D7A;
    box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.2);
  }

  .dark .tf-option {
    background: #181c20;
    border-color: #3D8D7A;
  }

  .dark .tf-option:hover,
  .dark .tf-option.selected {
    background: #23272b;
    border-color: #A3D1C6;
    box-shadow: 0 0 0 3px rgba(163, 209, 198, 0.2);
  }

  .tf-icon {
    font-size: 3rem;
  }

  .tf-label {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.3px;
  }

  .dark .tf-label {
    color: #e2e8f0;
  }

  /* Fill in the Blank */
  .answer-input {
    margin-top: 1rem;
  }

  .fill-blank-input {
    width: 100%;
    padding: 1.25rem 1.5rem;
    border: 2px solid rgba(61, 141, 122, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    font-size: 1.05rem;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fill-blank-input:focus {
    outline: none;
    border-color: #3D8D7A;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 16px rgba(61, 141, 122, 0.15);
  }

  .dark .fill-blank-input {
    background: rgba(24, 28, 32, 0.7);
    color: #e2e8f0;
    border-color: rgba(61, 141, 122, 0.4);
  }

  .dark .fill-blank-input:focus {
    background: rgba(35, 39, 43, 0.95);
    border-color: #A3D1C6;
    box-shadow: 0 4px 16px rgba(163, 209, 198, 0.15);
  }

  /* Question Navigation */
  .question-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-top: 2.5rem;
    padding-top: 2.5rem;
    border-top: 2px solid rgba(226, 232, 240, 0.5);
  }

  .dark .question-navigation {
    border-top-color: rgba(61, 141, 122, 0.3);
  }

  .question-indicators {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    justify-content: center;
    flex: 1;
  }

  .indicator-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #e2e8f0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .indicator-dot:hover {
    transform: scale(1.3);
    box-shadow: 0 4px 8px rgba(61, 141, 122, 0.2);
  }

  .indicator-dot.active {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    transform: scale(1.4);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
  }

  .indicator-dot.answered {
    background: linear-gradient(135deg, #B3D8A8, #8ac17e);
  }

  .indicator-dot.answered.active {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  }

  .dark .indicator-dot {
    background: #334155;
  }

  .dark .indicator-dot.active {
    background: linear-gradient(135deg, #A3D1C6, #20c997);
  }

  .dark .indicator-dot.answered {
    background: linear-gradient(135deg, #B3D8A8, #8ac17e);
  }

  .btn-submit {
    background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
    color: white;
    border: 2px solid transparent;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
    position: relative;
    overflow: hidden;
  }

  .btn-submit::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .btn-submit:hover::before {
    left: 100%;
  }

  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 141, 122, 0.35);
    background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  }

  /* Modal */
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
    max-width: 480px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    animation: modalSlideIn 0.3s ease-out;
  }

  .dark .modal-content {
    background: #23272b;
    border: 1px solid #3D8D7A;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
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
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
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
    margin-bottom: 0.5rem;
  }

  .dark .modal-title {
    color: #A3D1C6;
  }

  .modal-description {
    font-size: 0.875rem;
    color: #6b7280;
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
    min-width: 100px;
  }

  /* Responsive Design - Mobile */
  @media (max-width: 768px) {
    .take-quiz-page {
      padding: 1rem;
    }

    .section-header-content {
      flex-direction: column;
      gap: 1rem;
    }

    /* Mobile Stats Grid - Same as Grades.vue */
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

    .quiz-timer-header {
      flex-direction: column;
      gap: 1rem;
    }

    .progress-info {
      width: 100%;
    }

    .progress-info > span {
      text-align: left;
    }

    .tf-options {
      flex-direction: column;
    }

    .question-navigation {
      flex-direction: column;
      gap: 1.5rem;
    }

    .question-navigation .btn {
      width: 100%;
    }

    .modal-content {
      width: 95%;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }

    .modal-actions .btn {
      width: 100%;
    }
  }
  </style>
