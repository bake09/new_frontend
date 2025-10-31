import { useAuthStore } from 'src/stores/auth-store'

export function useAccessControl() {
  const authStore = useAuthStore()

  /**
   * Prüft, ob der eingeloggte User die erforderlichen Rollen besitzt
   * @param {Array<string>} requiredRoles
   * @returns {boolean}
   */
  function hasRole(requiredRoles = []) {
    const userRoles = authStore.user?.roles?.map(r => r.name.toLowerCase()) || []
    const roles = requiredRoles.map(r => r.toLowerCase())
    return roles.some(role => userRoles.includes(role))
  }

  /**
   * Prüft, ob der User eine bestimmte Berechtigung (Permission) hat
   * (optional für später)
   */
  function hasPermission(requiredPermissions = []) {
    const userPermissions = authStore.user?.permissions?.map(p => p.name.toLowerCase()) || []
    const permissions = requiredPermissions.map(p => p.toLowerCase())
    return permissions.some(p => userPermissions.includes(p))
  }

  return { hasRole, hasPermission }
}