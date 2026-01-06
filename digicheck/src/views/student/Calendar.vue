<template>
  <div class="calendar-container">
    <!-- Loading Overlay (uniform with Subjects.vue) -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner-container">
          <div class="loading-spinner"></div>
        </div>
        <div class="loading-text">Loading Calendar</div>
        <div class="loading-subtext">Please wait while we fetch your academic events...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Unable to load calendar</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="initializeData" class="retry-btn">Try Again</button>
    </div>

    <!-- Main Calendar Content -->
    <div v-else>
      <!-- Minimal Card Header (Subjects style) -->
      <div class="section-header-card minimal-header-card header-flex-align">
        <div class="section-header-left">
          <div class="section-header-icon minimal-header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M5,19V5H19V19H5Z" />
            </svg>
          </div>
          <div>
            <div class="section-header-title minimal-header-title">Academic Calendar</div>
            <div class="section-header-sub minimal-header-sub">View and manage your academic events</div>
            <div class="academic-info-calendar">
              <span class="academic-year-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                S.Y. {{ currentSchoolYear }}
              </span>
              <span class="quarter-badge-calendar">{{ currentQuarter }}</span>
            </div>
          </div>
        </div>
        <div class="section-header-stats align-top">
          <div class="stat-item">
            <span class="stat-number">{{ events.length }}</span>
            <span class="stat-label">Total Events</span>
          </div>
          <div class="stat-item">
            <span class="stat-number live-indicator">
              <svg class="live-dot" width="18" height="18" viewBox="0 0 24 24" fill="#ef4444">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
            <span class="stat-label">Live</span>
          </div>
        </div>
      </div>

    <!-- Status Legend -->
    <div class="status-legend">
      <div class="legend-item">
        <div class="legend-color upcoming"></div>
        <span>Upcoming Deadline</span>
      </div>
      <div class="legend-item">
        <div class="legend-color due-today"></div>
        <span>Due Today</span>
      </div>
      <div class="legend-item">
        <div class="legend-color completed"></div>
        <span>Completed</span>
      </div>
      <div class="legend-item">
        <div class="legend-color overdue"></div>
        <span>Overdue</span>
      </div>
    </div>

    <!-- Academic Schedule Timeline -->
    <div class="academic-schedule-section">
      <div class="schedule-header">
        <h3 class="schedule-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
            <path d="M7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
          </svg>
          {{ activeSchoolYear?.year_name || 'Loading...' }} Academic Schedule
        </h3>
        <p class="schedule-subtitle">
          {{ activeSchoolYear?.start_date ? formatDate(activeSchoolYear.start_date) : '' }} - 
          {{ activeSchoolYear?.end_date ? formatDate(activeSchoolYear.end_date) : '' }}
        </p>
      </div>

      <div v-if="gradingPeriods.length > 0" class="quarters-timeline">
        <div 
          v-for="(period, index) in gradingPeriods" 
          :key="period.id"
          :class="['quarter-card', 
                   { 'active-quarter': period.is_active },
                   { 'completed-quarter': period.status === 'completed' },
                   { 'upcoming-quarter': period.status === 'upcoming' }]"
        >
          <div class="quarter-header">
            <div class="quarter-badge-large" :class="period.status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path v-if="period.status === 'completed'" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                <path v-else-if="period.is_active" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span class="quarter-number">Q{{ period.period_number }}</span>
            </div>
            <div class="quarter-info">
              <h4 class="quarter-name">{{ period.period_name }}</h4>
              <div class="quarter-dates">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                </svg>
                <span>{{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }}</span>
              </div>
            </div>
          </div>
          
          <div class="quarter-status">
            <div v-if="period.is_active" class="status-indicator active">
              <span class="status-dot"></span>
              <span>Active Now</span>
            </div>
            <div v-else-if="period.status === 'completed'" class="status-indicator completed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Completed</span>
            </div>
            <div v-else class="status-indicator upcoming">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>Upcoming</span>
            </div>
          </div>

          <div class="quarter-duration">
            <span class="duration-label">Duration:</span>
            <span class="duration-value">{{ calculateDuration(period.start_date, period.end_date) }} days</span>
          </div>

          <!-- Progress bar for active quarter -->
          <div v-if="period.is_active" class="quarter-progress">
            <div class="progress-info">
              <span class="progress-label">Progress</span>
              <span class="progress-percentage">{{ calculateQuarterProgress(period) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: calculateQuarterProgress(period) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-schedule">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p>No academic schedule available</p>
      </div>
    </div>

    <!-- Calendar Navigation -->
    <div class="calendar-nav">
      <div class="nav-controls">
        <button @click="previousMonth" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </svg>
        </button>
        <h2 class="current-month">{{ currentMonthYear }}</h2>
        <button @click="nextMonth" class="nav-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </button>
      </div>
      <div class="view-toggle">
        <button 
          v-for="view in views" 
          :key="view.key"
          @click="currentView = view.key"
          :class="['view-btn', { 'active': currentView === view.key }]"
        >
          {{ view.label }}
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-content">
      <div v-if="currentView === 'month'" class="calendar-grid">
        <!-- Days of Week Header -->
        <div class="calendar-header">
          <div v-for="day in daysOfWeek" :key="day" class="day-header">
            {{ day }}
          </div>
        </div>
        
        <!-- Calendar Days -->
        <div class="calendar-body">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="['calendar-day', {
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'has-events': day.events.length > 0,
              'has-due-today': day.hasDueToday,
              'has-overdue': day.hasOverdue,
              'has-upcoming': day.hasUpcoming,
              'clickable': day.events.length > 0
            }]"
            @click="selectDay(day)"
          >
            <span class="day-number">{{ day.day }}</span>
            <div class="day-events">
              <div 
                v-for="event in day.events.slice(0, 2)" 
                :key="event.id"
                :class="['event-dot', getEventStatus(event)]"
                :title="`${event.title} - ${getEventStatusText(event)}`"
              ></div>
              <span v-if="day.events.length > 2" class="more-events">
                +{{ day.events.length - 2 }}
              </span>
            </div>
            <div v-if="day.events.length > 0" class="event-count">
              {{ day.events.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="currentView === 'list'" class="events-list">
        <div v-for="(dayEvents, date) in groupedEvents" :key="date" class="day-group">
          <h3 class="day-title">{{ formatDate(date) }}</h3>
          <div class="events-container">
              <div 
                v-for="event in dayEvents" 
                :key="(event as any).id"
                :class="['event-item', (event as any).type, getEventStatus(event as any)]"
              >
              <div class="event-time">{{ (event as any).time }}</div>
              <div class="event-content">
                <div class="event-title-row">
                  <h4 class="event-title">{{ (event as any).title }}</h4>
                  <span :class="['type-badge', (event as any).type]">
                    {{ formatEventType((event as any).type) }}
                  </span>
                </div>
                <p class="event-subject">{{ (event as any).subject }}</p>
                <p class="event-description">{{ (event as any).description }}</p>
                <div class="event-status-badge">
                  <span :class="['status-badge', getEventStatus(event as any)]">
                    {{ getEventStatusText(event as any) }}
                  </span>
                </div>
              </div>
              <div class="event-actions">
                <button v-if="getEventStatus(event) === 'upcoming' || getEventStatus(event) === 'due-today'" 
                        class="answer-btn" 
                        @click="markAsCompleted(event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  Answer
                </button>
                <button class="view-btn-small" @click="viewEvent(event)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Details Modal -->
    <div v-if="selectedDay" class="modal-overlay" @click="closeDayModal">
      <div class="day-modal-content" @click.stop>
        <div class="day-modal-header">
          <h3>{{ formatSelectedDayDate() }}</h3>
          <button @click="closeDayModal" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <div class="day-modal-body">
          <div class="day-events-summary">
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="summary-number">{{ selectedDay.events.length }}</span>
                <span class="summary-label">Total Events</span>
              </div>
              <div class="summary-stat">
                <span class="summary-number">{{ getCompletedCount(selectedDay.events) }}</span>
                <span class="summary-label">Completed</span>
              </div>
              <div class="summary-stat">
                <span class="summary-number">{{ getPendingCount(selectedDay.events) }}</span>
                <span class="summary-label">Pending</span>
              </div>
            </div>
          </div>
          
          <div class="day-events-list">
            <h4>Deadlines & Events</h4>
            <div class="day-event-items">
              <div 
                v-for="event in selectedDay.events" 
                :key="event.id"
                :class="['day-event-item', getEventStatus(event)]"
              >
                <div class="event-status-indicator">
                  <div :class="['status-dot', getEventStatus(event)]"></div>
                </div>
                <div class="event-details">
                  <h5 class="event-name">{{ event.title }}</h5>
                  <p class="event-subject-small">{{ event.subject }}</p>
                  <p class="event-time-small">{{ event.time }}</p>
                  <p class="event-desc-small">{{ event.description }}</p>
                </div>
                <div class="event-status-text">
                  <span :class="['status-badge-small', getEventStatus(event)]">
                    {{ getEventStatusText(event) }}
                  </span>
                </div>
                <div class="event-quick-actions">
                  <button v-if="getEventStatus(event) === 'upcoming' || getEventStatus(event) === 'due-today'" 
                          class="quick-answer-btn" 
                          @click="markAsCompleted(event)"
                          :title="'Mark ' + event.title + ' as completed'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                  </button>
                  <button class="quick-view-btn" 
                          @click="viewEventFromDay(event)"
                          :title="'View ' + event.title + ' details'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedEvent.title }}</h3>
          <button @click="closeModal" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="event-detail">
            <strong>Subject:</strong> {{ selectedEvent.subject }}
          </div>
          <div class="event-detail">
            <strong>Date:</strong> {{ formatEventDate(selectedEvent.date) }}
          </div>
          <div class="event-detail">
            <strong>Time:</strong> {{ selectedEvent.time }}
          </div>
          <div class="event-detail">
            <strong>Type:</strong> {{ formatEventType(selectedEvent.type) }}
          </div>
          <div class="event-detail">
            <strong>Status:</strong> 
            <span :class="['status-badge', getEventStatus(selectedEvent)]">
              {{ getEventStatusText(selectedEvent) }}
            </span>
          </div>
          <div class="event-detail">
            <strong>Description:</strong> {{ selectedEvent.description }}
          </div>
          <div v-if="getEventStatus(selectedEvent) === 'upcoming' || getEventStatus(selectedEvent) === 'due-today'" class="modal-actions">
            <button class="answer-btn-modal" @click="markAsCompleted(selectedEvent)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
              </svg>
              Mark as Completed
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Notifications Area -->
    <div v-if="notifications.length > 0" class="notifications-container">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification', notification.type]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-content">
          <span class="notification-icon">
            {{ getNotificationIcon(notification.type) }}
          </span>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button class="notification-close">&times;</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { supabase } from '@/supabase.js'

export default {
  name: 'StudentCalendar',
  data() {
    return {
      currentDate: new Date(),
      currentView: 'month',
      selectedEvent: null,
      selectedDay: null,
      currentTime: new Date(),
      statusUpdateInterval: null,
      realTimeSubscription: null,
      loading: true,
      error: null,
      notifications: [],
      views: [
        { key: 'month', label: 'Month' },
        { key: 'list', label: 'List' }
      ],
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      events: [],
      user: null,
      studentId: null,
      fastUpdateInterval: null,
      // School Year and Quarter Management
      currentSchoolYear: '',
      currentQuarter: '',
      activeSchoolYear: null,
      gradingPeriods: [],
      schoolYearSubscription: null,
      gradingPeriodSubscription: null
    };
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    },
    upcomingDeadlines() {
      return this.events.filter(event => 
        this.getEventStatus(event) === 'upcoming' || this.getEventStatus(event) === 'due-today'
      ).length;
    },
    overdueCount() {
      return this.events.filter(event => this.getEventStatus(event) === 'overdue').length;
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const today = new Date(this.currentTime);
      today.setHours(0, 0, 0, 0);
      
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        date.setHours(0, 0, 0, 0);
        
        const dayEvents = this.events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === date.getTime();
        });
        
        const hasDueToday = dayEvents.some(event => this.getEventStatus(event) === 'due-today');
        const hasOverdue = dayEvents.some(event => this.getEventStatus(event) === 'overdue');
        const hasUpcoming = dayEvents.some(event => this.getEventStatus(event) === 'upcoming');
        
        days.push({
          date: date.toDateString(),
          day: date.getDate(),
          fullDate: new Date(date),
          isCurrentMonth: date.getMonth() === month,
          isToday: date.getTime() === today.getTime(),
          events: dayEvents,
          hasDueToday,
          hasOverdue,
          hasUpcoming
        });
      }
      
      return days;
    },
    groupedEvents() {
      const grouped = {};
      const sortedEvents = [...this.events].sort((a, b) => a.date - b.date);
      
      sortedEvents.forEach(event => {
        const dateKey = event.date.toDateString();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      });
      return grouped;
    }
  },
  methods: {
    async initializeData() {
      try {
        this.loading = true;
        this.error = null;
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        this.user = user;
        console.log('Current user:', user.id);
        
        // Get student ID from profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('auth_user_id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        console.log('Profile data:', profileData);
        
        if (profileData.role !== 'student') {
          throw new Error('This calendar is only available for students');
        }
        
        // Get student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id, full_name, grade_level')
          .eq('profile_id', profileData.id)
          .single();
          
        if (studentError) throw studentError;
        
        this.studentId = studentData.id;
        console.log('Student ID:', this.studentId);
        console.log('Student grade level:', studentData.grade_level);
        
        // Fetch school year and quarter information
        await this.fetchSchoolYearAndQuarter();
        
        // Load initial events
        await this.loadEvents();
        
        // Setup real-time subscription
        this.setupRealTimeSubscription();
        
      } catch (error) {
        console.error('Error initializing calendar:', error);
        this.error = error.message || 'Failed to load calendar data';
        this.showNotification('Error loading calendar data: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    async loadEvents() {
      try {
        if (!this.studentId) {
          console.error('Student ID not found');
          return;
        }

        console.log('Loading events for student:', this.studentId);

        // Get all section IDs the student is enrolled in
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select('section_id')
          .eq('student_id', this.studentId)
          .eq('status', 'active');

        if (enrollError) {
          console.error('Enrollment error:', enrollError);
          throw enrollError;
        }

        console.log('Total enrolled subjects:', enrollments?.length || 0);

        if (!enrollments || enrollments.length === 0) {
          console.log('Student is not enrolled in any sections');
          this.events = [];
          this.showNotification('You are not enrolled in any subjects yet.', 'info');
          return;
        }

        const sectionIds = enrollments.map(e => e.section_id);
        console.log('Enrolled section IDs:', sectionIds);

        // Get all published quizzes for those sections
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select(`
            id,
            title,
            description,
            start_date,
            end_date,
            status,
            number_of_questions,
            time_limit_minutes,
            attempts_allowed,
            quiz_code,
            subject_id,
            section_id
          `)
          .in('section_id', sectionIds)
          .eq('status', 'published')
          .order('end_date', { ascending: true });

        if (quizzesError) {
          console.error('Quizzes error:', quizzesError);
          throw quizzesError;
        }

        console.log('Published quizzes found:', quizzesData?.length || 0);

        // Get all published assignments for those sections
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            assignment_type,
            submission_type,
            total_points,
            due_date,
            allow_late_submission,
            status,
            subject_id,
            section_id
          `)
          .in('section_id', sectionIds)
          .eq('status', 'published')
          .order('due_date', { ascending: true });

        if (assignmentsError) {
          console.error('Assignments error:', assignmentsError);
          throw assignmentsError;
        }

        console.log('Published assignments found:', assignmentsData?.length || 0);

        if ((!quizzesData || quizzesData.length === 0) && (!assignmentsData || assignmentsData.length === 0)) {
          this.events = [];
          this.showNotification('No quizzes or assignments available yet. Check back later!', 'info');
          return;
        }

        // Get subject details for each quiz and assignment
        const quizSubjectIds = quizzesData?.map(q => q.subject_id) || [];
        const assignmentSubjectIds = assignmentsData?.map(a => a.subject_id) || [];
        const subjectIds = [...new Set([...quizSubjectIds, ...assignmentSubjectIds])];
        
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('id, name, grade_level')
          .in('id', subjectIds);

        if (subjectsError) {
          console.error('Subjects error:', subjectsError);
          throw subjectsError;
        }

        const subjectsMap = {};
        subjectsData?.forEach(subj => {
          subjectsMap[subj.id] = subj;
        });

        // Get section details
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('id, name, section_code')
          .in('id', sectionIds);

        if (sectionsError) {
          console.error('Sections error:', sectionsError);
          throw sectionsError;
        }

        const sectionsMap = {};
        sectionsData?.forEach(sec => {
          sectionsMap[sec.id] = sec;
        });

        // Get student's quiz results
        const quizIds = quizzesData?.map(q => q.id) || [];
        const { data: resultsData, error: resultsError } = await supabase
          .from('quiz_results')
          .select('quiz_id, status, best_percentage, total_attempts')
          .eq('student_id', this.studentId)
          .in('quiz_id', quizIds);

        if (resultsError) {
          console.error('Results error:', resultsError);
        }

        const resultsMap = {};
        resultsData?.forEach(result => {
          resultsMap[result.quiz_id] = result;
        });

        console.log('Quiz results found:', resultsData?.length || 0);

        // Get student's assignment submissions
        const assignmentIds = assignmentsData?.map(a => a.id) || [];
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('assignment_submissions')
          .select('assignment_id, status, score, submitted_at, is_late')
          .eq('student_id', this.studentId)
          .in('assignment_id', assignmentIds);

        if (submissionsError) {
          console.error('Submissions error:', submissionsError);
        }

        const submissionsMap = {};
        submissionsData?.forEach(submission => {
          submissionsMap[submission.assignment_id] = submission;
        });

        console.log('Assignment submissions found:', submissionsData?.length || 0);

        // Transform quiz data for calendar
        const quizEvents = (quizzesData || []).map(quiz => {
          const result = resultsMap[quiz.id];
          const subject = subjectsMap[quiz.subject_id];
          const section = sectionsMap[quiz.section_id];
          const isCompleted = result && (result.status === 'completed' || result.status === 'graded');
          
          const deadlineDate = quiz.end_date ? new Date(quiz.end_date) : null;
          
          return {
            id: quiz.id,
            title: quiz.title,
            subject: subject?.name || 'Unknown Subject',
            subjectCode: `Grade ${subject?.grade_level || '?'}`,
            date: deadlineDate || new Date(),
            time: deadlineDate ? deadlineDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '11:59 PM',
            type: 'quiz',
            description: quiz.description || `${quiz.number_of_questions} questions${quiz.time_limit_minutes ? ` • ${quiz.time_limit_minutes} minutes` : ''} • ${quiz.attempts_allowed} attempt${quiz.attempts_allowed > 1 ? 's' : ''} allowed`,
            isCompleted: isCompleted,
            submittedAt: isCompleted ? new Date() : null,
            quizCode: quiz.quiz_code,
            sectionName: section?.name || '',
            sectionCode: section?.section_code || '',
            numberOfQuestions: quiz.number_of_questions,
            timeLimit: quiz.time_limit_minutes,
            attemptsAllowed: quiz.attempts_allowed,
            totalAttempts: result?.total_attempts || 0,
            bestScore: result?.best_percentage || 0,
            startDate: quiz.start_date ? new Date(quiz.start_date) : null
          };
        });

        // Transform assignment data for calendar
        const assignmentEvents = (assignmentsData || []).map(assignment => {
          const submission = submissionsMap[assignment.id];
          const subject = subjectsMap[assignment.subject_id];
          const section = sectionsMap[assignment.section_id];
          const isCompleted = submission && (submission.status === 'submitted' || submission.status === 'graded');
          
          const deadlineDate = assignment.due_date ? new Date(assignment.due_date) : null;
          
          return {
            id: assignment.id,
            title: assignment.title,
            subject: subject?.name || 'Unknown Subject',
            subjectCode: `Grade ${subject?.grade_level || '?'}`,
            date: deadlineDate || new Date(),
            time: deadlineDate ? deadlineDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '11:59 PM',
            type: 'assignment',
            description: assignment.description || `${assignment.assignment_type} • ${assignment.submission_type.replace('_', ' ')} • ${assignment.total_points} points`,
            isCompleted: isCompleted,
            submittedAt: submission?.submitted_at ? new Date(submission.submitted_at) : null,
            sectionName: section?.name || '',
            sectionCode: section?.section_code || '',
            assignmentType: assignment.assignment_type,
            submissionType: assignment.submission_type,
            totalPoints: assignment.total_points,
            allowLateSubmission: assignment.allow_late_submission,
            score: submission?.score || 0,
            isLate: submission?.is_late || false,
            submissionStatus: submission?.status || 'not_submitted'
          };
        });

        // Combine and filter events
        this.events = [...quizEvents, ...assignmentEvents].filter(event => event.date);

        console.log('Events loaded successfully:', this.events.length);
        console.log('Quizzes:', quizEvents.length, 'Assignments:', assignmentEvents.length);
        
        if (this.events.length > 0) {
          this.showNotification(
            `Loaded ${quizEvents.length} quiz${quizEvents.length !== 1 ? 'zes' : ''} and ${assignmentEvents.length} assignment${assignmentEvents.length !== 1 ? 's' : ''}`, 
            'success'
          );
        }
        
      } catch (error) {
        console.error('Error loading events:', error);
        this.showNotification('Failed to load calendar events: ' + error.message, 'error');
      }
    },

    setupRealTimeSubscription() {
      if (!this.studentId) return;

      console.log('Setting up real-time subscription...');

      // Subscribe to changes in quizzes and assignments tables
      this.realTimeSubscription = supabase
        .channel('calendar-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'quizzes',
          filter: `status=eq.published`
        }, (payload) => {
          console.log('Real-time quiz update:', payload);
          this.handleQuizUpdate(payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'assignments',
          filter: `status=eq.published`
        }, (payload) => {
          console.log('Real-time assignment update:', payload);
          this.handleAssignmentUpdate(payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'quiz_results',
          filter: `student_id=eq.${this.studentId}`
        }, (payload) => {
          console.log('Real-time quiz result update:', payload);
          this.handleQuizResultUpdate(payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'assignment_submissions',
          filter: `student_id=eq.${this.studentId}`
        }, (payload) => {
          console.log('Real-time assignment submission update:', payload);
          this.handleAssignmentSubmissionUpdate(payload);
        })
        .subscribe((status) => {
          console.log('Real-time subscription status:', status);
        });
    },

    async handleQuizUpdate(payload) {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          await this.loadEvents();
          if (newRecord?.title) {
            this.showNotification(`New quiz available: ${newRecord.title}`, 'info');
          }
          break;
        case 'UPDATE':
          await this.loadEvents();
          if (newRecord?.title) {
            this.showNotification(`Quiz updated: ${newRecord.title}`, 'info');
          }
          break;
        case 'DELETE':
          if (oldRecord?.id) {
            this.events = this.events.filter(e => e.id !== oldRecord.id);
            this.showNotification('A quiz has been removed', 'warning');
          }
          break;
      }
    },

    async handleQuizResultUpdate(payload) {
      const { new: newRecord } = payload;
      
      if (!newRecord?.quiz_id) return;
      
      const eventIndex = this.events.findIndex(e => e.id === newRecord.quiz_id);
      if (eventIndex !== -1) {
        const isCompleted = newRecord.status === 'completed' || newRecord.status === 'graded';
        this.events[eventIndex].isCompleted = isCompleted;
        this.events[eventIndex].totalAttempts = newRecord.total_attempts || 0;
        this.events[eventIndex].bestScore = newRecord.best_percentage || 0;
        
        if (isCompleted) {
          this.showNotification(`Quiz completed: ${this.events[eventIndex].title}`, 'success');
        }
        
        this.$forceUpdate();
      }
    },

    async handleAssignmentUpdate(payload) {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          await this.loadEvents();
          if (newRecord?.title) {
            this.showNotification(`New assignment available: ${newRecord.title}`, 'info');
          }
          break;
        case 'UPDATE':
          await this.loadEvents();
          if (newRecord?.title) {
            this.showNotification(`Assignment updated: ${newRecord.title}`, 'info');
          }
          break;
        case 'DELETE':
          if (oldRecord?.id) {
            this.events = this.events.filter(e => e.id !== oldRecord.id || e.type !== 'assignment');
            this.showNotification('An assignment has been removed', 'warning');
          }
          break;
      }
    },

    async handleAssignmentSubmissionUpdate(payload) {
      const { new: newRecord } = payload;
      
      if (!newRecord?.assignment_id) return;
      
      const eventIndex = this.events.findIndex(e => e.id === newRecord.assignment_id && e.type === 'assignment');
      if (eventIndex !== -1) {
        const isCompleted = newRecord.status === 'submitted' || newRecord.status === 'graded';
        this.events[eventIndex].isCompleted = isCompleted;
        this.events[eventIndex].submittedAt = newRecord.submitted_at ? new Date(newRecord.submitted_at) : null;
        this.events[eventIndex].score = newRecord.score || 0;
        this.events[eventIndex].isLate = newRecord.is_late || false;
        this.events[eventIndex].submissionStatus = newRecord.status || 'not_submitted';
        
        if (isCompleted) {
          this.showNotification(`Assignment submitted: ${this.events[eventIndex].title}`, 'success');
        }
        
        this.$forceUpdate();
      }
    },

    async markAsCompleted(event) {
      try {
        // Check if quiz result already exists
        const { data: existingResult, error: checkError } = await supabase
          .from('quiz_results')
          .select('id, status')
          .eq('quiz_id', event.id)
          .eq('student_id', this.studentId)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingResult) {
          // Update existing result
          const { error: updateError } = await supabase
            .from('quiz_results')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingResult.id);

          if (updateError) throw updateError;
        } else {
          // Create new result
          const { error: insertError } = await supabase
            .from('quiz_results')
            .insert({
              quiz_id: event.id,
              student_id: this.studentId,
              status: 'completed',
              best_percentage: 0,
              total_attempts: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
        }

        // Update local event state
        event.isCompleted = true;
        event.submittedAt = new Date();
        
        // Close any open modals
        this.selectedEvent = null;
        this.selectedDay = null;
        
        // Show success notification
        this.showNotification(`✅ ${event.title} marked as completed!`, 'success');
        
        // Force update to reflect changes
        this.$forceUpdate();
        
      } catch (error) {
        console.error('Error marking quiz as completed:', error);
        this.showNotification('Failed to mark quiz as completed: ' + error.message, 'error');
      }
    },

    showNotification(message, type = 'info') {
      const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date()
      };

      this.notifications.push(notification);
      
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 5000);
      
      console.log(`[${type.toUpperCase()}] ${message}`);
    },

    removeNotification(notificationId) {
      const index = this.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },

    getNotificationIcon(type) {
      switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
      }
    },

    getEventStatus(event) {
      if (!event.date) return 'unknown';
      
      const eventDate = new Date(event.date);
      const today = new Date(this.currentTime);
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      if (event.isCompleted) {
        return 'completed';
      }
      
      if (eventDate.getTime() < today.getTime()) {
        return 'overdue';
      }
      
      if (eventDate.getTime() === today.getTime()) {
        return 'due-today';
      }
      
      return 'upcoming';
    },

    getEventStatusText(event) {
      const status = this.getEventStatus(event);
      switch (status) {
        case 'completed':
          if (event.type === 'quiz') {
            return `Completed (${event.bestScore.toFixed(0)}%)`;
          } else {
            return event.score ? `Completed (${event.score}/${event.totalPoints} pts)` : 'Submitted';
          }
        case 'overdue':
          if (event.type === 'quiz') {
            return `Overdue (${event.totalAttempts}/${event.attemptsAllowed} attempts)`;
          } else {
            return 'Overdue';
          }
        case 'due-today':
          return 'Due Today!';
        case 'upcoming':
          return 'Upcoming';
        default:
          return 'Unknown';
      }
    },

    formatEventType(type) {
      if (!type) return 'Event';
      return type.charAt(0).toUpperCase() + type.slice(1);
    },

    getCompletedCount(events) {
      return events.filter(event => this.getEventStatus(event) === 'completed').length;
    },

    getPendingCount(events) {
      return events.filter(event => 
        this.getEventStatus(event) === 'upcoming' || 
        this.getEventStatus(event) === 'due-today' || 
        this.getEventStatus(event) === 'overdue'
      ).length;
    },

    updateCurrentTime() {
      this.currentTime = new Date();
      this.checkDeadlineReminders();
    },

    checkDeadlineReminders() {
      const now = new Date();
      const oneHour = 60 * 60 * 1000;
      const oneDay = 24 * oneHour;

      this.events.forEach(event => {
        if (event.isCompleted || !event.date) return;

        const eventDateTime = new Date(event.date);
        const timeDiff = eventDateTime.getTime() - now.getTime();

        if (timeDiff > 0 && timeDiff <= oneHour) {
          this.showNotification(
            `⏰ ${event.title} is due in less than 1 hour!`,
            'warning'
          );
        } else if (timeDiff > oneHour && timeDiff <= oneDay) {
          this.showNotification(
            `📅 ${event.title} is due today!`,
            'info'
          );
        }
      });
    },

    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    },

    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    },

    goToToday() {
      this.currentDate = new Date();
    },

    selectDay(day) {
      if (day.events.length > 0) {
        this.selectedDay = day;
      }
    },

    closeDayModal() {
      this.selectedDay = null;
    },

    viewEvent(event) {
      this.selectedEvent = event;
    },

    viewEventFromDay(event) {
      this.selectedDay = null;
      this.selectedEvent = event;
    },

    closeModal() {
      this.selectedEvent = null;
    },

    formatSelectedDayDate() {
      if (!this.selectedDay) return '';
      return this.selectedDay.fullDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatEventDate(date) {
      if (!date) return 'No deadline set';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
          this.activeSchoolYear = null;
        } else if (activeSchoolYear) {
          this.currentSchoolYear = activeSchoolYear.year_name;
          this.activeSchoolYear = activeSchoolYear;
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

          // Fetch all grading periods for this school year (for timeline display)
          const { data: allPeriods, error: periodsError } = await supabase
            .from('grading_periods')
            .select('*')
            .eq('school_year_id', activeSchoolYear.id)
            .order('period_number', { ascending: true });

          if (!periodsError && allPeriods) {
            this.gradingPeriods = allPeriods;
            console.log('✅ Grading periods loaded:', this.gradingPeriods.length);
          }
        } else {
          console.warn('⚠️ No active school year found');
          this.currentSchoolYear = 'No Active Year';
          this.currentQuarter = 'N/A';
          this.activeSchoolYear = null;
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
          .channel('school_years_changes_calendar')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'school_years'
            },
            (payload) => {
              console.log('🔔 School year changed:', payload);
              this.fetchSchoolYearAndQuarter();
            }
          )
          .subscribe();

        // Subscribe to grading_periods table changes
        this.gradingPeriodSubscription = supabase
          .channel('grading_periods_changes_calendar')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'grading_periods'
            },
            (payload) => {
              console.log('🔔 Grading period changed:', payload);
              this.fetchSchoolYearAndQuarter();
            }
          )
          .subscribe();

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
      }
      
      if (this.gradingPeriodSubscription) {
        supabase.removeChannel(this.gradingPeriodSubscription);
        this.gradingPeriodSubscription = null;
      }
    },

    calculateDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },

    calculateQuarterProgress(period) {
      const now = new Date();
      const start = new Date(period.start_date);
      const end = new Date(period.end_date);
      
      if (now < start) return 0;
      if (now > end) return 100;
      
      const totalDuration = end - start;
      const elapsed = now - start;
      const progress = (elapsed / totalDuration) * 100;
      
      return Math.min(100, Math.max(0, Math.round(progress)));
    },

    cleanup() {
      if (this.statusUpdateInterval) {
        clearInterval(this.statusUpdateInterval);
      }
      if (this.fastUpdateInterval) {
        clearInterval(this.fastUpdateInterval);
      }
      if (this.realTimeSubscription) {
        this.realTimeSubscription.unsubscribe();
      }
      this.cleanupSchoolYearSubscription();
    }
  },
  mounted() {
    this.initializeData();
    
    // Setup school year real-time subscription
    this.setupSchoolYearSubscription();
    
    this.statusUpdateInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 60000);
    
    this.fastUpdateInterval = setInterval(() => {
      this.updateCurrentTime();
    }, 30000);
  },

  beforeUnmount() {
    this.cleanup();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* CSS Variables for Typography - Premium Design System */
:root {
  /* Font Sizes */
  --font-size-xs: 0.75rem;      /* 12px - Small labels, metadata */
  --font-size-sm: 0.875rem;     /* 14px - Body text, descriptions */
  --font-size-base: 1rem;       /* 16px - Base body text */
  --font-size-lg: 1.125rem;     /* 18px - Section headings */
  --font-size-xl: 1.25rem;      /* 20px - Card titles */
  --font-size-2xl: 1.5rem;      /* 24px - Page headings */
  --font-size-3xl: 2rem;        /* 32px - Main titles */
  
  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* All other CSS follows here */
.section-header-card {
  border: 2px solid rgba(255, 255, 255, 0.6);
}
.dark .section-header-card {
  border: 2px solid rgba(61, 141, 122, 0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.calendar-container {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  padding: 1.5rem 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  position: relative;
  overflow-y: auto;
}
.dark .calendar-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%);
}

/* Custom Scrollbar */
.calendar-container::-webkit-scrollbar {
  width: 12px;
}

.calendar-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.calendar-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.calendar-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}
/* Header Card Styles (matching Admin Dashboard) */
.section-header-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  min-height: auto;
  gap: 1.25rem;
  justify-content: space-between;
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
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.section-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
  animation: pulse 2s ease-in-out infinite;
  flex-shrink: 0;
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
  line-height: var(--line-height-tight);
}
.dark .section-header-title {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header-sub {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0;
  line-height: var(--line-height-normal);
}
.dark .section-header-sub {
  color: #94a3b8;
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
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}
.dark .stat-number {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-top: 0.5rem;
}
.dark .stat-label {
  color: #94a3b8;
}

/* Loading Overlay (matching Admin Dashboard) */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem 4rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(61, 141, 122, 0.15);
  border: 2px solid rgba(163, 209, 198, 0.6);
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
  border-top: 5px solid #2d6a5a;
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
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.loading-subtext {
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Error State */

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
}

.error-title {
  font-size: 1.5rem;
  color: #ef4444;
  font-weight: 600;
  margin: 0;
}

.error-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}
.dark .error-message {
  color: #9ca3af;
}

.retry-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.retry-btn:hover {
  background: #2f6b5c;
  transform: translateY(-1px);
}

/* Status Legend */
.status-legend {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(226, 232, 240, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}
.dark .status-legend {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}
.dark .legend-item {
  color: #e2e8f0;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-color.upcoming { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
.legend-color.due-today { background: linear-gradient(135deg, #ef4444, #dc2626); }
.legend-color.completed { background: linear-gradient(135deg, #10b981, #059669); }
.legend-color.overdue { background: linear-gradient(135deg, #f59e0b, #d97706); }

/* Notifications */
.notifications-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.notification {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 32px var(--shadow-medium);
  border-left: 4px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.notification.success {
  border-left-color: #22c55e;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.notification.error {
  border-left-color: #dc2626;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.notification.warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.notification.info {
  border-left-color: #3D8D7A;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05) 0%, rgba(255, 255, 255, 1) 100%);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.notification-icon {
  font-size: 1.25rem;
}

.notification-message {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.3s ease;
}

.notification-close:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Live Indicator */

.live-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}
.live-dot {
  width: 1.6rem;
  height: 1.6rem;
  display: inline-block;
}
@media (max-width: 480px) {
  .stat-number {
    font-size: 1.1rem;
  }
  .live-dot {
    width: 1.1rem;
    height: 1.1rem;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.calendar-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(226, 232, 240, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}
.dark .calendar-nav {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: rgba(241, 245, 249, 0.8);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1rem;
}
.dark .nav-btn {
  background: rgba(51, 65, 85, 0.5);
  border-color: rgba(61, 141, 122, 0.3);
  color: #94a3b8;
}

.nav-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(61, 141, 122, 0.3);
}
.dark .nav-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
}

.current-month {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  min-width: 200px;
  text-align: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px;
}
.dark .current-month {
  background: linear-gradient(135deg, #e2e8f0, #A3D1C6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: rgba(241, 245, 249, 0.5);
  padding: 0.25rem;
  border-radius: 10px;
  border: 2px solid rgba(226, 232, 240, 0.8);
}
.dark .view-toggle {
  background: rgba(51, 65, 85, 0.3);
  border-color: rgba(61, 141, 122, 0.3);
}

.view-btn {
  background: transparent;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.85rem;
  position: relative;
  overflow: hidden;
}
.dark .view-btn {
  color: #94a3b8;
}

.view-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.view-btn:hover::before {
  left: 100%;
}

.view-btn:hover {
  background: rgba(61, 141, 122, 0.1);
  color: #3D8D7A;
}
.dark .view-btn:hover {
  color: #A3D1C6;
}

.view-btn.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.today-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.today-btn:hover {
  background: #2f6b5c;
  transform: translateY(-1px);
}

.calendar-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(226, 232, 240, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}
.dark .calendar-content {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.calendar-grid {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  background: rgba(241, 245, 249, 0.5);
  border-radius: 8px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .day-header {
  color: #e2e8f0;
  background: rgba(51, 65, 85, 0.3);
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  min-height: 120px;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 2px solid rgba(226, 232, 240, 0.5);
}
.dark .calendar-day {
  background: rgba(31, 41, 55, 0.5);
  border-color: rgba(75, 85, 99, 0.3);
}

.calendar-day.clickable {
  cursor: pointer;
}

.calendar-day.clickable:hover {
  background: rgba(248, 250, 252, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.15);
  border-color: rgba(61, 141, 122, 0.4);
}
.dark .calendar-day.clickable:hover {
  background: rgba(55, 65, 81, 0.7);
  border-color: rgba(61, 141, 122, 0.5);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.today {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.12), rgba(45, 106, 90, 0.08));
  border-color: #3D8D7A;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.2);
}
.dark .calendar-day.today {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.2), rgba(45, 106, 90, 0.15));
}

.calendar-day.has-due-today {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05));
}
.dark .calendar-day.has-due-today {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
}

.calendar-day.has-overdue {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.05));
}
.dark .calendar-day.has-overdue {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1));
}

.calendar-day.has-upcoming {
  border-color: rgba(61, 141, 122, 0.6);
}

.day-number {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .day-number {
  color: #e2e8f0;
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.event-dot {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  margin-bottom: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-dot.upcoming {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.event-dot.due-today {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.event-dot.completed {
  background: linear-gradient(135deg, #10b981, #059669);
}

.event-dot.overdue {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.more-events {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.25rem;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 4px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .more-events {
  color: #94a3b8;
  background: rgba(51, 65, 85, 0.5);
}

.event-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

.day-modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(226, 232, 240, 0.8);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark .day-modal-content {
  background: rgba(31, 41, 55, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
}

.day-modal-header {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.day-modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmerModal 3s linear infinite;
}

@keyframes shimmerModal {
  0% { left: -100%; }
  100% { left: 100%; }
}

.day-modal-header h3 {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.3px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.25rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: rotate(90deg);
}

.day-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
}

.day-events-summary {
  margin-bottom: 1.5rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.summary-stat {
  background: rgba(61, 141, 122, 0.05);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #A3D1C6;
}
.dark .summary-stat {
  background: #23272b;
  border-color: #3D8D7A;
}

.summary-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3D8D7A;
  line-height: 1;
}
.dark .summary-number {
  color: #A3D1C6;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}
.dark .summary-label {
  color: #9ca3af;
}

.day-events-list h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}
.dark .day-events-list h4 {
  color: #A3D1C6;
}

.day-event-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.day-event-item {
  background: #FBFFE4;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s;
  border: 1px solid #A3D1C6;
}
.dark .day-event-item {
  background: #23272b;
  border-color: #3D8D7A;
}

.day-event-item:hover {
  background: #f0f9f4;
  border-color: #3D8D7A;
}
.dark .day-event-item:hover {
  background: #2a3137;
}

.day-event-item.upcoming {
  border-left: 4px solid #3D8D7A;
}

.day-event-item.due-today {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}
.dark .day-event-item.due-today {
  background: #2d1b1b;
}

.day-event-item.completed {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}
.dark .day-event-item.completed {
  background: #1a2e1a;
}

.day-event-item.overdue {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}
.dark .day-event-item.overdue {
  background: #2d2516;
}

.event-status-indicator {
  margin-top: 0.25rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.status-dot.upcoming {
  background: #3D8D7A;
}

.status-dot.due-today {
  background: #ef4444;
}

.status-dot.completed {
  background: #10b981;
}

.status-dot.overdue {
  background: #f59e0b;
}

.event-details {
  flex: 1;
}

.event-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}
.dark .event-name {
  color: #A3D1C6;
}

.event-subject-small {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}
.dark .event-subject-small {
  color: #9ca3af;
}

.event-time-small {
  font-size: 0.875rem;
  font-weight: 500;
  color: #3D8D7A;
  margin-bottom: 0.5rem;
}
.dark .event-time-small {
  color: #A3D1C6;
}

.event-desc-small {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
.dark .event-desc-small {
  color: #9ca3af;
}

.event-status-text {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.status-badge-small {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.status-badge-small.upcoming {
  background: rgba(61, 141, 122, 0.2);
  color: #3D8D7A;
}

.status-badge-small.due-today {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.status-badge-small.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.status-badge-small.overdue {
  background: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.event-quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-answer-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-answer-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.quick-view-btn {
  background: #FBFFE4;
  border: 1px solid #A3D1C6;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3D8D7A;
}
.dark .quick-view-btn {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.quick-view-btn:hover {
  background: #A3D1C6;
  transform: scale(1.05);
}
.dark .quick-view-btn:hover {
  background: #3D8D7A;
}

/* List View Styles */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.day-group {
  border-bottom: 2px solid rgba(226, 232, 240, 0.5);
  padding-bottom: 1.5rem;
}

.day-title {
  font-size: 1.125rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.3px;
}
.dark .day-title {
  background: linear-gradient(135deg, #e2e8f0, #A3D1C6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(226, 232, 240, 0.8);
  position: relative;
  overflow: hidden;
}
.dark .event-item {
  background: rgba(35, 39, 43, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
}

.event-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.event-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.15);
  border-color: rgba(61, 141, 122, 0.5);
}
.dark .event-item:hover {
  background: rgba(42, 48, 56, 0.9);
}

.event-item.upcoming::before {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
}

.event-item.due-today {
  background: rgba(254, 242, 242, 0.9);
}

.event-item.due-today::before {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.dark .event-item.due-today {
  background: rgba(45, 27, 27, 0.9);
}

.event-item.completed {
  background: rgba(240, 253, 244, 0.9);
}

.event-item.completed::before {
  background: linear-gradient(135deg, #10b981, #059669);
}

.dark .event-item.completed {
  background: rgba(26, 46, 26, 0.9);
}

.event-item.overdue {
  background: rgba(255, 251, 235, 0.9);
}

.event-item.overdue::before {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.dark .event-item.overdue {
  background: rgba(45, 37, 22, 0.9);
}

.event-time {
  min-width: 80px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #3D8D7A;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .event-time {
  color: #A3D1C6;
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.2px;
}
.dark .event-title {
  color: #e2e8f0;
}

.event-subject {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .event-subject {
  color: #94a3b8;
}

.event-description {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.dark .event-description {
  color: #94a3b8;
}

.event-status-badge {
  margin-top: 0.5rem;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.status-badge.upcoming {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.1));
  color: #2d6a5a;
  border: 2px solid rgba(61, 141, 122, 0.3);
}

.status-badge.due-today {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  color: #b91c1c;
  border: 2px solid rgba(239, 68, 68, 0.3);
}

.status-badge.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
  color: #047857;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.status-badge.overdue {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1));
  color: #b45309;
  border: 2px solid rgba(245, 158, 11, 0.3);
}

/* Type Badges for Quiz/Assignment */
.event-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.type-badge.quiz {
  background: rgba(59, 130, 246, 0.15);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.type-badge.assignment {
  background: rgba(147, 51, 234, 0.15);
  color: #7c3aed;
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.dark .type-badge.quiz {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.4);
}

.dark .type-badge.assignment {
  background: rgba(147, 51, 234, 0.2);
  color: #a78bfa;
  border-color: rgba(147, 51, 234, 0.4);
}

.event-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.answer-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
}

.answer-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.view-btn-small {
  background: #FBFFE4;
  border: 1px solid #A3D1C6;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3D8D7A;
}
.dark .view-btn-small {
  background: #23272b;
  border-color: #3D8D7A;
  color: #A3D1C6;
}

.view-btn-small:hover {
  background: #A3D1C6;
  transform: scale(1.05);
}
.dark .view-btn-small:hover {
  background: #3D8D7A;
}

.modal-content {
  background: #FBFFE4;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(61, 141, 122, 0.15);
  border: 1px solid #A3D1C6;
}
.dark .modal-content {
  background: #1f2937;
  border-color: #3D8D7A;
}

.modal-header {
  background: #3D8D7A;
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  border-bottom: none;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

.modal-header .close-btn {
  color: rgba(255, 255, 255, 0.8);
}

.modal-header .close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  max-height: calc(80vh - 120px);
}

/* Custom Scrollbar for Modal Body */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(163, 209, 198, 0.1);
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3d8d7a, #20c997);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(61, 141, 122, 0.2);
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2f6b5c, #1ba085);
  box-shadow: 0 3px 6px rgba(61, 141, 122, 0.3);
}

.dark .modal-body::-webkit-scrollbar-track {
  background: rgba(61, 141, 122, 0.1);
}

.dark .modal-body::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #4dbb98, #20c997);
}

.event-detail {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(61, 141, 122, 0.1);
  align-items: flex-start;
}
.dark .event-detail {
  border-bottom-color: rgba(61, 141, 122, 0.2);
}

.event-detail strong {
  min-width: 80px;
  color: #3D8D7A;
  font-weight: 600;
  font-size: 0.875rem;
}
.dark .event-detail strong {
  color: #A3D1C6;
}

.event-detail span {
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.5;
}
.dark .event-detail span {
  color: #A3D1C6;
}

.modal-actions {
  padding-top: 1rem;
  border-top: 1px solid rgba(61, 141, 122, 0.1);
}
.dark .modal-actions {
  border-top-color: rgba(61, 141, 122, 0.2);
}

.answer-btn-modal {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Inter', sans-serif;
  width: 100%;
  justify-content: center;
}

.answer-btn-modal:hover {
  background: #059669;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .current-month {
    font-size: 1rem;
    font-weight: 700;
    color: #3D8D7A;
    margin: 0 1.2rem;
    text-align: center;
    font-family: 'Inter', sans-serif;
    letter-spacing: -0.5px;
  }
  }
  
  .section-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .section-header-stats {
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
  }
  
  .section-header-title {
    font-size: 1.25rem;
  }
  
  .status-legend {
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .status-item {
    min-height: 44px;
    padding: 8px 12px;
  }
  
  .calendar-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .nav-controls {
    justify-content: center;
    gap: 0.5rem;
  }
  
  .nav-btn {
    min-width: 44px;
    min-height: 44px;
    padding: 12px;
  }
  
  .calendar-content {
    padding: 1rem;
  }
  
  .calendar-day {
    min-height: 100px;
    padding: 0.75rem;
  }
  
  .day-header {
    padding: 0.75rem;
    font-size: 0.8rem;
    min-height: 44px;
  }
  
  .event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    min-height: 44px;
  }
  
  .event-time {
    min-width: auto;
  }
  
  .calendar-grid {
    gap: 1px;
  }
  
  .month-year-selector {
    min-height: 44px;
    font-size: 16px;
  }
@media (max-width: 480px) {
  .calendar-container {
    padding: 0.75rem 0.75rem 0 0.75rem;
    padding-bottom: 120px;
  }
  
  .section-header-card {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .section-header-title {
    font-size: 1.1rem;
  }
  
  .section-header-sub {
    font-size: 0.85rem;
  }
  
  .status-legend {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .status-item {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
  
  .calendar-nav {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .nav-btn {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
  
  .calendar-content {
    padding: 0.75rem;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 0.5rem;
  }
  
  .day-header {
    padding: 0.5rem;
    font-size: 0.75rem;
    min-height: 40px;
  }
  
  .day-number {
    font-size: 0.9rem;
  }
  
  .event-item {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  .calendar-grid {
    gap: 0.5px;
  }
  
  .month-year-selector {
    min-height: 40px;
    font-size: 16px;
  }
  @media (max-width: 480px) {
    /* ...existing mobile styles... */
  }

/* iPhone 12 Pro Specific (390px) */
@media (max-width: 390px) {
  .calendar-container {
    padding: 0.5rem 0.5rem 0 0.5rem;
    padding-bottom: 110px;
  }
  
  .section-header-card {
    padding: 0.75rem;
  }
  
  .section-header-title {
    font-size: 1rem;
  }
  
  .status-legend {
    padding: 0.5rem;
  }
  
  .calendar-nav {
    padding: 0.5rem;
  }
  
  .calendar-content {
    padding: 0.5rem;
  }
  
  .calendar-day {
    min-height: 70px;
    padding: 0.25rem;
  }
  
  .day-header {
    padding: 0.25rem;
    font-size: 0.7rem;
  }
  
  .day-number {
    font-size: 0.8rem;
  }
  
  .event-item {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
}
  
  .event-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .day-modal-content,
  .modal-content {
    max-width: 95%;
    margin: 1rem;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .day-event-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .event-quick-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}

/* Loading Overlay (uniform with Subjects.vue) */
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
.dark .loading-overlay {
  background: rgba(24, 28, 32, 0.95);
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
.dark .loading-content {
  background: #23272b;
  border-color: #20c997;
  color: #A3D1C6;
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #181c20;
  margin: 0 0 0.5rem 0;
  line-height: var(--line-height-tight);
}
.dark .loading-text {
  color: #A3D1C6;
}

.loading-subtext {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: #3d8d7a;
  margin: 0;
  line-height: var(--line-height-normal);
}
.dark .loading-subtext {
  color: #A3D1C6;
}

/* Academic Info Calendar Styles */
.academic-info-calendar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(241, 245, 249, 0.5);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  backdrop-filter: blur(10px);
  margin-top: 0.75rem;
}

.dark .academic-info-calendar {
  background: rgba(51, 65, 85, 0.3);
  border-color: rgba(61, 141, 122, 0.3);
}

.academic-year-badge,
.quarter-badge-calendar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0;
}

.academic-year-badge {
  background: rgba(241, 245, 249, 0.8);
  color: #1e293b;
  border: 2px solid rgba(226, 232, 240, 0.8);
}

.dark .academic-year-badge {
  background: rgba(51, 65, 85, 0.5);
  color: #e2e8f0;
  border-color: rgba(71, 85, 105, 0.5);
}

.quarter-badge-calendar {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: 2px solid rgba(61, 141, 122, 0.3);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.dark .quarter-badge-calendar {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: rgba(61, 141, 122, 0.4);
}

.academic-year-badge:hover,
.quarter-badge-calendar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.3);
}

/* Academic Schedule Section */
.academic-schedule-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(226, 232, 240, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
}

.dark .academic-schedule-section {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
}

.dark .schedule-header {
  border-bottom-color: rgba(61, 141, 122, 0.3);
}

.schedule-title {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.3px;
  line-height: var(--line-height-tight);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .schedule-title {
  background: linear-gradient(135deg, #e2e8f0, #A3D1C6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.schedule-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  line-height: var(--line-height-normal);
}

.dark .schedule-subtitle {
  color: #94a3b8;
}

/* Quarters Timeline */
.quarters-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.quarter-card {
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dark .quarter-card {
  background: rgba(42, 48, 56, 0.5);
  border-color: rgba(61, 141, 122, 0.3);
}

.quarter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3D8D7A, #2d6a5a, #3D8D7A);
  background-size: 200% 100%;
  opacity: 0.7;
  animation: shimmer 3s linear infinite;
}

.quarter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(61, 141, 122, 0.2);
  border-color: rgba(61, 141, 122, 0.6);
}

.dark .quarter-card:hover {
  border-color: rgba(61, 141, 122, 0.7);
  box-shadow: 0 12px 32px rgba(61, 141, 122, 0.25);
}

/* Active Quarter */
.quarter-card.active-quarter {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: rgba(61, 141, 122, 0.8);
  color: white;
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.35);
}

.dark .quarter-card.active-quarter {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: rgba(61, 141, 122, 0.9);
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.4);
}

.quarter-card.active-quarter::before {
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
  opacity: 1;
}

.quarter-card.active-quarter .quarter-name,
.quarter-card.active-quarter .quarter-dates,
.quarter-card.active-quarter .duration-label,
.quarter-card.active-quarter .duration-value {
  color: white !important;
}

/* Completed Quarter */
.quarter-card.completed-quarter {
  opacity: 0.8;
  background: rgba(241, 245, 249, 0.6);
}

.dark .quarter-card.completed-quarter {
  background: rgba(26, 30, 34, 0.5);
  opacity: 0.7;
}

.quarter-card.completed-quarter::before {
  background: linear-gradient(90deg, #94a3b8, #64748b);
  opacity: 0.5;
}

/* Upcoming Quarter */
.quarter-card.upcoming-quarter {
  border-style: dashed;
  opacity: 0.9;
}

.dark .quarter-card.upcoming-quarter {
  opacity: 0.8;
}

/* Quarter Header */
.quarter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.quarter-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(241, 245, 249, 0.8);
  color: #1e293b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0;
  flex-shrink: 0;
}

.quarter-badge-large.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.quarter-badge-large.completed {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.quarter-badge-large.upcoming {
  background: rgba(59, 130, 246, 0.15);
  color: #1d4ed8;
}

.quarter-info {
  flex: 1;
}

.quarter-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.dark .quarter-name {
  color: #e2e8f0;
}

.quarter-dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.dark .quarter-dates {
  color: #94a3b8;
}

/* Quarter Status */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.status-indicator.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.status-indicator .status-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.status-indicator.completed {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.dark .quarter-status.status-completed {
  background: rgba(32, 201, 151, 0.15);
  color: #20c997;
  border-color: rgba(32, 201, 151, 0.3);
}

.quarter-status.status-upcoming {
  background: rgba(163, 209, 198, 0.15);
  color: #5e8c7a;
  border: 1px solid rgba(163, 209, 198, 0.3);
}

.dark .quarter-status.status-upcoming {
  background: rgba(163, 209, 198, 0.1);
  color: #a3d1c6;
  border-color: rgba(163, 209, 198, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Quarter Dates */
.quarter-dates {
  margin-bottom: 0.75rem;
}

.quarter-dates p {
  font-size: var(--font-size-sm);
  color: #5e8c7a;
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: var(--line-height-normal);
}

.dark .quarter-dates p {
  color: #a3d1c6;
}

.quarter-dates strong {
  font-weight: var(--font-weight-semibold);
  color: #2d6a57;
}

.dark .quarter-dates strong {
  color: #20c997;
}

/* Quarter Duration */
.quarter-duration {
  font-size: var(--font-size-sm);
  color: #7a9c8f;
  font-weight: var(--font-weight-medium);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(163, 209, 198, 0.2);
  line-height: var(--line-height-normal);
}

.dark .quarter-duration {
  color: #a3d1c6;
  border-top-color: rgba(163, 209, 198, 0.1);
}

/* Quarter Progress */
.quarter-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgba(255, 255, 255, 0.95);
  line-height: var(--line-height-tight);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive Design */
@media (max-width: 1400px) {
  .quarters-timeline {
    gap: 0.875rem;
  }
  
  .quarter-card {
    padding: 1.25rem;
  }
  
  .quarter-header h4 {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 1200px) {
  .quarters-timeline {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .academic-info-calendar {
    flex-direction: column;
    align-items: stretch;
    gap: 0.625rem;
    padding: 0.75rem;
  }

  .academic-year-badge,
  .quarter-badge-calendar {
    justify-content: center;
    padding: 0.625rem 1rem;
  }

  .quarters-timeline {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .quarter-card {
    padding: 1.25rem;
  }

  .quarter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .academic-schedule-section {
    padding: 1.25rem;
  }
  
  .schedule-header-text h3 {
    font-size: var(--font-size-xl);
  }
}
</style>

/* --- Modern Card Header Styles (from Home.vue) --- */
.section-header-card {
  position: relative;
  background: var(--bg-primary);
  border-radius: 32px;
  padding: 3.5rem;
  margin-bottom: 2.5rem;
  min-height: 180px;
  box-shadow: 
    0 24px 48px rgba(61, 141, 122, 0.08),
    0 12px 24px rgba(61, 141, 122, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(61, 141, 122, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.section-header-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 32px 64px rgba(61, 141, 122, 0.12),
    0 16px 32px rgba(61, 141, 122, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.header-bg-decoration {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 120%;
  height: 200%;
  background: radial-gradient(ellipse at center, rgba(77, 187, 152, 0.08) 0%, transparent 70%);
  z-index: 1;
}
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}
.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(77, 187, 152, 0.1) 0%, rgba(51, 128, 107, 0.05) 100%);
}
.shape-1 {
  width: 120px;
  height: 120px;
  top: -30px;
  right: 10%;
  animation: float 6s ease-in-out infinite;
}
.shape-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  right: 25%;
  animation: float 8s ease-in-out infinite reverse;
}
.shape-3 {
  width: 60px;
  height: 60px;
  top: 50%;
  right: 5%;
  animation: float 7s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}
.section-header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.section-header-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.section-header-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4dbb98 0%, #33806b 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
  box-shadow: 
    0 12px 24px rgba(61, 141, 122, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.section-header-icon:hover {
  transform: scale(1.05);
}
.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.section-header-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d6a57;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #33806b 0%, #4dbb98 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}
.section-header-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #5e8c7a;
  margin-bottom: 0.25rem;
}
.section-header-description {
  font-size: 1rem;
  color: #7a9c8f;
  font-weight: 400;
  opacity: 0.9;
}
.header-badge {
  background: rgba(77, 187, 152, 0.1);
  border: 2px solid rgba(77, 187, 152, 0.2);
  border-radius: 20px;
  padding: 1rem 1.5rem;
  backdrop-filter: blur(10px);
}
.badge-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.badge-icon {
  font-size: 1.5rem;
}
.badge-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #33806b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
