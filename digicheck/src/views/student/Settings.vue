<template>
  <div class="page-container">
    <div class="main-wrapper">

      <!-- Header Section -->
      <div class="header-card">
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11.03L21.54,9.37C21.73,9.22 21.78,8.95 21.67,8.75L19.67,5.27C19.56,5.08 19.3,5.03 19.1,5.12L16.9,6C16.5,5.65 16.08,5.36 15.61,5.1L15.2,2.83C15.15,2.56 14.9,2.33 14.62,2.33L9.38,2.33C9.1,2.33 8.85,2.56 8.8,2.83L8.39,5.09C7.92,5.34 7.5,5.65 7.1,6L4.9,5.12C4.7,5.03 4.44,5.08 4.33,5.27L2.33,8.75C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11.03C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.33,15.25L4.33,18.73C4.44,18.92 4.7,18.97 4.9,18.88L7.1,18C7.5,18.35 7.92,18.64 8.39,18.9L8.8,21.17C8.85,21.44 9.1,21.67 9.38,21.67L14.62,21.67C14.9,21.67 15.15,21.44 15.2,21.17L15.61,18.91C16.08,18.66 16.5,18.35 16.9,18L19.1,18.88C19.3,18.97 19.56,18.92 19.67,18.73L21.67,15.25C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
            </div>
            <div>
              <h1 class="header-title">Settings</h1>
              <p class="header-subtitle">Manage your profile and account preferences</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Information Card -->
      <div class="content-card">
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="section-icon">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg> 
            Profile Information
          </h2>
          <p class="section-subtitle">Update your personal information and profile photo</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Update Profile</span>
              <button @click="openProfileModal" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Student Information Display -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="section-icon">
              <path d="M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z" />
            </svg> 
            Student Information
          </h2>
          <p class="section-subtitle">Your academic information (managed by admin)</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Student ID</span>
              <span class="info-value">{{ studentData.student_id || 'Not assigned' }}</span>
            </div>
            <div class="setting-item">
              <span>Grade Level</span>
              <span class="info-value">
                Grade {{ studentData.grade_level }}
                <span v-if="studentData.strand" class="strand-badge">{{ studentData.strand }}</span>
              </span>
            </div>
            <div class="setting-item">
              <span>Gender</span>
              <span class="info-value">{{ studentData.gender || 'Not set' }}</span>
            </div>
            <div class="setting-item">
              <span>School Year</span>
              <span class="info-value">{{ schoolYear || 'Not enrolled' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Security Card -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="section-icon">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z" />
            </svg> 
            Security
          </h2>
          <p class="section-subtitle">Manage your password and account security</p>
          <div class="settings-list">
            <div class="setting-item">
              <span>Change Password</span>
              <button @click="openPasswordModal" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change
              </button>
            </div>
          </div>
        </div>

        <!-- App Preferences -->
        <div class="settings-card">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="section-icon">
              <path d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z" />
            </svg> 
            Appearance
          </h2>
          <p class="section-subtitle">Customize how the app looks</p>
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
      </div>
    </div>

    <!-- Profile Update Modal -->
    <div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Update Profile</h3>
          <button @click="closeProfileModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="avatar-upload-section">
            <div class="avatar-preview-wrapper">
              <div v-if="imagePreview || currentProfilePicture" class="avatar-preview">
                <img :src="imagePreview || currentProfilePicture" alt="Profile Preview" />
              </div>
              <div v-else class="avatar-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
            </div>
            
            <div class="upload-controls">
              <input 
                type="file" 
                id="profilePhotoInput" 
                @change="handleImageSelect" 
                accept="image/*"
                class="file-input"
              />
              <label for="profilePhotoInput" class="file-input-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                </svg>
                Choose Photo
              </label>
              <p v-if="selectedImage" class="selected-file">{{ selectedImage.name }}</p>
            </div>
          </div>

          <div class="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              v-model="profileData.full_name" 
              class="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <p v-if="profileError" class="error-message">{{ profileError }}</p>
          <p v-if="profileSuccess" class="success-message">{{ profileSuccess }}</p>
        </div>

        <div class="modal-footer">
          <button @click="closeProfileModal" class="btn-secondary">Cancel</button>
          <button @click="saveProfile" class="btn-primary" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Change Password</h3>
          <button @click="closePasswordModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>New Password *</label>
            <input 
              type="password" 
              v-model="passwordData.newPassword" 
              class="form-input"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div class="form-group">
            <label>Confirm New Password *</label>
            <input 
              type="password" 
              v-model="passwordData.confirmPassword" 
              class="form-input"
              placeholder="Confirm your new password"
            />
          </div>

          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
          <p v-if="passwordSuccess" class="success-message">{{ passwordSuccess }}</p>
        </div>

        <div class="modal-footer">
          <button @click="closePasswordModal" class="btn-secondary">Cancel</button>
          <button @click="changePassword" class="btn-primary" :disabled="isChangingPassword">
            {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../../supabase.js';

export default {
  name: 'StudentSettings',
  data() {
    return {
      // Student data
      studentData: {
        id: null,
        student_id: '',
        full_name: '',
        grade_level: null,
        strand: null,
        gender: null,
        profile_id: null
      },
      schoolYear: '',
      currentProfilePicture: null,
      currentProfileId: null,
      
      // Profile modal
      showProfileModal: false,
      profileData: {
        full_name: ''
      },
      selectedImage: null,
      imagePreview: null,
      isSaving: false,
      profileError: '',
      profileSuccess: '',
      
      // Password modal
      showPasswordModal: false,
      passwordData: {
        newPassword: '',
        confirmPassword: ''
      },
      isChangingPassword: false,
      passwordError: '',
      passwordSuccess: '',
      
      // Dark mode
      isDarkMode: false
    };
  },
  
  async mounted() {
    await this.loadUserData();
    this.initializeDarkMode();
  },
  
  methods: {
    async loadUserData() {
      try {
        console.log('Loading user data...');
        
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          await this.$router.push('/login');
          return;
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        this.currentProfileId = profile.id;
        this.currentProfilePicture = profile.profile_photo;
        
        // Get student data with school year
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select(`
            *,
            school_years:school_year_enrolled(year_name)
          `)
          .eq('profile_id', profile.id)
          .single();
        
        if (studentError) throw studentError;
        
        this.studentData = {
          id: student.id,
          student_id: student.student_id,
          full_name: student.full_name,
          grade_level: student.grade_level,
          strand: student.strand,
          gender: student.gender,
          profile_id: student.profile_id
        };
        
        this.schoolYear = student.school_years?.year_name || '';
        
        console.log('User data loaded:', this.studentData);
        
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    
    openProfileModal() {
      this.profileData.full_name = this.studentData.full_name;
      this.showProfileModal = true;
      this.clearMessages();
    },
    
    closeProfileModal() {
      this.showProfileModal = false;
      this.selectedImage = null;
      this.imagePreview = null;
      this.clearMessages();
    },
    
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        this.profileError = 'Please select an image file';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.profileError = 'Image size must be less than 5MB';
        return;
      }

      this.selectedImage = file;
      this.profileError = '';

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    async uploadImage() {
      if (!this.selectedImage) return null;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        const fileExt = this.selectedImage.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Upload to storage
        const { data, error } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, this.selectedImage, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);

        return publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
    
    async saveProfile() {
      this.clearMessages();

      if (!this.profileData.full_name.trim()) {
        this.profileError = 'Full name is required';
        return;
      }

      this.isSaving = true;

      try {
        let photoUrl = this.currentProfilePicture;

        // Upload new photo if selected
        if (this.selectedImage) {
          photoUrl = await this.uploadImage();
        }

        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: this.profileData.full_name,
            profile_photo: photoUrl
          })
          .eq('id', this.currentProfileId);

        if (profileError) throw profileError;

        // Update students table
        const { error: studentError } = await supabase
          .from('students')
          .update({
            full_name: this.profileData.full_name
          })
          .eq('profile_id', this.currentProfileId);

        if (studentError) throw studentError;

        // Update local data
        this.studentData.full_name = this.profileData.full_name;
        this.currentProfilePicture = photoUrl;

        this.profileSuccess = 'Profile updated successfully!';
        
        // Emit event to update dashboard
        window.dispatchEvent(new CustomEvent('studentProfileUpdated', {
          detail: {
            nameChanged: true,
            newName: this.profileData.full_name,
            photoChanged: this.selectedImage !== null,
            newPhoto: photoUrl
          }
        }));

        setTimeout(() => {
          this.closeProfileModal();
        }, 1500);

      } catch (error) {
        console.error('Error saving profile:', error);
        this.profileError = error.message || 'Failed to save profile';
      } finally {
        this.isSaving = false;
      }
    },
    
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
        newPassword: '',
        confirmPassword: ''
      };
    },
    
    async changePassword() {
      this.clearMessages();

      if (!this.passwordData.newPassword || !this.passwordData.confirmPassword) {
        this.passwordError = 'Please fill in all fields';
        return;
      }

      if (this.passwordData.newPassword.length < 6) {
        this.passwordError = 'Password must be at least 6 characters';
        return;
      }

      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.passwordError = 'Passwords do not match';
        return;
      }

      this.isChangingPassword = true;

      try {
        // Update password
        const { error } = await supabase.auth.updateUser({
          password: this.passwordData.newPassword
        });

        if (error) throw error;

        // Update password_changed_from_default flag
        await supabase
          .from('students')
          .update({ password_changed_from_default: true })
          .eq('id', this.studentData.id);

        this.passwordSuccess = 'Password changed successfully!';
        
        setTimeout(() => {
          this.closePasswordModal();
        }, 1500);

      } catch (error) {
        console.error('Error changing password:', error);
        this.passwordError = error.message || 'Failed to update password';
      } finally {
        this.isChangingPassword = false;
      }
    },
    
    initializeDarkMode() {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === 'true') {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
      }
    },
    
    handleDarkModeToggle() {
      localStorage.setItem('darkMode', this.isDarkMode.toString());
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    
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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  padding: 1.5rem 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow-y: auto;
}

/* Custom Scrollbar */
.page-container::-webkit-scrollbar {
  width: 12px;
}

.page-container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.page-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.page-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
}

.main-wrapper {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Card */
.header-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.6);
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
  border-color: rgba(61, 141, 122, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
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
  color: #9ca3af;
}

/* Content Card */
.content-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Settings Card */
.settings-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.settings-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.settings-card:hover::before {
  left: 100%;
}

.settings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(61, 141, 122, 0.3);
}

.dark .settings-card {
  background: rgba(35, 39, 43, 0.95);
  border-color: rgba(61, 141, 122, 0.3);
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.dark .section-title {
  background: linear-gradient(135deg, #A3D1C6, #3D8D7A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-icon {
  color: #3D8D7A;
}

.dark .section-icon {
  color: #20c997;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
}

.dark .section-subtitle {
  color: #9ca3af;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.setting-item:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
  transform: translateX(4px);
}

.dark .setting-item {
  background: rgba(26, 30, 34, 0.8);
  border-color: rgba(55, 65, 81, 0.5);
}

.setting-item span {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.1px;
}

.dark .setting-item span {
  color: #e5e7eb;
}

.info-value {
  color: #3D8D7A !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark .info-value {
  color: #20c997 !important;
}

.strand-badge {
  background: rgba(61, 141, 122, 0.1);
  color: #3D8D7A;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .strand-badge {
  background: rgba(32, 201, 151, 0.1);
  color: #20c997;
}

.action-btn {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
  letter-spacing: -0.1px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.action-btn:hover {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
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
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #3D8D7A;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.slider.round {
  border-radius: 28px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(20px);
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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

.dark .modal-content {
  background: rgba(35, 39, 43, 0.98);
  border-color: rgba(61, 141, 122, 0.4);
}

.modal-header {
  padding: 1.75rem 2rem;
  border-bottom: 2px solid rgba(226, 232, 240, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.modal-header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3D8D7A, transparent);
  opacity: 0.3;
}

.dark .modal-header {
  border-bottom-color: rgba(55, 65, 81, 0.5);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.35rem;
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

.close-btn {
  background: rgba(241, 245, 249, 0.8);
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  background: rgba(226, 232, 240, 0.9);
  color: #1e293b;
  transform: scale(1.05) rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
  padding: 1.75rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  border: 2px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-upload-section:hover {
  background: rgba(241, 245, 249, 0.9);
  border-color: rgba(61, 141, 122, 0.3);
}

.avatar-preview-wrapper {
  display: flex;
  justify-content: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #3D8D7A;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.upload-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.file-input {
  display: none;
}

.file-input-label {
  padding: 0.75rem 1.5rem;
  background: #3D8D7A;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.file-input-label:hover {
  background: #2f6b5c;
  transform: translateY(-1px);
}

.selected-file {
  font-size: 0.813rem;
  color: #64748b;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 700;
  margin-bottom: 0.65rem;
  color: #1e293b;
  font-size: 0.875rem;
  letter-spacing: -0.1px;
}

.dark .form-group label {
  color: #e5e7eb;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 0.938rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(248, 250, 252, 0.5);
  color: #1e293b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
}

.dark .form-input {
  background: rgba(26, 30, 34, 0.8);
  border-color: rgba(55, 65, 81, 0.6);
  color: #e5e7eb;
}

.form-input:focus {
  outline: none;
  border-color: #3D8D7A;
  background: white;
  box-shadow: 0 0 0 3px rgba(61, 141, 122, 0.1);
}

.error-message {
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.success-message {
  padding: 0.75rem;
  background: #d1fae5;
  color: #059669;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.modal-footer {
  padding: 1.75rem 2rem;
  border-top: 2px solid rgba(226, 232, 240, 0.6);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  position: relative;
}

.modal-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3D8D7A, transparent);
  opacity: 0.3;
}

.dark .modal-footer {
  border-top-color: rgba(55, 65, 81, 0.5);
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-size: 0.938rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.1px;
}

.btn-primary {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  box-shadow: 0 4px 12px rgba(61, 141, 122, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d6a5a, #1e4d3f);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 141, 122, 0.35);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: rgba(241, 245, 249, 0.8);
  color: #1e293b;
  border: 2px solid rgba(226, 232, 240, 0.8);
}

.dark .btn-secondary {
  background: rgba(55, 65, 81, 0.6);
  color: #e5e7eb;
  border-color: rgba(75, 85, 99, 0.8);
}

.btn-secondary:hover {
  background: rgba(226, 232, 240, 0.9);
  border-color: rgba(203, 213, 225, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
