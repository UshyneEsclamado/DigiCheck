<template>
  <div class="school-year-management">
    <!-- Top Navigation with Back Button -->
    <div class="top-navigation">
      <button @click="goBackToDashboard" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Dashboard</span>
      </button>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>School Year Management</h1>
          <p class="subtitle">Create and manage academic school years</p>
        </div>
        <div class="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Current Active School Year -->
    <section class="active-year-banner" v-if="activeSchoolYear">
      <div class="banner-content">
        <div class="banner-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <div class="banner-info">
          <div class="banner-label">Current Active School Year</div>
          <div class="year-name">{{ activeSchoolYear.year_name }}</div>
          <div class="year-dates">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(activeSchoolYear.start_date) }} - {{ formatDate(activeSchoolYear.end_date) }}
          </div>
        </div>
        <div class="banner-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          ACTIVE
        </div>
      </div>
    </section>

    <div v-else class="warning-banner">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <strong>No active school year!</strong>
        <p>Please activate a school year to enable enrollments.</p>
      </div>
    </div>

    <!-- Create New School Year Form -->
    <section class="create-form-section">
      <div class="section-header">
        <div class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <h2>Create New School Year</h2>
        </div>
        <button @click="toggleCreateForm" class="toggle-btn">
          <svg v-if="showCreateForm" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          {{ showCreateForm ? 'Hide Form' : 'Show Form' }}
        </button>
      </div>
      
      <div v-if="showCreateForm" class="create-form">
        <div class="form-grid">
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              School Year Name *
            </label>
            <input 
              v-model="newYear.year_name" 
              type="text" 
              placeholder="e.g., 2025-2026"
              class="form-input"
            />
            <small class="help-text">Format: YYYY-YYYY</small>
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Start Date *
            </label>
            <input 
              v-model="newYear.start_date" 
              type="date" 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              End Date *
            </label>
            <input 
              v-model="newYear.end_date" 
              type="date" 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Description (Optional)
            </label>
            <input 
              v-model="newYear.description" 
              type="text" 
              placeholder="e.g., Academic Year 2025-2026"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button @click="createSchoolYear" class="btn-primary" :disabled="!isFormValid">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Create School Year
          </button>
          <button @click="resetForm" class="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Clear Form
          </button>
        </div>
      </div>
    </section>

    <!-- School Years List -->
    <section class="school-years-list">
      <div class="section-header">
        <div class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <h2>All School Years</h2>
        </div>
        <span class="count-badge">{{ schoolYears.length }} total</span>
      </div>
      
      <div class="table-container">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading school years...</p>
        </div>
        
        <div v-else-if="schoolYears.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <h4>No School Years Found</h4>
          <p>Create a new school year using the form above to get started.</p>
        </div>
        
        <div v-else class="years-grid">
          <div 
            v-for="year in schoolYears" 
            :key="year.id" 
            class="year-card"
            :class="{ 'active-year': year.is_active }"
          >
            <div class="year-header">
              <div class="year-title-section">
                <h3>{{ year.year_name }}</h3>
                <span :class="'status-badge ' + year.status">
                  <svg v-if="year.status === 'active'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else-if="year.status === 'upcoming'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ year.status }}
                </span>
              </div>
              <div v-if="year.is_active" class="active-indicator">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                ACTIVE
              </div>
            </div>
            
            <div class="year-dates-section">
              <div class="date-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatDate(year.start_date) }}
              </div>
              <span class="date-separator">→</span>
              <div class="date-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatDate(year.end_date) }}
              </div>
            </div>
            
            <div v-if="year.description" class="year-description">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              {{ year.description }}
            </div>
            
            <div class="year-actions">
              <button 
                v-if="!year.is_active && year.status !== 'completed'"
                @click="confirmActivate(year)" 
                class="action-btn activate"
                title="Activate School Year"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Activate
              </button>
              <button 
                @click="editYear(year)" 
                class="action-btn edit"
                title="Edit School Year"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
              <button 
                v-if="year.status === 'active'"
                @click="confirmClose(year)" 
                class="action-btn close"
                title="Close School Year"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Close
              </button>
              <button 
                @click="viewStatistics(year)" 
                class="action-btn view"
                title="View Statistics"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
                Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Activate School Year Confirmation Modal -->
    <div v-if="showActivateModal" class="modal-overlay" @click.self="showActivateModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Activate School Year</h2>
          <button @click="showActivateModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="modal-message">You are about to activate <strong>{{ selectedYear?.year_name }}</strong>.</p>
          <div class="warning-box">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Important:
            </h4>
            <ul>
              <li>This will <strong>deactivate</strong> the current school year ({{ activeSchoolYear?.year_name }})</li>
              <li>All <strong>new enrollments</strong> will use this school year</li>
              <li>All <strong>grading periods</strong> from the previous year will be deactivated</li>
              <li>This action will affect the entire system</li>
            </ul>
          </div>
          <p class="confirm-text">Are you sure you want to continue?</p>
          <div class="modal-actions">
            <button @click="activateSchoolYear" class="btn-warn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Yes, Activate {{ selectedYear?.year_name }}
            </button>
            <button @click="showActivateModal = false" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Close School Year Confirmation Modal -->
    <div v-if="showCloseModal" class="modal-overlay" @click.self="showCloseModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Close School Year</h2>
          <button @click="showCloseModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon danger">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p class="modal-message">Close and complete <strong>{{ selectedYear?.year_name }}</strong>?</p>
          <p class="warn-text">This will mark it as completed and you won't be able to activate it again.</p>
          <div class="modal-actions">
            <button @click="closeSchoolYear" class="btn-warn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Close School Year
            </button>
            <button @click="showCloseModal = false" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit School Year Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit School Year</h2>
          <button @click="showEditModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="editForm">
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              School Year Name
            </label>
            <input v-model="editForm.year_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Start Date
            </label>
            <input v-model="editForm.start_date" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              End Date
            </label>
            <input v-model="editForm.end_date" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Description
            </label>
            <input v-model="editForm.description" type="text" class="form-input" />
          </div>
          <div class="modal-actions">
            <button @click="saveSchoolYear" class="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Changes
            </button>
            <button @click="showEditModal = false" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div v-if="showStatsModal" class="modal-overlay" @click.self="showStatsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Statistics for {{ selectedYear?.year_name }}</h2>
          <button @click="showStatsModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="loadingStats" class="loading-state">
            <div class="spinner"></div>
            <p>Loading statistics...</p>
          </div>
          <div v-else class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon enrollments">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats.total_enrollments }}</div>
              <div class="stat-label">Total Enrollments</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon students">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats.unique_students }}</div>
              <div class="stat-label">Unique Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon sections">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats.total_sections }}</div>
              <div class="stat-label">Sections</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon subjects">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats.total_subjects }}</div>
              <div class="stat-label">Subjects</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon periods">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats.grading_periods }}</div>
              <div class="stat-label">Grading Periods</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'SchoolYearManagement',
  data() {
    return {
      schoolYears: [],
      activeSchoolYear: null,
      loading: false,
      showCreateForm: false,
      showActivateModal: false,
      showCloseModal: false,
      showEditModal: false,
      showStatsModal: false,
      selectedYear: null,
      editForm: null,
      loadingStats: false,
      stats: {
        total_enrollments: 0,
        unique_students: 0,
        total_sections: 0,
        total_subjects: 0,
        grading_periods: 0
      },
      newYear: {
        year_name: '',
        start_date: '',
        end_date: '',
        description: ''
      }
    }
  },
  computed: {
    isFormValid() {
      return this.newYear.year_name.trim() !== '' &&
             this.newYear.start_date !== '' &&
             this.newYear.end_date !== '' &&
             new Date(this.newYear.end_date) > new Date(this.newYear.start_date)
    }
  },
  mounted() {
    this.fetchSchoolYears()
  },
  methods: {
    goBackToDashboard() {
      this.$router.push('/admin/dashboard')
    },

    async fetchSchoolYears() {
      this.loading = true
      const { data, error } = await supabase
        .from('school_years')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching school years:', error)
        this.loading = false
        return
      }

      this.schoolYears = data
      this.activeSchoolYear = data.find(y => y.is_active)
      this.loading = false
    },

    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm
    },

    async createSchoolYear() {
      if (!this.isFormValid) {
        alert('Please fill all required fields correctly')
        return
      }

      const { error } = await supabase
        .from('school_years')
        .insert({
          year_name: this.newYear.year_name.trim(),
          start_date: this.newYear.start_date,
          end_date: this.newYear.end_date,
          description: this.newYear.description.trim() || null,
          is_active: false,
          status: 'upcoming'
        })

      if (error) {
        console.error('Error creating school year:', error)
        if (error.code === '23505') {
          alert('School year with this name already exists')
        } else {
          alert('Failed to create school year')
        }
        return
      }

      alert('School year created successfully!')
      this.resetForm()
      this.showCreateForm = false
      this.fetchSchoolYears()
    },

    resetForm() {
      this.newYear = {
        year_name: '',
        start_date: '',
        end_date: '',
        description: ''
      }
    },

    confirmActivate(year) {
      this.selectedYear = year
      this.showActivateModal = true
    },

    async activateSchoolYear() {
      // Use the database function to activate school year
      const { error } = await supabase.rpc('activate_school_year', {
        p_school_year_id: this.selectedYear.id
      })

      if (error) {
        console.error('Error activating school year:', error)
        alert('Failed to activate school year')
        return
      }

      alert(`${this.selectedYear.year_name} is now the active school year!`)
      this.showActivateModal = false
      this.fetchSchoolYears()
    },

    confirmClose(year) {
      this.selectedYear = year
      this.showCloseModal = true
    },

    async closeSchoolYear() {
      const { error } = await supabase
        .from('school_years')
        .update({ 
          is_active: false,
          status: 'completed'
        })
        .eq('id', this.selectedYear.id)

      if (error) {
        console.error('Error closing school year:', error)
        alert('Failed to close school year')
        return
      }

      alert('School year closed successfully')
      this.showCloseModal = false
      this.fetchSchoolYears()
    },

    editYear(year) {
      this.selectedYear = year
      this.editForm = { ...year }
      this.showEditModal = true
    },

    async saveSchoolYear() {
      const { error } = await supabase
        .from('school_years')
        .update({
          year_name: this.editForm.year_name,
          start_date: this.editForm.start_date,
          end_date: this.editForm.end_date,
          description: this.editForm.description
        })
        .eq('id', this.editForm.id)

      if (error) {
        console.error('Error updating school year:', error)
        alert('Failed to update school year')
        return
      }

      alert('School year updated successfully')
      this.showEditModal = false
      this.fetchSchoolYears()
    },

    async viewStatistics(year) {
      this.selectedYear = year
      this.showStatsModal = true
      this.loadingStats = true

      // Fetch statistics
      const [enrollments, sections, subjects, gradingPeriods] = await Promise.all([
        supabase.from('enrollments').select('id, student_id', { count: 'exact' }).eq('school_year_id', year.id),
        supabase.from('sections').select('id', { count: 'exact' }).eq('school_year_id', year.id),
        supabase.from('subjects').select('id', { count: 'exact' }).eq('school_year_id', year.id),
        supabase.from('grading_periods').select('id', { count: 'exact' }).eq('school_year_id', year.id)
      ])

      // Count unique students
      const uniqueStudents = enrollments.data ? new Set(enrollments.data.map(e => e.student_id)).size : 0

      this.stats = {
        total_enrollments: enrollments.count || 0,
        unique_students: uniqueStudents,
        total_sections: sections.count || 0,
        total_subjects: subjects.count || 0,
        grading_periods: gradingPeriods.count || 0
      }

      this.loadingStats = false
    },

    formatDate(dateString) {
      if (!dateString) return '—'
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.school-year-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #fefce8 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1rem;
  overflow-y: auto;
}

/* Enhanced Scrollbar */
.school-year-management::-webkit-scrollbar {
  width: 12px;
}

.school-year-management::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  border-radius: 10px;
}

.school-year-management::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid #f1f5f9;
}

.school-year-management::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2d6a5a, #1e4d3f);
}

/* Top Navigation */
.top-navigation {
  margin-bottom: 1rem;
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  color: #3D8D7A;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
  transform: translateX(-4px);
  box-shadow: 0 4px 16px rgba(61, 141, 122, 0.25);
}

.back-button svg {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button:hover svg {
  transform: translateX(-2px);
}

/* Page Header */
.page-header {
  margin-bottom: 1.25rem;
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-radius: 20px;
  border: 2px solid rgba(61, 141, 122, 0.1);
  box-shadow: 
    0 4px 20px rgba(61, 141, 122, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 30px rgba(61, 141, 122, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.header-text h1 {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 4px 14px rgba(61, 141, 122, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Active Year Banner */
.active-year-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  color: white;
  box-shadow: 
    0 10px 30px rgba(102, 126, 234, 0.35),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: bannerSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.active-year-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes bannerSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shimmer {
  to { left: 100%; }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.banner-icon {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-info {
  flex: 1;
}

.banner-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.year-name {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.year-dates {
  font-size: 0.95rem;
  opacity: 0.95;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.banner-badge {
  background: rgba(255, 255, 255, 0.25);
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Warning Banner */
.warning-banner {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.warning-banner svg {
  flex-shrink: 0;
  color: #d97706;
}

.warning-banner strong {
  display: block;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.warning-banner p {
  margin: 0;
  font-size: 0.9rem;
}

/* Create Form Section */
.create-form-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  border: 2px solid rgba(61, 141, 122, 0.1);
  box-shadow: 
    0 4px 20px rgba(61, 141, 122, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.section-title h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.toggle-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.create-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #475569;
}

.form-group label svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 
    0 0 0 4px rgba(61, 141, 122, 0.1),
    0 2px 8px rgba(61, 141, 122, 0.15);
  transform: translateY(-1px);
}

.help-text {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

/* School Years List */
.school-years-list {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  border: 2px solid rgba(61, 141, 122, 0.1);
  box-shadow: 
    0 4px 20px rgba(61, 141, 122, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
  max-height: calc(100vh - 420px);
  min-height: 400px;
  overflow-y: auto;
}

/* Scrollbar for School Years List */
.school-years-list::-webkit-scrollbar {
  width: 10px;
}

.school-years-list::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-radius: 10px;
  margin: 8px;
}

.school-years-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

.school-years-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2d6a5a, #1e4d3f);
}

.count-badge {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #475569;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.table-container {
  margin-top: 1.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
  gap: 1rem;
}

.empty-state svg {
  opacity: 0.5;
}

.empty-state h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0;
}

.years-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.year-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  backdrop-filter: blur(8px);
  border: 2px solid rgba(61, 141, 122, 0.1);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.year-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 
    0 12px 28px rgba(61, 141, 122, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-color: rgba(61, 141, 122, 0.3);
}

.year-card.active-year {
  border-color: rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  box-shadow: 
    0 4px 16px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.year-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.year-title-section h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
}

.status-badge.upcoming {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
}

.status-badge.completed {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  color: #991b1b;
}

.active-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.year-dates-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.date-item svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.date-separator {
  color: #cbd5e1;
  font-weight: 700;
  font-size: 1.2rem;
}

.year-description {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem;
  background: #f0f9ff;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #0c4a6e;
  margin-bottom: 1rem;
  border-left: 3px solid #0ea5e9;
}

.year-description svg {
  flex-shrink: 0;
  color: #0ea5e9;
}

.year-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.action-btn.activate {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.action-btn.activate:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn.edit {
  background: #f1f5f9;
  color: #475569;
}

.action-btn.edit:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.action-btn.close {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.action-btn.close:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.action-btn.view {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.action-btn.view:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.modal-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  max-width: 550px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 8px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(61, 141, 122, 0.15);
  animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Modal Scrollbar */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-radius: 10px;
  margin: 12px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-content.small {
  max-width: 450px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f1f5f9;
  background: #fafbfc;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.close-btn {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-body {
  padding: 2rem;
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.modal-icon.warning {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
}

.modal-icon.danger {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  color: #dc2626;
}

.modal-message {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 1rem;
  text-align: center;
}

.warning-box {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-left: 3px solid #f59e0b;
  padding: 1rem 1.25rem;
  margin: 1rem 0 1.5rem;
  border-radius: 8px;
}

.warning-box h4 {
  margin: 0 0 0.75rem;
  color: #92400e;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.warning-box h4 svg {
  color: #d97706;
}

.warning-box ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #92400e;
}

.warning-box li {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.confirm-text {
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
  color: #1e293b;
}

.warn-text {
  color: #dc2626;
  font-size: 0.85rem;
  text-align: center;
  background: #fef2f2;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 3px solid #dc2626;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.stat-icon.enrollments {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.stat-icon.students {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
}

.stat-icon.sections {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.stat-icon.subjects {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stat-icon.periods {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Button Styles */
.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 
    0 4px 14px rgba(61, 141, 122, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover:not(:disabled)::before {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(61, 141, 122, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-warn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 
    0 4px 14px rgba(239, 68, 68, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-warn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-warn:hover::before {
  left: 100%;
}

.btn-warn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(239, 68, 68, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .years-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 1024px) {
  .years-grid {
    grid-template-columns: 1fr;
  }

  .school-years-list {
    max-height: calc(100vh - 400px);
  }
}

@media (max-width: 768px) {
  .school-year-management {
    padding: 0.75rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }

  .year-name {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .year-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .school-years-list {
    max-height: calc(100vh - 380px);
  }

  .back-button {
    font-size: 0.85rem;
    padding: 0.65rem 1rem;
  }
}

@media (max-width: 480px) {
  .header-text h1 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .year-name {
    font-size: 1.25rem;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>
