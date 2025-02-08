<template>
  <q-page class="q-pa-md">
    <!-- <q-inner-loading
      :showing="true"
      label="Loggin out..."
      label-style="font-size: 1.1em"
    /> -->
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from "stores/auth-store";
const authStore = useAuthStore()
import { useTodoStore } from "stores/todo-store";
const todoStore = useTodoStore()

onMounted(async() => {
  await authStore.handleTokenLogout()
  todoStore.leaveOnlineUsersChannel()
})
</script>
