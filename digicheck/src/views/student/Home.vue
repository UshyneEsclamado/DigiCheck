<template>
  <div class="home-container">
    <!-- Simple Header -->
    <div class="header-card">
      <div class="header-content">
        <div class="header-left">
          <div class="user-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="header-title">
              <span v-if="!isLoadingName">Hello, {{ studentName }}!</span>
              <span v-else>Hello, Loading...</span>
            </h1>
            <p class="header-subtitle">Welcome to your dashboard</p>
          </div>
        </div>
        
        <!-- Notification Bell -->
        <div class="notif-wrapper" ref="notifWrapper">
          <button class="notif-btn" @click="toggleNotifDropdown" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="notifications.length" class="notif-badge">{{ notifications.length }}</span>
          </button>
          
          <!-- Notification Dropdown -->
          <div v-if="showNotifDropdown" class="notif-dropdown">
            <!-- Mobile backdrop overlay -->
            <div class="notif-backdrop" @click="closeNotifDropdown"></div>
            <div class="notif-content">
              <div class="notif-header">
                <span>Notifications</span>
                <button @click="closeNotifDropdown" class="close-notif-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div v-if="notifications.length === 0" class="notif-empty">No notifications</div>
              <div v-for="notif in notifications" :key="notif.id" class="notif-item">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-body">{{ notif.body }}</div>
                <div class="notif-date">{{ notif.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon stat-subjects">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M5,19V5H19V19H5Z" />
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ totalSubjects }}</div>
          <div class="stat-label">Enrolled Subjects</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-pending">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>
        <div>
          <div class="stat-number">{{ pendingAssessments }}</div>
          <div class="stat-label">Pending Tasks</div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Recent Assessments -->
      <div class="content-card">
        <div class="card-header">
          <h3>Recent Assessments</h3>
          <p class="card-desc">Keep track of your quizzes and assignments</p>
        </div>
        <div class="assessment-list">
          <div v-if="recentAssessments.length === 0" class="empty-state">
            No assessments available
          </div>
          <div v-for="assessment in recentAssessments" :key="assessment.id" class="assessment-item">
            <div class="assessment-info">
              <div class="assessment-title-row">
                <h4>{{ assessment.title }}</h4>
                <span class="assessment-type-badge" :class="assessment.type">
                  {{ assessment.type === 'quiz' ? '📝 Quiz' : '📄 Assignment' }}
                </span>
              </div>
              <p class="assessment-class">{{ assessment.subject }}</p>
            </div>
            <div class="assessment-due">
              <span class="due-date">{{ formatDate(assessment.dueDate) }}</span>
              <span v-if="assessment.status" class="status" :class="getStatusClass(assessment.status)">
                {{ formatStatus(assessment.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="content-card">
        <div class="card-header">
          <h3>Quick Links</h3>
          <p class="card-desc">Access key features</p>
        </div>
        <div class="quick-links">
          <button @click.prevent="navigateToSubjects" class="quick-link" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M5,19V5H19V19H5Z" />
            </svg>
            My Subjects
          </button>
          <button @click.prevent="navigateToCalendar" class="quick-link" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,13.5H11V18.5H16.5V13.5Z" />
            </svg>
            Calendar
          </button>
          <button @click.prevent="navigateToMessages" class="quick-link" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zM4 6h16v.5l-8 5-8-5V6zm0 13.5V8l8 5 8-5v11.5H4z" />
            </svg>
            Messages
          </button>
          <button @click.prevent="navigateToSettings" class="quick-link" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.96 21.66,8.74L19.65,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.9,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.1,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.74C2.21,8.96 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.04 2.34,15.26L4.34,18.73C4.46,18.95 4.73,19.04 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.1,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.9,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.04 19.54,18.95 19.66,18.73L21.66,15.26C21.78,15.04 21.73,14.78 21.54,14.63L19.43,12.97Z" />
            </svg>
            Settings
          </button>
        </div>
      </div>
    </div>
    
    <!-- Floating Help & Support Button -->
    <button @click="openHelpModal" class="floating-help-btn" title="Help & Support">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </button>

    <!-- Help & Support Modal -->
    <div v-if="showHelpModal" class="modal-overlay" @click="closeHelpModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>Help & Support</h3>
          <button @click="closeHelpModal" class="close-btn">×</button>
        </div>
        <div class="modal-body document-body">
          <div class="document-content">
            <h4>Welcome to IntelliGrade Help Center</h4>
            <p class="document-date">We're here to help you!</p>
            
            <section>
              <h5>📧 Contact Support</h5>
              <p>Have a question or need assistance? Reach out to our support team:</p>
              <ul>
                <li>Email: <strong>support@intelligrade.edu</strong></li>
                <li>Response Time: Within 24 hours</li>
              </ul>
            </section>

            <section>
              <h5>🔧 Common Issues</h5>
              <p><strong>Can't log in?</strong></p>
              <ul>
                <li>Check if your email and password are correct</li>
                <li>Try resetting your password</li>
                <li>Clear your browser cache and cookies</li>
              </ul>
              
              <p><strong>Quizzes not loading?</strong></p>
              <ul>
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Make sure you're enrolled in the class</li>
              </ul>
            </section>

            <section>
              <h5>💡 Getting Started</h5>
              <p><strong>For Students:</strong></p>
              <ul>
                <li>View your enrolled subjects and classes</li>
                <li>Take quizzes and assessments</li>
                <li>Check your grades and progress</li>
                <li>Communicate with your teachers</li>
                <li>Track assignment deadlines</li>
              </ul>
            </section>

            <section>
              <h5>🔒 Account Security</h5>
              <ul>
                <li>Use a strong, unique password</li>
                <li>Never share your login credentials</li>
                <li>Log out when using shared computers</li>
                <li>Update your password regularly</li>
              </ul>
            </section>

            <section>
              <h5>📱 Technical Requirements</h5>
              <p>For the best experience with IntelliGrade:</p>
              <ul>
                <li>Use a modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Ensure JavaScript is enabled</li>
                <li>Stable internet connection recommended</li>
                <li>Screen resolution: 1280x720 or higher</li>
              </ul>
            </section>

            <section>
              <h5>📚 Taking Quizzes</h5>
              <ul>
                <li>Make sure to read all instructions carefully</li>
                <li>Submit before the deadline</li>
                <li>Check your internet connection before starting</li>
                <li>Contact your teacher if you experience technical issues</li>
              </ul>
            </section>

            <section>
              <h5>🐛 Report a Bug</h5>
              <p>Found a bug? Help us improve IntelliGrade by reporting it:</p>
              <ul>
                <li>Send detailed description to: <strong>bugs@intelligrade.edu</strong></li>
                <li>Include screenshots if possible</li>
                <li>Mention your browser and device type</li>
              </ul>
            </section>

            <section>
              <h5>💬 Feedback</h5>
              <p>We value your feedback! Share your thoughts and suggestions:</p>
              <ul>
                <li>Email: <strong>feedback@intelligrade.edu</strong></li>
                <li>Your input helps us improve the platform</li>
              </ul>
            </section>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeHelpModal" class="btn-primary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../../supabase.js';

export default {
  name: 'StudentHome',
  data() {
    return {
      showHelpModal: false,
      showNotifDropdown: false,
      studentName: 'Student',
      userId: null,
      profileId: null,
      studentRecordId: null,
      isLoadingName: true,
      totalSubjects: 0,
      pendingAssessments: 0,
      recentAssessments: [],
      notifications: [],
      unreadNotifications: 0,
      subscriptions: [],
      pollInterval: null,
      enrolledSectionIds: [],
      subjectMap: new Map(),
      sectionMap: new Map(),
      enrollmentSubscription: null
    };
  },
  
  methods: {
    toggleNotifDropdown() {
      this.showNotifDropdown = !this.showNotifDropdown;
      if (this.showNotifDropdown && this.unreadNotifications > 0) {
        this.markNotificationsAsRead();
      }
    },

    closeNotifDropdown() {
      this.showNotifDropdown = false;
    },

    markNotificationsAsRead() {
      this.unreadNotifications = 0;
      if (this.studentRecordId) {
        localStorage.setItem(`notif_read_${this.studentRecordId}`, new Date().toISOString());
      }
    },

    handleClickOutside(event) {
      if (this.$refs.notifWrapper && !this.$refs.notifWrapper.contains(event.target)) {
        this.closeNotifDropdown();
      }
    },
    
    openHelpModal() {
      this.showHelpModal = true;
    },
    
    closeHelpModal() {
      this.showHelpModal = false;
    },

    navigateToSubjects() {
      this.$router.push('/student/subjects');
    },

    navigateToCalendar() {
      this.$router.push('/student/calendar');
    },

    navigateToMessages() {
      this.$router.push('/student/messages');
    },

    navigateToSettings() {
      this.$router.push('/student/settings');
    },

    async loadStudentProfile() {
      try {
        this.isLoadingName = true;
        console.log('📝 Step 1: Loading student profile...');
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('❌ Auth error:', authError);
          return false;
        }

        this.userId = user.id;
        console.log('✅ Auth user ID:', user.id);

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('auth_user_id', user.id);

        if (profileError || !profiles || profiles.length === 0) {
          console.error('❌ Profile error:', profileError);
          return false;
        }

        const profile = profiles[0];
        this.profileId = profile.id;
        console.log('✅ Profile ID:', profile.id, 'Role:', profile.role);

        if (profile.role !== 'student') {
          console.warn('⚠️ Not a student role');
          return false;
        }

        const { data: students, error: studentError } = await supabase
          .from('students')
          .select('id, student_id, grade_level, full_name, email, is_active')
          .eq('profile_id', profile.id);

        if (studentError || !students || students.length === 0) {
          console.error('❌ Student record not found:', studentError);
          return false;
        }

        const studentData = students[0];
        this.studentRecordId = studentData.id;
        this.studentName = studentData.full_name || profile.full_name || 'Student';
        
        console.log('✅ Student loaded:', {
          name: this.studentName,
          id: this.studentRecordId,
          studentId: studentData.student_id
        });

        return true;

      } catch (error) {
        console.error('❌ Error:', error);
        return false;
      } finally {
        this.isLoadingName = false;
      }
    },

    async loadEnrolledSections() {
      if (!this.studentRecordId) {
        console.warn('⚠️ No student ID');
        return;
      }
      
      try {
        console.log('📚 Loading enrollments for student:', this.studentRecordId);
        
        const { data: enrollments, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            section_id,
            subject_id,
            status,
            enrolled_at,
            sections (
              id,
              name,
              section_code,
              subject_id,
              subjects (
                id,
                name,
                grade_level,
                description
              )
            )
          `)
          .eq('student_id', this.studentRecordId)
          .eq('status', 'active');

        if (error) {
          console.error('❌ Enrollment error:', error);
          return;
        }

        console.log('📋 Raw enrollments:', enrollments);

        if (!enrollments || enrollments.length === 0) {
          console.log('ℹ️ No enrollments');
          this.enrolledSectionIds = [];
          this.totalSubjects = 0;
          return;
        }

        // Extract section IDs
        this.enrolledSectionIds = enrollments.map(e => e.section_id);
        
        // Build subject and section maps
        const uniqueSubjects = new Set();
        enrollments.forEach(e => {
          if (e.sections) {
            this.sectionMap.set(e.sections.id, e.sections.name);
            
            if (e.sections.subjects) {
              uniqueSubjects.add(e.sections.subjects.id);
              this.subjectMap.set(e.sections.subjects.id, e.sections.subjects.name);
            }
          }
        });

        this.totalSubjects = uniqueSubjects.size;
        
        console.log('✅ Loaded:', {
          sections: this.enrolledSectionIds.length,
          subjects: this.totalSubjects,
          sectionIds: this.enrolledSectionIds
        });

      } catch (error) {
        console.error('❌ Error:', error);
      }
    },

    async loadAvailableQuizzes() {
      if (!this.studentRecordId) return;

      try {
        console.log('📋 Loading quizzes and assignments...');

        if (this.enrolledSectionIds.length === 0) {
          console.log('ℹ️ No sections enrolled');
          this.recentAssessments = [];
          this.pendingAssessments = 0;
          return;
        }

        console.log('🔍 Checking assessments for sections:', this.enrolledSectionIds);

        // Load Quizzes
        const { data: quizzes, error: quizError } = await supabase
          .from('quizzes')
          .select('id, title, start_date, end_date, section_id, subject_id, attempts_allowed, status')
          .in('section_id', this.enrolledSectionIds)
          .eq('status', 'published')
          .order('end_date', { ascending: true });

        if (quizError) {
          console.error('❌ Quiz error:', quizError);
        }

        // Load Assignments
        const { data: assignments, error: assignmentError } = await supabase
          .from('assignments')
          .select('id, title, due_date, section_id, subject_id, status, total_points')
          .in('section_id', this.enrolledSectionIds)
          .eq('status', 'published')
          .order('due_date', { ascending: true });

        if (assignmentError) {
          console.error('❌ Assignment error:', assignmentError);
        }

        console.log('📝 Quizzes found:', quizzes?.length || 0);
        console.log('📄 Assignments found:', assignments?.length || 0);

        // Get quiz attempts
        const { data: quizAttempts } = await supabase
          .from('quiz_attempts')
          .select('quiz_id, status')
          .eq('student_id', this.studentRecordId);

        const attemptMap = {};
        if (quizAttempts) {
          quizAttempts.forEach(a => {
            if (!attemptMap[a.quiz_id]) attemptMap[a.quiz_id] = [];
            attemptMap[a.quiz_id].push(a);
          });
        }

        // Get assignment submissions
        const { data: assignmentSubmissions } = await supabase
          .from('assignment_submissions')
          .select('assignment_id, status, submitted_at')
          .eq('student_id', this.studentRecordId);

        const submissionMap = {};
        if (assignmentSubmissions) {
          assignmentSubmissions.forEach(s => {
            submissionMap[s.assignment_id] = s;
          });
        }

        const now = new Date();
        let pending = 0;
        const processed = [];

        // Process Quizzes
        if (quizzes && quizzes.length > 0) {
          for (const q of quizzes) {
            const start = q.start_date ? new Date(q.start_date) : null;
            const end = q.end_date ? new Date(q.end_date) : null;
            const atts = attemptMap[q.id] || [];
            
            const completed = atts.filter(a => ['submitted', 'graded', 'reviewed'].includes(a.status)).length;
            const inProgress = atts.some(a => a.status === 'in_progress');
            
            let status = 'pending';
            if (inProgress) {
              status = 'in-progress';
              pending++;
            } else if (completed >= q.attempts_allowed) {
              status = 'completed';
            } else if (end && end < now) {
              status = 'overdue';
            } else if ((!start || start <= now) && (!end || end >= now)) {
              status = 'available';
              pending++;
            } else if (start && start > now) {
              status = 'upcoming';
            }
            
            processed.push({
              id: q.id,
              type: 'quiz',
              title: q.title || 'Untitled Quiz',
              subject: this.subjectMap.get(q.subject_id) || 'Unknown',
              dueDate: end,
              status: status
            });
          }
        }

        // Process Assignments
        if (assignments && assignments.length > 0) {
          for (const a of assignments) {
            const dueDate = a.due_date ? new Date(a.due_date) : null;
            const submission = submissionMap[a.id];
            
            let status = 'pending';
            if (submission) {
              if (submission.status === 'draft') {
                status = 'in-progress';
                pending++;
              } else if (submission.status === 'submitted') {
                status = 'submitted';
              } else if (submission.status === 'graded') {
                status = 'completed';
              } else if (submission.status === 'returned') {
                status = 'returned';
              }
            } else {
              if (dueDate && dueDate < now) {
                status = 'overdue';
              } else {
                status = 'available';
                pending++;
              }
            }
            
            processed.push({
              id: a.id,
              type: 'assignment',
              title: a.title || 'Untitled Assignment',
              subject: this.subjectMap.get(a.subject_id) || 'Unknown',
              dueDate: dueDate,
              status: status
            });
          }
        }

        // Sort by priority and due date
        processed.sort((a, b) => {
          const priority = { 
            'in-progress': 1, 
            'available': 2, 
            'upcoming': 3, 
            'overdue': 4, 
            'submitted': 5,
            'returned': 6,
            'completed': 7 
          };
          const priorityDiff = priority[a.status] - priority[b.status];
          if (priorityDiff !== 0) return priorityDiff;
          
          // If same priority, sort by due date
          if (a.dueDate && b.dueDate) {
            return a.dueDate - b.dueDate;
          }
          return 0;
        });

        this.recentAssessments = processed.slice(0, 5);
        this.pendingAssessments = pending;
        
        console.log('✅ Assessments loaded:', {
          total: processed.length,
          pending: pending,
          showing: this.recentAssessments.length
        });

      } catch (error) {
        console.error('❌ Error:', error);
      }
    },

    async loadNotifications() {
      if (!this.studentRecordId) return;

      try {
        console.log('🔔 Loading notifications...');

        const readKey = `notif_read_${this.studentRecordId}`;
        const lastRead = new Date(localStorage.getItem(readKey) || 0);
        const notifs = [];
        
        const { data: messages } = await supabase
          .from('messages')
          .select('id, message_text, message_type, sent_at')
          .eq('recipient_id', this.studentRecordId)
          .order('sent_at', { ascending: false })
          .limit(10);

        if (messages?.length > 0) {
          messages.forEach(m => {
            const sent = new Date(m.sent_at);
            notifs.push({
              id: `msg-${m.id}`,
              title: m.message_type === 'announcement' ? '📢 Announcement' : '💬 Message',
              body: (m.message_text || '').substring(0, 80),
              date: sent.toLocaleString(),
              rawDate: sent,
              isUnread: sent > lastRead
            });
          });
        }

        if (this.enrolledSectionIds.length > 0) {
          const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          
          // Check for urgent quizzes
          const { data: urgentQuizzes } = await supabase
            .from('quizzes')
            .select('id, title, end_date, created_at')
            .in('section_id', this.enrolledSectionIds)
            .eq('status', 'published')
            .gte('end_date', new Date().toISOString())
            .lte('end_date', in3Days.toISOString())
            .limit(5);

          if (urgentQuizzes?.length > 0) {
            const { data: completed } = await supabase
              .from('quiz_attempts')
              .select('quiz_id')
              .eq('student_id', this.studentRecordId)
              .in('status', ['submitted', 'graded']);

            const completedIds = new Set(completed?.map(c => c.quiz_id) || []);

            urgentQuizzes.forEach(q => {
              if (!completedIds.has(q.id)) {
                const created = new Date(q.created_at);
                const due = new Date(q.end_date);
                notifs.push({
                  id: `quiz-${q.id}`,
                  title: '⏰ Quiz Due Soon',
                  body: `${q.title} - Due: ${due.toLocaleDateString()}`,
                  date: due.toLocaleString(),
                  rawDate: due,
                  isUnread: created > lastRead
                });
              }
            });
          }

          // Check for urgent assignments
          const { data: urgentAssignments } = await supabase
            .from('assignments')
            .select('id, title, due_date, created_at')
            .in('section_id', this.enrolledSectionIds)
            .eq('status', 'published')
            .gte('due_date', new Date().toISOString())
            .lte('due_date', in3Days.toISOString())
            .limit(5);

          if (urgentAssignments?.length > 0) {
            const { data: submissions } = await supabase
              .from('assignment_submissions')
              .select('assignment_id, status')
              .eq('student_id', this.studentRecordId)
              .in('status', ['submitted', 'graded']);

            const submittedIds = new Set(submissions?.map(s => s.assignment_id) || []);

            urgentAssignments.forEach(a => {
              if (!submittedIds.has(a.id)) {
                const created = new Date(a.created_at);
                const due = new Date(a.due_date);
                notifs.push({
                  id: `assignment-${a.id}`,
                  title: '⏰ Assignment Due Soon',
                  body: `${a.title} - Due: ${due.toLocaleDateString()}`,
                  date: due.toLocaleString(),
                  rawDate: due,
                  isUnread: created > lastRead
                });
              }
            });
          }
        }

        notifs.sort((a, b) => b.rawDate - a.rawDate);
        this.notifications = notifs.slice(0, 10);
        this.unreadNotifications = notifs.filter(n => n.isUnread).length;
        
        console.log('✅ Notifications:', notifs.length, 'Unread:', this.unreadNotifications);

      } catch (error) {
        console.error('❌ Notification error:', error);
      }
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      const now = new Date();
      const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff === -1) return 'Yesterday';
      if (diff > 1 && diff <= 7) return `In ${diff} days`;
      
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    formatStatus(status) {
      return status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
    },

    getStatusClass(status) {
      const s = status?.toLowerCase() || '';
      if (s.includes('progress') || s.includes('available')) return 'actionable';
      if (s.includes('completed') || s.includes('graded')) return 'completed';
      if (s.includes('submitted') || s.includes('returned')) return 'submitted';
      if (s.includes('overdue')) return 'overdue';
      return 'default';
    },

    setupRealtimeSubscriptions() {
      if (!this.studentRecordId) return;

      console.log('🔄 Setting up real-time subscriptions...');

      try {
        // Subscribe to enrollment changes with enhanced handling
        const enrollSub = supabase
          .channel(`enrollments_${this.studentRecordId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'enrollments',
            filter: `student_id=eq.${this.studentRecordId}`
          }, (payload) => {
            console.log('📚 Enrollment change detected:', payload);
            
            const { eventType, new: newRecord, old: oldRecord } = payload;
            
            // Handle unenrollment or status changes
            if (eventType === 'DELETE' || 
               (eventType === 'UPDATE' && newRecord?.status !== 'active') ||
               (eventType === 'UPDATE' && oldRecord?.status === 'active' && newRecord?.status !== 'active')) {
              
              console.log('👋 Student was unenrolled, refreshing dashboard...');
              
              // Refresh all data with a small delay to ensure database consistency
              setTimeout(async () => {
                await this.loadEnrolledSections();
                await this.loadAvailableQuizzes();
                await this.loadNotifications();
              }, 500);
              
            } else if (eventType === 'INSERT' && newRecord?.status === 'active') {
              console.log('🎉 New enrollment detected, refreshing dashboard...');
              
              setTimeout(async () => {
                await this.loadEnrolledSections();
                await this.loadAvailableQuizzes();
                await this.loadNotifications();
              }, 500);
            }
          })
          .subscribe();

        // Subscribe to quiz changes
        const quizSub = supabase
          .channel(`quizzes_${this.studentRecordId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'quizzes'
          }, (payload) => {
            const quiz = payload.new || payload.old;
            if (quiz && this.enrolledSectionIds.includes(quiz.section_id)) {
              console.log('📝 Quiz changed, reloading...');
              this.loadAvailableQuizzes();
            }
          })
          .subscribe();

        // Subscribe to assignment changes
        const assignmentSub = supabase
          .channel(`assignments_${this.studentRecordId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'assignments'
          }, (payload) => {
            const assignment = payload.new || payload.old;
            if (assignment && this.enrolledSectionIds.includes(assignment.section_id)) {
              console.log('📄 Assignment changed, reloading...');
              this.loadAvailableQuizzes();
            }
          })
          .subscribe();

        // Subscribe to messages
        const msgSub = supabase
          .channel(`messages_${this.studentRecordId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'messages'
          }, (payload) => {
            const msg = payload.new || payload.old;
            if (msg && msg.recipient_id === this.studentRecordId) {
              console.log('💬 New message, reloading...');
              this.loadNotifications();
            }
          })
          .subscribe();

        this.subscriptions = [enrollSub, quizSub, assignmentSub, msgSub];
        console.log('✅ Real-time subscriptions active');

      } catch (error) {
        console.error('❌ Subscription error:', error);
      }
    },

    cleanupSubscriptions() {
      console.log('🧹 Cleaning up subscriptions');
      this.subscriptions.forEach(sub => {
        try {
          sub?.unsubscribe?.();
        } catch (e) {
          console.error('Error unsubscribing:', e);
        }
      });
      this.subscriptions = [];
    }
  },

  async mounted() {
    console.log('🚀 StudentHome mounted');
    document.addEventListener('click', this.handleClickOutside);
    
    try {
      // Step 1: Load profile
      const loaded = await this.loadStudentProfile();
      if (!loaded) {
        console.error('❌ Cannot proceed without student profile');
        return;
      }

      // Step 2: Load enrollments (this also loads subjects count)
      await this.loadEnrolledSections();

      // Step 3: Load quizzes and notifications in parallel
      await Promise.all([
        this.loadAvailableQuizzes(),
        this.loadNotifications()
      ]);

      // Step 4: Setup real-time subscriptions
      this.setupRealtimeSubscriptions();

      // Step 5: Poll for updates every 5 minutes
      this.pollInterval = setInterval(() => {
        console.log('🔄 Polling for updates...');
        this.loadEnrolledSections().then(() => {
          this.loadAvailableQuizzes();
          this.loadNotifications();
        });
      }, 300000);

      console.log('✅ Dashboard ready');

    } catch (error) {
      console.error('❌ Mount error:', error);
    }
  },

  beforeUnmount() {
    console.log('🛑 Unmounting...');
    document.removeEventListener('click', this.handleClickOutside);
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.cleanupSubscriptions();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Floating Help & Support Button */
.floating-help-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3D8D7A 0%, #2f6b5c 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 20px rgba(61, 141, 122, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 999;
  animation: pulse-help 2s ease-in-out infinite;
}

.dark .floating-help-btn {
  background: linear-gradient(135deg, #20c997 0%, #3D8D7A 100%);
  box-shadow: 0 4px 20px rgba(32, 201, 151, 0.4);
}

@keyframes pulse-help {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(61, 141, 122, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 30px rgba(61, 141, 122, 0.5);
  }
}

.floating-help-btn:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 30px rgba(61, 141, 122, 0.5);
}

.dark .floating-help-btn:hover {
  box-shadow: 0 6px 30px rgba(32, 201, 151, 0.6);
}

.floating-help-btn:active {
  transform: scale(0.95) !important;
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  color: #1f2937;
  border: 1px solid #A3D1C6;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}
.dark .modal-content::-webkit-scrollbar-track {
  background: #374151;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #3D8D7A;
  border-radius: 3px;
}
.dark .modal-content::-webkit-scrollbar-thumb {
  background: #20c997;
}

.dark .modal-content {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  color: #A3D1C6;
}

.document-modal {
  max-width: 700px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #A3D1C6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 12px 12px 0 0;
  z-index: 10;
}

.dark .modal-header {
  background: #2a2e36;
  border-bottom: 1px solid #3D8D7A;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #3D8D7A;
  font-weight: 600;
}

.dark .modal-header h3 {
  color: #A3D1C6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1f2937;
}

.dark .close-btn:hover {
  color: #A3D1C6;
}

.modal-body {
  padding: 1.5rem;
}

.document-body {
  max-height: 60vh;
  overflow-y: auto;
}

.document-body::-webkit-scrollbar {
  width: 6px;
}

.document-body::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}
.dark .document-body::-webkit-scrollbar-track {
  background: #374151;
}

.document-body::-webkit-scrollbar-thumb {
  background: #3D8D7A;
  border-radius: 3px;
}
.dark .document-body::-webkit-scrollbar-thumb {
  background: #20c997;
}

.document-content {
  line-height: 1.6;
}

.document-content h4 {
  font-size: 1.4rem;
  color: #3D8D7A;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.dark .document-content h4 {
  color: #A3D1C6;
}

.document-date {
  color: #6b7280;
  font-style: italic;
  margin: 0 0 2rem 0;
  font-size: 0.875rem;
}

.dark .document-date {
  color: #9ca3af;
}

.document-content section {
  margin-bottom: 1.5rem;
}

.document-content h5 {
  font-size: 1.1rem;
  color: #1f2937;
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.dark .document-content h5 {
  color: #e5e7eb;
}

.document-content p {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 0.9rem;
}

.dark .document-content p {
  color: #e5e7eb;
}

.document-content ul {
  margin: 0 0 1rem 1.5rem;
}

.document-content li {
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-size: 0.9rem;
}

.dark .document-content li {
  color: #e5e7eb;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #A3D1C6;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: white;
  border-radius: 0 0 12px 12px;
}

.dark .modal-footer {
  background: #2a2e36;
  border-top: 1px solid #3D8D7A;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #3D8D7A;
  color: white;
}

.btn-primary:hover {
  background: #2f6b5c;
  transform: translateY(-1px);
}

.home-container {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1.5rem 2rem;
  position: relative;
  overflow-y: auto;
}
.dark .home-container {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* Custom Scrollbar */
.home-container::-webkit-scrollbar {
  width: 12px;
}

.home-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.home-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.home-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Header */
.header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

.header-card::before {
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

.dark .header-card {
  background: rgba(35, 39, 43, 0.95);
  border: 2px solid rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.user-icon {
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

.header-title {
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
.dark .header-title {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}
.dark .header-subtitle {
  color: #94a3b8;
}

/* Notification */
.notif-wrapper {
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
}

.notif-btn {
  width: 48px;
  height: 48px;
  background: rgba(251, 255, 228, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(163, 209, 198, 0.5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  color: #3D8D7A;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.notif-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.dark .notif-btn {
  background: rgba(35, 39, 43, 0.8);
  border-color: rgba(61, 141, 122, 0.4);
  color: #A3D1C6;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
}

.notif-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  width: 340px;
  max-height: 420px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 1000;
  border: 2px solid rgba(255, 255, 255, 0.6);
}
.dark .notif-dropdown {
  background: rgba(35, 39, 43, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.notif-dropdown::-webkit-scrollbar {
  width: 10px;
}

.notif-dropdown::-webkit-scrollbar-track {
  background: rgba(163, 209, 198, 0.2);
  border-radius: 5px;
  border: 1px solid rgba(163, 209, 198, 0.3);
}
.dark .notif-dropdown::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.5);
  border-color: rgba(61, 141, 122, 0.3);
}

.notif-dropdown::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.notif-dropdown::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.dark .notif-dropdown::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: rgba(255, 255, 255, 0.2);
}

.notif-backdrop {
  display: none;
}

.notif-content {
  position: relative;
  z-index: 1001;
}

.notif-header {
  padding: 1.25rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-bottom: 2px solid rgba(163, 209, 198, 0.3);
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dark .notif-header {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-color: rgba(35, 39, 43, 0.98);
  border-bottom: 2px solid rgba(61, 141, 122, 0.3);
}

.close-notif-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-notif-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dark .close-notif-btn {
  color: #9ca3af;
}

.dark .close-notif-btn:hover {
  background: #374151;
  color: #e5e7eb;
}

.notif-empty {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
}
.dark .notif-empty {
  color: #64748b;
}

.notif-item {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(241, 245, 249, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.notif-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.notif-item:hover::before {
  opacity: 1;
}

.dark .notif-item {
  border-bottom: 1px solid rgba(61, 141, 122, 0.2);
}

.notif-item:hover {
  background: rgba(163, 209, 198, 0.1);
  transform: translateX(4px);
}
.dark .notif-item:hover {
  background: rgba(61, 141, 122, 0.1);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-title {
  font-weight: 700;
  color: #1f2937;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  letter-spacing: -0.2px;
}
.dark .notif-title {
  color: #e2e8f0;
}

.notif-body {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-weight: 500;
}
.dark .notif-body {
  color: #94a3b8;
}

.notif-date {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
}
.dark .notif-date {
  color: #64748b;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(61, 141, 122, 0.15);
}

.dark .stat-card {
  background: rgba(35, 39, 43, 0.95);
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-subjects { 
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}
.stat-pending { 
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -0.5px;
}
.dark .stat-number {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-weight: 600;
  line-height: 1.3;
}
.dark .stat-label {
  color: #94a3b8;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  animation: fadeInUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}


.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3D8D7A, #2d6a5a);
}

.content-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.content-card:first-child {
  max-height: 550px;
}

.content-card:last-child {
  height: fit-content;
  max-height: 550px;
}
.dark .content-card {
  background: rgba(35, 39, 43, 0.95);
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.card-header {
  margin-bottom: 1.25rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.dark .card-header h3 {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-desc {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}
.dark .card-desc {
  color: #94a3b8;
}

/* Assessment List */
.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
}

.assessment-list::-webkit-scrollbar {
  width: 10px;
}

.assessment-list::-webkit-scrollbar-track {
  background: rgba(163, 209, 198, 0.2);
  border-radius: 5px;
  border: 1px solid rgba(163, 209, 198, 0.3);
}
.dark .assessment-list::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.5);
  border-color: rgba(61, 141, 122, 0.3);
}

.assessment-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 5px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.assessment-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.dark .assessment-list::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: rgba(255, 255, 255, 0.2);
}

.assessment-item {
  background: rgba(251, 255, 228, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(163, 209, 198, 0.5);
  position: relative;
  overflow: hidden;
}

.assessment-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(61, 141, 122, 0.1), transparent);
  transition: left 0.5s ease;
}

.assessment-item:hover::before {
  left: 100%;
}

.dark .assessment-item {
  background: rgba(35, 39, 43, 0.8);
  border-color: rgba(32, 201, 151, 0.3);
}

.assessment-item:hover {
  background: rgba(163, 209, 198, 0.4);
  border-color: #3D8D7A;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.2);
}
.dark .assessment-item:hover {
  background: rgba(35, 39, 43, 0.95);
  border-color: #A3D1C6;
}

.assessment-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  letter-spacing: -0.3px;
}
.dark .assessment-info h4 {
  color: #e2e8f0;
}

.assessment-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.assessment-type-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  white-space: nowrap;
}

.assessment-type-badge.quiz {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.dark .assessment-type-badge.quiz {
  background: #1e3a8a;
  color: #93c5fd;
  border-color: #3b82f6;
}

.assessment-type-badge.assignment {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.dark .assessment-type-badge.assignment {
  background: #78350f;
  color: #fde68a;
  border-color: #fbbf24;
}

.assessment-class {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-weight: 500;
  line-height: 1.4;
}
.dark .assessment-class {
  color: #94a3b8;
}

.assessment-progress {
  font-size: 0.8rem;
  color: #3D8D7A;
  font-weight: 600;
  line-height: 1.3;
}
.dark .assessment-progress {
  color: #A3D1C6;
}

/* Assessment Due and Status */
.assessment-due {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-end;
}

.due-date {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}
.dark .due-date {
  color: #e2e8f0;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.status.actionable {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fbbf24;
}
.dark .status.actionable {
  background: #451a03;
  color: #fbbf24;
  border-color: #d97706;
}

.status.completed {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #10b981;
}
.dark .status.completed {
  background: #022c22;
  color: #34d399;
  border-color: #059669;
}

.status.submitted {
  background: #e0e7ff;
  color: #4338ca;
  border: 1px solid #6366f1;
}
.dark .status.submitted {
  background: #312e81;
  color: #a5b4fc;
  border-color: #4338ca;
}

.status.overdue {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #ef4444;
}
.dark .status.overdue {
  background: #7f1d1d;
  color: #fca5a5;
  border-color: #dc2626;
}

.status.default {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
.dark .status.default {
  background: #374151;
  color: #9ca3af;
  border-color: #4b5563;
}

.grade-btn {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  padding: 0.625rem 1.5rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  position: relative;
  overflow: hidden;
}

.grade-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.grade-btn:hover::before {
  left: 100%;
}

.dark .grade-btn {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
}

.grade-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.35);
}
.dark .grade-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 3rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
}
.dark .empty-state {
  color: #64748b;
}

/* Quick Links */

.quick-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.quick-link {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(163, 209, 198, 0.4);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.85rem;
  height: fit-content;
  min-height: 90px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quick-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(61, 141, 122, 0.1), transparent);
  transition: left 0.5s ease;
}

.quick-link:hover::before {
  left: 100%;
}

.dark .quick-link {
  background: rgba(35, 39, 43, 0.8);
  border-color: rgba(61, 141, 122, 0.4);
  color: #e2e8f0;
}

.quick-link:hover {
  background: linear-gradient(135deg, rgba(163, 209, 198, 0.3), rgba(61, 141, 122, 0.2));
  color: #1f2937;
  border-color: #3D8D7A;
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.2);
}
.dark .quick-link:hover {
  background: linear-gradient(135deg, rgba(163, 209, 198, 0.2), rgba(61, 141, 122, 0.3));
  color: #e2e8f0;
  border-color: #A3D1C6;
}

.quick-link svg {
  color: #3D8D7A;
  transition: transform 0.3s ease;
}

.quick-link:hover svg {
  transform: scale(1.1);
}

.dark .quick-link svg {
  color: #A3D1C6;
}

/* Quick Actions */
.quick-actions {
  margin-top: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.action-card {
  background: #FBFFE4;
  border: 1px solid #A3D1C6;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.2s;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
}
.dark .action-card {
  background: #23272b;
  border-color: #20c997;
  color: #A3D1C6;
}

.action-card:hover {
  background: #20c997;
  color: #181c20;
  border-color: #A3D1C6;
  transform: translateY(-2px);
}
.dark .action-card:hover {
  background: #A3D1C6;
  color: #23272b;
  border-color: #20c997;
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  margin-bottom: 0.5rem;
}

.action-icon i {
  font-size: 1.5rem;
}
.dark .action-icon i {
  color: #A3D1C6;
}

.action-content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
.dark .action-content h3 {
  color: #A3D1C6;
}

.action-content p {
  font-size: 0.875rem;
  color: #6b7280;
}
.dark .action-content p {
  color: #A3D1C6;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 0;
    min-height: calc(100vh - 150px);
    margin-bottom: 0;
  }

  /* Header adjustments for mobile */
  .header-card {
    margin: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 12px;
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .header-left {
    width: auto;
    flex: 1;
    min-width: 0;
  }

  .header-text {
    flex: 1;
    min-width: 0;
  }

  .user-icon {
    width: 50px;
    height: 50px;
  }

  .header-title {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }

  .header-subtitle {
    font-size: 0.9rem;
  }

  /* Notification improvements for mobile */
  .notif-wrapper {
    position: relative;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .notif-btn {
    width: 44px;
    height: 44px;
    padding: 0;
  }

  .notif-dropdown {
    position: fixed;
    top: auto;
    right: 1rem;
    left: 1rem;
    bottom: 50%;
    transform: translateY(50%);
    width: auto;
    max-height: 70vh;
    overflow-y: auto;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
    z-index: 1001;
  }

  .notif-backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  .notif-content {
    position: relative;
    z-index: 1001;
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }

  .dark .notif-content {
    background: #23272b;
    border-color: #3D8D7A;
  }

  /* Stats grid mobile optimization */
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 0 1rem 1.5rem 1rem;
  }

  .stat-card {
    padding: 1rem;
    border-radius: 12px;
    min-height: 80px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  /* Content grid mobile layout */
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 0 1rem;
  }

  .content-card {
    border-radius: 16px;
    padding: 1.25rem;
  }

  .content-card:first-child {
    max-height: 450px;
  }

  .content-card:last-child {
    max-height: 500px;
  }

  .card-header h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .card-desc {
    font-size: 0.85rem;
  }

  /* Assessment list mobile optimization */
  .assessment-list {
    max-height: 400px;
    gap: 0.75rem;
    padding-right: 0.5rem;
  }

  .assessment-item {
    padding: 1rem;
    border-radius: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .assessment-info {
    width: 100%;
  }

  .assessment-info h4 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .assessment-class {
    font-size: 0.8rem;
  }

  .assessment-progress {
    font-size: 0.75rem;
  }

  .assessment-due {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .due-date {
    font-size: 0.8rem;
  }

  .status {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .grade-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    width: 100%;
  }

  /* Quick links mobile optimization */
  .quick-links {
    gap: 0.75rem;
    padding: 0.5rem 0;
  }

  .quick-link {
    min-width: 140px;
    padding: 1rem;
    border-radius: 12px;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .quick-link svg {
    width: 24px;
    height: 24px;
  }

  .quick-link span {
    font-size: 0.8rem;
  }

  /* Quick actions mobile layout */
  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-card {
    padding: 1.25rem;
    border-radius: 12px;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .action-icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  .action-content {
    flex: 1;
    text-align: left;
  }

  .action-content h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .action-content p {
    font-size: 0.85rem;
  }

  /* Empty state mobile adjustments */
  .empty-state {
    padding: 2rem 1rem;
  }

  .empty-state h3 {
    font-size: 1.1rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }

  /* Modal adjustments for mobile */
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    margin: 0;
    border-radius: 16px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .document-modal {
    max-width: none;
    width: 100%;
  }

  .modal-header {
    padding: 1.25rem;
    border-radius: 16px 16px 0 0;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .document-content h4 {
    font-size: 1.1rem;
  }

  .document-content h5 {
    font-size: 1rem;
  }

  .document-content p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  /* Floating help button mobile position */
  .floating-help-btn {
    bottom: 10rem;
    right: 1rem;
    width: 52px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  /* Extra small mobile optimizations */
  .header-card {
    margin: 0.75rem;
    padding: 0.875rem;
  }

  .header-title {
    font-size: 1.125rem;
  }

  .stats-grid {
    margin: 0 0.75rem 1.25rem 0.75rem;
    gap: 0.75rem;
  }

  .stat-card {
    padding: 0.875rem;
    min-height: 70px;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .content-grid {
    margin: 0 0.75rem;
    gap: 1.25rem;
  }

  .content-card {
    padding: 1rem;
  }

  .assessment-item {
    padding: 0.875rem;
  }

  .quick-link {
    min-width: 120px;
    padding: 0.875rem;
  }

  .action-card {
    padding: 1rem;
  }

  .action-icon {
    width: 45px;
    height: 45px;
  }

  .notif-dropdown {
    top: 75px;
    right: 0.75rem;
    left: 0.75rem;
  }

  /* Notification items mobile touch optimization */
  .notif-item {
    padding: 1rem;
    border-radius: 12px;
    min-height: 60px;
  }

  .notif-title {
    font-size: 0.9rem;
  }

  .notif-body {
    font-size: 0.8rem;
  }

  .floating-help-btn {
    bottom: 10rem;
    right: 0.75rem;
    width: 48px;
    height: 48px;
  }

  .floating-help-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
