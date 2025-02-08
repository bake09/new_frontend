<template>
  <q-page>
    <transition
      enter-active-class="animated fadeInDown fast"
      leave-active-class="animated fadeOutUp fast"
    >
      <q-banner class="bg-primarys text-whitess q-px-sm">
        <div class="row flex">
          <TodoFilter />
          <q-space />
          <!-- <TodoSorting /> -->
          <TodoSorting />
          <!-- <q-btn icon="home" @click="handleShowSheet(sheetContent, sheetHeight)"/> -->
        </div>
      </q-banner>
    </transition>
    <q-scroll-area style="height: calc(100vh - 154px); max-width: 100%;" :thumb-style="settingStore.thumbStyle" :bar-style="settingStore.barStyle">
      <q-inner-loading :showing="todoStore.todosLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      
      <q-list v-if="todoStore.todos.length && !authStore.isAuthProceeding.loading" v-auto-animate="{ duration: 150 }" class="q-pa-sm">
        <TodoItem v-for="todo in todoStore.filteredTodos" :key="todo.id" :todo="todo"/>
      </q-list>
      
      <TodoItemSkeleton v-else />
    </q-scroll-area>
    <BottomSheet ref="bottomSheetRef" @onOpen="handleOpen" @onClose="handleClose">
      <template #form-content>
        <q-form class="text-black q-gutter-md" v-if="todoStore.bottomSheetShowing.todo">
          <div class="text-h6 text-center">Edit The Entry</div>
          <q-input v-model="todoStore.bottomSheetShowing.todo.content" label="Todo" outlined />
          <div class="row justify-end">
            <q-btn label="update" color="primary" icon="save" @click="todoStore.updateTodo()"/>
          </div>
        </q-form>  
      </template>
    </BottomSheet>
  </q-page>
</template>

<script setup>
import { onActivated, onDeactivated, ref, watch } from 'vue';
import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

import { useSettingStore } from 'src/stores/settings-store';
const settingStore = useSettingStore()

import { echo } from "../boot/echo";
import TodoSorting from 'src/components/Todo/TodoSorting.vue';
import TodoItem from 'src/components/Todo/TodoItem.vue';
import TodoItemSkeleton from 'src/components/Todo/TodoItemSkeleton.vue';

import TodoFilter from 'src/components/Todo/TodoFilter.vue';

const bottomSheetRef = ref(null)
import BottomSheet from 'src/components/BottomSheet.vue';

const handleShowSheet = (content, height) => {
  bottomSheetRef.value.animateDrawerTo(height)
}
const handleOpen = async() => {
  console.log('OPEN')
}
const handleClose = () => {
  todoStore.toggleBottomSheet()
  console.log('CLOSE')
}

watch(() => todoStore.bottomSheetShowing, (newVal) => {
  if (newVal.todo) {
    bottomSheetRef.value.animateDrawerTo(240)
    console.log('newVal :>> ', newVal);
    if(newVal.show == false){
      bottomSheetRef.value.animateDrawerTo(0)
    }
  }
}, {deep: true})

onActivated(() => {
  todoStore.joinAndListenOnlineUsersChannel()
  todoStore.getTodos()

  echo.channel(`todochannel.1`)
    .listen('.addTodo', (payload) => {
      console.log('payload :>> ', payload);

      todoStore.todos.push(payload.todo)
      // animateScroll()
    })
    .listen('.toggleTodo', (payload) => {
      // console.log('payload :>> ', payload);
      todoStore.toggleTodoDoneLocally(payload.todo)
    })
    .listen('.deleteTodo', (payload) => {
      console.log('payload :>> ', payload);
      todoStore.deleteTodoLocally(payload.todo)
    });
})

onDeactivated(() => {
  todoStore.todosLoading = true
  todoStore.clearTodos()
  echo.leaveChannel(`todochannel.1`)
  todoStore.leaveOnlineUsersChannel()
})
</script>

<style>
.bg-gradient{
  background: linear-gradient(180deg, rgb(0, 168, 132) 0%, rgba(224,224,224,1) 100%);
}
</style>