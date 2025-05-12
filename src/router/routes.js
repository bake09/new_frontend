const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        component: () => import('src/pages/TodoPage.vue'),
        name: 'home',
        meta: { requiresAuth: true },
      },
      { 
        path: '/calendar',
        component: () => import('pages/CalendarPage.vue'),
        name: 'calendar',
        meta: { requiresAuth: true },
      },
      { 
        path: '/settings',
        component: () => import('pages/SettingsPage.vue'),
        name: 'settings',
        meta: { requiresAuth: true },
      },
      { 
        path: '/roles',
        component: () => import('pages/RolesPage.vue'),
        name: 'roles',
        meta: { requiresAuth: true },
      },
      {
        path: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        name: 'login'
      },
      {
        path: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
        name: 'register'
      },
      {
        path: 'forgot-password',
        component: () => import('pages/auth/ForgotPasswordPage.vue'),
        name: 'forgot-password'
      },
      {
        path: 'profile',
        component: () => import('pages/ProfilePage.vue'),
        name: 'profile',
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        component: () => import('pages/UsersPage.vue'),
        name: 'users',
        meta: { requiresAuth: true },
      },
      {
        path: 'userform',
        component: () => import('pages/UserFormPage.vue'),
        name: 'userform',
        meta: { requiresAuth: true },
      },
      {
        path: 'forbidden',
        component: () => import('pages/ErrorForbidden.vue'),
        name: 'forbidden'
      },
      {
        path: 'logout',
        component: () => import('pages/auth/LogoutPage.vue'),
        name: 'logout',
        meta: { requiresAuth: true },
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
