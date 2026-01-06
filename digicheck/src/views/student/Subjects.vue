@media (max-width: 768px) {
  .stats-grid {
    gap: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .stat-card {
    gap: 0.25rem;
    padding: 0.5rem 0.5rem;
  }
  .stat-value {
    font-size: 1.1rem;
    margin-right: 0.25rem;
  }
  .stat-label {
    font-size: 0.8rem;
    margin-left: 0.1rem;
  }
}
/* code: Responsive mobile improvements for back button and stat boxes */
@media (max-width: 768px) {
  .section-header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .back-btn {
    align-self: flex-start;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    min-width: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    justify-content: center;
    font-size: 1.25rem;
    gap: 0;
  }
  .back-btn span {
    display: none;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .stat-card {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }
  .stat-value {
    font-size: 1.25rem;
    margin-right: 0.5rem;
  }
  .stat-label {
    font-size: 0.85rem;
    margin-left: 0.25rem;
  }
}

<template>
  <div class="subjects-container">
    <!-- Modern Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-main">
          <div class="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" stroke="currentColor" stroke-width="2"/>
              <path d="M7 7H17M7 10H17M7 13H17M7 16H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">My Subjects</h1>
            <p class="page-subtitle">View and manage your enrolled subjects</p>
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
        
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ totalSubjects }}</div>
            <div class="stat-label">Total Subjects</div>
          </div>
          <div class="enrollment-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L6.67 7L1 12.67L2.33 14L6.67 9.67L10.5 13.5L18.33 5.67L21 8.33V6.33L21 9Z"/>
            </svg>
            <span>Enrolled by Teacher</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Controls Section -->
    <div class="controls-card">
      <div class="search-section">
        <div class="search-wrapper">
          <div class="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search subjects by name, code, or instructor..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="filter-section">
        <div class="filter-pills">
          <button 
            v-for="filter in filters" 
            :key="filter.key"
            @click="activeFilter = filter.key"
            :class="['filter-pill', { 'active': activeFilter === filter.key }]"
          >
            <span class="filter-label">{{ filter.label }}</span>
            <span class="filter-count" v-if="getFilterCount(filter.key) > 0">{{ getFilterCount(filter.key) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Subjects Grid -->
    <div class="content-area">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
      
      <!-- Subjects Grid -->
      <div v-else-if="filteredSubjects.length > 0" class="subjects-grid">
        <div 
          v-for="subject in filteredSubjects" 
          :key="subject.id" 
          :class="[
            'subject-card',
            { 'favorite-card': favoriteSubjects.has(subject.id) },
            { 'archived-card': archivedSubjects.has(subject.id) }
          ]"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="subject-info">
              <div class="subject-avatar" :style="{ background: subject.color || getSubjectColor(subject.code) }">
                <span>{{ getSubjectInitials(subject) }}</span>
              </div>
              <div class="subject-details">
                <h3 class="subject-title">{{ subject.name }}</h3>
                <p class="subject-meta">
                  <span class="subject-code">{{ subject.code }}</span>
                  <span class="separator">•</span>
                  <span class="subject-section">{{ subject.section }}</span>
                </p>
                <p class="subject-instructor">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                  </svg>
                  {{ subject.instructor }}
                </p>
              </div>
            </div>
            
            <div class="card-actions">
              <button 
                @click.stop="toggleFavorite(subject.id)"
                :class="['action-icon-btn', 'favorite-btn', { 'active': favoriteSubjects.has(subject.id) }]"
                :title="favoriteSubjects.has(subject.id) ? 'Remove from favorites' : 'Add to favorites'"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" :fill="favoriteSubjects.has(subject.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                </svg>
              </button>
              
              <div class="dropdown">
                <button 
                  @click.stop="toggleOptionsMenu(subject.id)"
                  class="action-icon-btn options-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                  </svg>
                </button>
                
                <div v-if="subject.showOptions" class="options-dropdown" @click.stop>
                  <button @click.stop="viewSubjectDetails(subject)" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7S17 9.24 17 12S14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z"/>
                    </svg>
                    View Details
                  </button>
                  <button @click.stop="toggleArchive(subject.id)" class="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,21H4V10H6V19H18V10H20V21ZM3,3H21V9H3V3ZM9.5,11A0.5,0.5 0 0,1 10,11.5V13.5A0.5,0.5 0 0,1 9.5,14H14.5A0.5,0.5 0 0,1 14,13.5V11.5A0.5,0.5 0 0,1 14.5,11H9.5Z"/>
                    </svg>
                    {{ archivedSubjects.has(subject.id) ? 'Unarchive' : 'Archive' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Section -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Overall Progress</span>
              <span class="progress-percentage">{{ subject.progress || 0 }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (subject.progress || 0) + '%' }"></div>
            </div>
          </div>

          <!-- Stats Section -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ subject.totalAssessments || 0 }}</div>
              <div class="stat-label">Assignments</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ subject.availableQuizzes || 0 }}</div>
              <div class="stat-label">Quizzes</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ subject.currentGrade || '--' }}</div>
              <div class="stat-label">Grade</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <button class="primary-btn" @click.stop="navigateToSubject(subject)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18L15 12L9 6"/>
              </svg>
              View Grades
            </button>
            
            <div class="secondary-actions">
              <button 
                v-if="(subject.availableQuizzes || 0) > 0"
                class="secondary-btn quiz-btn"
                @click.stop="viewAssessments(subject, 'quiz')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                </svg>
                {{ subject.availableQuizzes }} Quiz{{ subject.availableQuizzes !== 1 ? 'es' : '' }}
              </button>
              
              <button 
                v-if="(subject.availableAssignments || 0) > 0"
                class="secondary-btn assignment-btn"
                @click.stop="viewAssessments(subject, 'assignment')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                {{ subject.availableAssignments }} Assignment{{ subject.availableAssignments !== 1 ? 's' : '' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Empty State -->
      <div v-else class="empty-state-wrapper">
        <div class="empty-state-card">
          <div class="empty-illustration">
            <!-- Animated Books Stack -->
            <div class="books-container">
              <div class="book book-1"></div>
              <div class="book book-2"></div>
              <div class="book book-3"></div>
            </div>
            <!-- Floating Elements -->
            <div class="floating-elements">
              <div class="element element-1">📚</div>
              <div class="element element-2">✨</div>
              <div class="element element-3">📝</div>
            </div>
          </div>
          
          <div class="empty-content">
            <h3 class="empty-title">
              {{ searchQuery || activeFilter !== 'all' ? 'No subjects found' : 'No subjects yet' }}
            </h3>
            
            <div v-if="searchQuery || activeFilter !== 'all'" class="search-empty">
              <p class="empty-description">
                Try adjusting your search terms or filter settings to find what you're looking for.
              </p>
              <div class="search-suggestions">
                <button @click="clearFilters" class="suggestion-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6H21M9 6V4C9 3.45 9.45 3 10 3H14C14.55 3 15 3.45 15 4V6M19 6V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V6"/>
                  </svg>
                  Clear all filters
                </button>
              </div>
            </div>
            
            <div v-else class="enrollment-info">
              <p class="empty-description">
                You haven't been enrolled in any subjects yet. Your teacher will add you to their classes where you can access assignments, quizzes, and track your progress.
              </p>
              
              <div class="info-cards">
                <div class="info-card">
                  <div class="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L6.67 7L1 12.67L2.33 14L6.67 9.67L10.5 13.5L18.33 5.67L21 8.33V6.33L21 9Z"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <h4>Getting Started</h4>
                    <p>Your teacher will enroll you in subjects automatically</p>
                  </div>
                </div>
                
                <div class="info-card">
                  <div class="info-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L13.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <h4>What's Next?</h4>
                    <p>Once enrolled, you'll see all your subjects here</p>
                  </div>
                </div>
              </div>
              
              <div class="help-tip">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M11,17H13V11H11V17Z"/>
                </svg>
                <span>Need help? Contact your teacher if you believe you should be enrolled in a class</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner-container">
          <div class="loading-spinner"></div>
        </div>
        <p class="loading-text">{{ loadingMessage }}</p>
        <p class="loading-subtext">Please wait a moment...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { supabase } from '../../supabase.js'

export default {
  name: 'StudentSubjects',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
      isLoading: true,
      loadingMessage: 'Loading your subjects...',
      filters: [
        { key: 'all', label: 'All Subjects' },
        { key: 'favorites', label: 'Favorites' },
        { key: 'active', label: 'Active' },
        { key: 'archived', label: 'Archived' }
      ],
      subjects: [],
      pollingInterval: null,
      currentUser: null,
      studentInfo: null,
      profile: null,
      favoriteSubjects: new Set(),
      archivedSubjects: new Set(),
      enrollmentSubscription: null,
      schoolYearSubscription: null,
      gradingPeriodSubscription: null,
      currentSchoolYear: '',
      currentQuarter: '',
    };
  },
  watch: {
    $route() {
      this.fetchSubjects();
    }
  },
  computed: {
    totalSubjects() {
      return this.subjects.length;
    },
    filteredSubjects() {
      let filtered = this.subjects;
      
      if (this.activeFilter === 'favorites') {
        filtered = filtered.filter(subject => this.favoriteSubjects.has(subject.id));
      } else if (this.activeFilter === 'archived') {
        filtered = filtered.filter(subject => this.archivedSubjects.has(subject.id));
      } else {
        filtered = filtered.filter(subject => !this.archivedSubjects.has(subject.id));
      }
      
      if (this.activeFilter !== 'all' && this.activeFilter !== 'favorites' && this.activeFilter !== 'archived') {
        filtered = filtered.filter(subject => subject.status === this.activeFilter);
      }
      
      if (this.searchQuery) {
        filtered = filtered.filter(subject => 
          subject.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          subject.code.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          subject.instructor.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      if (this.activeFilter !== 'archived') {
        filtered.sort((a, b) => {
          const aIsFavorite = this.favoriteSubjects.has(a.id);
          const bIsFavorite = this.favoriteSubjects.has(b.id);
          if (aIsFavorite && !bIsFavorite) return -1;
          if (!aIsFavorite && bIsFavorite) return 1;
          return 0;
        });
      }
      
      return filtered;
    },
  },
  methods: {
    async initializeAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError)
          throw sessionError
        }
        
        if (!session?.user) {
          await this.$router.push('/login')
          return false
        }
        
        this.currentUser = session.user
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, full_name, email')
          .eq('auth_user_id', session.user.id)
          .maybeSingle()
        
        if (profileError) {
          console.error('❌ Error getting profile:', profileError)
          throw profileError
        }

        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              auth_user_id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student',
              email: session.user.email,
              role: 'student'
            })
            .select()
            .single()

          if (createError) {
            console.error('❌ Failed to create profile:', createError)
            throw createError
          }

          this.profile = newProfile
        } else {
          this.profile = profile
        }

        if (this.profile.role !== 'student') {
          alert('Access denied. Student account required.')
          await this.$router.push('/login')
          return false
        }

        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', this.profile.id)
          .maybeSingle()

        if (studentError && studentError.code !== 'PGRST116') {
          console.error('❌ Error getting student info:', studentError)
          throw studentError
        }

        if (!student) {
          const gradeLevel = session.user.user_metadata?.grade_level || 7
          
          const { data: newStudent, error: createStudentError } = await supabase
            .from('students')
            .insert({
              profile_id: this.profile.id,
              full_name: this.profile.full_name,
              email: this.profile.email,
              grade_level: gradeLevel,
              is_active: true
            })
            .select()
            .single()

          if (createStudentError) {
            console.error('❌ Failed to create student record:', createStudentError)
            throw createStudentError
          }

          this.studentInfo = newStudent
        } else {
          if (!student.is_active) {
            alert('Your account is currently inactive. Please contact support.')
            await this.$router.push('/login')
            return false
          }

          this.studentInfo = student
        }

        return true

      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        alert(`Authentication error: ${error.message || 'Unknown error'}`)
        await this.$router.push('/login')
        return false
      }
    },

    calculateSchoolYear() {
      // DEPRECATED: This method is now replaced by fetchSchoolYearAndQuarter()
      // which fetches real-time data from the database
      console.log('⚠️ calculateSchoolYear() is deprecated - use fetchSchoolYearAndQuarter()');
    },

    async fetchSchoolYearAndQuarter() {
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
          this.currentSchoolYear = 'N/A';
        } else if (activeSchoolYear) {
          this.currentSchoolYear = activeSchoolYear.year_name;
          console.log('✅ Active School Year:', this.currentSchoolYear);

          // Fetch active grading period for this school year
          const { data: activeGradingPeriod, error: gradingPeriodError } = await supabase
            .from('grading_periods')
            .select('*')
            .eq('school_year_id', activeSchoolYear.id)
            .eq('is_active', true)
            .maybeSingle();

          if (gradingPeriodError) {
            console.error('❌ Error fetching grading period:', gradingPeriodError);
            this.currentQuarter = 'N/A';
          } else if (activeGradingPeriod) {
            this.currentQuarter = activeGradingPeriod.period_name;
            console.log('✅ Active Quarter:', this.currentQuarter);
          } else {
            console.warn('⚠️ No active grading period found');
            this.currentQuarter = 'No Active Quarter';
          }
        } else {
          console.warn('⚠️ No active school year found');
          this.currentSchoolYear = 'No Active Year';
          this.currentQuarter = 'N/A';
        }

        console.log(`📅 School Year: ${this.currentSchoolYear}, Quarter: ${this.currentQuarter}`);
      } catch (error) {
        console.error('❌ Error in fetchSchoolYearAndQuarter:', error);
        this.currentSchoolYear = 'Error';
        this.currentQuarter = 'Error';
      }
    },

    setupSchoolYearSubscription() {
      try {
        console.log('🔔 Setting up real-time subscription for school year updates...');

        // Subscribe to school_years table changes
        this.schoolYearSubscription = supabase
          .channel('school_years_changes')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'school_years'
            },
            (payload) => {
              console.log('🔔 School year changed:', payload);
              // Refetch school year and quarter when changes occur
              this.fetchSchoolYearAndQuarter();
            }
          )
          .subscribe((status) => {
            console.log('🔔 School year subscription status:', status);
          });

        // Subscribe to grading_periods table changes
        this.gradingPeriodSubscription = supabase
          .channel('grading_periods_changes')
          .on(
            'postgres_changes',
            {
              event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
              schema: 'public',
              table: 'grading_periods'
            },
            (payload) => {
              console.log('🔔 Grading period changed:', payload);
              // Refetch school year and quarter when changes occur
              this.fetchSchoolYearAndQuarter();
            }
          )
          .subscribe((status) => {
            console.log('🔔 Grading period subscription status:', status);
          });

        console.log('✅ Real-time subscriptions established');
      } catch (error) {
        console.error('❌ Error setting up school year subscription:', error);
      }
    },

    cleanupSchoolYearSubscription() {
      console.log('🔄 Cleaning up school year subscriptions...');
      
      if (this.schoolYearSubscription) {
        supabase.removeChannel(this.schoolYearSubscription);
        this.schoolYearSubscription = null;
        console.log('✅ School year subscription cleaned up');
      }
      
      if (this.gradingPeriodSubscription) {
        supabase.removeChannel(this.gradingPeriodSubscription);
        this.gradingPeriodSubscription = null;
        console.log('✅ Grading period subscription cleaned up');
      }
    },

    generateSubjectColor(subjectName) {
      const colors = ['#3D8D7A', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];
      const hash = subjectName.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return colors[Math.abs(hash) % colors.length];
    },

    // New helper methods for enhanced UI
    getSubjectColor(subjectCode) {
      const colors = [
        '#3D8D7A', '#6366f1', '#f59e0b', '#ef4444', 
        '#8b5cf6', '#10b981', '#06b6d4', '#84cc16',
        '#f97316', '#ec4899'
      ];
      let hash = 0;
      for (let i = 0; i < subjectCode.length; i++) {
        hash = subjectCode.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    },

    getSubjectInitials(subject) {
      if (subject.code) {
        return subject.code.substring(0, 2).toUpperCase();
      }
      if (subject.name) {
        const words = subject.name.split(' ');
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return subject.name.substring(0, 2).toUpperCase();
      }
      return 'SU';
    },

    getFilterCount(filterKey) {
      switch (filterKey) {
        case 'all':
          return this.subjects.length;
        case 'active':
          return this.subjects.filter(s => s.status === 'active').length;
        case 'completed':
          return this.subjects.filter(s => s.status === 'completed').length;
        case 'favorites':
          return this.subjects.filter(s => this.favoriteSubjects.has(s.id)).length;
        case 'archived':
          return this.subjects.filter(s => this.archivedSubjects.has(s.id)).length;
        default:
          return 0;
      }
    },

    clearFilters() {
      this.searchQuery = '';
      this.activeFilter = 'all';
    },

    navigateToSubject(subject) {
      console.log('📌 navigateToSubject called:', subject)
      
      if (!subject || !subject.id || !subject.sectionId) {
        console.error('❌ Invalid subject data:', subject)
        alert('Unable to navigate. Please refresh the page and try again.')
        return
      }
      
      // Navigate to grades page for this subject
      this.$router.push(`/student/grades/${subject.id}/${subject.sectionId}`).catch(err => {
        console.error('❌ Navigation error:', err)
      })
    },

    viewSubjectDetails(subject) {
      // Show subject details modal or navigate to detail page
      this.navigateToSubject(subject);
    },

    toggleArchive(subjectId) {
      if (this.archivedSubjects.has(subjectId)) {
        this.archivedSubjects.delete(subjectId);
      } else {
        this.archivedSubjects.add(subjectId);
      }
      this.saveUserPreferences();
      this.closeAllOptionsMenus();
    },

    async fetchSubjects() {
      try {
        if (!this.studentInfo?.id) {
          this.subjects = []
          this.isLoading = false
          return
        }

        this.isLoading = true

        let { data: enrollments, error: viewError } = await supabase
          .from('student_dashboard')
          .select('*')
          .eq('student_id', this.studentInfo.id)
          .eq('enrollment_status', 'active')

        if (viewError || !enrollments || enrollments.length === 0) {
          // Fallback to direct query
          const [enrollmentsData, sectionsData, subjectsData, teachersData] = await Promise.all([
            supabase
              .from('enrollments')
              .select('id, student_id, section_id, subject_id, status, enrolled_at')
              .eq('student_id', this.studentInfo.id)
              .eq('status', 'active')
              .then(res => res.data || []),
            
            supabase
              .from('sections')
              .select('id, name, section_code, subject_id')
              .then(res => res.data || []),
            
            supabase
              .from('subjects')
              .select('id, name, grade_level, description, teacher_id')
              .then(res => res.data || []),
            
            supabase
              .from('teachers')
              .select('id, full_name, email, department')
              .then(res => res.data || [])
          ])

          if (enrollmentsData.length === 0) {
            this.subjects = []
            this.isLoading = false
            return
          }

          const sectionsMap = new Map(sectionsData.map(s => [s.id, s]))
          const subjectsMap = new Map(subjectsData.map(s => [s.id, s]))
          const teachersMap = new Map(teachersData.map(t => [t.id, t]))

          enrollments = enrollmentsData.map(e => {
            const section = sectionsMap.get(e.section_id)
            const subject = subjectsMap.get(section?.subject_id)
            const teacher = subject ? teachersMap.get(subject.teacher_id) : null

            return {
              enrollment_id: e.id,
              student_id: e.student_id,
              section_id: e.section_id,
              subject_id: subject?.id,
              enrollment_status: e.status,
              enrolled_at: e.enrolled_at,
              section_name: section?.name,
              section_code: section?.section_code,
              subject_name: subject?.name,
              subject_grade_level: subject?.grade_level,
              subject_description: subject?.description,
              teacher_id: teacher?.id,
              teacher_name: teacher?.full_name,
              teacher_email: teacher?.email,
              teacher_department: teacher?.department
            }
          })
        }

        if (!enrollments || enrollments.length === 0) {
          this.subjects = []
          this.isLoading = false
          return
        }

        const sectionIds = enrollments.map(e => e.section_id)

        // Fetch quizzes, assignments, results, and submissions in parallel
        const [quizzesResponse, assignmentsResponse, quizResultsResponse, submissionsResponse] = await Promise.all([
          supabase
            .from('quizzes')
            .select('id, section_id, title, status, start_date, end_date')
            .in('section_id', sectionIds)
            .eq('status', 'published'),
          
          supabase
            .from('assignments')
            .select('id, section_id, subject_id, status, due_date')
            .in('section_id', sectionIds)
            .eq('status', 'published'),
          
          supabase
            .from('quiz_results')
            .select('quiz_id, best_score, best_percentage, total_attempts')
            .eq('student_id', this.studentInfo.id),
          
          supabase
            .from('assignment_submissions')
            .select('assignment_id, assignment:assignments!inner(section_id)')
            .eq('student_id', this.studentInfo.id)
        ])

        const allQuizzes = quizzesResponse.data || []
        const allAssignments = assignmentsResponse.data || []
        const allResults = quizResultsResponse.data || []
        const submissions = submissionsResponse.data || []
        
        // Build lookup maps
        const quizzesBySection = {}
        allQuizzes.forEach(quiz => {
          if (!quizzesBySection[quiz.section_id]) {
            quizzesBySection[quiz.section_id] = []
          }
          quizzesBySection[quiz.section_id].push(quiz)
        })

        const resultsByQuizId = {}
        allResults.forEach(result => {
          resultsByQuizId[result.quiz_id] = result
        })

        // Count assignments by section
        const assignmentsBySection = {}
        const assignmentsCompletedBySection = {}
        
        allAssignments.forEach(assignment => {
          const sectionId = assignment.section_id
          assignmentsBySection[sectionId] = (assignmentsBySection[sectionId] || 0) + 1
        })

        submissions.forEach(submission => {
          const sectionId = submission.assignment?.section_id || submission.assignments?.section_id
          if (sectionId) {
            assignmentsCompletedBySection[sectionId] = (assignmentsCompletedBySection[sectionId] || 0) + 1
          }
        })

        sectionIds.forEach(sId => {
          if (!(sId in assignmentsBySection)) assignmentsBySection[sId] = 0
          if (!(sId in assignmentsCompletedBySection)) assignmentsCompletedBySection[sId] = 0
        })

        // Build subjects array
        const now = new Date()
        
        const newSubjects = enrollments.map(enrollment => {
          const sectionId = enrollment.section_id
          const subjectId = enrollment.subject_id

          const sectionQuizzes = quizzesBySection[sectionId] || []
          
          // Calculate available quizzes
          const availableQuizzesList = sectionQuizzes.filter(quiz => {
            const hasStarted = !quiz.start_date || new Date(quiz.start_date) <= now
            const hasNotExpired = !quiz.end_date || new Date(quiz.end_date) > now
            const result = resultsByQuizId[quiz.id]
            const isNotCompleted = !result || result.total_attempts === 0
            return hasStarted && hasNotExpired && isNotCompleted
          })
          
          const completedQuizIds = sectionQuizzes
            .map(q => q.id)
            .filter(quizId => {
              const result = resultsByQuizId[quizId]
              return result && result.total_attempts > 0
            })

          const totalQuizzes = sectionQuizzes.length
          const completedQuizzes = completedQuizIds.length
          const availableQuizzes = availableQuizzesList.length

          // Get assignment counts
          const totalAssignments = assignmentsBySection[sectionId] || 0
          const completedAssignments = assignmentsCompletedBySection[sectionId] || 0
          const availableAssignments = Math.max(0, totalAssignments - completedAssignments)

          // Calculate total assessments
          const totalAssessments = totalQuizzes + totalAssignments
          const completedAssessments = completedQuizzes + completedAssignments

          // Calculate grade
          let currentGrade = '--'
          let overallScore = null
          
          if (completedQuizIds.length > 0) {
            const scores = completedQuizIds.map(qId => resultsByQuizId[qId].best_percentage || 0)
            overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
            
            if (overallScore >= 95) currentGrade = 'A+'
            else if (overallScore >= 90) currentGrade = 'A'
            else if (overallScore >= 85) currentGrade = 'B+'
            else if (overallScore >= 80) currentGrade = 'B'
            else if (overallScore >= 75) currentGrade = 'C+'
            else if (overallScore >= 70) currentGrade = 'C'
            else if (overallScore >= 65) currentGrade = 'D+'
            else if (overallScore >= 60) currentGrade = 'D'
            else currentGrade = 'F'
          }

          return {
            id: subjectId,
            name: enrollment.subject_name || 'Unknown Subject',
            code: enrollment.section_code || 'NO-CODE',
            section: enrollment.section_name || 'Unknown Section',
            instructor: enrollment.teacher_name || 'Teacher Not Available',
            gradeLevel: enrollment.subject_grade_level || 'N/A',
            color: this.generateSubjectColor(enrollment.subject_name || 'default'),
            status: 'active',
            completedQuizzes,
            availableQuizzes,
            totalQuizzes,
            completedAssignments,
            availableAssignments,
            totalAssignments,
            totalAssessments,
            completedAssessments,
            currentGrade,
            overallScore,
            enrollmentId: enrollment.enrollment_id,
            sectionId: sectionId,
            showOptions: false
          }
        })
        
        this.subjects = newSubjects
        console.log('✅ Loaded', this.subjects.length, 'subjects')

      } catch (error) {
        console.error('❌ Error fetching subjects:', error)
        alert(`Unable to load subjects: ${error.message}`)
        this.subjects = []
      } finally {
        this.isLoading = false
      }
    },

    setupEnrollmentSubscription() {
      if (!this.studentInfo?.id) {
        console.log('⚠️ No student info for subscription')
        return
      }

      console.log('🔔 Setting up real-time subscriptions for student:', this.studentInfo.id)
      
      // Get all section IDs for this student
      const sectionIds = this.subjects.map(s => s.sectionId).filter(Boolean)
      console.log('📡 Monitoring sections:', sectionIds)
      
      // Create a single channel for all real-time updates
      this.enrollmentSubscription = supabase
        .channel('student_realtime_updates')
        
        // 1. Listen for ENROLLMENT changes
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'enrollments',
            filter: `student_id=eq.${this.studentInfo.id}`
          }, 
          async (payload) => {
            console.log('📢 Enrollment change detected:', payload)
            const { eventType, new: newRecord, old: oldRecord } = payload
            
            if (eventType === 'DELETE' || 
               (eventType === 'UPDATE' && newRecord?.status !== 'active')) {
              console.log('👋 Unenrolled - refreshing...')
              setTimeout(async () => await this.fetchSubjects(), 500)
            } else if (eventType === 'INSERT' && newRecord?.status === 'active') {
              console.log('🎉 New enrollment - refreshing...')
              setTimeout(async () => await this.fetchSubjects(), 500)
            }
          }
        )
        
        // 2. Listen for NEW QUIZZES
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'quizzes'
          },
          async (payload) => {
            const quiz = payload.new
            console.log('� New quiz detected:', quiz.title)
            
            if (sectionIds.includes(quiz.section_id)) {
              console.log('✨ New quiz in your section! Updating...')
              this.fetchSubjects()
            }
          }
        )
        
        // 3. Listen for QUIZ STATUS UPDATES (draft -> published)
        .on('postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'quizzes'
          },
          async (payload) => {
            const quiz = payload.new
            const oldQuiz = payload.old
            
            if (sectionIds.includes(quiz.section_id) && 
                quiz.status === 'published' && 
                oldQuiz.status !== 'published') {
              console.log('📢 Quiz published:', quiz.title)
              this.fetchSubjects()
            }
          }
        )
        
        // 4. Listen for NEW ASSIGNMENTS
        .on('postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'assignments'
          },
          async (payload) => {
            const assignment = payload.new
            
            if (sectionIds.includes(assignment.section_id)) {
              console.log('✨ New assignment published!')
              this.fetchSubjects()
            }
          }
        )
        
        // 5. Listen for ASSIGNMENT STATUS UPDATES (draft -> published)
        .on('postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'assignments'
          },
          async (payload) => {
            const assignment = payload.new
            const oldAssignment = payload.old
            
            if (sectionIds.includes(assignment.section_id) && 
                assignment.status === 'published' && 
                oldAssignment.status !== 'published') {
              console.log('📢 Assignment published:', assignment.title)
              this.fetchSubjects()
            }
          }
        )
        
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Live updates active!')
          }
        })
    },

    cleanupEnrollmentSubscription() {
      if (this.enrollmentSubscription) {
        console.log('🧹 Cleaning up enrollment subscription')
        supabase.removeChannel(this.enrollmentSubscription)
        this.enrollmentSubscription = null
      }
    },

    viewAssessments(subject, type) {
      console.log('📌 viewAssessments called:', { subject, type })
      
      // Validate subject data before navigating
      if (!subject || !subject.id || !subject.sectionId) {
        console.error('❌ Invalid subject data:', subject)
        alert('Unable to navigate. Please refresh the page and try again.')
        return
      }
      
      if (type === 'assignment') {
        this.$router.push({
          name: 'TakeAssignments',
          params: {
            subjectId: subject.id,
            sectionId: subject.sectionId
          },
          query: {
            subjectName: subject.name,
            sectionName: subject.section,
            instructor: subject.instructor
          }
        }).catch(err => {
          console.error('❌ Navigation error:', err)
        })
      } else if (type === 'quiz') {
        this.$router.push({
          name: 'TakeQuiz',
          params: {
            subjectId: subject.id,
            sectionId: subject.sectionId
          },
          query: {
            subjectName: subject.name,
            sectionName: subject.section,
            instructor: subject.instructor
          }
        }).catch(err => {
          console.error('❌ Navigation error:', err)
        })
      } else {
        this.$router.push({
          name: 'StudentAssessments',
          params: {
            subjectId: subject.id,
            sectionId: subject.sectionId
          },
          query: {
            subjectName: subject.name,
            sectionName: subject.section,
            type: type,
            instructor: subject.instructor
          }
        }).catch(err => {
          console.error('❌ Navigation error:', err)
        })
      }
    },

    takeQuiz(subject) {
      console.log('📌 takeQuiz called:', subject)
      
      if (!subject || !subject.id || !subject.sectionId) {
        console.error('❌ Invalid subject data:', subject)
        alert('Unable to navigate. Please refresh the page and try again.')
        return
      }
      
      this.$router.push({
        name: 'TakeQuiz',
        params: {
          subjectId: subject.id,
          sectionId: subject.sectionId
        },
        query: {
          subjectName: subject.name,
          sectionName: subject.section,
          gradeLevel: subject.gradeLevel,
          sectionCode: subject.code
        }
      }).catch(err => {
        console.error('❌ Navigation error:', err)
      })
    },

    viewGrades(subject) {
      console.log('📌 viewGrades called:', subject)
      
      if (!subject || !subject.id || !subject.sectionId) {
        console.error('❌ Invalid subject data:', subject)
        alert('Unable to navigate. Please refresh the page and try again.')
        return
      }
      
      this.$router.push({
        name: 'StudentGrades',
        params: {
          subjectId: subject.id,
          sectionId: subject.sectionId
        },
        query: {
          subjectName: subject.name,
          sectionName: subject.section,
          instructor: subject.instructor,
          currentGrade: subject.currentGrade,
          overallScore: subject.overallScore
        }
      }).catch(err => {
        console.error('❌ Navigation error:', err)
      })
    },

    toggleFavorite(subjectId) {
      if (this.favoriteSubjects.has(subjectId)) {
        this.favoriteSubjects.delete(subjectId)
      } else {
        this.favoriteSubjects.add(subjectId)
      }
      this.saveUserPreferences()
    },

    toggleArchive(subjectId) {
      if (this.archivedSubjects.has(subjectId)) {
        this.archivedSubjects.delete(subjectId)
      } else {
        this.archivedSubjects.add(subjectId)
        this.favoriteSubjects.delete(subjectId)
      }
      this.saveUserPreferences()
      this.closeAllOptionsMenus()
    },

    toggleOptionsMenu(subjectId) {
      this.subjects.forEach(subject => {
        if (subject.id !== subjectId) {
          subject.showOptions = false
        }
      })
      
      const subject = this.subjects.find(s => s.id === subjectId)
      if (subject) {
        subject.showOptions = !subject.showOptions
      }
    },

    closeAllOptionsMenus(event) {
      // Don't interfere with navigation clicks
      if (event) {
        const target = event.target;
        // Check if click is on a navigation link or inside sidebar
        if (target.closest('.nav-item') || 
            target.closest('.mobile-nav-item') || 
            target.closest('.sidebar') ||
            target.closest('.mobile-bottom-nav') ||
            target.closest('a[href]')) {
          return;
        }
        // Check if click is within an options menu or its trigger
        if (target.closest('.options-menu') || target.closest('.options-btn')) {
          return;
        }
      }
      
      this.subjects.forEach(subject => {
        subject.showOptions = false
      })
    },

    getUserStorageKey(key) {
      const userId = this.currentUser?.id || 'anonymous'
      return `intelligrade_${key}_${userId}`
    },

    saveUserPreferences() {
      try {
        localStorage.setItem(
          this.getUserStorageKey('favorites'),
          JSON.stringify(Array.from(this.favoriteSubjects))
        )
        localStorage.setItem(
          this.getUserStorageKey('archived'),
          JSON.stringify(Array.from(this.archivedSubjects))
        )
      } catch (error) {
        console.warn('Failed to save preferences:', error)
      }
    },

    loadUserPreferences() {
      try {
        const favoritesData = localStorage.getItem(this.getUserStorageKey('favorites'))
        const archivedData = localStorage.getItem(this.getUserStorageKey('archived'))
        
        if (favoritesData) {
          this.favoriteSubjects = new Set(JSON.parse(favoritesData))
        }
        if (archivedData) {
          this.archivedSubjects = new Set(JSON.parse(archivedData))
        }
      } catch (error) {
        console.warn('Failed to load preferences:', error)
        this.favoriteSubjects = new Set()
        this.archivedSubjects = new Set()
      }
    },
  },

  async mounted() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🚀 COMPONENT MOUNTED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    try {
      // Fetch real-time school year and quarter from database
      await this.fetchSchoolYearAndQuarter();
      
      // Setup click handler immediately
      this.$nextTick(() => {
        document.addEventListener('click', this.closeAllOptionsMenus, false)
      })

      // Load preferences immediately (no await needed)
      this.loadUserPreferences()

      // Initialize auth and fetch subjects in parallel with UI render
      const authSuccess = await this.initializeAuth()
      
      if (!authSuccess) {
        console.log('❌ Auth failed')
        return
      }

      // Start fetching subjects immediately (don't block UI)
      this.fetchSubjects()
      
      // Setup real-time subscription for enrollments
      this.setupEnrollmentSubscription()
      
      // Setup real-time subscription for school year and quarter changes
      this.setupSchoolYearSubscription()
      
      console.log('✅ INITIALIZATION COMPLETE')
      
    } catch (error) {
      console.error('❌ MOUNT ERROR:', error)
      await this.$router.push('/login')
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event)
      if (event === 'SIGNED_IN' && session?.user) {
        const success = await this.initializeAuth()
        if (success) this.fetchSubjects()
      } else if (event === 'SIGNED_OUT') {
        this.subjects = []
        this.currentUser = null
        this.studentInfo = null
        await this.$router.push('/login')
      }
    })
  },
  
  beforeUnmount() {
    console.log('🔄 COMPONENT UNMOUNTING - Cleaning up')
    if (this.pollingInterval) clearInterval(this.pollingInterval)
    this.cleanupEnrollmentSubscription()
    this.cleanupSchoolYearSubscription()
    document.removeEventListener('click', this.closeAllOptionsMenus, false)
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ==================== MODERN ENHANCED STYLES ==================== */

/* Page Header Styles */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.header-content:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.3);
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.academic-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.academic-year {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.academic-year svg {
  width: 16px;
  height: 16px;
  color: #3d8d7a;
}

.quarter-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3d8d7a 0%, #2d6d5f 100%);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(61, 141, 122, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  min-width: 120px;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #3d8d7a;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.enrollment-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  border: 2px solid #7dd3fc;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
}

/* Controls Card Styles */
.controls-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-section {
  flex: 1;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  border-color: #3d8d7a;
  background: white;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1);
}

.search-icon {
  color: #6b7280;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #374151;
  outline: none;
  font-family: 'Inter', sans-serif;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-pills {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
}

.filter-pill:hover {
  border-color: #d1d5db;
  background: #e5e7eb;
}

.filter-pill.active {
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  border-color: #3d8d7a;
  color: white;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.3);
}

.filter-label {
  font-weight: 500;
}

.filter-count {
  background: rgba(0, 0, 0, 0.15);
  color: currentColor;
  border-radius: 12px;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.25rem;
  text-align: center;
  line-height: 1.2;
}

.filter-pill.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Content Area Styles */
.content-area {
  min-height: 500px;
  width: 100%;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

/* Enhanced Subject Cards */
.subject-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  min-height: 420px;
  height: auto;
}

.subject-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.subject-card:hover {
  border-color: #3d8d7a;
  box-shadow: 0 8px 32px rgba(61, 141, 122, 0.15);
  transform: translateY(-2px);
}

.subject-card:hover::before {
  opacity: 1;
}

.subject-card.favorite-card {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fff 100%);
}

.subject-card.favorite-card::before {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.subject-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.subject-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.125rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
}

.subject-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.subject-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.subject-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.2;
}

.subject-code {
  font-weight: 700;
  color: #3d8d7a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(61, 141, 122, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.separator {
  color: #9ca3af;
  font-weight: 400;
}

.subject-section {
  color: #6b7280;
  font-weight: 500;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.subject-instructor {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #6b7280;
  font-size: 0.8125rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
}

.card-actions {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  position: relative;
}

.action-icon-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.action-icon-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  color: #374151;
}

.favorite-btn.active {
  border-color: #f59e0b;
  background: #fef3c7;
  color: #d97706;
}

.favorite-btn.active:hover {
  background: #fed7aa;
  border-color: #d97706;
}

/* Progress Section */
.progress-section {
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
}

.progress-percentage {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #3d8d7a;
  background: rgba(61, 141, 122, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
}

.progress-bar {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  border-radius: 3px;
  transition: width 0.8s ease;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.stats-grid .stat-card {
  background: #f9fafb;
  padding: 0.75rem 0.5rem;
  border-radius: 10px;
  text-align: center;
  min-width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 65px;
  border: 1px solid #f1f5f9;
}

.stats-grid .stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3d8d7a;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stats-grid .stat-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.2);
  width: 100%;
  min-height: 44px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.3);
}

.secondary-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.secondary-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  color: #374151;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  min-width: 0;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.secondary-btn:hover {
  border-color: #d1d5db;
  background: #f3f4f6;
}

.secondary-btn.quiz-btn {
  border-color: #dbeafe;
  background: #eff6ff;
  color: #1e40af;
}

.secondary-btn.quiz-btn:hover {
  border-color: #3b82f6;
  background: #dbeafe;
}

.secondary-btn.assignment-btn {
  border-color: #fce7f3;
  background: #fdf2f8;
  color: #be185d;
}

.secondary-btn.assignment-btn:hover {
  border-color: #ec4899;
  background: #fce7f3;
}

/* Enhanced Empty State */
.empty-state-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  padding: 2rem;
}

.empty-state-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #e5e7eb;
}

.empty-illustration {
  position: relative;
  margin-bottom: 2rem;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.books-container {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.book {
  width: 20px;
  border-radius: 3px 3px 0 0;
  position: relative;
}

.book-1 {
  height: 60px;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  animation: float 3s ease-in-out infinite;
}

.book-2 {
  height: 70px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  animation: float 3s ease-in-out infinite 0.5s;
}

.book-3 {
  height: 55px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  animation: float 3s ease-in-out infinite 1s;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.element {
  position: absolute;
  font-size: 1.5rem;
  animation: float-element 4s ease-in-out infinite;
}

.element-1 {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.element-2 {
  top: 20%;
  right: 15%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 30%;
  left: 15%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes float-element {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-12px) rotate(5deg);
    opacity: 1;
  }
}

.empty-content {
  margin-bottom: 2rem;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.empty-description {
  font-size: 1.1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.search-suggestions {
  margin-top: 1.5rem;
}

.suggestion-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #374151;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-btn:hover {
  border-color: #3d8d7a;
  background: #f0fdf4;
  color: #3d8d7a;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: left;
}

.info-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3d8d7a 0%, #20c997 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.info-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.info-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.help-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #e0f2fe;
  border: 1px solid #7dd3fc;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1.5rem;
}

.help-tip svg {
  color: #0369a1;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.help-tip span {
  color: #0c4a6e;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
  z-index: 10;
}

.options-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  z-index: 1000;
  min-width: 180px;
  animation: dropdownFadeIn 0.2s ease-out;
  /* Ensure dropdown stays within viewport */
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive dropdown positioning */
@media (max-width: 768px) {
  .options-dropdown {
    right: 0;
    left: auto;
    transform: none;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  background: none;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  border-radius: 8px;
  margin-bottom: 0.25rem;
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item:hover {
  background: #f0f9ff;
  color: #0369a1;
  transform: translateX(2px);
}

.dropdown-item svg {
  color: #6b7280;
  transition: color 0.2s ease;
}

.dropdown-item:hover svg {
  color: #0369a1;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3d8d7a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ==================== RESPONSIVE DESIGN ==================== */

@media (max-width: 1024px) {
  .subjects-grid {
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 1.25rem;
  }

  .subject-card {
    min-height: 400px;
  }

  .header-stats {
    gap: 1.5rem;
  }

  .stat-card {
    min-width: 100px;
    padding: 0.75rem 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .subjects-container {
    padding: 1rem;
  }

  .page-header {
    margin-bottom: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .header-main {
    gap: 1rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .header-stats {
    justify-content: space-between;
    gap: 1rem;
  }

  .stat-card {
    flex: 1;
    min-width: 80px;
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .enrollment-badge {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .controls-card {
    padding: 1rem;
    gap: 1rem;
  }

  .search-wrapper {
    padding: 0.625rem 0.75rem;
  }

  .search-input {
    font-size: 0.9375rem;
  }

  .filter-pills {
    gap: 0.5rem;
  }

  .filter-pill {
    padding: 0.4375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .subject-card {
    padding: 1.25rem;
    min-height: 380px;
  }

  .card-header {
    margin-bottom: 1.25rem;
  }

  .subject-avatar {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }

  .subject-title {
    font-size: 1rem;
  }

  .subject-details {
    gap: 0.375rem;
  }

  .subject-meta {
    font-size: 0.75rem;
  }

  .subject-instructor {
    font-size: 0.75rem;
  }

  .progress-label,
  .progress-percentage {
    font-size: 0.75rem;
  }

  .stats-grid {
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .stats-grid .stat-card {
    padding: 0.75rem;
  }

  .stats-grid .stat-number {
    font-size: 1.25rem;
  }

  .quick-actions {
    gap: 0.5rem;
  }

  .primary-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }

  .secondary-btn {
    padding: 0.4375rem 0.625rem;
    font-size: 0.75rem;
  }

  .empty-state-card {
    padding: 2rem 1.5rem;
  }

  .empty-illustration {
    height: 100px;
    margin-bottom: 1.5rem;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-description {
    font-size: 1rem;
  }

  .info-cards {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .info-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .subjects-container {
    padding: 0.75rem;
  }

  .header-content {
    padding: 1.25rem;
  }

  .header-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .header-text {
    text-align: center;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
  }

  .academic-info {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .academic-year {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }

  .academic-year svg {
    width: 14px;
    height: 14px;
  }

  .quarter-badge {
    font-size: 0.75rem;
    padding: 0.4rem 0.75rem;
  }

  .header-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .enrollment-badge {
    justify-content: center;
    padding: 0.625rem 0.75rem;
  }

  .controls-card {
    padding: 0.75rem;
  }

  .search-wrapper {
    padding: 0.5625rem;
  }

  .filter-pills {
    justify-content: center;
    flex-wrap: wrap;
  }

  .filter-pill {
    padding: 0.375rem 0.625rem;
  }

  .subject-card {
    padding: 1rem;
    min-height: 360px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .subject-info {
    width: 100%;
  }

  .card-actions {
    align-self: flex-end;
  }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .stats-grid .stat-card {
    padding: 0.625rem 0.5rem;
  }

  .stats-grid .stat-number {
    font-size: 1.125rem;
  }

  .stats-grid .stat-label {
    font-size: 0.6875rem;
  }

  .secondary-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .secondary-btn {
    justify-content: center;
  }

  .empty-state-card {
    padding: 1.5rem 1rem;
  }

  .books-container {
    transform: scale(0.8);
  }

  .empty-title {
    font-size: 1.25rem;
  }

  .empty-description {
    font-size: 0.9375rem;
  }

  .info-card {
    padding: 1rem;
  }

  .info-icon {
    width: 36px;
    height: 36px;
  }
}

/* Extra small screens */
@media (max-width: 320px) {
  .subjects-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .subject-card {
    padding: 0.875rem;
    min-height: 340px;
  }

  .stats-grid {
    gap: 0.5rem;
  }

  .stats-grid .stat-card {
    padding: 0.5rem 0.375rem;
    min-height: 60px;
  }

  .stats-grid .stat-number {
    font-size: 1rem;
  }

  .stats-grid .stat-label {
    font-size: 0.625rem;
  }

  .secondary-btn {
    font-size: 0.6875rem;
    padding: 0.4rem 0.5rem;
  }
}

/* Dark Mode Support */
.dark .page-header .header-content {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

.dark .page-title {
  color: #f9fafb;
}

.dark .page-subtitle {
  color: #9ca3af;
}

.dark .academic-year {
  color: #f9fafb;
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border-color: #4b5563;
}

.dark .academic-year svg {
  color: #20c997;
}

.dark .quarter-badge {
  background: linear-gradient(135deg, #20c997 0%, #17a085 100%);
  color: #fff;
  box-shadow: 0 2px 4px rgba(32, 201, 151, 0.3);
}

.dark .stat-card {
  background: #374151;
  color: #f9fafb;
}

.dark .enrollment-badge {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: #93c5fd;
  border-color: #3b82f6;
}

.dark .controls-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .search-wrapper {
  background: #374151;
  border-color: #4b5563;
}

.dark .search-wrapper:focus-within {
  border-color: #20c997;
  background: #374151;
}

.dark .search-input {
  color: #f9fafb;
}

.dark .filter-pill {
  background: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark .filter-pill:hover {
  background: #4b5563;
}

.dark .subject-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .subject-title {
  color: #f9fafb;
}

.dark .subject-instructor,
.dark .subject-section,
.dark .subject-meta {
  color: #d1d5db;
}

.dark .action-icon-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.dark .stats-grid .stat-card {
  background: #374151;
}

.dark .stats-grid .stat-label {
  color: #9ca3af;
}

.dark .secondary-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.dark .empty-state-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .empty-title {
  color: #f9fafb;
}

.dark .empty-description {
  color: #d1d5db;
}

.dark .info-card {
  background: #374151;
}

.dark .help-tip {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.dark .help-tip span {
  color: #93c5fd;
}

.dark .options-dropdown {
  background: #1f2937;
  border-color: #374151;
}

.dark .dropdown-item {
  color: #d1d5db;
}

.dark .dropdown-item:hover {
  background: #374151;
  color: #f9fafb;
}
/* Dark mode for empty state */
.dark .empty-state {
  background: #23272b;
  border-color: #20c997;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.08);
}
.dark .empty-icon {
  background: rgba(32, 201, 151, 0.08);
  color: #20c997;
}
.dark .empty-state h3 {
  color: #fbffe4;
}
.dark .empty-state p {
  color: #a3d1c6;
}
/* More dark mode for stats and buttons */
.dark .subject-stats {
  background: #23272b;
  border-color: #20c997;
}
.dark .stat-value {
  color: #20c997;
}
.dark .stat-text {
  color: #a3d1c6;
}
.dark .action-btn.primary {
  background: #20c997;
  color: #181c20;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.15);
}
.dark .action-btn.primary:hover {
  background: #3d8d7a;
}
.dark .action-btn.secondary,
.dark .action-btn.clickable {
  background: #23272b;
  color: #20c997;
  border: 1px solid #20c997;
}
.dark .action-btn.clickable:hover {
  background: #181c20;
  border-color: #3d8d7a;
}
.dark .action-btn.completed {
  background: rgba(32, 201, 151, 0.08);
  color: #20c997;
  border: 1px solid #20c997;
}

/* Dark Mode - Assessment Action Buttons */
.dark .assessment-actions {
  border-top-color: rgba(32, 201, 151, 0.2);
}

.dark .actions-title {
  color: #20c997;
}

.dark .assessment-action-btn {
  background: #23272b;
  border-color: #3d4852;
}

.dark .assessment-action-btn:hover {
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.12);
}

.dark .assessment-action-btn.quiz-btn {
  border-color: #1e3a5f;
  background: linear-gradient(135deg, #23272b 0%, #1a2332 100%);
}

.dark .assessment-action-btn.quiz-btn:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.dark .assessment-action-btn.quiz-btn.has-available {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #1e293b 0%, #1e3a5f 100%);
}

.dark .assessment-action-btn.assignment-btn {
  border-color: #4a1942;
  background: linear-gradient(135deg, #23272b 0%, #2d1b28 100%);
}

.dark .assessment-action-btn.assignment-btn:hover {
  border-color: #ec4899;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.dark .assessment-action-btn.assignment-btn.has-available {
  border-color: #ec4899;
  background: linear-gradient(135deg, #27212e 0%, #4a1942 100%);
}

.dark .quiz-icon {
  background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%);
  color: #60a5fa;
}

.dark .assignment-icon {
  background: linear-gradient(135deg, #4a1942 0%, #831843 100%);
  color: #f472b6;
}

.dark .btn-title {
  color: #e5e7eb;
}

.dark .btn-count {
  color: #9ca3af;
}

/* DARK MODE OVERRIDES */
.dark .subjects-container {
  background: #181c20;
}

.dark .section-header-card,
.dark .minimal-header-card {
  background: #23272b;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.08);
  border: 2px solid #20c997;
}

.dark .minimal-header-icon {
  background: #20c997;
  color: #181c20;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.15);
}

.dark .minimal-header-title {
  color: #fbffe4;
}

.dark .minimal-header-sub {
  color: #a3d1c6;
}

.dark .section-header-stats .stat-number {
  color: #20c997;
}

.dark .section-header-stats .stat-label {
  color: #a3d1c6;
}

.dark .controls-section {
  background: #23272b;
  border-color: #20c997;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.08);
}

.dark .search-box {
  background: #181c20;
  border-color: #20c997;
}
.dark .search-box svg {
  color: #20c997;
}
.dark .search-input {
  color: #fbffe4;
}
.dark .search-input::placeholder {
  color: #a3d1c6;
}

.dark .filter-tab {
  background: #23272b;
  border-color: #20c997;
  color: #a3d1c6;
}
.dark .filter-tab.active {
  background: #20c997;
  color: #181c20;
  border-color: #20c997;
}
.dark .filter-tab:hover {
  background: #23272b;
  border-color: #3d8d7a;
}

.dark .subjects-grid .subject-card {
  background: #23272b;
  border-color: #20c997;
  color: #fbffe4;
}
.dark .subject-card:hover {
  border-color: #20c997;
}
.dark .subject-card.favorite-card {
  background: rgba(32, 201, 151, 0.08);
  border-color: #ffd600;
}
.dark .subject-card.archived-card {
  background: rgba(163, 209, 198, 0.08);
}
.dark .subject-title,
.dark .subject-instructor,
.dark .subject-section {
  color: #fbffe4;
}
.dark .star-btn {
  color: #a3d1c6;
}
.dark .star-btn:hover {
  background: rgba(255, 193, 7, 0.1);
  color: #ffd600;
}
.dark .options-menu {
  background: #23272b;
  color: #fbffe4;
  border-color: #20c997;
}
.dark .dropdown-item:hover {
  background: #20c997;
  color: #181c20;
}
.dark .subject-preview {
  background: #23272b;
  border-color: #20c997;
}
.dark .preview-card {
  background: #181c20;
  border-color: #20c997;
}
.dark .preview-icon {
  background: #20c997;
  color: #181c20;
}
.dark .loading-overlay {
  background: rgba(24, 28, 32, 0.95);
}
.dark .loading-content {
  background: #23272b;
  border-color: #20c997;
  color: #fbffe4;
}

/* Add border for both light and dark mode */
.section-header-card,
.minimal-header-card {
  border: 2px solid #a3d1c6;
}
.dark .section-header-card,
.dark .minimal-header-card {
  border: 2px solid #20c997;
}


:root {
  --bg-card-muted: rgba(var(--bg-card-rgb, 255, 255, 255), 0.6);
}

.subjects-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: #fbffe4;
  min-height: 100vh;
}

.section-header-card {
  display: flex;
  align-items: center;
  background: #fbffe4;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  min-height: auto;
  gap: 1.25rem;
  justify-content: space-between;
}

.minimal-header-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  background: #fbffe4;
  padding: 1.25rem;
  min-height: auto;
  gap: 1.25rem;
}

.minimal-header-icon {
  width: 48px;
  height: 48px;
  background: #3d8d7a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.15);
}

.minimal-header-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #181c20;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.minimal-header-sub {
  font-size: 0.95rem;
  color: #3d8d7a;
  font-weight: 400;
  margin-bottom: 0;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-header-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3d8d7a;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #23272b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.enrollment-info-badge {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
  border: 2px solid #7dd3fc;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.1);
  white-space: nowrap;
}

.enrollment-info-badge.desktop {
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
}

.dark .enrollment-info-badge {
  background: linear-gradient(135deg, #075985 0%, #0c4a6e 100%);
  color: #7dd3fc;
  border-color: #0ea5e9;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.2);
}

.controls-section {
  background: #fbffe4;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  border: 2px solid #a3d1c6;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #a3d1c6;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  min-width: 280px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  border-color: #3d8d7a;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.08);
}

.search-box svg {
  color: #3d8d7a;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: #181c20;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.search-input::placeholder {
  color: #6b7280;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  background: white;
  border: 1px solid #a3d1c6;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #181c20;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.filter-count {
  background: rgba(61, 141, 122, 0.1);
  color: #3d8d7a;
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.2rem;
  text-align: center;
  line-height: 1;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.filter-tab:hover {
  background: #f8fffe;
  border-color: #3d8d7a;
}

.filter-tab.active {
  background: #3d8d7a;
  color: white;
  border-color: #3d8d7a;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

  .subjects-grid {
    gap: 1rem;
    margin-bottom: 0.25rem;
  }
  .subject-card {
    padding: 1.2rem 1.2rem 1.5rem 1.2rem;
    gap: 0.15rem;
    border-radius: 6px;
    border: 2px solid #3D8D7A;
    box-shadow: 0 2px 8px rgba(61, 141, 122, 0.10);
    background: #fff;
  }
  .subject-header {
    gap: 0.15rem;
    margin-bottom: 0.08rem;
  }

.subject-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.12);
  border-color: #3d8d7a;
}

/* Favorite Card Styling */
.subject-card.favorite-card {
  border: 1.5px solid rgba(255, 193, 7, 0.3);
  background: var(--bg-card-translucent);
  position: relative;
}

.subject-card.favorite-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.02) 0%, rgba(255, 193, 7, 0.05) 100%);
  border-radius: 18px;
  pointer-events: none;
}

.subject-card.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px var(--shadow-medium), 0 0 0 1px rgba(255, 193, 7, 0.1);
}

/* Archived Card Styling */
.subject-card.archived-card {
  opacity: 0.7;
  background: var(--bg-card-muted);
}

.subject-card.archived-card .subject-title,
.subject-card.archived-card .subject-instructor,
.subject-card.archived-card .subject-section {
  color: var(--text-muted);
}

/* Star/Favorite Button Styles */
.star-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-btn:hover {
  background: rgba(255, 193, 7, 0.1);
  color: #f59e0b;
  transform: scale(1.1);
}

.star-btn.favorited {
  color: #f59e0b;
}

.star-btn.favorited:hover {
  background: rgba(255, 193, 7, 0.2);
  transform: scale(1.1);
}

/* Options Menu Styles */
.options-menu {
  position: relative;
}

.options-btn {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.options-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .options-btn {
  background: #374151;
  border-color: #4b5563;
  color: #9ca3af;
}

.dark .options-btn:hover {
  background: #4b5563;
  color: #f3f4f6;
  border-color: #6b7280;
}

.options-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color-light);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--shadow-medium);
  padding: 0.5rem 0;
  z-index: 10;
  min-width: 140px;
  backdrop-filter: blur(20px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--bg-hover);
  color: #3D8D7A;
}





.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.subject-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.subject-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.subject-actions-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subject-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 8px 32px rgba(61, 141, 122, 0.2);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
}

.status-badge.completed {
  background: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.status-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #e6b000;
}

.subject-content {
  flex: 1;
}

.subject-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #181c20;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.subject-code {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3d8d7a;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subject-instructor {
  font-size: 0.95rem;
  color: #23272b;
  margin: 0 0 0.3rem 0;
  font-weight: 500;
}

.subject-section {
  font-size: 0.875rem;
  color: #3d8d7a;
  margin: 0;
  font-weight: 600;
}

.subject-grade {
  font-size: 0.875rem;
  color: #3d8d7a;
  margin: 0.3rem 0 0 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subject-stats {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  gap: 0.75rem;
  border: 1px solid #e6f2ed;
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #3d8d7a;
  line-height: 1;
}

.stat-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #23272b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.subject-actions {
  display: flex;
  gap: 0.75rem;
  position: relative;
  z-index: 2; /* Higher than the card */
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  font-family: 'Inter', sans-serif;
  pointer-events: auto !important; /* Ensure button is clickable */
  z-index: 1; /* Make sure it's above other elements */
}

.action-btn.primary {
  background: #20c997;
  color: white;
  box-shadow: 0 2px 8px rgba(32, 201, 151, 0.15);
  position: relative;
}

.action-btn.primary:hover {
  background: #1ba085;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.25);
}

.action-btn.secondary {
  background: white;
  color: #3d8d7a;
  border: 1px solid #a3d1c6;
}

.action-btn.primary.pulse {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 4px 16px rgba(61, 141, 122, 0.2); }
  50% { box-shadow: 0 4px 20px rgba(61, 141, 122, 0.4), 0 0 20px rgba(61, 141, 122, 0.3); }
  100% { box-shadow: 0 4px 16px rgba(61, 141, 122, 0.2); }
}

.action-btn.completed {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
  cursor: default;
}

.action-btn.clickable {
  background: white;
  color: #3d8d7a;
  border: 1px solid #a3d1c6;
  cursor: pointer;
}

.action-btn.clickable:hover {
  transform: translateY(-1px);
  background: #f8fffe;
  border-color: #3d8d7a;
}

/* Assessment Management Section */
.assessment-actions {
  margin: 1.25rem 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(163, 209, 198, 0.3);
}

.actions-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3d8d7a;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons-grid {
  display: grid;
  gap: 0.625rem;
}

.assessment-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-align: left;
  position: relative;
}

.assessment-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.assessment-action-btn.quiz-btn {
  border-color: #dbeafe;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
}

.assessment-action-btn.quiz-btn:hover {
  border-color: #60a5fa;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.15);
}

.assessment-action-btn.quiz-btn.has-available {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.assessment-action-btn.assignment-btn {
  border-color: #fce7f3;
  background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
}

.assessment-action-btn.assignment-btn:hover {
  border-color: #f472b6;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.15);
}

.assessment-action-btn.assignment-btn.has-available {
  border-color: #f472b6;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
}

.btn-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quiz-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #2563eb;
}

.assignment-icon {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #db2777;
}

.btn-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.btn-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.btn-count {
  font-size: 0.8125rem;
  color: #6b7280;
}

.notification-badge {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 24px;
  text-align: center;
}

.action-btn.full-width {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #fbffe4;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.08);
  border: 2px solid #a3d1c6;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: rgba(61, 141, 122, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3d8d7a;
  margin: 0 auto 1.5rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #181c20;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #23272b;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
}

/* Enrollment Notice Styles */
.enrollment-notice {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border: 2px solid #7dd3fc;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.notice-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.notice-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0c4a6e;
  margin-bottom: 0.75rem;
}

.notice-description {
  color: #075985;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.notice-tip {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(14, 165, 233, 0.1);
  border-left: 3px solid #0ea5e9;
  border-radius: 8px;
}

.notice-tip svg {
  flex-shrink: 0;
  color: #0284c7;
  margin-top: 0.125rem;
}

.notice-tip span {
  color: #0c4a6e;
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 500;
}

.dark .enrollment-notice {
  background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

.dark .notice-icon {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
}

.dark .notice-title {
  color: #7dd3fc;
}

.dark .notice-description {
  color: #bae6fd;
}

.dark .notice-tip {
  background: rgba(14, 165, 233, 0.15);
  border-left-color: #0ea5e9;
}

.dark .notice-tip svg {
  color: #7dd3fc;
}

.dark .notice-tip span {
  color: #e0f2fe;
}

/* Modal Styles */
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
  padding: 2rem;
}

.modal-content {
  background: #fbffe4;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid #a3d1c6;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #a3d1c6;
}

.modal-header h2 {
  color: #181c20;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 8px;
}

.close-btn:hover {
  color: #3d8d7a;
  background: rgba(61, 141, 122, 0.1);
}

.join-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #181c20;
  font-weight: 600;
  font-size: 0.95rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  left: 1rem;
  color: #3D8D7A;
  z-index: 1;
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #a3d1c6;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  background: white;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #3d8d7a;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.input-with-icon input.error {
  border-color: #ef4444;
}

.form-help {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.subject-preview {
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  border: 1px solid #a3d1c6;
}

.subject-preview h3 {
  color: #181c20;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.preview-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fffe;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e6f2ed;
}

.preview-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.preview-info h4 {
  color: #181c20;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.preview-info p {
  color: #23272b;
  font-size: 0.875rem;
  margin: 0.1rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: white;
  color: #23272b;
  border: 1px solid #a3d1c6;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.cancel-btn:hover {
  border-color: #3d8d7a;
  background: #f8fffe;
}

.join-btn {
  background: #20c997;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.join-btn:hover {
  background: #1ba085;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.25);
}

.join-btn:disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading Styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(251, 255, 228, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-content {
  background: white;
  padding: 3rem 4rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(61, 141, 122, 0.15);
  border: 2px solid #a3d1c6;
  animation: slideUp 0.4s ease;
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

.loading-spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(61, 141, 122, 0.1);
  border-left: 5px solid #3d8d7a;
  border-top: 5px solid #20c997;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(61, 141, 122, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #181c20;
  margin: 0 0 0.5rem 0;
  font-family: 'Inter', sans-serif;
}

.loading-subtext {
  font-size: 0.95rem;
  font-weight: 500;
  color: #3d8d7a;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

/* ==================== END NEW LOADING STYLES ==================== */

/* ==================== MOBILE RESPONSIVE STYLES ==================== */

@media (max-width: 1024px) {
  .subjects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  /* Remove icon for mobile: adjust left padding if needed */
  .section-header-left > .section-header-icon {
    display: none !important;
  }
  .section-header-left > div[style] {
    width: 100%;
  }
  .subjects-container {
    padding: 0.25rem;
    min-height: calc(100vh - 120px);
  }

  /* Header optimizations for mobile */
  .section-header-card,
  .minimal-header-card {
    margin: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-radius: 10px;
  }

  .minimal-header-icon {
    width: 50px;
    height: 50px;
  }

  .minimal-header-title {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .minimal-header-sub {
    font-size: 0.9rem;
  }

  .section-header-stats {
    flex-direction: row;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .join-class-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
    width: 100%;
    margin-top: 1rem;
  }

  /* Controls section mobile optimization */
  .controls-section {
    margin: 0 1rem 1.5rem 1rem;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
  }

  .search-box {
    width: 100%;
    max-width: none;
  }

  .search-input {
    padding: 0.875rem 1rem 0.875rem 2.5rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .filter-tab {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    white-space: nowrap;
    border-radius: 10px;
    min-width: auto;
  }

  .filter-count {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  /* Subjects grid mobile layout */
  .subjects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0 1rem;
  }

  .subject-card {
    padding: 1.25rem;
    border-radius: 16px;
  }

  .subject-header {
    margin-bottom: 1rem;
  }

  .subject-header-right {
    gap: 0.75rem;
  }

  .star-btn,
  .options-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .subject-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    margin-bottom: 0.75rem;
  }

  .subject-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .subject-code {
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
  }

  .subject-instructor {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }

  .subject-section {
    font-size: 0.8rem;
  }

  .subject-grade {
    font-size: 0.85rem;
    margin: 0.75rem 0;
  }

  .subject-stats {
    margin: 1rem 0;
    gap: 1rem;
  }

  .stat {
    padding: 0.75rem;
    border-radius: 10px;
    min-width: 80px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-text {
    font-size: 0.75rem;
  }

  .subject-actions {
    gap: 0.75rem;
    flex-direction: column;
  }

  .action-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 12px;
    width: 100%;
    min-height: 48px;
  }

  /* Options dropdown mobile optimization */
  .options-dropdown {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    top: auto;
    transform: none;
    border-radius: 16px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .dropdown-item {
    padding: 1rem;
    font-size: 0.95rem;
    min-height: 56px;
    border-radius: 12px;
  }

  /* Empty state mobile optimization */
  .empty-state {
    padding: 2rem 1rem;
    margin: 1rem;
    border-radius: 16px;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .empty-state p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .join-first-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }

  /* Modal mobile optimization */
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    margin: 0;
    width: 100%;
    max-width: none;
    border-radius: 16px;
    max-height: 85vh;
    overflow-y: auto;
  }

  .modal-header {
    padding: 1.25rem;
    border-radius: 16px 16px 0 0;
  }

  .modal-header h2 {
    font-size: 1.1rem;
  }

  .close-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .join-form {
    padding: 1.25rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .input-with-icon input {
    padding: 0.875rem 1rem 0.875rem 2.75rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  .input-with-icon svg {
    left: 1rem;
  }

  .error-message {
    font-size: 0.85rem;
    padding: 0.75rem;
    border-radius: 10px;
  }

  .modal-actions {
    padding: 1.25rem;
    gap: 0.75rem;
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
    padding: 0.875rem;
    font-size: 0.95rem;
    border-radius: 12px;
  }

  /* Loading overlay mobile */
  .loading-overlay {
    border-radius: 16px;
  }

  .loading-content {
    padding: 2rem 1rem;
  }

  .loading-text {
    font-size: 1.1rem;
  }

  .loading-subtext {
    font-size: 0.85rem;
  }

  /* Subject preview mobile */
  .subject-preview {
    margin: 1rem;
    border-radius: 16px;
  }

  .preview-card {
    padding: 1.25rem;
    border-radius: 16px;
  }

  .preview-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  /* Extra small mobile optimizations */
  .section-header-card,
  .minimal-header-card {
    margin: 0.75rem;
    padding: 0.875rem;
  }

  .minimal-header-title {
    font-size: 1.125rem;
  }

  .section-header-stats {
    gap: 1rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .controls-section {
    margin: 0 0.75rem 1.25rem 0.75rem;
    padding: 0.875rem;
  }

  .subjects-grid {
    margin: 0 0.75rem;
    gap: 0.875rem;
  }

  .subject-card {
    padding: 1rem;
  }

  .subject-icon {
    width: 45px;
    height: 45px;
  }

  .subject-title {
    font-size: 1rem;
  }

  .subject-stats {
    gap: 0.75rem;
  }

  .stat {
    padding: 0.625rem;
    min-width: 70px;
  }

  .stat-value {
    font-size: 1.125rem;
  }

  .action-btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    min-height: 44px;
  }

  .empty-state {
    margin: 0.75rem;
    padding: 1.5rem 0.875rem;
  }

  .empty-icon {
    width: 70px;
    height: 70px;
  }

  .modal-header,
  .join-form,
  .modal-actions {
    padding: 1rem;
  }

  .dropdown-item {
    padding: 0.875rem;
    min-height: 52px;
  }

  /* Touch optimization for small screens */
  .star-btn,
  .options-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .filter-tab {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }
}

/* iPhone 12 Pro specific optimizations */
@media (max-width: 390px) {
  .section-header-card,
  .minimal-header-card {
    margin: 0.5rem;
  }

  .controls-section {
    margin: 0 0.5rem 1rem 0.5rem;
  }

  .subjects-grid {
    margin: 0 0.5rem;
  }

  .empty-state {
    margin: 0.5rem;
  }

  .options-dropdown {
    left: 0.5rem;
    right: 0.5rem;
  }

  .modal-overlay {
    padding: 0.5rem;
  }
}

/* ==================== END MOBILE RESPONSIVE STYLES ==================== */

/* ==================== UNENROLL MODAL STYLES ==================== */
.unenroll-modal {
  max-width: 500px;
}

.unenroll-content {
  padding: 1.5rem;
}

.warning-icon {
  width: 80px;
  height: 80px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #ef4444;
}

.warning-text {
  text-align: center;
  font-size: 1.1rem;
  color: #181c20;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.warning-text strong {
  color: #ef4444;
  font-weight: 700;
}

.unenroll-details {
  background: #f8fffe;
  border: 1px solid #e6f2ed;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.unenroll-details p {
  margin: 0.5rem 0;
  color: #23272b;
  font-size: 0.95rem;
}

.unenroll-details strong {
  color: #3d8d7a;
  font-weight: 600;
  margin-right: 0.5rem;
}

.warning-note {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.warning-note svg {
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-note span {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
}

.unenroll-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.unenroll-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

.unenroll-btn:disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-item.unenroll-item {
  color: #ef4444;
}

.dropdown-item.unenroll-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.dropdown-item.unenroll-item svg {
  color: #ef4444;
}

/* Dark mode unenroll styles */
.dark .unenroll-modal {
  background: #23272b;
  border-color: #20c997;
}

.dark .unenroll-content {
  color: #fbffe4;
}

.dark .warning-icon {
  background: rgba(239, 68, 68, 0.15);
}

.dark .warning-text {
  color: #fbffe4;
}

.dark .warning-text strong {
  color: #ff6b6b;
}

.dark .unenroll-details {
  background: #181c20;
  border-color: #20c997;
}

.dark .unenroll-details p {
  color: #a3d1c6;
}

.dark .unenroll-details strong {
  color: #20c997;
}

.dark .warning-note {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.dark .warning-note span {
  color: #ff8787;
}

.dark .unenroll-btn {
  background: #ef4444;
}

.dark .unenroll-btn:hover {
  background: #dc2626;
}

.dark .dropdown-item.unenroll-item {
  color: #ff6b6b;
}

.dark .dropdown-item.unenroll-item:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ff8787;
}

/* Mobile responsive for unenroll modal */
@media (max-width: 768px) {
  .unenroll-modal {
    max-width: none;
    width: 100%;
  }

  .unenroll-content {
    padding: 1.25rem;
  }

  .warning-icon {
    width: 70px;
    height: 70px;
    margin-bottom: 1.25rem;
  }

  .warning-text {
    font-size: 1rem;
    margin-bottom: 1.25rem;
  }

  .unenroll-details {
    padding: 1rem;
    margin-bottom: 1.25rem;
  }

  .unenroll-details p {
    font-size: 0.9rem;
    margin: 0.4rem 0;
  }

  .warning-note {
    padding: 0.875rem;
    gap: 0.625rem;
    margin-bottom: 1.25rem;
  }

  .warning-note span {
    font-size: 0.8rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-actions .cancel-btn,
  .modal-actions .unenroll-btn {
    width: 100%;
    padding: 0.875rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .warning-icon {
    width: 60px;
    height: 60px;
  }

  .warning-text {
    font-size: 0.95rem;
  }

  .unenroll-details p {
    font-size: 0.85rem;
  }

  .warning-note span {
    font-size: 0.75rem;
  }
}

/* ==================== END UNENROLL MODAL STYLES ==================== */

/* ==================== VALIDATION LOADING STYLES ==================== */
.validation-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  margin-top: 1rem;
  background: rgba(61, 141, 122, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(61, 141, 122, 0.2);
}

.validation-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(61, 141, 122, 0.2);
  border-top: 3px solid #3d8d7a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 0.75rem;
}

.validation-loading p {
  color: #3d8d7a;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.dark .validation-loading {
  background: rgba(32, 201, 151, 0.08);
  border-color: rgba(32, 201, 151, 0.3);
}

.dark .validation-spinner {
  border-color: rgba(32, 201, 151, 0.2);
  border-top-color: #20c997;
}

.dark .validation-loading p {
  color: #20c997;
}

@media (max-width: 768px) {
  .validation-loading {
    padding: 1.5rem 1rem;
  }

  .validation-spinner {
    width: 36px;
    height: 36px;
  }

  .validation-loading p {
    font-size: 0.9rem;
  }
}
/* ==================== END VALIDATION LOADING STYLES ==================== */
</style>