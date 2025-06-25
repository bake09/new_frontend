<template>
  <!-- <q-banner inline-actions :class="!$q.dark.isActive ? 'bg-grey-4 text-black' : 'bg-grey-8 text-white'">
    <template v-slot:avatar>
      <q-icon color="primary" name="notifications" />
    </template>
      Push Benachrichtigungen aktivieren?
    <template v-slot:action>
      <div class="row q-gutter-x-sm">
        <q-btn label="Ja" @click="enableNotifications" />
        <q-btn label="Nein" @click="disableNotifications" />
      </div>
    </template>
  </q-banner> -->


  <q-dialog class="pushDialog" v-model="pushStore.showNotificationsBanner" persistent position="top">
    <q-card class="push-dialog-card">
      <q-card-section class="row items-center">
        <q-avatar icon="notifications" color="primary" text-color="white" />
        <span class="q-ml-sm">Push Benachrichtigungen aktivieren?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Ja" @click="enableNotifications" />
        <q-btn label="Nein" @click="disableNotifications" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar()

import { usePushStore } from 'src/stores/push-store';
const pushStore = usePushStore()

const enableNotifications = async () => {
  await pushStore.requestPermission();
  await pushStore.subscribeUser()
  confirm.value = false;
}

const disableNotifications = async () => {
  await pushStore.unsubscribeUser()
  confirm.value = false;
}

const confirm = ref(true);
</script>

<style >
.q-body--force-scrollbar-x {
  overflow: hidden !important;
}
/* .push-dialog-card {
  max-width: 95vw;
  width: 400px;
  min-width: 220px;
  box-sizing: border-box;
}
@media (max-width: 450px) {
  .push-dialog-card {
    width: 98vw;
    min-width: unset;
    padding-left: 0;
    padding-right: 0;
  }
} */
</style>
