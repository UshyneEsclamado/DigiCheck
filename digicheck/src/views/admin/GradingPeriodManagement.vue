<template>
  <div class="grading-period-management">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Grading Period Management</h1>
          <p class="subtitle">Create and manage grading periods within school years</p>
        </div>
        <div class="header-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- School Year Selector -->
    <section class="selector-card">
      <div class="selector-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <h3>Select School Year</h3>
      </div>
      <div class="selector-content">
        <select v-model="selectedSchoolYearId" @change="onSchoolYearChange" class="select-input">
          <option value="">-- Choose a school year --</option>
          <option v-for="year in schoolYears" :key="year.id" :value="year.id">
            {{ year.year_name }} {{ year.is_active ? '(Active)' : '' }}
          </option>
        </select>
      </div>
    </section>

    <div v-if="selectedSchoolYearId">
      <!-- Current Active Grading Period -->
      <section class="active-period-banner" v-if="activePeriod">
        <div class="banner-content">
          <div class="banner-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
            </svg>
          </div>
          <div class="banner-info">
            <div class="banner-label">Current Active Grading Period</div>
            <div class="period-name">{{ activePeriod.period_name }}</div>
            <div class="period-dates">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ formatDate(activePeriod.start_date) }} - {{ formatDate(activePeriod.end_date) }}
            </div>
          </div>
          <div class="banner-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ACTIVE
          </div>
        </div>
      </section>

      <div v-else class="warning-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <div>
          <strong>No active grading period!</strong>
          <p>Please activate a period to enable grade entry.</p>
        </div>
      </div>

      <!-- Quick Create Templates -->
      <section class="templates-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <h2>Quick Create Templates</h2>
          </div>
          <p class="section-description">Use pre-configured templates to quickly set up grading periods</p>
        </div>
        <div class="template-grid">
          <button @click="createQuartersTemplate" class="template-card" :disabled="gradingPeriods.length > 0">
            <div class="template-icon quarters">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div class="template-content">
              <h3>4 Quarters</h3>
              <p>Aug-Oct, Nov-Jan, Feb-Apr, Apr-Jun</p>
              <span class="template-meta">Standard quarter system</span>
            </div>
          </button>
          <button @click="createSemestersTemplate" class="template-card" :disabled="gradingPeriods.length > 0">
            <div class="template-icon semesters">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div class="template-content">
              <h3>2 Semesters</h3>
              <p>Aug-Dec, Jan-Jun</p>
              <span class="template-meta">Standard semester system</span>
            </div>
          </button>
        </div>
        <div v-if="gradingPeriods.length > 0" class="template-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Templates only work on empty school years. Delete existing periods first.
        </div>
      </section>

      <!-- Create New Grading Period Form -->
      <section class="create-form-section">
        <div class="section-header">
          <div class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <h2>Create New Grading Period</h2>
          </div>
          <button @click="toggleCreateForm" class="toggle-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline :points="showCreateForm ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
            </svg>
            {{ showCreateForm ? 'Hide Form' : 'Show Form' }}
          </button>
        </div>
        
        <div v-if="showCreateForm" class="create-form">
          <div class="form-grid">
            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Period Name *
              </label>
              <input 
                v-model="newPeriod.period_name" 
                type="text" 
                placeholder="e.g., 1st Quarter, 1st Semester"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="10" y1="14" x2="21" y2="3"/>
                  <path d="M18 8L22 4 20 2 16 6"/>
                  <path d="M2 22l1-1"/>
                  <path d="M5 18L9 14"/>
                </svg>
                Period Number *
              </label>
              <input 
                v-model.number="newPeriod.period_number" 
                type="number" 
                min="1" 
                max="4"
                placeholder="1-4"
                class="form-input"
              />
              <small class="help-text">Enter a number between 1 and 4</small>
            </div>
            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Start Date *
              </label>
              <input 
                v-model="newPeriod.start_date" 
                type="date" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                End Date *
              </label>
              <input 
                v-model="newPeriod.end_date" 
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          <div class="form-actions">
            <button @click="createGradingPeriod" class="btn-primary" :disabled="!isFormValid">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Create Grading Period
            </button>
            <button @click="resetForm" class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"/>
                <polyline points="23 20 23 14 17 14"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Clear Form
            </button>
          </div>
        </div>
      </section>

      <!-- Grading Periods List -->
      <section class="grading-periods-list">
        <div class="section-header">
          <div class="section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <h2>Grading Periods for {{ selectedSchoolYear?.year_name }}</h2>
          </div>
          <span class="count-badge">{{ gradingPeriods.length }} period{{ gradingPeriods.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="table-container">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading grading periods...</p>
          </div>
          <div v-else-if="gradingPeriods.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h4>No Grading Periods Found</h4>
            <p>Create one above or use quick templates to get started</p>
          </div>
          <div v-else class="periods-grid">
            <div 
              v-for="period in gradingPeriods" 
              :key="period.id" 
              class="period-card"
              :class="{ 'active-period': period.is_active }"
            >
              <div class="period-header">
                <div class="period-title-section">
                  <h3>{{ period.period_name }}</h3>
                  <span class="period-number">Period {{ period.period_number }}</span>
                </div>
                <span :class="'status-badge ' + period.status">
                  <svg v-if="period.status === 'active'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else-if="period.status === 'completed'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ period.status.toUpperCase() }}
                </span>
              </div>
              
              <div class="period-dates-section">
                <div class="date-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <span>{{ formatDate(period.start_date) }}</span>
                </div>
                <div class="date-separator">→</div>
                <div class="date-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{ formatDate(period.end_date) }}</span>
                </div>
              </div>
              
              <div v-if="period.is_active" class="active-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Currently Active Period
              </div>
              
              <div class="period-actions">
                <button 
                  v-if="!period.is_active && period.status !== 'completed'"
                  @click="confirmActivate(period)" 
                  class="action-btn activate" 
                  title="Activate this period"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Activate
                </button>
                <button @click="editPeriod(period)" class="action-btn edit" title="Edit period">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button 
                  v-if="period.status === 'active'"
                  @click="confirmClose(period)" 
                  class="action-btn close" 
                  title="Close and complete period"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Close
                </button>
                <button @click="viewGrades(period)" class="action-btn view" title="View grades">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Grades
                </button>
                <button @click="confirmDelete(period)" class="action-btn delete" title="Delete period">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="empty-state-main">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <h3>Select a School Year</h3>
      <p>Choose a school year from the dropdown above to manage grading periods</p>
    </div>

    <!-- Activate Grading Period Confirmation Modal -->
    <div v-if="showActivateModal" class="modal-overlay" @click.self="showActivateModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Activate Grading Period</h2>
          <button @click="showActivateModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p class="modal-message">You are about to activate <strong>{{ selectedPeriod?.period_name }}</strong></p>
          <div class="warning-box">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Important Information:
            </h4>
            <ul>
              <li>This will <strong>deactivate</strong> the current grading period ({{ activePeriod?.period_name }})</li>
              <li>Teachers will now enter grades for <strong>{{ selectedPeriod?.period_name }}</strong></li>
              <li>All grade entry will be for this period</li>
            </ul>
          </div>
          <p class="confirm-text">Are you sure you want to continue?</p>
          <div class="modal-actions">
            <button @click="activateGradingPeriod" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Yes, Activate {{ selectedPeriod?.period_name }}
            </button>
            <button @click="showActivateModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Close Grading Period Confirmation Modal -->
    <div v-if="showCloseModal" class="modal-overlay" @click.self="showCloseModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Close Grading Period</h2>
          <button @click="showCloseModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon warning">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p class="modal-message">Close and complete <strong>{{ selectedPeriod?.period_name }}</strong>?</p>
          <p class="warn-text">This will mark it as completed and lock all grades for this period.</p>
          <div class="modal-actions">
            <button @click="closeGradingPeriod" class="btn-warn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Close Period
            </button>
            <button @click="showCloseModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Grading Period Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Grading Period</h2>
          <button @click="showEditModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="editForm">
          <div class="form-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Period Name
            </label>
            <input v-model="editForm.period_name" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="10" y1="14" x2="21" y2="3"/>
                <path d="M18 8L22 4 20 2 16 6"/>
                <path d="M2 22l1-1"/>
                <path d="M5 18L9 14"/>
              </svg>
              Period Number
            </label>
            <input v-model.number="editForm.period_number" type="number" min="1" max="4" class="form-input" />
          </div>
          <div class="form-group">
            <label>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              End Date
            </label>
            <input v-model="editForm.end_date" type="date" class="form-input" />
          </div>
          <div class="modal-actions">
            <button @click="saveGradingPeriod" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </button>
            <button @click="showEditModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Delete Grading Period</h2>
          <button @click="showDeleteModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon danger">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>
          <p class="modal-message">Delete <strong>{{ selectedPeriod?.period_name }}</strong>?</p>
          <p class="warn-text">This action cannot be undone. All associated data will be permanently removed.</p>
          <div class="modal-actions">
            <button @click="deleteGradingPeriod" class="btn-warn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Delete
            </button>
            <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Grades Info Modal -->
    <div v-if="showGradesModal" class="modal-overlay" @click.self="showGradesModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Grades for {{ selectedPeriod?.period_name }}</h2>
          <button @click="showGradesModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon info">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <p class="modal-message">This would show all grades entered for <strong>{{ selectedPeriod?.period_name }}</strong></p>
          <div class="info-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>Navigate to Gradebook or implement a detailed grades view here to see all student grades for this grading period.</p>
          </div>
          <div class="modal-actions">
            <button @click="showGradesModal = false" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'GradingPeriodManagement',
  data() {
    return {
      schoolYears: [],
      selectedSchoolYearId: '',
      selectedSchoolYear: null,
      gradingPeriods: [],
      activePeriod: null,
      loading: false,
      showCreateForm: false,
      showActivateModal: false,
      showCloseModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showGradesModal: false,
      selectedPeriod: null,
      editForm: null,
      newPeriod: {
        period_name: '',
        period_number: null,
        start_date: '',
        end_date: ''
      }
    }
  },
  computed: {
    isFormValid() {
      return this.newPeriod.period_name.trim() !== '' &&
             this.newPeriod.period_number >= 1 &&
             this.newPeriod.period_number <= 4 &&
             this.newPeriod.start_date !== '' &&
             this.newPeriod.end_date !== '' &&
             new Date(this.newPeriod.end_date) > new Date(this.newPeriod.start_date)
    }
  },
  mounted() {
    this.fetchSchoolYears()
  },
  methods: {
    async fetchSchoolYears() {
      const { data, error } = await supabase
        .from('school_years')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching school years:', error)
        return
      }

      this.schoolYears = data
      
      // Auto-select active school year if exists
      const activeYear = data.find(y => y.is_active)
      if (activeYear) {
        this.selectedSchoolYearId = activeYear.id
        this.onSchoolYearChange()
      }
    },

    onSchoolYearChange() {
      this.selectedSchoolYear = this.schoolYears.find(y => y.id === this.selectedSchoolYearId)
      if (this.selectedSchoolYearId) {
        this.fetchGradingPeriods()
      }
    },

    async fetchGradingPeriods() {
      this.loading = true
      const { data, error } = await supabase
        .from('grading_periods')
        .select('*')
        .eq('school_year_id', this.selectedSchoolYearId)
        .order('period_number', { ascending: true })

      if (error) {
        console.error('Error fetching grading periods:', error)
        this.loading = false
        return
      }

      this.gradingPeriods = data
      this.activePeriod = data.find(p => p.is_active)
      this.loading = false
    },

    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm
    },

    async createGradingPeriod() {
      if (!this.isFormValid) {
        alert('Please fill all required fields correctly')
        return
      }

      const { error } = await supabase
        .from('grading_periods')
        .insert({
          school_year_id: this.selectedSchoolYearId,
          period_name: this.newPeriod.period_name.trim(),
          period_number: this.newPeriod.period_number,
          start_date: this.newPeriod.start_date,
          end_date: this.newPeriod.end_date,
          is_active: false,
          status: 'upcoming'
        })

      if (error) {
        console.error('Error creating grading period:', error)
        if (error.code === '23505') {
          alert('A grading period with this number already exists for this school year')
        } else {
          alert('Failed to create grading period')
        }
        return
      }

      alert('Grading period created successfully!')
      this.resetForm()
      this.showCreateForm = false
      this.fetchGradingPeriods()
    },

    resetForm() {
      this.newPeriod = {
        period_name: '',
        period_number: null,
        start_date: '',
        end_date: ''
      }
    },

    confirmActivate(period) {
      this.selectedPeriod = period
      this.showActivateModal = true
    },

    async activateGradingPeriod() {
      // Use the database function to activate grading period
      const { error } = await supabase.rpc('activate_grading_period', {
        p_period_id: this.selectedPeriod.id
      })

      if (error) {
        console.error('Error activating grading period:', error)
        alert('Failed to activate grading period')
        return
      }

      alert(`${this.selectedPeriod.period_name} is now the active grading period!`)
      this.showActivateModal = false
      this.fetchGradingPeriods()
    },

    confirmClose(period) {
      this.selectedPeriod = period
      this.showCloseModal = true
    },

    async closeGradingPeriod() {
      const { error } = await supabase
        .from('grading_periods')
        .update({ 
          is_active: false,
          status: 'completed'
        })
        .eq('id', this.selectedPeriod.id)

      if (error) {
        console.error('Error closing grading period:', error)
        alert('Failed to close grading period')
        return
      }

      alert('Grading period closed successfully')
      this.showCloseModal = false
      this.fetchGradingPeriods()
    },

    editPeriod(period) {
      this.selectedPeriod = period
      this.editForm = { ...period }
      this.showEditModal = true
    },

    async saveGradingPeriod() {
      const { error } = await supabase
        .from('grading_periods')
        .update({
          period_name: this.editForm.period_name,
          period_number: this.editForm.period_number,
          start_date: this.editForm.start_date,
          end_date: this.editForm.end_date
        })
        .eq('id', this.editForm.id)

      if (error) {
        console.error('Error updating grading period:', error)
        alert('Failed to update grading period')
        return
      }

      alert('Grading period updated successfully')
      this.showEditModal = false
      this.fetchGradingPeriods()
    },

    confirmDelete(period) {
      this.selectedPeriod = period
      this.showDeleteModal = true
    },

    async deleteGradingPeriod() {
      const { error } = await supabase
        .from('grading_periods')
        .delete()
        .eq('id', this.selectedPeriod.id)

      if (error) {
        console.error('Error deleting grading period:', error)
        alert('Failed to delete grading period')
        return
      }

      alert('Grading period deleted successfully')
      this.showDeleteModal = false
      this.fetchGradingPeriods()
    },

    viewGrades(period) {
      this.selectedPeriod = period
      this.showGradesModal = true
    },

    async createQuartersTemplate() {
      if (!this.selectedSchoolYear) return

      const schoolYear = this.selectedSchoolYear
      const startYear = new Date(schoolYear.start_date).getFullYear()
      const endYear = new Date(schoolYear.end_date).getFullYear()

      const quarters = [
        {
          period_name: '1st Quarter',
          period_number: 1,
          start_date: `${startYear}-08-25`,
          end_date: `${startYear}-10-31`
        },
        {
          period_name: '2nd Quarter',
          period_number: 2,
          start_date: `${startYear}-11-03`,
          end_date: `${endYear}-01-30`
        },
        {
          period_name: '3rd Quarter',
          period_number: 3,
          start_date: `${endYear}-02-02`,
          end_date: `${endYear}-04-03`
        },
        {
          period_name: '4th Quarter',
          period_number: 4,
          start_date: `${endYear}-04-06`,
          end_date: `${endYear}-06-05`
        }
      ]

      const periods = quarters.map(q => ({
        ...q,
        school_year_id: this.selectedSchoolYearId,
        is_active: false,
        status: 'upcoming'
      }))

      const { error } = await supabase.from('grading_periods').insert(periods)

      if (error) {
        console.error('Error creating quarters:', error)
        alert('Failed to create quarters template')
        return
      }

      alert('4 Quarters created successfully!')
      this.fetchGradingPeriods()
    },

    async createSemestersTemplate() {
      if (!this.selectedSchoolYear) return

      const schoolYear = this.selectedSchoolYear
      const startYear = new Date(schoolYear.start_date).getFullYear()
      const endYear = new Date(schoolYear.end_date).getFullYear()

      const semesters = [
        {
          period_name: '1st Semester',
          period_number: 1,
          start_date: `${startYear}-08-25`,
          end_date: `${startYear}-12-20`
        },
        {
          period_name: '2nd Semester',
          period_number: 2,
          start_date: `${endYear}-01-06`,
          end_date: `${endYear}-06-05`
        }
      ]

      const periods = semesters.map(s => ({
        ...s,
        school_year_id: this.selectedSchoolYearId,
        is_active: false,
        status: 'upcoming'
      }))

      const { error } = await supabase.from('grading_periods').insert(periods)

      if (error) {
        console.error('Error creating semesters:', error)
        alert('Failed to create semesters template')
        return
      }

      alert('2 Semesters created successfully!')
      this.fetchGradingPeriods()
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.grading-period-management {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-text h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #64748b;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Selector Card */
.selector-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.selector-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.selector-header svg {
  color: #3D8D7A;
}

.selector-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.selector-content {
  display: flex;
  gap: 1rem;
}

.select-input {
  flex: 1;
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.select-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

/* Active Period Banner */
.active-period-banner {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 8px 24px rgba(61, 141, 122, 0.3);
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

.period-name {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.period-dates {
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

/* Templates Section */
.templates-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.section-description {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.template-card:hover:not(:disabled) {
  border-color: #3D8D7A;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.05));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.template-card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.template-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.template-icon.quarters {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.template-icon.semesters {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.template-content {
  flex: 1;
}

.template-content h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.template-content p {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.template-meta {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.template-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #92400e;
}

.template-note svg {
  flex-shrink: 0;
  color: #d97706;
}

/* Create Form Section */
.create-form-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.toggle-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
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
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.form-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
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

/* Grading Periods List */
.grading-periods-list {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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

.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.period-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.period-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.period-card.active-period {
  border-color: #3D8D7A;
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.05));
}

.period-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.period-title-section h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.period-number {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
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

.period-dates-section {
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
}

.active-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.period-actions {
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

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #dc2626;
  color: white;
}

/* Empty State Main */
.empty-state-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  color: #94a3b8;
  gap: 1rem;
}

.empty-state-main svg {
  opacity: 0.5;
}

.empty-state-main h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
}

.empty-state-main p {
  font-size: 0.95rem;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 550px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
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

.modal-icon.info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1d4ed8;
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

.info-box {
  display: flex;
  gap: 1rem;
  background: #f0f9ff;
  border-left: 3px solid #0ea5e9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-box svg {
  flex-shrink: 0;
  color: #0ea5e9;
}

.info-box p {
  margin: 0;
  font-size: 0.85rem;
  color: #0c4a6e;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
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
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
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
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn-warn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .periods-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .grading-period-management {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .period-name {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }

  .period-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
