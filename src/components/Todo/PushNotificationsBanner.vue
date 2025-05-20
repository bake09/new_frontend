<template>
  <q-banner inline-actions :class="!$q.dark.isActive ? 'bg-grey-4 text-black' : 'bg-grey-8 text-white'">
    <template v-slot:avatar>
      <q-icon color="primary" name="notifications" />
    </template>
      Enable Push Notifications?
    <template v-slot:action>
      <q-btn flat color="primary" label="Never" @click="todoStore.setPushNotifications('never')"/>
      <q-btn flat color="primary" label="later" @click="todoStore.setPushNotifications('later')"/>
      <q-btn flat color="primary" label="Yes" @click="todoStore.setPushNotifications('yes')" />
    </template>
  </q-banner>
</template>

<script setup>
import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

import { useQuasar } from 'quasar';
const $q = useQuasar()

</script>
