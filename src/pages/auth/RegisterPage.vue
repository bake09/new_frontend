<template>
  <q-page class="flex flex-center bg-orange" padding>
    <q-card class="q-pa-md" style="width: 420px; margin: 0 auto;">
      <q-form
          @submit.prevent="handleRegister"
          @reset="handleReset"
          class="q-gutter-md"
        >
        <div class="text-h6 text-center">Register Page</div>
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.registerForm.name" label="Name" />
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.registerForm.email" label="Email" />
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.registerForm.password" label="Password" type="password"/>
        <q-input dense outlined clearable clear-icon="close" v-model="authStore.registerForm.password_confirmation" label="Repeat Password" type="password"/>
        <div class="row">
          <q-btn label="Register" type="submit" class="col" color="black"/>
        </div>
        <div class="row">
          <q-btn label="Account vorhanden?" no-caps flat class="col" color="primary" @click="router.push({name: 'login'})"/>
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

const handleRegister = async () => {
  await authStore.handleTokenRegister()
}

const handleReset = () => {
  console.log("handleReset triggerd")
}
</script>
