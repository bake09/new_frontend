import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { echo } from 'src/boot/echo';

import { useAuthStore } from "stores/auth-store";
import { LocalStorage, Notify } from 'quasar';

const api = axios.create({ baseURL: process.env.VUE_APP_API_URL })

if(false){
  api.defaults.withCredentials = true;
  api.defaults.withXSRFToken = true;
  
  api.get('/csrf-cookie').then(res => {
    // console.log(res)
  }).catch(err => {
    console.log("Error retieving CSRF-Cookie. Error: ", err)
  })
}else{
}

export default boot(async ({ app, router }) => {
  const authStore = useAuthStore()
  // app.config.globalProperties.$can = authStore.can;
  
  // Add a request interceptor to include the 'X-Socket-Id' header
  api.interceptors.request.use(async config => {
    const token = authStore.token
    const socketId = echo.socketId();
    if(token){
      config.headers.Authorization =  `Bearer ${token}`;
    }
    if (socketId) {
      config.headers['X-Socket-Id'] = socketId;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        await authStore.clearUser()
        Notify.create({
          progress: true,
          position: 'top',
          message: 'Please Login.',
          icon: 'priority_high',
          color: 'negative',
          textColor: 'white',
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ]
        })
        // Throw an exception to stop further execution
        return Promise.reject(error);
      }

      // FORBIDDEN 403
      if (error.response && error.response.status === 403) {
        // router.push({name: 'forbidden'})
        Notify.create({
          progress: true,
          position: 'top',
          message: 'You have no permissions for this action.',
          icon: 'priority_high',
          color: 'negative',
          textColor: 'white',
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => { /* ... */ } }
          ]
        })
        return Promise.reject(error);
      }
      if (error.response && error.response.status === 422) {
        return Promise.reject(error);
      }
      // Handle other errors here
      return Promise.reject(error);
    }
  );
})

export { api }
