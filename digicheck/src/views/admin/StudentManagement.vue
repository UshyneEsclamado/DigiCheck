<template>
  <div class="student-management">
    <!-- Top Navigation with Back Button -->
    <div class="top-navigation">
      <button @click="goBackToDashboard" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Dashboard</span>
      </button>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>Student Management</h1>
          <p class="subtitle">View, search, edit, and manage all students</p>
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
            placeholder="Search by name, username, email, or student ID..."
            class="search-input"
          />
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
          <select v-model="filterGrade" @change="applyFilters" class="filter-select">
            <option value="">All Grade Levels</option>
            <option v-for="g in [7,8,9,10,11,12]" :key="g" :value="g">Grade {{ g }}</option>
          </select>
        </div>
        <div class="filter-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <select v-model="filterStatus" @change="applyFilters" class="filter-select">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>
        <div class="filter-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <select v-model="filterSchoolYear" @change="applyFilters" class="filter-select">
            <option value="">All School Years</option>
            <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">{{ sy.year_name }}</option>
          </select>
        </div>
        <button @click="clearFilters" class="btn-clear">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          Clear Filters
        </button>
      </div>
    </section>

    <!-- Bulk Actions -->
    <section class="bulk-actions" v-if="selectedStudents.length > 0">
      <div class="selection-info">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ selectedStudents.length }} student{{ selectedStudents.length > 1 ? 's' : '' }} selected</span>
      </div>
      <div class="bulk-buttons">
        <button @click="bulkUnenroll" class="btn-bulk warn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Bulk Unenroll
        </button>
        <button @click="exportSelected" class="btn-bulk">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Selected
        </button>
        <button @click="clearSelection" class="btn-bulk">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Clear Selection
        </button>
      </div>
    </section>

    <!-- Data Table -->
    <section class="data-table-wrapper">
      <div class="table-header">
        <div class="table-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <h3>Student Records</h3>
          <span class="count-badge">{{ filteredStudents.length }} total</span>
        </div>
        <button @click="exportAllToCSV" class="btn-export">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export All to CSV
        </button>
      </div>
      
      <div class="table-container">
        <table class="students-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
              </th>
              <th @click="sortBy('student_id')" class="sortable">
                Student ID
                <svg v-if="sortField === 'student_id'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
              <th @click="sortBy('grade_level')" class="sortable">
                Grade
                <svg v-if="sortField === 'grade_level'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th @click="sortBy('enrollment_status')" class="sortable">
                Status
                <svg v-if="sortField === 'enrollment_status'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="sortOrder === 'asc' ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="loading-cell">
                <div class="loading-state">
                  <div class="spinner"></div>
                  <p>Loading students...</p>
                </div>
              </td>
            </tr>
            <tr v-else-if="paginatedStudents.length === 0">
              <td colspan="8" class="empty-cell">
                <div class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <p>No students found</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="student in paginatedStudents" :key="student.id" class="student-row">
              <td class="checkbox-col">
                <input type="checkbox" :value="student.id" v-model="selectedStudents" />
              </td>
              <td class="id-col">{{ student.student_id || '—' }}</td>
              <td class="name-col">{{ student.last_name }}, {{ student.first_name }} {{ student.middle_name || '' }}</td>
              <td>{{ student.username || '—' }}</td>
              <td class="email-col">{{ student.email || '—' }}</td>
              <td class="grade-col">
                <span class="grade-badge">Grade {{ student.grade_level }}</span>
              </td>
              <td>
                <span :class="'status-badge ' + student.enrollment_status">
                  <svg v-if="student.enrollment_status === 'active'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else-if="student.enrollment_status === 'inactive'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <svg v-else-if="student.enrollment_status === 'graduated'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  {{ student.enrollment_status }}
                </span>
              </td>
              <td class="actions-cell">
                <button @click="viewStudentDetails(student)" class="action-btn view" title="View Details">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
                <button @click="editStudent(student)" class="action-btn edit" title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="confirmUnenroll(student)" class="action-btn delete" title="Unenroll">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                </button>
                <button @click="resetPassword(student)" class="action-btn password" title="Reset Password">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </button>
                <button @click="viewGrades(student)" class="action-btn grades" title="View Grades">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="20" x2="12" y2="10"/>
                    <line x1="18" y1="20" x2="18" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="16"/>
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
          <span class="total-text">{{ filteredStudents.length }} total students</span>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- View Student Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Student Details</h2>
          <button @click="showDetailsModal = false" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body" v-if="selectedStudent">
          <div class="student-avatar">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="details-grid">
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Student ID
              </div>
              <div class="detail-value">{{ selectedStudent.student_id }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Full Name
              </div>
              <div class="detail-value">{{ selectedStudent.first_name }} {{ selectedStudent.middle_name }} {{ selectedStudent.last_name }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Username
              </div>
              <div class="detail-value">{{ selectedStudent.username }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </div>
              <div class="detail-value">{{ selectedStudent.email }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                Grade Level
              </div>
              <div class="detail-value">Grade {{ selectedStudent.grade_level }}</div>
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
                <span :class="'status-badge ' + selectedStudent.enrollment_status">{{ selectedStudent.enrollment_status }}</span>
              </div>
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
              <div class="detail-value">{{ selectedStudent.date_of_birth || '—' }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Contact Number
              </div>
              <div class="detail-value">{{ selectedStudent.contact_number || '—' }}</div>
            </div>
            <div class="detail-row full-width">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Address
              </div>
              <div class="detail-value">{{ selectedStudent.address || '—' }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Guardian Name
              </div>
              <div class="detail-value">{{ selectedStudent.guardian_name || '—' }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Guardian Contact
              </div>
              <div class="detail-value">{{ selectedStudent.guardian_contact || '—' }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                School Year Enrolled
              </div>
              <div class="detail-value">{{ getSchoolYearName(selectedStudent.school_year_enrolled) }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Created
              </div>
              <div class="detail-value">{{ new Date(selectedStudent.created_at).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Student Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Edit Student</h2>
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                Grade Level
              </label>
              <select v-model.number="editForm.grade_level" class="form-input">
                <option v-for="g in [7,8,9,10,11,12]" :key="g" :value="g">Grade {{ g }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Status
              </label>
              <select v-model="editForm.enrollment_status" class="form-input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
            <div class="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Contact Number
              </label>
              <input v-model="editForm.contact_number" type="text" class="form-input" />
            </div>
            <div class="form-group full-width">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Address
              </label>
              <textarea v-model="editForm.address" class="form-input" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="saveStudent" class="btn-primary">
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

    <!-- Unenroll Confirmation Modal -->
    <div v-if="showUnenrollModal" class="modal-overlay" @click.self="showUnenrollModal = false">
      <div class="modal-content small">
        <div class="modal-header">
          <h2>Confirm Unenroll</h2>
          <button @click="showUnenrollModal = false" class="close-btn">
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
          <p class="modal-message">Are you sure you want to unenroll <strong>{{ selectedStudent?.first_name }} {{ selectedStudent?.last_name }}</strong>?</p>
          <p class="warn-text">This will set their status to inactive.</p>
          <div class="modal-actions">
            <button @click="unenrollStudent" class="btn-warn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Unenroll Student
            </button>
            <button @click="showUnenrollModal = false" class="btn-secondary">
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
          <div class="modal-icon info" v-if="newPassword">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <p v-if="!newPassword" class="modal-message">Generating new password for <strong>{{ selectedStudent?.first_name }} {{ selectedStudent?.last_name }}</strong>...</p>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>Please share this password with the student securely. They should change it after first login.</p>
            </div>
          </div>
          <div class="modal-actions">
            <button v-if="newPassword" @click="copyPassword" class="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy Password
            </button>
            <button @click="showResetPasswordModal = false" class="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'StudentManagement',
  data() {
    return {
      students: [],
      filteredStudents: [],
      paginatedStudents: [],
      schoolYears: [],
      searchQuery: '',
      filterGrade: '',
      filterStatus: '',
      filterSchoolYear: '',
      sortField: 'last_name',
      sortOrder: 'asc',
      currentPage: 1,
      perPage: 20,
      loading: false,
      selectedStudents: [],
      showDetailsModal: false,
      showEditModal: false,
      showUnenrollModal: false,
      showResetPasswordModal: false,
      selectedStudent: null,
      editForm: null,
      newPassword: ''
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.perPage)
    },
    allSelected() {
      return this.paginatedStudents.length > 0 && this.selectedStudents.length === this.paginatedStudents.length
    }
  },
  mounted() {
    this.fetchAllStudents()
    this.fetchSchoolYears()
  },
  methods: {
    async fetchAllStudents() {
      this.loading = true
      // Join with profiles to get username and email
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_profile_id_fkey(username, email)
        `)
        .order('last_name', { ascending: true })
      
      if (error) {
        console.error('Error fetching students:', error)
        this.loading = false
        return
      }

      this.students = data.map(s => ({
        ...s,
        username: s.profiles?.username || '',
        email: s.profiles?.email || ''
      }))
      this.applyFilters()
      this.loading = false
    },

    async fetchSchoolYears() {
      const { data } = await supabase.from('school_years').select('id, year_name').order('year_name', { ascending: false })
      if (data) this.schoolYears = data
    },

    handleSearch() {
      this.applyFilters()
    },

    applyFilters() {
      let result = [...this.students]

      // Search filter
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        result = result.filter(s => 
          s.first_name?.toLowerCase().includes(q) ||
          s.last_name?.toLowerCase().includes(q) ||
          s.middle_name?.toLowerCase().includes(q) ||
          s.username?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.student_id?.toLowerCase().includes(q)
        )
      }

      // Grade filter
      if (this.filterGrade) {
        result = result.filter(s => s.grade_level === parseInt(this.filterGrade))
      }

      // Status filter
      if (this.filterStatus) {
        result = result.filter(s => s.enrollment_status === this.filterStatus)
      }

      // School year filter
      if (this.filterSchoolYear) {
        result = result.filter(s => s.school_year_enrolled === this.filterSchoolYear)
      }

      this.filteredStudents = result
      this.currentPage = 1
      this.paginate()
    },

    clearFilters() {
      this.searchQuery = ''
      this.filterGrade = ''
      this.filterStatus = ''
      this.filterSchoolYear = ''
      this.applyFilters()
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'asc'
      }
      this.filteredStudents.sort((a, b) => {
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
      this.paginatedStudents = this.filteredStudents.slice(start, end)
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

    toggleSelectAll(e) {
      if (e.target.checked) {
        this.selectedStudents = this.paginatedStudents.map(s => s.id)
      } else {
        this.selectedStudents = []
      }
    },

    clearSelection() {
      this.selectedStudents = []
    },

    viewStudentDetails(student) {
      this.selectedStudent = student
      this.showDetailsModal = true
    },

    editStudent(student) {
      this.selectedStudent = student
      this.editForm = { ...student }
      this.showEditModal = true
    },

    async saveStudent() {
      const { error } = await supabase
        .from('students')
        .update({
          first_name: this.editForm.first_name,
          middle_name: this.editForm.middle_name,
          last_name: this.editForm.last_name,
          email: this.editForm.email,
          grade_level: this.editForm.grade_level,
          enrollment_status: this.editForm.enrollment_status,
          contact_number: this.editForm.contact_number,
          address: this.editForm.address
        })
        .eq('id', this.editForm.id)

      if (error) {
        console.error('Error updating student:', error)
        alert('Failed to update student')
        return
      }

      alert('Student updated successfully')
      this.showEditModal = false
      this.fetchAllStudents()
    },

    confirmUnenroll(student) {
      this.selectedStudent = student
      this.showUnenrollModal = true
    },

    async unenrollStudent() {
      const { error } = await supabase
        .from('students')
        .update({ enrollment_status: 'inactive' })
        .eq('id', this.selectedStudent.id)

      if (error) {
        console.error('Error unenrolling student:', error)
        alert('Failed to unenroll student')
        return
      }

      alert('Student unenrolled successfully')
      this.showUnenrollModal = false
      this.fetchAllStudents()
    },

    async bulkUnenroll() {
      if (!confirm(`Unenroll ${this.selectedStudents.length} students?`)) return

      const { error } = await supabase
        .from('students')
        .update({ enrollment_status: 'inactive' })
        .in('id', this.selectedStudents)

      if (error) {
        console.error('Error bulk unenrolling:', error)
        alert('Failed to unenroll students')
        return
      }

      alert('Students unenrolled successfully')
      this.selectedStudents = []
      this.fetchAllStudents()
    },

    async resetPassword(student) {
      this.selectedStudent = student
      this.newPassword = ''
      this.showResetPasswordModal = true

      // Generate random password
      const generatedPassword = this.generatePassword()
      this.newPassword = generatedPassword

      // In a real implementation, you'd update the auth user password via Supabase Admin API
      // For now, we just display the password
      // const { error } = await supabase.auth.admin.updateUserById(student.auth_user_id, { password: generatedPassword })
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

    viewGrades(student) {
      // Navigate to grades view or open grades modal
      this.$router.push(`/admin/student-grades/${student.id}`)
    },

    exportSelected() {
      const selected = this.students.filter(s => this.selectedStudents.includes(s.id))
      this.exportToCSV(selected, 'selected_students.csv')
    },

    exportAllToCSV() {
      this.exportToCSV(this.filteredStudents, 'all_students.csv')
    },

    exportToCSV(data, filename) {
      const headers = ['Student ID', 'First Name', 'Middle Name', 'Last Name', 'Username', 'Email', 'Grade Level', 'Status']
      const rows = data.map(s => [
        s.student_id || '',
        s.first_name || '',
        s.middle_name || '',
        s.last_name || '',
        s.username || '',
        s.email || '',
        s.grade_level || '',
        s.enrollment_status || ''
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(field => `"${field}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    },

    getSchoolYearName(id) {
      const sy = this.schoolYears.find(y => y.id === id)
      return sy ? sy.year_name : '—'
    },

    goBackToDashboard() {
      this.$router.push('/admin/dashboard')
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

.student-management {
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1.5rem 2rem;
  position: relative;
}

/* Top Navigation */
.top-navigation {
  margin-bottom: 1.5rem;
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
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
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(61, 141, 122, 0.2);
  border-radius: 12px;
  color: #3D8D7A;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.back-button:hover {
  transform: translateX(-4px);
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border-color: #3D8D7A;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
}

.back-button svg {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button:hover svg {
  transform: translateX(-3px);
}

/* Custom Scrollbar */
.student-management::-webkit-scrollbar {
  width: 12px;
}

.student-management::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.student-management::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.student-management::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.table-container::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.table-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 6px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
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
  padding: 2rem 2.5rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
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

.header-text h1 {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
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
  border-radius: 18px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
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
  left: 1.25rem;
  color: #3D8D7A;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.5rem;
  border: 2px solid rgba(61, 141, 122, 0.2);
  border-radius: 14px;
  font-size: 0.95rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  border-color: #3D8D7A;
  background: white;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1),
              0 4px 12px rgba(61, 141, 122, 0.15);
  transform: translateY(-1px);
}

.filter-group {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: rgba(248, 250, 252, 0.9);
  padding: 0.625rem 1rem;
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-item:hover {
  border-color: rgba(61, 141, 122, 0.3);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.1);
}

.filter-item svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
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
  padding: 0.75rem 1.5rem;
  background: rgba(241, 245, 249, 0.9);
  color: #475569;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.btn-clear::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(61, 141, 122, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

.btn-clear:hover::before {
  width: 300px;
  height: 300px;
}

.btn-clear:hover {
  background: rgba(226, 232, 240, 0.95);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

/* Bulk Actions */
.bulk-actions {
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.95), rgba(253, 230, 138, 0.95));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.15);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 800;
  color: #92400e;
  font-size: 0.95rem;
}

.selection-info svg {
  color: #d97706;
}

.bulk-buttons {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.btn-bulk {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  color: #475569;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.btn-bulk::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s ease;
}

.btn-bulk:hover::before {
  left: 100%;
}

.btn-bulk:hover {
  background: rgba(248, 250, 252, 0.95);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.2);
}

.btn-bulk.warn {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border-color: #dc2626;
}

.btn-bulk.warn::before {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.btn-bulk.warn:hover {
  background: linear-gradient(135deg, #b91c1c, #991b1b);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
}

/* Data Table Wrapper */
.data-table-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 1.75rem;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.table-title svg {
  color: #3D8D7A;
}

.table-title h3 {
  font-size: 1.3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.3px;
}

.count-badge {
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.15), rgba(45, 106, 90, 0.1));
  backdrop-filter: blur(10px);
  color: #3D8D7A;
  padding: 0.5rem 1.125rem;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 800;
  border: 2px solid rgba(61, 141, 122, 0.25);
  box-shadow: 0 2px 8px rgba(61, 141, 122, 0.15);
}

.btn-export {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
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
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35);
}

/* Table Container */
.table-container {
  max-height: calc(100vh - 480px);
  overflow-x: auto;
  overflow-y: auto;
  border-radius: 14px;
  border: 2px solid rgba(241, 245, 249, 0.8);
}

.students-table {
  width: 100%;
  min-width: 1100px;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
}

.students-table thead {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.students-table th {
  padding: 0.9rem 0.5rem;
  text-align: left;
  font-weight: 800;
  font-size: 0.7rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.students-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.students-table th.sortable::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.students-table th.sortable:hover::after {
  width: 100%;
}

.students-table th.sortable:hover {
  background: rgba(45, 106, 90, 0.8);
  color: white;
}

.students-table th.sortable svg {
  display: inline-block;
  vertical-align: middle;
  margin-left: 0.35rem;
}

.students-table th.checkbox-col {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.students-table th:nth-child(2) {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
}

.students-table th:nth-child(3) {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

.students-table th:nth-child(4) {
  width: 130px;
  min-width: 130px;
  max-width: 130px;
}

.students-table th:nth-child(5) {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
}

.students-table th:nth-child(6) {
  width: 90px;
  min-width: 90px;
  max-width: 90px;
  text-align: center;
}

.students-table th:nth-child(7) {
  width: 110px;
  min-width: 110px;
  max-width: 110px;
  text-align: center;
}

.students-table th:nth-child(8) {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  text-align: center;
}

.students-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(241, 245, 249, 0.8);
  font-size: 0.85rem;
  color: #475569;
}

.students-table td:nth-child(1) {
  width: 50px;
  text-align: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.students-table td:nth-child(2) {
  width: 120px;
}

.students-table td:nth-child(3) {
  width: 200px;
}

.students-table td:nth-child(4) {
  width: 130px;
}

.students-table td:nth-child(5) {
  width: 200px;
}

.students-table td:nth-child(6) {
  width: 90px;
  text-align: center;
}

.students-table td:nth-child(7) {
  width: 110px;
  text-align: center;
}

.students-table td:nth-child(8) {
  width: 200px;
  text-align: center;
}

.checkbox-col {
  text-align: center;
  width: 50px;
}

.checkbox-col input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3D8D7A;
  margin: 0;
}

.id-col {
  font-family: 'Monaco', 'Courier New', monospace;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-col {
  font-weight: 700;
  color: #1e293b;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-col {
  color: #64748b;
  font-size: 0.85rem;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grade-col {
  text-align: center;
  width: 90px;
}

.student-row {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.student-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(90deg, rgba(61, 141, 122, 0.1), transparent);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.student-row:hover::before {
  width: 100%;
}

.student-row:hover {
  background: rgba(248, 250, 252, 0.8);
}

.checkbox-col {
  text-align: center;
  width: 50px;
}

.checkbox-col input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3D8D7A;
  margin: 0;
}

.id-col {
  font-family: 'Monaco', 'Courier New', monospace;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-col {
  font-weight: 700;
  color: #1e293b;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-col {
  color: #64748b;
  font-size: 0.85rem;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grade-badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(191, 219, 254, 0.95));
  backdrop-filter: blur(10px);
  color: #1e40af;
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1.5px solid rgba(147, 197, 253, 0.5);
  box-shadow: 0 2px 6px rgba(30, 64, 175, 0.15);
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1.5px solid;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.status-badge svg {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
}

.status-badge.active {
  background: linear-gradient(135deg, rgba(209, 250, 229, 0.95), rgba(167, 243, 208, 0.95));
  color: #065f46;
  border-color: rgba(52, 211, 153, 0.5);
}

.status-badge.inactive {
  background: linear-gradient(135deg, rgba(254, 202, 202, 0.95), rgba(252, 165, 165, 0.95));
  color: #991b1b;
  border-color: rgba(248, 113, 113, 0.5);
}

.status-badge.graduated {
  background: linear-gradient(135deg, rgba(224, 231, 255, 0.95), rgba(199, 210, 254, 0.95));
  color: #3730a3;
  border-color: rgba(165, 180, 252, 0.5);
}

.status-badge.transferred {
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.95), rgba(253, 230, 138, 0.95));
  color: #92400e;
  border-color: rgba(251, 191, 36, 0.5);
}

.actions-cell {
  display: flex;
  gap: 0.25rem;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.action-btn {
  width: 30px;
  height: 30px;
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  border: 1.5px solid;
  position: relative;
  overflow: hidden;
  padding: 0;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.action-btn:hover::before {
  width: 100px;
  height: 100px;
}

.action-btn.view {
  background: rgba(240, 249, 255, 0.9);
  color: #0369a1;
  border-color: rgba(3, 105, 161, 0.2);
}

.action-btn.view svg {
  width: 13px;
  height: 13px;
}

.action-btn.view::before {
  background: rgba(3, 105, 161, 0.15);
}

.action-btn.view:hover {
  background: #0369a1;
  color: white;
  border-color: #0369a1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

.action-btn.edit {
  background: rgba(241, 245, 249, 0.9);
  color: #475569;
  border-color: rgba(71, 85, 105, 0.2);
}

.action-btn.edit svg {
  width: 13px;
  height: 13px;
}

.action-btn.edit::before {
  background: rgba(71, 85, 105, 0.15);
}

.action-btn.edit:hover {
  background: #475569;
  color: white;
  border-color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3);
}

.action-btn.delete {
  background: rgba(254, 242, 242, 0.9);
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.2);
}

.action-btn.delete svg {
  width: 13px;
  height: 13px;
}

.action-btn.delete::before {
  background: rgba(220, 38, 38, 0.15);
}

.action-btn.delete:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.action-btn.password {
  background: rgba(254, 243, 199, 0.9);
  color: #d97706;
  border-color: rgba(217, 119, 6, 0.2);
}

.action-btn.password svg {
  width: 13px;
  height: 13px;
}

.action-btn.password::before {
  background: rgba(217, 119, 6, 0.15);
}

.action-btn.password:hover {
  background: #d97706;
  color: white;
  border-color: #d97706;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
}

.action-btn.grades {
  background: rgba(240, 253, 244, 0.9);
  color: #16a34a;
  border-color: rgba(22, 163, 74, 0.2);
}

.action-btn.grades svg {
  width: 13px;
  height: 13px;
}

.action-btn.grades::before {
  background: rgba(22, 163, 74, 0.15);
}

.action-btn.grades:hover {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.loading-cell, .empty-cell {
  text-align: center;
  padding: 3.5rem 1rem;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  color: #94a3b8;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(226, 232, 240, 0.5);
  border-top-color: #3D8D7A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p, .empty-state p {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.75rem;
  padding-top: 1.75rem;
  border-top: 2px solid rgba(241, 245, 249, 0.8);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.pagination-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(61, 141, 122, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.pagination-btn:hover:not(:disabled)::before {
  width: 200px;
  height: 200px;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(248, 250, 252, 0.95);
  border-color: #3D8D7A;
  color: #3D8D7A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.15);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.page-text {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.95rem;
}

.total-text {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.8);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
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
  max-width: 480px;
}

.modal-content.large {
  max-width: 750px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  border-bottom: 2px solid rgba(61, 141, 122, 0.15);
  background: linear-gradient(135deg, rgba(61, 141, 122, 0.05), rgba(45, 106, 90, 0.03));
  backdrop-filter: blur(10px);
  border-radius: 20px 20px 0 0;
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
  font-weight: 800;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
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
  padding: 2.25rem;
}

.modal-icon {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.75rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.modal-icon.info {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(191, 219, 254, 0.95));
  color: #1d4ed8;
}

.modal-icon.danger {
  background: linear-gradient(135deg, rgba(254, 202, 202, 0.95), rgba(252, 165, 165, 0.95));
  color: #dc2626;
}

.modal-message {
  font-size: 0.95rem;
  color: #475569;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
  line-height: 1.6;
}

.student-avatar {
  width: 88px;
  height: 88px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.75rem;
  color: white;
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.3);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.125rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1.125rem;
  padding: 0.875rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 10px;
  align-items: center;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-row:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateX(4px);
}

.detail-row.full-width {
  grid-template-columns: 1fr;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: #64748b;
}

.detail-label svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.detail-value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.75rem;
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
  gap: 0.625rem;
  margin-bottom: 0.625rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: #475569;
}

.form-group label svg {
  color: #3D8D7A;
  flex-shrink: 0;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1.125rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
}

.form-input:focus {
  outline: none;
  border-color: #3D8D7A;
  background: white;
  box-shadow: 0 0 0 4px rgba(61, 141, 122, 0.1),
              0 4px 12px rgba(61, 141, 122, 0.15);
  transform: translateY(-1px);
}

textarea.form-input {
  resize: vertical;
  min-height: 90px;
}

.password-display {
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;
  border-radius: 14px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 1.15rem;
  text-align: center;
  margin: 1.25rem 0;
  color: #1e293b;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.password-display svg {
  color: #3D8D7A;
}

.warn-text {
  color: #dc2626;
  font-size: 0.85rem;
  text-align: center;
  background: rgba(254, 242, 242, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.875rem 1.125rem;
  border-radius: 10px;
  border-left: 4px solid #dc2626;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.info-box {
  display: flex;
  gap: 1.125rem;
  background: rgba(240, 249, 255, 0.95);
  backdrop-filter: blur(10px);
  border-left: 4px solid #0ea5e9;
  padding: 1.125rem;
  border-radius: 10px;
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
  font-weight: 600;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.875rem;
  margin-top: 1.75rem;
}

/* Button Styles */
.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(61, 141, 122, 0.35);
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background: rgba(241, 245, 249, 0.9);
  color: #475569;
  border: 2px solid rgba(226, 232, 240, 0.8);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(71, 85, 105, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.btn-secondary:hover::before {
  width: 200px;
  height: 200px;
}

.btn-secondary:hover {
  background: rgba(226, 232, 240, 0.95);
  border-color: #475569;
  color: #1e293b;
  transform: translateY(-2px);
}

.btn-warn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-warn:hover::before {
  left: 100%;
}

.btn-warn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .student-management {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 1024px) {
  .table-container {
    overflow-x: scroll;
  }
}

@media (max-width: 768px) {
  .student-management {
    padding: 0.75rem 1rem;
  }

  .top-navigation {
    margin-bottom: 1rem;
  }

  .back-button {
    width: 100%;
    justify-content: center;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
    padding: 1.75rem;
  }

  .header-text h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
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

  .bulk-actions {
    flex-direction: column;
  }

  .bulk-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-bulk {
    width: 100%;
    justify-content: center;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-export {
    width: 100%;
    justify-content: center;
  }

  .students-table th,
  .students-table td {
    padding: 0.875rem 0.625rem;
    font-size: 0.85rem;
  }

  .actions-cell {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
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
    gap: 0.625rem;
  }

  .modal-header {
    padding: 1.5rem 1.75rem;
  }

  .modal-header h2 {
    font-size: 1.2rem;
  }

  .modal-body {
    padding: 1.75rem;
  }
}

@media (max-width: 480px) {
  .student-management {
    padding: 0.5rem;
  }

  .back-button {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }

  .header-content {
    padding: 1.5rem;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .filters-bar {
    padding: 1.25rem;
  }

  .data-table-wrapper {
    padding: 1.25rem;
  }

  .modal-content {
    width: 95%;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }
}
</style>
