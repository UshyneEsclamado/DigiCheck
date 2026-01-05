<template>
  <div class="teacher-management">
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Teacher Management</h1>
          <p class="subtitle">View, search, edit, and manage all teachers</p>
        </div>
        <div class="header-actions">
          <button @click="navigateToAddTeacher" class="btn-add">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Teacher
          </button>
        </div>
      </div>
      <div class="header-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <section class="filters-bar">
      <div class="search-box">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            @input="handleSearch" 
            type="text" 
            placeholder="Search by name, username, email, or employee ID..."
            class="search-input"
          />
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <select v-model="filterSubject" @change="applyFilters" class="filter-select">
            <option value="">All Subject Specialties</option>
            <option v-for="subj in subjects" :key="subj.id" :value="subj.id">{{ subj.name }}</option>
          </select>
        </div>
        <div class="filter-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <select v-model="filterStatus" @change="applyFilters" class="filter-select">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button @click="clearFilters" class="btn-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
          Clear Filters
        </button>
      </div>
    </section>

    <!-- Data Table -->
    <section class="data-table-wrapper">
      <div class="table-header">
        <div class="table-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3>Teachers</h3>
          <span class="count-badge">{{ filteredTeachers.length }}</span>
        </div>
        <button @click="exportAllToCSV" class="btn-export">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export to CSV
        </button>
      </div>
      
      <div class="table-container">
        <table class="teachers-table">
          <thead>
            <tr>
              <th @click="sortBy('employee_id')" class="sortable">
                Employee ID
                <svg v-if="sortField === 'employee_id'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th @click="sortBy('last_name')" class="sortable">
                Name
                <svg v-if="sortField === 'last_name'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th @click="sortBy('username')" class="sortable">
                Username
                <svg v-if="sortField === 'username'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th>Email</th>
              <th>Subjects Teaching</th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <svg v-if="sortField === 'status'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="loading-cell">
                <div class="loading-state">
                  <div class="spinner"></div>
                  <p>Loading teachers...</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedTeachers.length === 0">
              <td colspan="7" class="empty-cell">
                <div class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p>No teachers found</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="teacher in paginatedTeachers" :key="teacher.id" class="teacher-row">
              <td class="id-col">{{ teacher.employee_id || '—' }}</td>
              <td class="name-col">{{ teacher.last_name }}, {{ teacher.first_name }} {{ teacher.middle_name || '' }}</td>
              <td class="username-col">{{ teacher.username || '—' }}</td>
              <td class="email-col">{{ teacher.email || '—' }}</td>
              <td class="subjects-col">
                <div class="subjects-list">
                  <span v-if="teacher.subjects_teaching.length === 0" class="muted">None assigned</span>
                  <div v-else class="subject-tags">
                    <span v-for="(subj, idx) in teacher.subjects_teaching.slice(0, 2)" :key="subj.id" class="subject-tag">
                      {{ subj.name }}
                    </span>
                    <span v-if="teacher.subjects_teaching.length > 2" class="more-tag">+{{ teacher.subjects_teaching.length - 2 }} more</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="'status-badge ' + teacher.status">
                  <svg v-if="teacher.status === 'active'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {{ teacher.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button @click="viewTeacherDetails(teacher)" class="action-btn view" title="View Details">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <button @click="editTeacher(teacher)" class="action-btn edit" title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="confirmDeactivate(teacher)" class="action-btn delete" title="Deactivate">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </button>
                <button @click="resetPassword(teacher)" class="action-btn password" title="Reset Password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </button>
                <button @click="assignSubjects(teacher)" class="action-btn subjects" title="Assign Subjects">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </button>
                <button @click="viewSections(teacher)" class="action-btn sections" title="View Sections">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Previous
        </button>
        <div class="page-info">
          <span class="page-text">Page {{ currentPage }} of {{ totalPages }}</span>
          <span class="total-text">{{ filteredTeachers.length }} total teachers</span>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- View Teacher Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Teacher Details</h2>
          <button @click="showDetailsModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedTeacher">
          <div class="teacher-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          
          <div class="details-grid">
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Employee ID
              </div>
              <div class="detail-value">{{ selectedTeacher.employee_id || '—' }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Full Name
              </div>
              <div class="detail-value">{{ selectedTeacher.first_name }} {{ selectedTeacher.middle_name }} {{ selectedTeacher.last_name }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Username
              </div>
              <div class="detail-value">{{ selectedTeacher.username || '—' }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Email
              </div>
              <div class="detail-value">{{ selectedTeacher.email || '—' }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Status
              </div>
              <div class="detail-value">
                <span :class="'status-badge ' + selectedTeacher.status">
                  {{ selectedTeacher.status }}
                </span>
              </div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Phone
              </div>
              <div class="detail-value">{{ selectedTeacher.phone_number || '—' }}</div>
            </div>
            
            <div class="detail-row full-width">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Address
              </div>
              <div class="detail-value">{{ selectedTeacher.address || '—' }}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Date of Birth
              </div>
              <div class="detail-value">{{ selectedTeacher.date_of_birth || '—' }}</div>
            </div>
            
            <div class="detail-row full-width">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Subjects Teaching
              </div>
              <div class="detail-value">
                <span v-if="selectedTeacher.subjects_teaching.length === 0" class="muted">None assigned</span>
                <div v-else class="subject-tags">
                  <span v-for="subj in selectedTeacher.subjects_teaching" :key="subj.id" class="subject-tag">
                    {{ subj.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Created
              </div>
              <div class="detail-value">{{ new Date(selectedTeacher.created_at).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Teacher Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Edit Teacher</h2>
          <button @click="showEditModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="editForm">
          <div class="form-grid">
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                First Name
              </label>
              <input v-model="editForm.first_name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Middle Name
              </label>
              <input v-model="editForm.middle_name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Last Name
              </label>
              <input v-model="editForm.last_name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Email
              </label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Employee ID
              </label>
              <input v-model="editForm.employee_id" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Phone Number
              </label>
              <input v-model="editForm.phone_number" type="text" class="form-input" />
            </div>
            <div class="form-group full-width">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Address
              </label>
              <textarea v-model="editForm.address" class="form-input"></textarea>
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Status
              </label>
              <select v-model="editForm.status" class="form-input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="saveTeacher" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Changes
            </button>
            <button @click="showEditModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Confirmation Modal -->
    <div v-if="showDeactivateModal" class="modal-overlay" @click.self="showDeactivateModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Confirm Deactivation</h2>
          <button @click="showDeactivateModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon danger">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <p class="modal-message">Are you sure you want to deactivate <strong>{{ selectedTeacher?.first_name }} {{ selectedTeacher?.last_name }}</strong>?</p>
          <p class="warn-text">This will remove their access to the system.</p>
          <div class="modal-actions">
            <button @click="deactivateTeacher" class="btn-warn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Deactivate
            </button>
            <button @click="showDeactivateModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click.self="showResetPasswordModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Reset Password</h2>
          <button @click="showResetPasswordModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="modal-icon info">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p v-if="!newPassword" class="modal-message">Generating new password for <strong>{{ selectedTeacher?.first_name }} {{ selectedTeacher?.last_name }}</strong>...</p>
          <div v-else>
            <p class="modal-message">New password generated successfully!</p>
            <div class="password-display">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {{ newPassword }}
            </div>
            <div class="info-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>Please share this password with the teacher securely.</p>
            </div>
          </div>
          <div class="modal-actions">
            <button v-if="newPassword" @click="copyPassword" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy Password
            </button>
            <button @click="showResetPasswordModal = false" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Subjects Modal -->
    <div v-if="showAssignSubjectsModal" class="modal-overlay" @click.self="showAssignSubjectsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assign Subjects</h2>
          <button @click="showAssignSubjectsModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedTeacher">
          <div class="modal-icon info">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <p class="modal-message">Assign subjects to <strong>{{ selectedTeacher.first_name }} {{ selectedTeacher.last_name }}</strong></p>
          <div class="subjects-checkboxes">
            <label v-for="subj in subjects" :key="subj.id" class="checkbox-label">
              <input 
                type="checkbox" 
                :value="subj.id" 
                v-model="assignedSubjectIds"
              />
              <span>{{ subj.name }}</span>
            </label>
          </div>
          <div class="modal-actions">
            <button @click="saveAssignedSubjects" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Assignments
            </button>
            <button @click="showAssignSubjectsModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Sections Modal -->
    <div v-if="showSectionsModal" class="modal-overlay" @click.self="showSectionsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Sections Handled</h2>
          <button @click="showSectionsModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedTeacher">
          <div class="modal-icon info">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p class="modal-message"><strong>{{ selectedTeacher.first_name }} {{ selectedTeacher.last_name }}</strong> handles the following sections:</p>
          <div v-if="teacherSections.length > 0" class="sections-list">
            <div v-for="section in teacherSections" :key="section.id" class="section-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <div class="section-details">
                <div class="section-name">{{ section.name }}</div>
                <div class="section-meta">{{ section.subject_name }} ({{ section.grade_level }})</div>
              </div>
            </div>
          </div>
          <p v-else class="empty-message">No sections assigned yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'TeacherManagement',
  data() {
    return {
      teachers: [],
      filteredTeachers: [],
      paginatedTeachers: [],
      subjects: [],
      searchQuery: '',
      filterSubject: '',
      filterStatus: '',
      sortField: 'last_name',
      sortOrder: 'asc',
      currentPage: 1,
      perPage: 20,
      loading: false,
      showDetailsModal: false,
      showEditModal: false,
      showDeactivateModal: false,
      showResetPasswordModal: false,
      showAssignSubjectsModal: false,
      showSectionsModal: false,
      selectedTeacher: null,
      editForm: null,
      newPassword: '',
      assignedSubjectIds: [],
      teacherSections: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredTeachers.length / this.perPage)
    }
  },
  mounted() {
    this.fetchAllTeachers()
    this.fetchSubjects()
  },
  methods: {
    async fetchAllTeachers() {
      this.loading = true
      // Join with profiles to get username and email, and subjects
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          profiles!teachers_profile_id_fkey(username, email)
        `)
        .order('last_name', { ascending: true })
      
      if (error) {
        console.error('Error fetching teachers:', error)
        this.loading = false
        return
      }

      // Fetch subjects for each teacher
      for (let teacher of data) {
        const { data: subjData } = await supabase
          .from('subjects')
          .select('id, name')
          .eq('teacher_id', teacher.id)
        
        teacher.subjects_teaching = subjData || []
      }

      this.teachers = data.map(t => ({
        ...t,
        username: t.profiles?.username || '',
        email: t.profiles?.email || '',
        status: t.status || 'active' // Default status if not in DB
      }))
      this.applyFilters()
      this.loading = false
    },

    async fetchSubjects() {
      const { data } = await supabase.from('subjects').select('id, name').order('name', { ascending: true })
      if (data) this.subjects = data
    },

    handleSearch() {
      this.applyFilters()
    },

    applyFilters() {
      let result = [...this.teachers]

      // Search filter
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        result = result.filter(t => 
          t.first_name?.toLowerCase().includes(q) ||
          t.last_name?.toLowerCase().includes(q) ||
          t.middle_name?.toLowerCase().includes(q) ||
          t.username?.toLowerCase().includes(q) ||
          t.email?.toLowerCase().includes(q) ||
          t.employee_id?.toLowerCase().includes(q)
        )
      }

      // Subject filter
      if (this.filterSubject) {
        result = result.filter(t => 
          t.subjects_teaching.some(s => s.id === this.filterSubject)
        )
      }

      // Status filter
      if (this.filterStatus) {
        result = result.filter(t => t.status === this.filterStatus)
      }

      this.filteredTeachers = result
      this.currentPage = 1
      this.paginate()
    },

    clearFilters() {
      this.searchQuery = ''
      this.filterSubject = ''
      this.filterStatus = ''
      this.applyFilters()
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
      this.filteredTeachers.sort((a, b) => {
        const aVal = a[field] || ''
        const bVal = b[field] || ''
        if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })
      this.paginate()
    },

    paginate() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      this.paginatedTeachers = this.filteredTeachers.slice(start, end)
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.paginate()
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.paginate()
      }
    },

    viewTeacherDetails(teacher) {
      this.selectedTeacher = teacher
      this.showDetailsModal = true
    },

    editTeacher(teacher) {
      this.selectedTeacher = teacher
      this.editForm = { ...teacher }
      this.showEditModal = true
    },

    async saveTeacher() {
      const { error } = await supabase
        .from('teachers')
        .update({
          first_name: this.editForm.first_name,
          middle_name: this.editForm.middle_name,
          last_name: this.editForm.last_name,
          email: this.editForm.email,
          employee_id: this.editForm.employee_id,
          phone_number: this.editForm.phone_number,
          address: this.editForm.address,
          status: this.editForm.status
        })
        .eq('id', this.editForm.id)

      if (error) {
        console.error('Error updating teacher:', error)
        alert('Failed to update teacher')
        return
      }

      alert('Teacher updated successfully')
      this.showEditModal = false
      this.fetchAllTeachers()
    },

    confirmDeactivate(teacher) {
      this.selectedTeacher = teacher
      this.showDeactivateModal = true
    },

    async deactivateTeacher() {
      const { error } = await supabase
        .from('teachers')
        .update({ status: 'inactive' })
        .eq('id', this.selectedTeacher.id)

      if (error) {
        console.error('Error deactivating teacher:', error)
        alert('Failed to deactivate teacher')
        return
      }

      alert('Teacher deactivated successfully')
      this.showDeactivateModal = false
      this.fetchAllTeachers()
    },

    async resetPassword(teacher) {
      this.selectedTeacher = teacher
      this.newPassword = ''
      this.showResetPasswordModal = true

      // Generate random password
      const generatedPassword = this.generatePassword()
      this.newPassword = generatedPassword

      // In a real implementation, update via Supabase Admin API
      // const { error } = await supabase.auth.admin.updateUserById(teacher.auth_user_id, { password: generatedPassword })
    },

    generatePassword(length = 12) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },

    copyPassword() {
      navigator.clipboard.writeText(this.newPassword)
      alert('Password copied to clipboard')
    },

    assignSubjects(teacher) {
      this.selectedTeacher = teacher
      this.assignedSubjectIds = teacher.subjects_teaching.map(s => s.id)
      this.showAssignSubjectsModal = true
    },

    async saveAssignedSubjects() {
      // First, unassign all current subjects
      const { error: unassignError } = await supabase
        .from('subjects')
        .update({ teacher_id: null })
        .eq('teacher_id', this.selectedTeacher.id)

      if (unassignError) {
        console.error('Error unassigning subjects:', unassignError)
      }

      // Then assign selected subjects
      if (this.assignedSubjectIds.length > 0) {
        const { error: assignError } = await supabase
          .from('subjects')
          .update({ teacher_id: this.selectedTeacher.id })
          .in('id', this.assignedSubjectIds)

        if (assignError) {
          console.error('Error assigning subjects:', assignError)
          alert('Failed to assign subjects')
          return
        }
      }

      alert('Subjects assigned successfully')
      this.showAssignSubjectsModal = false
      this.fetchAllTeachers()
    },

    async viewSections(teacher) {
      this.selectedTeacher = teacher
      
      // Fetch sections where this teacher is assigned
      const { data, error } = await supabase
        .from('sections')
        .select(`
          id,
          name,
          grade_level,
          subjects(name)
        `)
        .eq('teacher_id', teacher.id)

      if (error) {
        console.error('Error fetching sections:', error)
      }

      this.teacherSections = data ? data.map(s => ({
        ...s,
        subject_name: s.subjects?.name || '—'
      })) : []
      
      this.showSectionsModal = true
    },

    navigateToAddTeacher() {
      this.$router.push('/admin/user-account-creation?role=teacher')
    },

    exportAllToCSV() {
      const headers = ['Employee ID', 'First Name', 'Middle Name', 'Last Name', 'Username', 'Email', 'Status', 'Subjects Teaching']
      const rows = this.filteredTeachers.map(t => [
        t.employee_id || '',
        t.first_name || '',
        t.middle_name || '',
        t.last_name || '',
        t.username || '',
        t.email || '',
        t.status || '',
        t.subjects_teaching.map(s => s.name).join('; ')
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(field => `"${field}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'all_teachers.csv'
      a.click()
      window.URL.revokeObjectURL(url)
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

.teacher-management {
  min-height: 100vh;
  height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1.5rem 2rem;
  position: relative;
  overflow-y: auto;
}

/* Custom Scrollbar */
.teacher-management::-webkit-scrollbar {
  width: 12px;
}

.teacher-management::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.teacher-management::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.teacher-management::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Page Header */
.page-header {
  margin-bottom: 1.5rem;
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content::before {
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

.header-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
              0 4px 12px rgba(0, 0, 0, 0.08);
}

.header-text h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.35rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-add::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-add:hover::before {
  left: 100%;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.header-icon {
  width: 48px;
  height: 48px;
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

/* Filters Bar */
.filters-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper svg {
  position: absolute;
  left: 1rem;
  color: #3D8D7A;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1),
              0 2px 8px rgba(61, 141, 122, 0.15);
  transform: translateY(-1px);
}

.filter-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-item:hover {
  border-color: #3D8D7A;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.filter-item svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-clear:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-color: #cbd5e1;
  color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Data Table Wrapper */
.data-table-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(241, 245, 249, 0.8);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-title svg {
  color: #3D8D7A;
}

.table-title h3 {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.3px;
}

.count-badge {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.25);
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.btn-export::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-export:hover::before {
  left: 100%;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Table Container */
.table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  max-height: calc(100vh - 450px);
  overflow-y: auto;
}

/* Custom Scrollbar for Table */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.teachers-table {
  width: 100%;
  border-collapse: collapse;
}

.teachers-table thead {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.08), rgba(45, 106, 90, 0.08));
  position: sticky;
  top: 0;
  z-index: 10;
}

.teachers-table th {
  padding: 0.875rem 0.75rem;
  text-align: left;
  font-weight: 800;
  font-size: 0.75rem;
  color: #3D8D7A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(61, 141, 122, 0.2);
  white-space: nowrap;
}

.teachers-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.teachers-table th.sortable:hover {
  background: rgba(61, 141, 122, 0.15);
  color: #2d6a5a;
}

.teachers-table th.sortable svg {
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.25rem;
}

.teachers-table td {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.8rem;
  color: #475569;
}

.teacher-row {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
}

.teacher-row:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.03), rgba(45, 106, 90, 0.03));
  border-left-color: #3D8D7A;
  transform: translateX(2px);
}

.id-col {
  font-family: 'Monaco', 'Courier New', monospace;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
}

.name-col {
  font-weight: 700;
  color: #1e293b;
}

.username-col {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

.email-col {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
}

.subjects-col {
  max-width: 250px;
}

.subject-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.subject-tag {
  display: inline-block;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
}

.more-tag {
  display: inline-block;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #64748b;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(100, 116, 139, 0.1);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.status-badge.active {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: 2px solid rgba(6, 95, 70, 0.2);
}

.status-badge.inactive {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  color: #991b1b;
  border: 2px solid rgba(153, 27, 27, 0.2);
}

.actions-cell {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.view {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #0369a1;
}

.action-btn.view:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

.action-btn.edit {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: #475569;
}

.action-btn.edit:hover {
  background: linear-gradient(135deg, #475569, #334155);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3);
}

.action-btn.delete {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  color: #dc2626;
}

.action-btn.delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.action-btn.password {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
}

.action-btn.password:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.action-btn.subjects {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #16a34a;
}

.action-btn.subjects:hover {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.action-btn.sections {
  background: linear-gradient(135deg, #e9d5ff, #d8b4fe);
  color: #7c3aed;
}

.action-btn.sections:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}

.loading-cell, .empty-cell {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #94a3b8;
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

.loading-state p, .empty-state p {
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
}

.muted {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(241, 245, 249, 0.8);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.page-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.total-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
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
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25),
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

.modal-content.large {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 2px solid rgba(61, 141, 122, 0.15);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(61, 141, 122, 0.1), transparent);
  animation: shimmer 3s linear infinite;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.close-btn {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border: 2px solid rgba(61, 141, 122, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.close-btn:hover {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-color: #3D8D7A;
  color: white;
  transform: rotate(90deg) scale(1.05);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.modal-body {
  padding: 2.5rem;
}

.modal-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.modal-icon.info {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1d4ed8;
}

.modal-icon.danger {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  color: #dc2626;
}

.modal-message {
  font-size: 1rem;
  color: #475569;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.6;
}

.teacher-avatar {
  width: 96px;
  height: 96px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.9));
  border-radius: 12px;
  align-items: center;
  border: 1px solid rgba(61, 141, 122, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-row:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
  border-color: rgba(61, 141, 122, 0.2);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
}

.detail-row.full-width {
  grid-template-columns: 1fr;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-label svg {
  color: #3D8D7A;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.detail-value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group label svg {
  color: #3D8D7A;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: #3D8D7A;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.15);
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.95));
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.password-display {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 2px solid #3D8D7A;
  padding: 1.5rem;
  border-radius: 16px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 1.25rem;
  text-align: center;
  margin: 1.5rem 0;
  color: #1e293b;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.2);
}

.password-display svg {
  color: #3D8D7A;
  width: 24px;
  height: 24px;
}

.warn-text {
  color: #dc2626;
  font-size: 0.9rem;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 4px solid #dc2626;
  margin-bottom: 1.5rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
}

.info-box {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border-left: 4px solid #0ea5e9;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
}

.info-box svg {
  flex-shrink: 0;
  color: #0ea5e9;
  width: 20px;
  height: 20px;
}

.info-box p {
  margin: 0;
  font-size: 0.9rem;
  color: #0c4a6e;
  line-height: 1.6;
  font-weight: 500;
}

.subjects-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 320px;
  overflow-y: auto;
  padding: 1.25rem;
  border: 2px solid rgba(61, 141, 122, 0.15);
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  margin-bottom: 1.5rem;
}

.subjects-checkboxes::-webkit-scrollbar {
  width: 8px;
}

.subjects-checkboxes::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.subjects-checkboxes::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
}

.subjects-checkboxes::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1f4a3d);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  border: 1px solid transparent;
}

.checkbox-label:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
  border-color: rgba(61, 141, 122, 0.2);
  transform: translateX(4px);
}

.checkbox-label input {
  cursor: pointer;
  width: 20px;
  height: 20px;
  accent-color: #3D8D7A;
}

.checkbox-label span {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.section-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.9));
  border-radius: 12px;
  border: 1px solid rgba(61, 141, 122, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-item:hover {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
  border-color: rgba(61, 141, 122, 0.25);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.1);
}

.section-item svg {
  color: #3D8D7A;
  flex-shrink: 0;
  margin-top: 0.2rem;
  width: 20px;
  height: 20px;
}

.section-details {
  flex: 1;
}

.section-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.section-meta {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.empty-message {
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 3rem 1rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

/* Button Styles */
.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: 2px solid transparent;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.3);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #1e293b;
}

.btn-warn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: 2px solid transparent;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-warn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.btn-warn:hover::before {
  left: 100%;
}

.btn-warn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .teacher-management {
    padding: 1.25rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .detail-row {
    grid-template-columns: 140px 1fr;
  }
}

@media (max-width: 1024px) {
  .table-container {
    overflow-x: scroll;
  }
  
  .filters-bar {
    grid-template-columns: 1fr;
  }
  
  .search-container,
  .filter-group {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .teacher-management {
    padding: 1rem;
  }

  .page-header {
    padding: 1.25rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .page-header svg {
    width: 36px;
    height: 36px;
  }

  .btn-add {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }

  .filter-group {
    flex-direction: column;
    width: 100%;
  }

  .filter-item {
    width: 100%;
  }

  .btn-clear {
    width: 100%;
    justify-content: center;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-export {
    width: 100%;
    justify-content: center;
  }

  .teachers-table th,
  .teachers-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }

  .actions-cell {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-btn {
    width: 100%;
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .detail-label {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(61, 141, 122, 0.15);
  }
  
  .modal-content {
    max-width: 95%;
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-warn,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .teacher-management {
    padding: 0.75rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 1.25rem;
  }
  
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .teacher-avatar {
    width: 72px;
    height: 72px;
    font-size: 2rem;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
  }
}
</style>
