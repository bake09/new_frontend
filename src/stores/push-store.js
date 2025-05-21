import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'

export const usePushStore = defineStore('push', () => {
  // State
  const showNotificationsBanner = ref(true)
  const subscription = ref(null)
  const permission = ref(Notification.permission)

  // Getter
  const pushNotificationsSupported = computed(() => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  });

  // Actions
  const requestPermission = async () => {
    if (!pushNotificationsSupported.value) {
      console.warn('Push-Benachrichtigungen werden nicht unterstützt.')
      return;
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result;
      if (result !== 'granted') {
        console.warn('Benachrichtigungsberechtigung nicht erteilt.')
      }
    } catch (error) {
      console.error('Fehler beim Anfordern der Benachrichtigungsberechtigung:', error)
    }
  }

  const subscribeUser = async () => {
    if (permission.value !== 'granted') {
      console.warn('Benachrichtigungsberechtigung nicht erteilt.')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription()

      if (existingSubscription) {
        subscription.value = existingSubscription
        return
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BF7vw8z4IrBtFQsPXUM9Q3StVgebufBI1ZQkpMxSwGUsOy1F1x8_Kt-vZATKIXvgURBOCsqQ8vHYUm3Xvn8LBtU',
        
      });

      subscription.value = newSubscription;

      // Sende die Subscription an das Backend
      await api.post('/notifications/subscribe', newSubscription)
    } catch (error) {
      console.error('Fehler beim Abonnieren von Push-Benachrichtigungen:', error)
    }
  }

  const unsubscribeUser = async () => {
    if (!subscription.value) {
      console.warn('Keine aktive Subscription zum Abbestellen.')
      return;
    }

    try {
      await subscription.value.unsubscribe()
      await api.post('/notifications/unsubscribe', {
        endpoint: subscription.value.endpoint,
      })
      subscription.value = null
    } catch (error) {
      console.error('Fehler beim Abbestellen von Push-Benachrichtigungen:', error)
    }
  }


  // Spalten in der Laravel migration der Packe laravel-notification-channels package
  // id	subscribable_type	subscribable_id	endpoint	public_key	auth_token	content_encoding	created_at	updated_at	

  return {
    // State
    showNotificationsBanner,
    subscription,
    permission,
    // Getter
    pushNotificationsSupported,
    // Actions
    requestPermission,
    subscribeUser,
    unsubscribeUser,
  }
})
