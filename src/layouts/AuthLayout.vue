<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="bg-auth">
      <router-view />
    </q-page-container>
    <q-inner-loading
      :showing="authStore.isAuthProceeding.loading"
      :label="authStore.isAuthProceeding.label"
      label-style="font-size: 1.1em"
    />
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

</script>

<style scoped>
.bg-auth{
  background: linear-gradient(183deg, #f9ce70, #ff840057);
}
</style>