<template>
  <div class="user-account-creation">
    <!-- Top Navigation with Back Button -->
    <div class="top-navigation">
      <button @click="goBackToDashboard" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Back to Dashboard</span>
      </button>
    </div>

    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1>User Account Creation</h1>
          <p class="subtitle">Create new student or teacher accounts with auto-generated credentials</p>
        </div>
        <div class="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Account Type Selector -->
    <section class="account-type-selector">
      <div class="tabs">
        <button 
          :class="['tab', { active: accountType === 'student' }]"
          @click="accountType = 'student'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Create Student Account
        </button>
        <button 
          :class="['tab', { active: accountType === 'teacher' }]"
          @click="accountType = 'teacher'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Create Teacher Account
        </button>
      </div>
    </section>

    <!-- Student Account Form -->
    <section v-if="accountType === 'student'" class="account-form">
      <div class="form-header">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <h2>Student Account Details</h2>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>First Name</label>
          <input v-model="studentForm.first_name" type="text" class="form-input" @input="updatePreview" />
        </div>
        <div class="form-group">
          <label>Middle Name</label>
          <input v-model="studentForm.middle_name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input v-model="studentForm.last_name" type="text" class="form-input" @input="updatePreview" />
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select v-model="studentForm.gender" class="form-input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="studentForm.email" type="email" class="form-input" @blur="validateEmail" @input="updatePreview" />
          <small v-if="emailError" class="error-text">{{ emailError }}</small>
        </div>
        <div class="form-group">
          <label>Grade Level</label>
          <select v-model.number="studentForm.grade_level" class="form-input" @change="onGradeLevelChange">
            <option value="">Select Grade</option>
            <option v-for="g in [7,8,9,10,11,12]" :key="g" :value="g">Grade {{ g }}</option>
          </select>
        </div>
        <div class="form-group" v-if="isSeniorHigh">
          <label>Strand *</label>
          <select v-model="studentForm.strand" class="form-input">
            <option value="">Select Strand</option>
            <option value="STEM">STEM (Science, Technology, Engineering, and Mathematics)</option>
            <option value="ABM">ABM (Accountancy, Business, and Management)</option>
            <option value="HUMSS">HUMSS (Humanities and Social Sciences)</option>
            <option value="GAS">GAS (General Academic Strand)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Student ID (Optional)</label>
          <input v-model="studentForm.student_id" type="text" class="form-input" placeholder="Auto-generated if empty" />
        </div>
        <div class="form-group">
          <label>Date of Birth</label>
          <input v-model="studentForm.date_of_birth" type="date" class="form-input" />
        </div>
        <div class="form-group">
          <label>Contact Number</label>
          <input v-model="studentForm.contact_number" type="text" class="form-input" />
        </div>
        <div class="form-group full-width">
          <label>Address</label>
          <textarea v-model="studentForm.address" class="form-input" rows="2"></textarea>
        </div>
      </div>

      <!-- Auto-generated Credentials Preview -->
      <div class="credentials-preview">
        <div class="preview-header">
          <h3>Auto-Generated Credentials</h3>
        </div>
        <div class="preview-grid">
          <div class="preview-item">
            <label>Login Email</label>
            <div class="preview-value">{{ studentForm.email || '(enter email above)' }}</div>
          </div>
          <div class="preview-item">
            <label>Temporary Password</label>
            <div class="preview-value password">{{ generatedPassword }}</div>
          </div>
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="sendEmail" />
          <span>Send credentials via email to student</span>
        </label>
      </div>

      <div class="form-actions">
        <button @click="createStudentAccount" class="btn-primary" :disabled="!isStudentFormValid || creating">
          {{ creating ? 'Creating...' : 'Create Student Account' }}
        </button>
        <button @click="resetStudentForm" class="btn-secondary">
          Clear Form
        </button>
      </div>
    </section>

    <!-- Teacher Account Form -->
    <section v-if="accountType === 'teacher'" class="account-form">
      <div class="form-header">
        <h2>Teacher Account Details</h2>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>First Name *</label>
          <input v-model="teacherForm.first_name" type="text" class="form-input" @input="updatePreview" />
        </div>
        <div class="form-group">
          <label>Middle Name</label>
          <input v-model="teacherForm.middle_name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>Last Name *</label>
          <input v-model="teacherForm.last_name" type="text" class="form-input" @input="updatePreview" />
        </div>
        <div class="form-group">
          <label>Gender *</label>
          <select v-model="teacherForm.gender" class="form-input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input v-model="teacherForm.email" type="email" class="form-input" @blur="validateEmail" @input="updatePreview" />
          <small v-if="emailError" class="error-text">{{ emailError }}</small>
        </div>
        <div class="form-group">
          <label>Employee ID (Optional)</label>
          <input v-model="teacherForm.employee_id" type="text" class="form-input" placeholder="Auto-generated if empty" />
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input v-model="teacherForm.phone_number" type="text" class="form-input" />
        </div>
        <div class="form-group full-width">
          <label>Address</label>
          <textarea v-model="teacherForm.address" class="form-input" rows="2"></textarea>
        </div>
      </div>

      <div class="credentials-preview">
        <div class="preview-header">
          <h3>Auto-Generated Credentials</h3>
        </div>
        <div class="preview-grid">
          <div class="preview-item">
            <label>Login Email</label>
            <div class="preview-value">{{ teacherForm.email || '(enter email above)' }}</div>
          </div>
          <div class="preview-item">
            <label>Temporary Password</label>
            <div class="preview-value password">{{ generatedPassword }}</div>
          </div>
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="sendEmail" />
          <span>Send credentials via email to teacher</span>
        </label>
      </div>

      <div class="form-actions">
        <button @click="createTeacherAccount" class="btn-primary" :disabled="!isTeacherFormValid || creating">
          {{ creating ? 'Creating...' : 'Create Teacher Account' }}
        </button>
        <button @click="resetTeacherForm" class="btn-secondary">
          Clear Form
        </button>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeSuccessModal">
      <div class="modal-content success-modal">
        <div class="modal-header success-header">
          <h2>Account Created Successfully!</h2>
          <button @click="closeSuccessModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="success-message">
            <p><strong>{{ accountType === 'student' ? 'Student' : 'Teacher' }} account has been created.</strong></p>
            <p v-if="sendEmail">Credentials have been sent to <strong>{{ createdEmail }}</strong></p>
          </div>

          <div class="credentials-display">
            <h3>Login Credentials</h3>
            <div class="credential-box">
              <div class="credential-row">
                <span class="credential-label">Name</span>
                <span class="credential-value">{{ createdName }}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Login Email</span>
                <span class="credential-value username-highlight">{{ createdEmail }}</span>
              </div>
              <div class="credential-row">
                <span class="credential-label">Temporary Password</span>
                <span class="credential-value password-highlight">{{ createdPassword }}</span>
              </div>
            </div>
          </div>

          <div class="warning-box">
            <strong>Important:</strong> Make sure to save these credentials. The {{ accountType === 'student' ? 'student' : 'teacher' }} will need them to log in for the first time.
          </div>

          <div class="modal-actions">
            <button @click="createAnother" class="btn-primary">Create Another Account</button>
            <button @click="closeSuccessModal" class="btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'UserAccountCreation',
  data() {
    return {
      accountType: 'student',
      studentForm: {
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        email: '',
        grade_level: '',
        strand: '',
        student_id: '',
        date_of_birth: '',
        contact_number: '',
        address: ''
      },
      teacherForm: {
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        email: '',
        employee_id: '',
        phone_number: '',
        address: ''
      },
      generatedPassword: '',
      sendEmail: false,
      emailError: '',
      creating: false,
      showSuccessModal: false,
      createdPassword: '',
      createdEmail: '',
      createdName: ''
    }
  },
  computed: {
    isStudentFormValid() {
      const basicValid = this.studentForm.first_name.trim() !== '' &&
             this.studentForm.last_name.trim() !== '' &&
             this.studentForm.gender !== '' &&
             this.studentForm.email.trim() !== '' &&
             this.studentForm.grade_level !== '' &&
             !this.emailError
      
      // If Grade 11 or 12, strand is required
      if (this.studentForm.grade_level === 11 || this.studentForm.grade_level === 12) {
        return basicValid && this.studentForm.strand !== ''
      }
      
      return basicValid
    },
    isTeacherFormValid() {
      return this.teacherForm.first_name.trim() !== '' &&
             this.teacherForm.last_name.trim() !== '' &&
             this.teacherForm.gender !== '' &&
             this.teacherForm.email.trim() !== '' &&
             !this.emailError
    },
    isSeniorHigh() {
      return this.studentForm.grade_level === 11 || this.studentForm.grade_level === 12
    }
  },
  mounted() {
    this.generatedPassword = this.generatePassword()
  },
  methods: {
    goBackToDashboard() {
      this.$router.push('/admin/dashboard')
    },

    updatePreview() {
      // This method can be used for any real-time preview updates if needed
    },

    onGradeLevelChange() {
      // Clear strand if switching away from senior high
      if (!this.isSeniorHigh) {
        this.studentForm.strand = ''
      }
    },

    generatePassword(length = 12) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },

    async validateEmail() {
      const email = this.accountType === 'student' ? this.studentForm.email : this.teacherForm.email
      
      if (!email.trim()) {
        this.emailError = ''
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        this.emailError = 'Invalid email format'
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single()

      if (data) {
        this.emailError = 'Email already exists'
      } else {
        this.emailError = ''
      }
    },

    async createStudentAccount() {
      if (!this.isStudentFormValid) return

      this.creating = true

      try {
        const password = this.generatedPassword
        const student_id = this.studentForm.student_id || `S${Date.now().toString().slice(-8)}`

        const fullName = [
          this.studentForm.first_name,
          this.studentForm.middle_name,
          this.studentForm.last_name
        ].filter(Boolean).join(' ')

        // Check if email already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', this.studentForm.email)
          .single()

        if (existingProfile) {
          alert('This email is already registered in the system.')
          this.creating = false
          return
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: this.studentForm.email,
          password: password,
          options: {
            data: {
              full_name: fullName,
              first_name: this.studentForm.first_name,
              last_name: this.studentForm.last_name,
              middle_name: this.studentForm.middle_name || null,
              role: 'student',
              grade_level: this.studentForm.grade_level,
              student_id: student_id,
              gender: this.studentForm.gender,
              strand: this.studentForm.strand || null
            },
            emailRedirectTo: window.location.origin
          }
        })

        if (authError) {
          console.error('Auth user creation error:', authError)
          alert(`Failed to create auth user: ${authError.message}`)
          this.creating = false
          return
        }

        if (!authData.user) {
          alert('Failed to create user account.')
          this.creating = false
          return
        }

        const authUserId = authData.user.id

        // Wait for trigger to create profile (3 seconds)
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Fetch the auto-created profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single()

        if (profileError || !profile) {
          console.error('Profile not found:', profileError)
          alert('Profile was not created automatically. Please check database triggers.')
          this.creating = false
          return
        }

        console.log('Profile created by trigger:', profile)

        // Update profile with gender
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ gender: this.studentForm.gender })
          .eq('id', profile.id)

        if (profileUpdateError) {
          console.warn('Failed to update profile gender:', profileUpdateError)
        }

        // Get active school year
        const { data: activeYear } = await supabase
          .from('school_years')
          .select('id')
          .eq('is_active', true)
          .single()

        // Wait a bit more for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if student record was auto-created by trigger
        const { data: existingStudent } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', profile.id)
          .single()

        let studentData

        if (existingStudent) {
          // Update the auto-created student record
          const { data: updatedStudent, error: updateError } = await supabase
            .from('students')
            .update({
              first_name: this.studentForm.first_name,
              last_name: this.studentForm.last_name,
              middle_name: this.studentForm.middle_name || null,
              full_name: fullName,
              email: this.studentForm.email,
              grade_level: this.studentForm.grade_level,
              student_id: student_id,
              gender: this.studentForm.gender,
              strand: this.studentForm.strand || null,
              enrollment_status: 'active',
              school_year_enrolled: activeYear?.id || null,
              is_active: true
            })
            .eq('id', existingStudent.id)
            .select()
            .single()

          if (updateError) {
            console.error('Student update error:', updateError)
            alert(`Failed to update student record: ${updateError.message}`)
            this.creating = false
            return
          }

          studentData = updatedStudent
          console.log('Student record updated successfully')
        } else {
          // Create student record manually
          const { data: newStudent, error: studentError } = await supabase
            .from('students')
            .insert({
              profile_id: profile.id,
              first_name: this.studentForm.first_name,
              last_name: this.studentForm.last_name,
              middle_name: this.studentForm.middle_name || null,
              full_name: fullName,
              email: this.studentForm.email,
              grade_level: this.studentForm.grade_level,
              student_id: student_id,
              gender: this.studentForm.gender,
              strand: this.studentForm.strand || null,
              enrollment_status: 'active',
              school_year_enrolled: activeYear?.id || null,
              is_active: true
            })
            .select()
            .single()

          if (studentError) {
            console.error('Student creation error:', studentError)
            alert(`Failed to create student record: ${studentError.message}`)
            this.creating = false
            return
          }

          studentData = newStudent
          console.log('Student record created successfully')
        }

        console.log('Final student data:', studentData)

        this.createdPassword = password
        this.createdEmail = this.studentForm.email
        this.createdName = fullName
        this.showSuccessModal = true

      } catch (error) {
        console.error('Error creating student account:', error)
        alert('An error occurred while creating the account')
      }

      this.creating = false
    },

    async createTeacherAccount() {
      if (!this.isTeacherFormValid) return

      this.creating = true

      try {
        const password = this.generatedPassword
        const employee_id = this.teacherForm.employee_id || `T${Date.now().toString().slice(-8)}`

        const fullName = [
          this.teacherForm.first_name,
          this.teacherForm.middle_name,
          this.teacherForm.last_name
        ].filter(Boolean).join(' ')

        // Check if email already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', this.teacherForm.email)
          .single()

        if (existingProfile) {
          alert('This email is already registered in the system.')
          this.creating = false
          return
        }

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: this.teacherForm.email,
          password: password,
          options: {
            data: {
              full_name: fullName,
              first_name: this.teacherForm.first_name,
              last_name: this.teacherForm.last_name,
              middle_name: this.teacherForm.middle_name || null,
              role: 'teacher',
              employee_id: employee_id,
              gender: this.teacherForm.gender
            },
            emailRedirectTo: window.location.origin
          }
        })

        if (authError) {
          console.error('Auth user creation error:', authError)
          alert(`Failed to create auth user: ${authError.message}`)
          this.creating = false
          return
        }

        if (!authData.user) {
          alert('Failed to create user account.')
          this.creating = false
          return
        }

        const authUserId = authData.user.id

        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Fetch the auto-created profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single()

        if (profileError || !profile) {
          console.error('Profile not found:', profileError)
          alert('Profile was not created automatically. Please check database triggers.')
          this.creating = false
          return
        }

        console.log('Profile created by trigger:', profile)

        // Update profile with gender
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ gender: this.teacherForm.gender })
          .eq('id', profile.id)

        if (profileUpdateError) {
          console.warn('Failed to update profile gender:', profileUpdateError)
        }

        // Wait for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if teacher record was auto-created by trigger
        const { data: existingTeacher } = await supabase
          .from('teachers')
          .select('*')
          .eq('profile_id', profile.id)
          .single()

        let teacherData

        if (existingTeacher) {
          // Update the auto-created teacher record
          const { data: updatedTeacher, error: updateError } = await supabase
            .from('teachers')
            .update({
              first_name: this.teacherForm.first_name,
              last_name: this.teacherForm.last_name,
              middle_name: this.teacherForm.middle_name || null,
              full_name: fullName,
              email: this.teacherForm.email,
              employee_id: employee_id,
              phone_number: this.teacherForm.phone_number || null,
              address: this.teacherForm.address || null,
              status: 'active'
            })
            .eq('id', existingTeacher.id)
            .select()
            .single()

          if (updateError) {
            console.error('Teacher update error:', updateError)
            alert(`Failed to update teacher record: ${updateError.message}`)
            this.creating = false
            return
          }

          teacherData = updatedTeacher
          console.log('Teacher record updated successfully')
        } else {
          // Create teacher record manually
          const { data: newTeacher, error: teacherError } = await supabase
            .from('teachers')
            .insert({
              profile_id: profile.id,
              first_name: this.teacherForm.first_name,
              last_name: this.teacherForm.last_name,
              middle_name: this.teacherForm.middle_name || null,
              full_name: fullName,
              email: this.teacherForm.email,
              employee_id: employee_id,
              phone_number: this.teacherForm.phone_number || null,
              address: this.teacherForm.address || null,
              status: 'active'
            })
            .select()
            .single()

          if (teacherError) {
            console.error('Teacher creation error:', teacherError)
            alert(`Failed to create teacher record: ${teacherError.message}`)
            this.creating = false
            return
          }

          teacherData = newTeacher
          console.log('Teacher record created successfully')
        }

        console.log('Final teacher data:', teacherData)

        this.createdPassword = password
        this.createdEmail = this.teacherForm.email
        this.createdName = fullName
        this.showSuccessModal = true

      } catch (error) {
        console.error('Error creating teacher account:', error)
        alert('An error occurred while creating the account')
      }

      this.creating = false
    },

    resetStudentForm() {
      this.studentForm = {
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        email: '',
        grade_level: '',
        strand: '',
        student_id: '',
        date_of_birth: '',
        contact_number: '',
        address: ''
      }
      this.generatedPassword = this.generatePassword()
      this.emailError = ''
      this.sendEmail = false
    },

    resetTeacherForm() {
      this.teacherForm = {
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '',
        email: '',
        employee_id: '',
        phone_number: '',
        address: ''
      }
      this.generatedPassword = this.generatePassword()
      this.emailError = ''
      this.sendEmail = false
    },

    createAnother() {
      if (this.accountType === 'student') {
        this.resetStudentForm()
      } else {
        this.resetTeacherForm()
      }
      this.showSuccessModal = false
    },

    closeSuccessModal() {
      this.showSuccessModal = false
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

.user-account-creation {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #fef3c7 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 1rem 2rem;
  overflow-y: auto;
  position: relative;
}

/* Enhanced Scrollbar */
.user-account-creation::-webkit-scrollbar {
  width: 12px;
}

.user-account-creation::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  border-radius: 10px;
}

.user-account-creation::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid #f1f5f9;
}

.user-account-creation::-webkit-scrollbar-thumb:hover {
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

.page-header {
  margin-bottom: 1.25rem;
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
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
  position: relative;
  overflow: hidden;
}

.header-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
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
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 4px 14px rgba(61, 141, 122, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 6px 20px rgba(61, 141, 122, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.account-type-selector {
  margin-bottom: 1.25rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

.tabs {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  padding: 0.75rem;
  border-radius: 20px;
  border: 2px solid rgba(61, 141, 122, 0.1);
  box-shadow: 
    0 4px 20px rgba(61, 141, 122, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  color: #64748b;
  border-radius: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.tab:hover::before {
  left: 100%;
}

.tab.active {
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  box-shadow: 
    0 4px 14px rgba(61, 141, 122, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.tab.active::before {
  left: 100%;
}

.tab:hover:not(.active) {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.account-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid rgba(61, 141, 122, 0.1);
  box-shadow: 
    0 4px 20px rgba(61, 141, 122, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
  max-height: calc(100vh - 320px);
  overflow-y: auto;
}

/* Scrollbar for Account Form */
.account-form::-webkit-scrollbar {
  width: 10px;
}

.account-form::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  border-radius: 10px;
  margin: 8px;
}

.account-form::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3D8D7A, #2d6a5a);
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

.account-form::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #2d6a5a, #1e4d3f);
}

.form-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(61, 141, 122, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-header svg {
  color: #3D8D7A;
}

.form-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.3px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #475569;
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

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.credentials-preview {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 2px solid rgba(61, 141, 122, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 
    0 4px 16px rgba(61, 141, 122, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
}

.credentials-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  to { left: 100%; }
}

.preview-header h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0c4a6e;
  letter-spacing: -0.3px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.preview-item label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #0c4a6e;
  margin-bottom: 0.5rem;
}

.preview-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0c4a6e;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 10px;
  border: 2px solid #bae6fd;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.preview-value:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.preview-value.password {
  color: #d97706;
  border-color: #fde68a;
  background: linear-gradient(135deg, #fefce8, #fef3c7);
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.1);
}

.preview-value.password:hover {
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.15);
}

.form-options {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  color: #475569;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3D8D7A;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  flex: 1;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3D8D7A, #2d6a5a);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #475569;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
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
  max-height: 90vh;
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

.success-modal {
  max-width: 700px;
}

.modal-header {
  padding: 2rem;
  border-bottom: 2px solid rgba(61, 141, 122, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafbfc;
  border-radius: 24px 24px 0 0;
}

.success-header {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  position: relative;
  overflow: hidden;
}

.success-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  border-radius: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #475569;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: rotate(90deg);
  color: #1e293b;
}

.modal-body {
  padding: 2rem;
}

.success-message {
  text-align: center;
  margin-bottom: 2rem;
}

.success-message p {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: #475569;
}

.credentials-display h3 {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}

.credential-box {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.credential-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.credential-row:last-child {
  border-bottom: none;
}

.credential-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #64748b;
}

.credential-value {
  font-weight: 600;
  color: #1e293b;
}

.username-highlight {
  color: #0ea5e9;
  font-family: 'Monaco', monospace;
  background: #f0f9ff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.password-highlight {
  color: #d97706;
  font-family: 'Monaco', monospace;
  font-weight: 700;
  background: #fef3c7;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.warning-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  color: #92400e;
}

.warning-box strong {
  display: block;
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 1400px) {
  .user-account-creation {
    padding: 1rem 1.5rem;
  }

  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 1200px) {
  .header-text h1 {
    font-size: 1.6rem;
  }

  .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 1024px) {
  .account-form {
    max-height: calc(100vh - 300px);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .user-account-creation {
    padding: 0.75rem 1rem;
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

  .tabs {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

  .account-form {
    max-height: calc(100vh - 280px);
  }

  .back-button {
    font-size: 0.85rem;
    padding: 0.65rem 1rem;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .user-account-creation {
    padding: 0.5rem;
  }

  .header-text h1 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .tab {
    font-size: 0.85rem;
    padding: 0.85rem 1rem;
  }

  .header-icon {
    width: 48px;
    height: 48px;
  }

  .form-header h2 {
    font-size: 1.1rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.85rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>