import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // State (Ref/Reactive)
  const name = ref('Гість')
  const isLoggedIn = ref(false)
  const loginTime = ref<string | null>(null)

  const profileData = ref(null)
  const isLoading = ref(false)

  async function fetchProfile() {
    isLoading.value = true
    try {
      profileData.value = await $fetch('https://api.github.com/users/octocat')
    } finally {
      isLoading.value = false
    }
  }

  // Getters (Computed)
  const welcomeMessage = computed(() => `Вітаємо, ${name.value}!`)

  // Actions (Functions)
  function login(userName: string) {
    name.value = userName
    isLoggedIn.value = true
    loginTime.value = new Date().toLocaleTimeString()
  }

  function logout() {
    name.value = 'Гість'
    isLoggedIn.value = false
    loginTime.value = null
  }

  // Обов'язково повертаємо ВСІ змінні та функції!
  return {
    name,
    isLoggedIn,
    loginTime,
    profileData,
    isLoading,
    welcomeMessage,
    login,
    logout,
    fetchProfile
  }
})
