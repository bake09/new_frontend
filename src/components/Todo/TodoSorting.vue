<template>
  <q-btn-dropdown persistent dense color="pink" @click="todoStore.sortTodos()">
    <template v-slot:label>
      <div class="row items-center no-wrap">
        <q-icon left name="filter_alt" size="xs"/>
        {{ todoStore.toggleAlphabeticFilter ? 'A-Z' : 'Z-A'}}
      </div>
    </template>
  </q-btn-dropdown>

  <!-- <q-btn-dropdown persistent dense color="pink" @click="todoStore.sortTodos()" class="q-ml-xs">
    <template v-slot:label>
      <div class="row items-center no-wrap">
        <q-icon left name="calendar_month" size="xs"/>
      </div>
    </template>
  </q-btn-dropdown> -->
</template>

<script setup>
import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()
</script>
