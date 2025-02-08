<template>
  <q-page class="flex flex-center bg-orange" padding>
    <q-card class="q-pa-md" style="width: 420px; margin: 0 auto;">
      <q-form
          @submit.prevent="handleLogin"
          @reset="handleReset"
          class="q-gutter-md"
        >
        <div class="text-h6 text-center">Login Page</div>
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.loginForm.email" label="Email" />
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.loginForm.password" label="Password" type="password"/>
        <div class="row">
          <q-btn label="Login" type="submit" class="col" color="black"/>
        </div>
        <div class="row">
          <q-btn label="Password vergessen?" no-caps flat class="col" color="primary" @click="router.push({name: 'forgot-password'})"/>
        </div>
        <div class="row">
          <q-btn label="Kein Account?" no-caps flat class="col" color="primary" @click="router.push({name: 'register'})"/>
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

const handleLogin = async () => {
  await authStore.handleTokenLogin()
}

const handleReset = () => {
  console.log("handleReset triggerd")
}
</script>
