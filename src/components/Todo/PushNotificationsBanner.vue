<template>
  <q-banner inline-actions :class="!$q.dark.isActive ? 'bg-grey-4 text-black' : 'bg-grey-8 text-white'">
    <template v-slot:avatar>
      <q-icon color="primary" name="notifications" />
    </template>
      Enable Push Notifications?
    <template v-slot:action>
      <!-- <q-btn flat color="primary" label="later" @click="pushStore.setPushNotifications('later')"/>
      <q-btn flat color="primary" label="Yes" @click="pushStore.setPushNotifications('yes')" /> -->
      <q-btn label="Benachrichtigungen aktivieren" @click="enableNotifications" />
    <q-btn label="Benachrichtigungen deaktivieren" @click="disableNotifications" />
    </template>
  </q-banner>
</template>

<script setup>
import { useQuasar } from 'quasar';
const $q = useQuasar()

import { usePushStore } from 'src/stores/push-store';
const pushStore = usePushStore()

const enableNotifications = async () => {
  await pushStore.requestPermission();
  await pushStore.subscribeUser()
}

const disableNotifications = async () => {
  await pushStore.unsubscribeUser()
}
</script>
