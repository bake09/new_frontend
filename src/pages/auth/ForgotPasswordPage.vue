<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-md" style="width: 420px; margin: 0 auto;">
      <q-form
          @submit.prevent="handleResetPassword"
          @reset="handleReset"
          class="q-gutter-md"
        >
        <div class="text-h6 text-center">Reset Password Page</div>
        <q-input dense outlined clearable clear-icon="close" v-model="email" label="Email" />
        <div class="row">
          <q-btn label="Email Senden" type="submit" class="col" color="black"/>
        </div>
        <div class="row">
          <q-btn label="zurück zur Anmeldung" no-caps flat class="col" color="primary" @click="router.push({name: 'login'})"/>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from "stores/auth-store";
const authStore = useAuthStore()

import { useRouter } from 'vue-router'
const router = useRouter()

import { api } from '../../boot/axios'

const email = ref('test@test.com')

const handleResetPassword = async () => {
  console.log("handleResetPassword triggered");

  api.post('auth/token/forgot-password', {email: email.value}).then(res => {
    console.log('res :>> ', res);
  }).catch(err => {
    console.log('err :>> ', err);
  })
}

const handleReset = () => {
  console.log("handleReset triggerd")
}
</script>
