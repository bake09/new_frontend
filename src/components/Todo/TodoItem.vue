<template>
  <q-item clickable v-ripple :class="todo.done ? 'bg-done' : ''" class="my-item q-mb-xs q-py-sm q-px-sm" @click="todoStore.toggleDone(todo)" >
    <q-item-section avatar @click.prevent.stop >
      <q-avatar v-if="todo.user.avatar" :class="todoStore.onlineUsers.includes(todo.user.id) ? 'avatar-status-glow' : ''">
        <img 
          :src="todoStore.renderAvatarHelper(todo.user.avatar)" 
          :class="todoStore.onlineUsers.includes(todo.user.id) ? 'avatar-status-online' : 'avatar-status-offline'"
          >
      </q-avatar>
    </q-item-section>
    <!-- <q-item-section side class="q-pr-nones"><q-icon name="shopping_cart" /></q-item-section> -->
    
    <q-item-section :class="todo.done ? 'text-strike text-italic' : ''">
      <div caption class="ellipsis" style="max-width: 100%;">{{ todo.content }}</div>
      <q-item-label caption class="ellipsis" style="max-width: 100%;"><span class="text-talic">Ersteller:</span> {{ todo.user.name }}</q-item-label>
    </q-item-section>
    
    <q-item-section side :class="todo.done ? 'text-strike text-italic' : ''">
      <q-item-label caption>{{ date.formatDate(todo.due_date, 'DD.MM.YYYY') }}</q-item-label>
      <q-item-label caption>{{ date.formatDate(todo.due_date, 'HH:mm') }} Uhr</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row">
        <q-btn round flat color="grey-7" size="12px" icon="edit" @click.prevent.stop="todoStore.toggleBottomSheet(todo)" v-if="authStore.hasPermission('update_todo')"/>
        <q-btn round flat color="red-7"  size="12px" icon="delete" @click.prevent.stop="todoStore.deleteTodo(todo)" v-if="authStore.hasPermission('delete_todo')"/>
      </div>
    </q-item-section>
    <q-inner-loading :showing="todoStore.processing.id === todo.id && todoStore.processing.state" class="processing">
      <q-spinner-dots color="primary" size="2em" />
    </q-inner-loading>
  </q-item>
</template>

<script setup>
import { date } from 'quasar'

import { useTodoStore } from 'src/stores/todo-store'
const todoStore = useTodoStore()

import { useAuthStore } from 'src/stores/auth-store'
const authStore = useAuthStore()

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
})
</script>

<style>
.bg-done{
  background-color: hsl(204.23deg 64.69% 26.86% / 13%)
}

.body--dark .bg-done{
  background-color: hsl(204.23deg 100% 5.19% / 89%);
}

.my-item{
  border-radius: 0px;
  border: 1px solid hsl(0deg 0% 50.2% / 27.84%);
}
.avatar-status-online{
  background-color: transparent;
  border: 2px solid var(--q-positive);
  padding: 2px;
  transition: border 0.8s ease;
}
.avatar-status-offline{
  border: 2px solid #668ba91f;
  padding: 2px;
  transition: border 0.8s ease;
}

@keyframes glowEffect {
  0% {
    box-shadow: lime 0px 0px 0px 0px;
  }
  50% {
    box-shadow: lime 0px 0px 20px 2px;
  }
  100% {
    box-shadow: lime 0px 0px 0px 0px;
  }
}

.avatar-status-glow {
  animation: glowEffect .4s ease-out;
}

.processing {
  background: hsl(199.86deg 34.04% 28.9% / 60%) !important;
}
</style>
