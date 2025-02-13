<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-md" style="width: 420px; margin: 0 auto;">
      <q-form
          @submit.prevent="handleResetPassword"
          @reset="handleReset"
          class="q-gutter-md"
        >
        <div class="text-h6 text-center">Reset Password Page</div>
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.loginForm.email" label="Email" />
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
import { useAuthStore } from "stores/auth-store";
const authStore = useAuthStore()

import { useRouter } from 'vue-router'
const router = useRouter()

const handleResetPassword = async () => {
  console.log("handleResetPassword triggered");
}

const handleReset = () => {
  console.log("handleReset triggerd")
}
</script>
