import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'

// Global state
const currentUser = ref(null)
const adminInfo = ref(null)
const isInitialized = ref(false)
const isLoading = ref(false)
const authListener = ref(null)

export function useAdminAuth() {
  const router = useRouter()

  // Initialize authentication once and reuse - with better persistence
  const initializeAuth = async (force = false) => {
    if (isInitialized.value && !force) {
      return { success: true, user: currentUser.value, admin: adminInfo.value }
    }

    if (isLoading.value) {
      // Wait for existing initialization to complete
      return new Promise((resolve) => {
        const checkInit = () => {
          if (!isLoading.value) {
            resolve({ 
              success: isInitialized.value, 
              user: currentUser.value, 
              admin: adminInfo.value 
            })
          } else {
            setTimeout(checkInit, 100)
          }
        }
        checkInit()
      })
    }

    isLoading.value = true

    try {
      // Try to get session with retry logic for refresh scenarios
      let session = null
      let sessionError = null
      
      for (let attempt = 0; attempt < 3; attempt++) {
        const result = await supabase.auth.getSession()
        session = result.data?.session
        sessionError = result.error
        
        if (!sessionError && session) {
          break
        }
        
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      if (sessionError) {
        console.error('Session error after retries:', sessionError)
        // Only fail on authentication errors, not network errors
        if (sessionError.message?.includes('Invalid') || sessionError.message?.includes('Expired')) {
          throw sessionError
        }
      }
      
      if (!session?.user) {
        console.warn('No active session')
        return { success: false, needsLogin: true }
      }
      
      currentUser.value = session.user
      
      // Get profile data with retry
      let profile = null
      let profileError = null
      
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await supabase
          .from('profiles')
          .select('id, role, full_name, email, gender')
          .eq('auth_user_id', session.user.id)
          .single()
        
        profile = result.data
        profileError = result.error
        
        if (!profileError && profile) {
          break
        }
        
        if (attempt < 1) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
      
      if (profileError || !profile) {
        console.error('Profile error:', profileError)
        return { success: false, needsLogin: true }
      }

      if (profile.role !== 'admin') {
        console.warn('User is not an admin')
        return { success: false, wrongRole: true }
      }

      adminInfo.value = { ...profile }
      isInitialized.value = true
      
      console.log('Admin authentication initialized:', profile.id)
      return { success: true, user: currentUser.value, admin: adminInfo.value }

    } catch (error) {
      console.error('Authentication error:', error)
      return { success: false, needsLogin: true }
    } finally {
      isLoading.value = false
    }
  }

  // Setup auth state listener
  const setupAuthListener = () => {
    if (authListener.value) return

    authListener.value = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Admin auth state changed:', event)

      if (event === 'SIGNED_OUT' || !session) {
        currentUser.value = null
        adminInfo.value = null
        isInitialized.value = false
        router.push('/login')
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await initializeAuth(true)
      }
    })
  }

  // Cleanup auth listener
  const cleanupAuthListener = () => {
    if (authListener.value) {
      authListener.value.data.subscription.unsubscribe()
      authListener.value = null
    }
  }

  // Logout function
  const logout = async () => {
    try {
      cleanupAuthListener()
      currentUser.value = null
      adminInfo.value = null
      isInitialized.value = false
      
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check if admin also has a teacher record
  const checkTeacherRole = async () => {
    if (!adminInfo.value) return { hasTeacherRole: false }

    try {
      const { data: teacherRecord, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('profile_id', adminInfo.value.id)
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        console.error('Error checking teacher role:', error)
        return { hasTeacherRole: false }
      }

      return { 
        hasTeacherRole: !!teacherRecord,
        teacherData: teacherRecord
      }
    } catch (error) {
      console.error('Error checking teacher role:', error)
      return { hasTeacherRole: false }
    }
  }

  // Register admin as teacher
  const registerAsTeacher = async (teacherInfo = {}) => {
    if (!adminInfo.value) {
      throw new Error('No admin session found')
    }

    try {
      // Check if already registered as teacher
      const { hasTeacherRole } = await checkTeacherRole()
      if (hasTeacherRole) {
        return { success: true, message: 'Already registered as teacher' }
      }

      // Create teacher record
      const employee_id = teacherInfo.employee_id || `T${Date.now().toString().slice(-8)}`
      
      // Parse full name to get first and last name
      const nameParts = (adminInfo.value.full_name || 'Admin User').split(' ')
      const firstName = teacherInfo.first_name || nameParts[0] || 'Admin'
      const lastName = teacherInfo.last_name || nameParts.slice(1).join(' ') || 'User'
      
      const { data: newTeacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          profile_id: adminInfo.value.id,
          employee_id: employee_id,
          full_name: adminInfo.value.full_name || 'Admin User',
          email: adminInfo.value.email,
          department: teacherInfo.department || null,
          phone_number: teacherInfo.phone_number || null,
          address: teacherInfo.address || null,
          is_active: true
        })
        .select()
        .single()

      if (teacherError) {
        console.error('Teacher creation error:', teacherError)
        throw new Error(`Failed to create teacher record: ${teacherError.message}`)
      }

      console.log('Teacher record created for admin:', newTeacher)
      return { 
        success: true, 
        message: 'Successfully registered as teacher',
        teacherData: newTeacher
      }
    } catch (error) {
      console.error('Error registering as teacher:', error)
      throw error
    }
  }

  // Switch to teacher dashboard
  const switchToTeacherDashboard = async () => {
    const { hasTeacherRole } = await checkTeacherRole()
    if (!hasTeacherRole) {
      throw new Error('No teacher role found. Please register as teacher first.')
    }

    router.push('/teacher/dashboard')
  }

  return {
    // State
    currentUser: computed(() => currentUser.value),
    adminInfo: computed(() => adminInfo.value),
    isAuthenticated: computed(() => isInitialized.value && !!currentUser.value && !!adminInfo.value),
    isLoading: computed(() => isLoading.value),
    adminId: computed(() => adminInfo.value?.id),

    // Methods
    initializeAuth,
    setupAuthListener,
    cleanupAuthListener,
    logout,
    checkTeacherRole,
    registerAsTeacher,
    switchToTeacherDashboard
  }
}
