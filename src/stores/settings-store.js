import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingStore = defineStore('settings', () => {
  // State
  const tab = ref('')
  const leftDrawerOpen = ref(false)
  const rightDrawerOpen = ref(false)
  const animateTabs = ref(false)
  const addressbarColor = ref('yellow')

  const languages = ref([
    {
      id: 1,
      name: 'german',
      code: 'de',
      isAktive: false,
      
    }
  ])
  
  const thumbStyle = ref({
    borderRadius: '7px',
    backgroundColor: '#027be3',
    width: '4px',
    opacity: 0.75
  })

  const barStyle = ref({
    borderRadius: '9px',
    backgroundColor: '#027be3',
    width: '8px',
    opacity: 0.2
  })

  // Getters
  const isExternalRoute = computed(() => {
    const tabRoutes = ['home', 'login', 'settings']
    return !tabRoutes.includes(tab.value)
  })

  const linksList = ref([
    { title: 'Home', caption: 'Home Page', icon: 'home', to: '/', requiresAuth: true },
    // { title: 'Cdr', caption: 'Cdr Page', icon: 'home', to: '/cdr', requiresAuth: true },
    // { title: 'Cdr-Import', caption: 'Cdr Import Page', icon: 'home', to: '/cdr-import', requiresAuth: true },
    // { title: 'Test2', caption: 'Test2 Page', icon: 'home', to: '/test2', requiresAuth: true },
    { title: 'Login', caption: 'Login Page', icon: 'person', to: 'login', requiresAuth: false },
    // { title: 'Calendar', caption: 'Calendar Page', icon: 'calendar_month', to: 'calendar', requiresAuth: true },
    // { title: 'Lobby', caption: 'Lobby Page', icon: 'settings', to: 'lobby', requiresAuth: true },
    // { title: 'Game', caption: 'Game Page', icon: 'settings', to: 'game', requiresAuth: true },
    { title: 'Settings', caption: 'Settings Page', icon: 'settings', to: 'settings', requiresAuth: true },
    // { title: 'Roles', caption: 'Roles Page', icon: 'settings', to: 'roles', requiresAuth: true },
    { title: 'Profile', caption: 'Profile Page', icon: 'person', to: 'profile', requiresAuth: true },
    { title: 'Users', caption: 'Users Page', icon: 'group', to: 'users', requiresAuth: true },
    // { title: 'UserForm', caption: 'User Form', icon: 'person', to: 'userform', requiresAuth: true },
    // { title: 'Fahrzeuge', caption: 'Fahrzeuge', icon: 'toys', to: 'fahrzeuge', requiresAuth: true },
    // { title: 'Nachlasstypen', caption: 'Nachlasstypen', icon: 'toys', to: 'nachlasstypen', requiresAuth: true },
    // { title: 'Einkaufsnachlass', caption: 'Einkaufsnachlass', icon: 'toys', to: 'einkaufsnachlass', requiresAuth: true },
    // { title: 'Logout', caption: 'Logout Page', icon: 'logout', to: '/logout', requiresAuth: true },
  ])

  // Actions
  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }
  const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  return {
    // State
    tab,
    leftDrawerOpen,
    rightDrawerOpen,
    animateTabs,
    thumbStyle,
    barStyle,
    addressbarColor,

    // Getters
    isExternalRoute,
    linksList,

    // Actions
    toggleLeftDrawer,
    toggleRightDrawer,

  }
})
