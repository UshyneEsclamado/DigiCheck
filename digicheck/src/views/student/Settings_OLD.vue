<template>
  <div class="page-container">
    <div class="main-wrapper">

      <!-- Header Section -->
      <div class="header-card">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.9,6C16.5,5.65 16.08,5.36 15.61,5.1L15.2,2.83C15.15,2.56 14.9,2.33 14.62,2.33L9.38,2.33C9.1,2.33 8.85,2.56 8.8,2.83L8.39,5.09C7.92,5.34 7.5,5.65 7.1,6L4.9,5.12C4.7,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.7,18.97 4.9,18.88L7.1,18C7.5,18.35 7.92,18.64 8.39,18.9L8.8,21.17C8.85,21.44 9.1,21.67 9.38,21.67L14.62,21.67C14.9,21.67 15.15,21.44 15.2,21.17L15.61,18.91C16.08,18.66 16.5,18.35 16.9,18L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Settings</h1>
              <p class="header-subtitle">Manage your account, profile, and app preferences</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="content-card">
        <!-- Account & Profile Card -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg> 
            Account & Profile
          </h2>
          <p class="section-subtitle">Update your personal information and profile settings</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Update Profile Info</span>
              <button @click="openProfileModal" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </button>
            </div>
            <div class="setting-item">
              <span>Change Password</span>
              <button @click="openPasswordModal" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- App Preferences Card -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg> 
            App Appearance
          </h2>
          <p class="section-subtitle">Customize the app's look and feel</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Dark Mode</span>
              <label class="switch">
                <input type="checkbox" v-model="isDarkMode" @change="handleDarkModeToggle">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Privacy & Legal Card -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg> 
            Privacy & Legal
          </h2>
          <p class="section-subtitle">Understand our policies and manage your data</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Privacy Policy</span>
              <button @click="openPrivacyPolicy" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </button>
            </div>
            <div class="setting-item">
              <span>Terms of Service</span>
              <button @click="openTermsOfService" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone Card -->
        <div class="settings-card danger-zone">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="section-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg> 
            Danger Zone
          </h2>
          <p class="section-subtitle">Sensitive actions that cannot be undone</p>
          <div class="settings-list">
            <div class="setting-item">
              <span class="danger-text">Delete Account</span>
              <button @click="confirmDeleteAccount" class="action-btn danger-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6l3 0l0 15a2 2 0 0 0 2 2l8 0a2 2 0 0 0 2 -2l0 -15l3 0"/>
                  <path d="M14 10l0 5"/>
                  <path d="M10 10l0 5"/>
                  <path d="M18 6l-12 0"/>
                  <path d="M10 3l4 0l0 3l-4 0l0 -3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- About Section -->
      <div class="about-card">
        <h2>IntelliGrade</h2>
        <p class="copyright-text">© 2025 IntelliGrade. All Rights Reserved.</p>
      </div>
    </div>

    <!-- Profile Update Modal -->
    <div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Update Profile</h3>
          <button @click="closeProfileModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <!-- Full Name Section -->
          <div class="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              v-model="profileData.full_name" 
              placeholder="Enter your full name"
              class="form-input"
            >
          </div>
          
          <!-- Grade Level Section -->
          <div class="form-group">
            <label>Grade Level</label>
            <select v-model="profileData.grade_level" class="form-input grade-select">
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            <p class="grade-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              When you advance to the next grade level, your previous enrollments and data will be archived
            </p>
          </div>
          
          <!-- Error/Success Messages -->
          <div v-if="profileError" class="error-message">{{ profileError }}</div>
          <div v-if="profileSuccess" class="success-message">{{ profileSuccess }}</div>
        </div>
        <div class="modal-footer">
          <button v-if="!profileSuccess" @click="closeProfileModal" class="btn-secondary">Cancel</button>
          <button v-if="!profileSuccess" @click="saveProfile" class="btn-primary" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
          <button v-if="profileSuccess" @click="closeProfileModal" class="btn-primary">
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Change Password</h3>
          <button @click="closePasswordModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              v-model="passwordData.currentPassword" 
              placeholder="Enter current password"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              v-model="passwordData.newPassword" 
              placeholder="Enter new password (min 6 characters)"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              v-model="passwordData.confirmPassword" 
              placeholder="Confirm new password"
              class="form-input"
            >
          </div>
          
          <!-- Error/Success Messages -->
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          <div v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</div>
        </div>
        <div class="modal-footer">
          <button @click="closePasswordModal" class="btn-secondary">Cancel</button>
          <button @click="changePassword" class="btn-primary" :disabled="isChangingPassword">
            {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="closePrivacyModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>Privacy Policy</h3>
          <button @click="closePrivacyModal" class="close-btn">×</button>
        </div>
        <div class="modal-body document-body">
          <div class="document-content">
            <h4>IntelliGrade Privacy Policy</h4>
            <p class="document-date">Last Updated: January 2025</p>
            
            <section>
              <h5>1. Information We Collect</h5>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Account information (name, email, student ID)</li>
                <li>Profile information (grade level)</li>
                <li>Academic records and grades</li>
                <li>Messages and communications within the platform</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h5>2. How We Use Your Information</h5>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our educational services</li>
                <li>Process enrollments and manage class sections</li>
                <li>Facilitate communication between teachers and students</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h5>3. Information Sharing</h5>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul>
                <li>Teachers and administrators within your educational institution</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h5>4. Data Security</h5>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>

            <section>
              <h5>5. Your Rights</h5>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your account</li>
                <li>Opt-out of non-essential communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h5>6. Children's Privacy</h5>
              <p>Our platform is designed for students in grades 7-12. We comply with applicable laws regarding the collection and use of information from minors.</p>
            </section>

            <section>
              <h5>7. Contact Us</h5>
              <p>If you have questions about this Privacy Policy, please contact us at privacy@intelligrade.edu</p>
            </section>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closePrivacyModal" class="btn-primary">Close</button>
        </div>
      </div>
    </div>

    <!-- Terms of Service Modal -->
    <div v-if="showTermsModal" class="modal-overlay" @click="closeTermsModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>Terms of Service</h3>
          <button @click="closeTermsModal" class="close-btn">×</button>
        </div>
        <div class="modal-body document-body">
          <div class="document-content">
            <h4>IntelliGrade Terms of Service</h4>
            <p class="document-date">Last Updated: January 2025</p>
            
            <section>
              <h5>1. Acceptance of Terms</h5>
              <p>By accessing and using IntelliGrade, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
            </section>

            <section>
              <h5>2. User Accounts</h5>
              <p>You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </section>

            <section>
              <h5>3. Acceptable Use</h5>
              <p>You agree not to:</p>
              <ul>
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to the system</li>
              </ul>
            </section>

            <section>
              <h5>4. Academic Integrity</h5>
              <p>All users must maintain academic integrity. Cheating, plagiarism, or any form of academic dishonesty is strictly prohibited and may result in account suspension or termination.</p>
            </section>

            <section>
              <h5>5. Content Ownership</h5>
              <p>You retain ownership of content you create on the platform. By posting content, you grant IntelliGrade a license to use, store, and display that content as necessary to provide our services.</p>
            </section>

            <section>
              <h5>6. Service Availability</h5>
              <p>We strive to provide continuous access to our platform but do not guarantee uninterrupted service. We may suspend or terminate access for maintenance, updates, or violations of these terms.</p>
            </section>

            <section>
              <h5>7. Limitation of Liability</h5>
              <p>IntelliGrade is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
            </section>

            <section>
              <h5>8. Termination</h5>
              <p>We reserve the right to suspend or terminate your account if you violate these terms or engage in conduct that we deem harmful to the platform or other users.</p>
            </section>

            <section>
              <h5>9. Changes to Terms</h5>
              <p>We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.</p>
            </section>

            <section>
              <h5>10. Contact Information</h5>
              <p>For questions about these Terms of Service, contact us at support@intelligrade.edu</p>
            </section>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeTermsModal" class="btn-primary">Close</button>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" style="max-width: 400px;" @click.stop>
        <div class="modal-header" style="border-bottom: 1px solid #dc3545;">
          <h3 style="color: #dc3545; font-weight: 600; margin: 0;">Delete Account</h3>
          <button @click="closeDeleteModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p style="color: #dc3545; font-weight: 500; margin-bottom: 1rem;">This action cannot be undone. This will permanently delete your account and all associated data.</p>
          <div style="margin-bottom: 1.5rem;">
            <label style="font-weight: 500;">Type <strong>DELETE</strong> to confirm:</label>
            <input 
              type="text" 
              v-model="deleteConfirmation" 
              placeholder="Type DELETE to confirm"
              class="form-input"
              style="margin-top: 0.5rem; text-align: center; border: 2px solid #dc3545; font-weight: 600; text-transform: uppercase;"
              @input="deleteConfirmation = (($event.target as HTMLInputElement).value || '').toUpperCase()"
            >
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-secondary">Cancel</button>
          <button 
            @click="executeDeleteAccount" 
            class="btn-danger" 
            :disabled="deleteConfirmation !== 'DELETE' || isDeletingAccount"
          >
            {{ isDeletingAccount ? 'Deleting...' : 'Delete Account' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { supabase } from '@/supabase.js';

export default {
  name: 'StudentSettings',
  data() {
    return {
      // User data
      currentUser: null,
      userProfile: null,
      studentData: null,
      
      // Theme
      isDarkMode: false,
      
      // Modal states
      showProfileModal: false,
      showPasswordModal: false,
      showPrivacyModal: false,
      showTermsModal: false,
      showDeleteModal: false,
      
      // Profile management
      profileData: {
        full_name: '',
        grade_level: '7'
      },
      isSaving: false,
      profileError: '',
      profileSuccess: '',
      
      // Password management
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      isChangingPassword: false,
      passwordError: '',
      passwordSuccess: '',
      
      // Delete account management
      deleteConfirmation: '',
      isDeletingAccount: false
    };
  },
  async mounted() {
    // Load theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.isDarkMode = savedTheme === 'true';
      this.applyTheme();
    }
    
    // Load user data
    await this.loadUserData();
  },
  watch: {
    $route() {
      this.loadUserData();
    }
  },
  methods: {
    // ==================== USER DATA METHODS ====================
    async loadUserData() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          this.$router.push('/login');
          return;
        }
        
        this.currentUser = user;
        
        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('auth_user_id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        // Verify this is a student
        if (profile.role !== 'student') {
          alert('This settings page is for students only');
          this.$router.push('/');
          return;
        }
        
        this.userProfile = profile;
        
        // Get student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id, student_id, grade_level, full_name, email, is_active')
          .eq('profile_id', profile.id)
          .single();
        
        if (studentError) throw studentError;
        
        this.studentData = studentData;
        
        console.log('✅ User data loaded:', {
          profile: this.userProfile,
          student: this.studentData
        });
        
      } catch (error) {
        console.error('Error loading user data:', error);
        alert('Failed to load user data. Please refresh the page.');
      }
    },
    
    // ==================== THEME METHODS ====================
    handleDarkModeToggle() {
      localStorage.setItem('darkMode', this.isDarkMode.toString());
      this.applyTheme();
    },
    
    applyTheme() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
    // ==================== PROFILE MODAL METHODS ====================
    openProfileModal() {
      if (!this.studentData) {
        alert('User data not loaded yet. Please wait...');
        return;
      }
      
      // Load current data into the form
      this.profileData = {
        full_name: this.studentData.full_name || '',
        grade_level: this.studentData.grade_level?.toString() || '7'
      };
      
      this.showProfileModal = true;
      this.clearMessages();
    },
    
    closeProfileModal() {
      this.showProfileModal = false;
      this.clearMessages();
    },
    
    async saveProfile() {
      this.clearMessages();

      if (!this.profileData.full_name.trim()) {
        this.profileError = 'Full name is required';
        return;
      }

      this.isSaving = true;

      try {
        const previousGradeLevel = this.studentData.grade_level;
        const newGradeLevel = parseInt(this.profileData.grade_level);
        const gradeChanged = previousGradeLevel !== newGradeLevel;
        const nameChanged = this.profileData.full_name.trim() !== this.studentData.full_name;
        
        console.log('Saving profile:', {
          previousGrade: previousGradeLevel,
          newGrade: newGradeLevel,
          gradeChanged,
          nameChanged
        });
        
        // If grade level changed, archive old enrollments FIRST
        if (gradeChanged) {
          await this.handleGradeTransition(previousGradeLevel, newGradeLevel);
        }
        
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: this.profileData.full_name.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', this.userProfile.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
        
        console.log('✅ Profiles table updated');

        // Update students table
        const { error: studentError } = await supabase
          .from('students')
          .update({
            full_name: this.profileData.full_name.trim(),
            grade_level: newGradeLevel,
            updated_at: new Date().toISOString()
          })
          .eq('profile_id', this.userProfile.id);

        if (studentError) {
          console.error('Student update error:', studentError);
          throw studentError;
        }
        
        console.log('✅ Students table updated');

        let successMessage = 'Profile updated successfully!';
        if (gradeChanged) {
          successMessage = `Profile updated! Grade changed from ${previousGradeLevel} to ${newGradeLevel}. Previous enrollments have been archived.`;
        } else if (nameChanged) {
          successMessage = 'Profile updated! Your name has been changed.';
        }
        
        this.profileSuccess = successMessage;
        
        // Reload user data
        await this.loadUserData();
        
        console.log('✅ Profile update complete');
        
        // Dispatch event for dashboard to update
        window.dispatchEvent(new CustomEvent('studentProfileUpdated', {
          detail: {
            gradeChanged,
            nameChanged,
            oldGrade: previousGradeLevel,
            newGrade: newGradeLevel,
            newName: this.profileData.full_name.trim()
          }
        }));
        
      } catch (error) {
        console.error('Error saving profile:', error);
        this.profileError = error.message || 'Failed to save profile. Please try again.';
      } finally {
        this.isSaving = false;
      }
    },
    
    async handleGradeTransition(oldGrade, newGrade) {
      try {
        console.log(`Starting grade transition: Grade ${oldGrade} → Grade ${newGrade}`);
        
        // Get all active enrollments
        const { data: activeEnrollments, error: fetchError } = await supabase
          .from('enrollments')
          .select('id, section_id, subject_id')
          .eq('student_id', this.studentData.id)
          .eq('status', 'active');
        
        if (fetchError) throw fetchError;
        
        const enrollmentCount = activeEnrollments?.length || 0;
        console.log(`Found ${enrollmentCount} active enrollments to archive`);
        
        // Archive all active enrollments
        if (enrollmentCount > 0) {
          const { error: archiveError } = await supabase
            .from('enrollments')
            .update({
              status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('student_id', this.studentData.id)
            .eq('status', 'active');
          
          if (archiveError) throw archiveError;
          console.log(`Successfully archived ${enrollmentCount} enrollments`);
        }
        
        // Log the transition
        await supabase
          .from('security_events')
          .insert({
            profile_id: this.userProfile.id,
            event_type: 'grade_transition',
            details: {
              old_grade: oldGrade,
              new_grade: newGrade,
              transition_date: new Date().toISOString(),
              enrollments_archived: true,
              enrollments_count: enrollmentCount
            }
          });
        
        console.log(`✅ Grade transition completed`);
        
      } catch (error) {
        console.error('Error handling grade transition:', error);
        throw new Error('Failed to process grade level change: ' + error.message);
      }
    },
    
    // ==================== PASSWORD MODAL METHODS ====================
    openPasswordModal() {
      this.showPasswordModal = true;
      this.resetPasswordForm();
      this.clearMessages();
    },
    
    closePasswordModal() {
      this.showPasswordModal = false;
      this.resetPasswordForm();
    },
    
    resetPasswordForm() {
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    
    async changePassword() {
      this.clearMessages();

      if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
        this.passwordError = 'All fields are required';
        return;
      }

      if (this.passwordData.newPassword.length < 6) {
        this.passwordError = 'New password must be at least 6 characters';
        return;
      }

      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.passwordError = 'New passwords do not match';
        return;
      }

      if (this.passwordData.currentPassword === this.passwordData.newPassword) {
        this.passwordError = 'New password must be different from current password';
        return;
      }

      this.isChangingPassword = true;

      try {
        // Verify current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: this.userProfile.email,
          password: this.passwordData.currentPassword
        });

        if (signInError) {
          this.passwordError = 'Current password is incorrect';
          this.isChangingPassword = false;
          return;
        }

        // Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
          password: this.passwordData.newPassword
        });

        if (updateError) throw updateError;

        // Update password_changed_at in profiles table
        await supabase
          .from('profiles')
          .update({
            password_changed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', this.userProfile.id);

        // Log password change event
        await supabase
          .from('security_events')
          .insert({
            profile_id: this.userProfile.id,
            event_type: 'password_change',
            details: { changed_at: new Date().toISOString() }
          });

        this.passwordSuccess = 'Password updated successfully!';
        
        setTimeout(() => {
          this.closePasswordModal();
        }, 1500);
        
      } catch (error) {
        console.error('Error changing password:', error);
        this.passwordError = error.message || 'Failed to update password. Please try again.';
      } finally {
        this.isChangingPassword = false;
      }
    },
    
    // ==================== PRIVACY & TERMS METHODS ====================
    openPrivacyPolicy() {
      this.showPrivacyModal = true;
    },
    
    closePrivacyModal() {
      this.showPrivacyModal = false;
    },
    
    openTermsOfService() {
      this.showTermsModal = true;
    },
    
    closeTermsModal() {
      this.showTermsModal = false;
    },
    
    // ==================== DELETE ACCOUNT METHODS ====================
    confirmDeleteAccount() {
      this.deleteConfirmation = '';
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteConfirmation = '';
    },

    async executeDeleteAccount() {
      if (this.deleteConfirmation !== 'DELETE') return;
      this.isDeletingAccount = true;

      try {
        console.log('🗑️ Starting account deletion...');
        
        // Log the deletion event first
        try {
          await supabase
            .from('security_events')
            .insert({
              profile_id: this.userProfile.id,
              event_type: 'account_deletion',
              details: {
                deleted_at: new Date().toISOString(),
                user_role: 'student'
              }
            });
          console.log('✅ Deletion logged');
        } catch (logError) {
          console.warn('Could not log deletion:', logError);
        }

        // Delete the auth user account (this will cascade delete everything)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          this.currentUser.id
        );

        if (deleteError) {
          console.error('❌ Delete Error:', deleteError);
          throw new Error('Failed to delete account: ' + deleteError.message);
        }
        
        console.log('✅ Account deleted');

        // Sign out the user
        await supabase.auth.signOut();
        console.log('✅ User signed out');

        this.isDeletingAccount = false;
        this.showDeleteModal = false;
        
        // Clear local storage
        localStorage.clear();
        
        alert('Your account has been permanently deleted. You will now be redirected to the login page.');
        
        // Redirect to login
        setTimeout(() => {
          window.location.replace('/login');
        }, 500);

      } catch (error) {
        console.error('❌ Error deleting account:', error);
        this.isDeletingAccount = false;
        alert('Failed to delete account: ' + (error.message || 'Unknown error') + '\n\nPlease contact support at support@intelligrade.edu');
      }
    },
    
    // ==================== UTILITY METHODS ====================
    clearMessages() {
      this.profileError = '';
      this.profileSuccess = '';
      this.passwordError = '';
      this.passwordSuccess = '';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* CSS Variables */
:root {
  --bg-primary: #FBFFE4;
  --bg-card: #ffffff;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-accent: #3D8D7A;
  --border-color: #A3D1C6;
  --accent-color: #3D8D7A;
  --accent-hover: #2f6b5c;
  --success-color: #B3D8A8;
  --danger-color: #dc3545;
  --shadow-light: rgba(61, 141, 122, 0.1);
}

.dark {
  --bg-primary: #1e2127;
  --bg-card: #2a2e36;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --text-accent: #3D8D7A;
  --border-color: #3D8D7A;
  --accent-color: #3D8D7A;
  --accent-hover: #2f6b5c;
  --success-color: #22c55e;
  --danger-color: #dc3545;
  --shadow-light: rgba(0, 0, 0, 0.2);
}

/* Main Container */
.page-container {
  min-height: 100vh;
  background: #FBFFE4;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
}

.dark .page-container {
  background: #181c20;
}

.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Card */
.header-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 2px solid #cbe7db;
}

.dark .header-card {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--accent-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.dark .header-icon {
  background: var(--accent-color);
  color: #FBFFE4;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.dark .header-title {
  color: #A3D1C6;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .header-subtitle {
  color: #A3D1C6;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dark .content-card {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

/* Settings Cards */
.settings-card {
  padding: 1.25rem;
  border: 1px solid #A3D1C6;
  border-radius: 12px;
  background: #FBFFE4;
  transition: all 0.2s;
}

.dark .settings-card {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #3D8D7A;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .section-title {
  color: #A3D1C6;
}

.section-icon {
  color: #3D8D7A;
}

.dark .section-icon {
  color: #A3D1C6;
}

.section-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.dark .section-subtitle {
  color: #A3D1C6;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #A3D1C6;
  font-size: 0.9rem;
  color: #1f2937;
}

.dark .setting-item {
  color: #A3D1C6;
  border-bottom: 1px solid #20c997;
}

.setting-item:last-child {
  border-bottom: none;
}

.action-btn {
  background: #3D8D7A;
  color: white;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark .action-btn {
  background: #20c997;
  color: white;
}

.action-btn:hover {
  background: #2f6b5c;
  transform: translateY(-1px);
}

.dark .action-btn:hover {
  background: #A3D1C6;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--accent-color);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Danger Zone */

/* Danger Zone - Enhanced Red Style */
.danger-zone {
  border: 1.5px solid #dc3545 !important;
  background: #fdf6f6 !important;
}
.dark .danger-zone {
  background: #2a1818 !important;
  border: 1.5px solid #dc3545 !important;
}
.danger-zone .section-title,
.danger-zone .section-subtitle,
.danger-zone .danger-text {
  color: #dc3545 !important;
}
.danger-btn {
  background-color: #dc3545 !important;
  color: white !important;
  border: 1px solid #dc3545 !important;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
  font-weight: 600;
}
.dark .danger-btn {
  background-color: #dc3545 !important;
  color: white !important;
  border: 1px solid #dc3545 !important;
}
.danger-btn:hover {
  background-color: #c82333 !important;
  border-color: #c82333 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Profile Photo Upload */
.photo-upload-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.dark .photo-upload-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.current-photo {
  flex-shrink: 0;
}

.profile-photo-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent-color);
}

.profile-photo-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.photo-upload-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.btn-upload, .btn-remove {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn-upload {
  background: var(--accent-color);
  color: white;
}

.btn-upload:hover {
  background: var(--accent-hover);
}

.btn-remove {
  background: var(--danger-color);
  color: white;
}

.btn-remove:hover {
  background: #c82333;
}

.photo-hint {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

/* About Card */
.about-card {
  text-align: center;
  padding: 1.5rem;
  background: white;
  border: 1px solid #A3D1C6;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark .about-card {
  background: #23272b;
  border: 1px solid #20c997;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.about-card h2 {
  font-size: 1.2rem;
  color: #3D8D7A;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.dark .about-card h2 {
  color: #A3D1C6;
}

.copyright-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.dark .copyright-text {
  color: #A3D1C6;
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
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--bg-card);
  border-radius: 12px 12px 0 0;
  z-index: 10;
}

.dark .modal-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-primary);
  font-weight: 600;
}

.dark .modal-header h3 {
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.document-body {
  max-height: 60vh;
  overflow-y: auto;
}

.document-content {
  line-height: 1.6;
}

.document-content h4 {
  font-size: 1.4rem;
  color: var(--text-accent);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.dark .document-content h4 {
  color: var(--text-accent);
}

.document-date {
  color: var(--text-secondary);
  font-style: italic;
  margin: 0 0 2rem 0;
  font-size: 0.875rem;
}

.dark .document-date {
  color: var(--text-secondary);
}

.document-content section {
  margin-bottom: 1.5rem;
}

.document-content h5 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.dark .document-content h5 {
  color: var(--text-primary);
}

.document-content p {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.dark .document-content p {
  color: var(--text-primary);
}

.document-content ul {
  margin: 0 0 1rem 1.5rem;
}

.document-content li {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.dark .document-content li {
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.dark .form-group label {
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  background-color: var(--bg-card);
  color: var(--text-primary);
  box-sizing: border-box;
}

.dark .form-input {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

/* Grade Level Styles */
.grade-select {
  cursor: pointer;
}

.grade-note {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(61, 141, 122, 0.1);
  border: 1px solid rgba(61, 141, 122, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.dark .grade-note {
  background: rgba(32, 201, 151, 0.1);
  border: 1px solid rgba(32, 201, 151, 0.2);
  color: var(--text-secondary);
}

.grade-note svg {
  flex-shrink: 0;
  color: var(--accent-color);
}

/* Messages */
.error-message {
  color: var(--danger-color);
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(220, 53, 69, 0.3);
  font-size: 0.875rem;
}

.success-message {
  color: var(--success-color);
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(179, 216, 168, 0.2);
  border-radius: 8px;
  border: 1px solid var(--success-color);
  font-size: 0.875rem;
}

.dark .success-message {
  color: var(--success-color);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid var(--success-color);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  position: sticky;
  bottom: 0;
  background: var(--bg-card);
  border-radius: 0 0 12px 12px;
}

.dark .modal-footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.dark .btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

/* Danger Button */
.btn-danger {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: #dc3545;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-danger:disabled {
  background: #dc3545;
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem 1rem 0 1rem;
    min-height: calc(100vh - 80px);
  }
  
  .main-wrapper {
    min-height: calc(100vh - 80px);
    padding-bottom: 100px;
  }
  
  .header-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .header-left {
    gap: 1rem;
  }
  
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .header-title {
    font-size: 1.3rem;
  }
  
  .content-card {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .settings-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .setting-item {
    min-height: 50px;
    padding: 0.75rem;
  }
  
  .action-btn {
    min-width: 44px;
    min-height: 44px;
    padding: 12px;
  }
  
  .setting-toggle {
    min-width: 44px;
    min-height: 44px;
  }
  
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 95vh;
    margin: 10px;
  }
  
  .modal-header, .modal-footer, .modal-body {
    padding: 1rem;
  }
  
  .document-modal {
    max-width: 100%;
  }
  
  .photo-upload-container {
    flex-direction: column;
    text-align: center;
  }
  
  .floating-help-btn {
    width: 50px;
    height: 50px;
    bottom: 100px;
    right: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    min-height: 44px;
    font-size: 16px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0.75rem 0.75rem 0 0.75rem;
    min-height: calc(100vh - 80px);
  }
  
  .main-wrapper {
    padding-bottom: 120px;
  }
  
  .header-card {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .header-title {
    font-size: 1.2rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .content-card {
    padding: 0.75rem;
    gap: 1rem;
  }
  
  .settings-card {
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
  }
  
  .section-subtitle {
    font-size: 0.8rem;
  }
  
  .setting-item {
    min-height: 48px;
    padding: 0.5rem;
  }
  
  .setting-item span {
    font-size: 0.9rem;
  }
  
  .action-btn {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
  
  .floating-help-btn {
    width: 45px;
    height: 45px;
    bottom: 90px;
    right: 1rem;
  }
  
  .floating-help-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .modal-content {
    margin: 5px;
    max-height: 98vh;
  }
  
  .modal-header, .modal-footer, .modal-body {
    padding: 0.75rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    font-size: 0.9rem;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    min-height: 40px;
    font-size: 16px;
    padding: 10px;
  }
  
  .btn {
    min-height: 44px;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
}

/* iPhone 12 Pro Specific (390px) */
@media (max-width: 390px) {
  .page-container {
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
  
  .header-card {
    padding: 0.75rem;
  }
  
  .header-title {
    font-size: 1.1rem;
  }
  
  .content-card {
    padding: 0.5rem;
  }
  
  .settings-card {
    padding: 0.75rem;
  }
  
  .setting-item {
    min-height: 44px;
    padding: 0.5rem;
  }
  
  .floating-help-btn {
    width: 40px;
    height: 40px;
    bottom: 85px;
    right: 0.75rem;
  }
  
  .floating-help-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
