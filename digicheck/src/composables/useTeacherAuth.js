import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'

// Global state
const currentUser = ref(null)
const teacherInfo = ref(null)
const isInitialized = ref(false)
const isLoading = ref(false)
const authListener = ref(null)

export function useTeacherAuth() {
  const router = useRouter()

  // Initialize authentication once and reuse - with better persistence
  const initializeAuth = async (force = false) => {
    if (isInitialized.value && !force) {
      return { success: true, user: currentUser.value, teacher: teacherInfo.value }
    }

    if (isLoading.value) {
      // Wait for existing initialization to complete
      return new Promise((resolve) => {
        const checkInit = () => {
          if (!isLoading.value) {
            resolve({ 
              success: isInitialized.value, 
              user: currentUser.value, 
              teacher: teacherInfo.value 
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
          .select('id, role, full_name, email')
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

      // Allow both 'teacher' role and 'admin' role (if admin has teacher record)
      if (profile.role !== 'teacher' && profile.role !== 'admin') {
        console.warn('User is neither a teacher nor an admin')
        return { success: false, wrongRole: true }
      }

      // Get teacher details with retry
      let teacher = null
      let teacherError = null
      
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await supabase
          .from('teachers')
          .select('*')
          .eq('profile_id', profile.id)
          .eq('is_active', true)
          .single()
        
        teacher = result.data
        teacherError = result.error
        
        if (!teacherError && teacher) {
          break
        }
        
        if (attempt < 1) {
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }

      if (teacherError || !teacher) {
        console.error('Teacher error:', teacherError)
        // If user is admin but has no teacher record, show specific message
        if (profile.role === 'admin') {
          console.warn('Admin user has no teacher record')
          return { success: false, needsTeacherRole: true }
        }
        return { success: false, needsLogin: true }
      }

      teacherInfo.value = { ...teacher, profile }
      isInitialized.value = true
      
      console.log('Teacher authentication initialized:', teacher.id)
      return { success: true, user: currentUser.value, teacher: teacherInfo.value }

    } catch (error) {
      console.error('Authentication error:', error)
      return { success: false, needsLogin: true }
    } finally {
      isLoading.value = false
    }
  }

  // Setup auth state listener (only once)
  const setupAuthListener = () => {
    if (authListener.value) {
      return // Already set up
    }
    
    authListener.value = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT' || !session) {
        currentUser.value = null
        teacherInfo.value = null
        isInitialized.value = false
        await router.push('/login')
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token refreshed, update user but don't re-fetch everything
        currentUser.value = session.user
      }
    })
  }

  // Get current teacher info without re-initialization
  const getTeacherInfo = () => {
    return {
      user: currentUser.value,
      teacher: teacherInfo.value,
      isInitialized: isInitialized.value,
      isLoading: isLoading.value
    }
  }

  // Reset state on logout
  const resetAuth = () => {
    currentUser.value = null
    teacherInfo.value = null
    isInitialized.value = false
    isLoading.value = false
    
    if (authListener.value) {
      authListener.value.data.subscription.unsubscribe()
      authListener.value = null
    }
  }

  // Computed properties
  const isAuthenticated = computed(() => {
    return isInitialized.value && currentUser.value && teacherInfo.value
  })

  const teacherId = computed(() => {
    return teacherInfo.value?.id || null
  })

  const teacherProfile = computed(() => {
    return teacherInfo.value?.profile || null
  })

  return {
    // State
    currentUser: computed(() => currentUser.value),
    teacherInfo: computed(() => teacherInfo.value),
    isInitialized: computed(() => isInitialized.value),
    isLoading: computed(() => isLoading.value),
    isAuthenticated,
    teacherId,
    teacherProfile,
    
    // Methods
    initializeAuth,
    setupAuthListener,
    getTeacherInfo,
    resetAuth
  }
}