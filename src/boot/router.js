import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async ({ router }) => {
  const authStore = useAuthStore()
  router.beforeEach((to, from, next) => {
    const user = authStore.user
    if (to.meta.requiresAuth && !user) {
      return next({ name: 'login' })
    }

    // Eingeloggte dürfen nicht zu Login/Register
    if (user && ['login', 'register', 'forgot-password'].includes(to.name)) {
      return next(from.path)
    }

    // Rollenprüfung
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRoles = user?.roles?.map(r => r.name.toLowerCase()) || []
      const requiredRoles = to.meta.roles.map(r => r.toLowerCase())

      const hasAccess = requiredRoles.some(role => userRoles.includes(role))

      if (!hasAccess) {
        console.warn(`🚫 Zugriff auf "${to.name}" verweigert. Deine BenutzerRolle : ${userRoles.join(', ')} hat auf diese Seite keine Zugriffsberechtigung.`)
        return next({ name: 'forbidden' })
      }
      // Zugriff erlaubt → weiter
      return next()
    }

    // Kein Rollen-Check nötig → weiter
    return next()
  })
})