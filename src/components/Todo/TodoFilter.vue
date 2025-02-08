<template>
  <div class="row self-center q-gutter-sm text-black">
    <q-btn
      size="sm"
      :label="`${t('all')} (${todoStore.totalTodosCount})`"
      :class="todoStore.renderFilter == 'all' ? 'activeBtn' : 'text-grey-5'"
      :outline="todoStore.renderFilter == 'all'"
      :flat="todoStore.renderFilter != 'all'"
      @click="todoStore.setFilter('all')"/>
    
    <q-btn 
      size="sm"
      :label="`${t('active')} (${todoStore.openTodosCount})`"
      :class="todoStore.renderFilter == 'active' ? 'activeBtn' : 'text-grey-5'"
      :outline="todoStore.renderFilter == 'active'"
      :flat="todoStore.renderFilter != 'active'"
      @click="todoStore.setFilter('active')"/>
    
    <q-btn 
      size="sm"
      :label="`${t('done')} (${todoStore.doneTodosCount})`"
      :class="todoStore.renderFilter == 'completed' ? 'activeBtn' : 'text-grey-5'"
      :outline="todoStore.renderFilter == 'completed'"
      :flat="todoStore.renderFilter != 'completed'"
      @click="todoStore.setFilter('completed')"/>
  </div>
</template>

<script setup>
import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.activeBtn{
  color: var(--q-primary)
}
</style>
