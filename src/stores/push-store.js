import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios';

export const usePushStore = defineStore('push', () => {
  
  // State
  const showNotificationsBanner = ref(true)
  
  // Getters
  const pushNotificationsSupported = computed(() => {
      console.log("CHECK pushNotificationsSupported triggered");

      // return 'serviceWorker' in navigator && 'PushManager' in window;
      if('PushManager' in window) return true
      return false
    }
  )
  
  // Actions
  const setPushNotifications = async (val) => {
    if(pushNotificationsSupported.value){
      console.log("supported");
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Push notifications permission granted');
          new Notification('Push notifications enabled');
          navigator.serviceWorker.ready.then((swreg) => {
            swreg.showNotification('Enabled', {
              body: 'You will now receive push notifications.',
              icon: '\icons\favicon-128x128.png'
            });
          })
        } else if (permission === 'denied') {
          console.log('Push notifications permission denied');
        } else {
          console.log('Push notifications permission dismissed');
        }
      })
    }else{
      console.log("not supported");
    }
  }
  // id	subscribable_type	subscribable_id	endpoint	public_key	auth_token	content_encoding	created_at	updated_at	

  // return 
  return {
    showNotificationsBanner,
    pushNotificationsSupported,
    setPushNotifications
  }
})
