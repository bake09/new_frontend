import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router}) => {
  // something to do
    router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && authStore.user === null) {
      next({ name: 'login'})
    }else if(authStore.user !== null && (to.name === 'login' || to.name === 'register' || to.name === 'forgot-password')){
      next(from.path)
    }else{
      next()
    }
    // next()
  })
})
