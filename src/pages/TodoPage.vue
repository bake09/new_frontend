<template>
  <q-page class="">
    <PushNotificationsBanner />

    <!-- <PushNotificationsBanner v-if="pushStore.showNotificationsBanner"/> -->
    <!-- <transition
      enter-active-class="animated fadeInDown fast"
      leave-active-class="animated fadeOutUp fast"
    >
      <q-banner class="bg-primarys text-whitess q-px-sm">
        <div class="row flex">
          <TodoFilter />
          <q-space />
          <TodoSorting />
        </div>
      </q-banner>
    </transition> -->
    <!-- <div style="height: calc(100vh - 154px); max-width: 100%;" :thumb-style="settingStore.thumbStyle" :bar-style="settingStore.barStyle"> -->
    <div>
      <q-inner-loading :showing="todoStore.todosLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      
      <q-list v-if="todoStore.todos.length && !authStore.isAuthProceeding.loading" v-auto-animate="{ duration: 150 }" class="q-pa-sm">
        <TodoItem v-for="todo in todoStore.filteredTodos" :key="todo.id" :todo="todo"/>
      </q-list>

      <q-list v-else  class="q-pa-sm">
        <TodoItemSkeleton />
      </q-list>
    </div>
    <BottomSheet ref="bottomSheetRef" @onOpen="handleOpen" @onClose="handleClose">
      <template #form-content>
        <q-form class="q-gutter-md bottomSheetForm" v-if="todoStore.bottomSheetShowing.todo">
          <div class="text-h6 text-center">Edit The Entry</div>
          <q-input dense v-model="todoStore.bottomSheetShowing.todo.content" label="Todo" outlined />

          <div class="row justify-between">
            <q-input dense outlined label="Fälligkeitsdatum" v-model="todoStore.bottomSheetShowing.todo.due_date" class="col q-pr-md">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="todoStore.bottomSheetShowing.todo.due_date" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="todoStore.bottomSheetShowing.todo.due_date" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-btn label="update" color="primary" icon="save" @click="todoStore.updateTodo()"/>
          </div>
        </q-form>  
      </template>
    </BottomSheet>
  </q-page>
</template>

<script setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()
import { usePushStore } from 'src/stores/push-store';
const pushStore = usePushStore()


import TodoInput from 'src/components/Todo/TodoInput.vue';

import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

import { useSettingStore } from 'src/stores/settings-store';
const settingStore = useSettingStore()

import { echo } from "../boot/echo";

import TodoItem from 'src/components/Todo/TodoItem.vue';
import TodoItemSkeleton from 'src/components/Todo/TodoItemSkeleton.vue';

import TodoSorting from 'src/components/Todo/TodoSorting.vue';
import TodoFilter from 'src/components/Todo/TodoFilter.vue';


const dialogVisible = ref(true)


const bottomSheetRef = ref(null)
import BottomSheet from 'src/components/BottomSheet.vue';
import PushNotificationsBanner from 'src/components/Todo/PushNotificationsBanner.vue';

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
    bottomSheetRef.value.animateDrawerTo(260)
    console.log('newVal :>> ', newVal);
    if(newVal.show == false){
      bottomSheetRef.value.animateDrawerTo(0)
    }
  }
}, {deep: true})

onMounted(() => {
  todoStore.joinAndListenOnlineUsersChannel()
  todoStore.getTodos()

  echo.channel(`todochannel.1`)
    .listen('.addTodo', (payload) => {
      console.log('payload addTodo :>> ', payload);

      todoStore.todos.push(payload.todo)
      // animateScroll()
    })
    .listen('.toggleTodo', (payload) => {
      console.log('payload :>> ', payload);
      todoStore.toggleTodoDoneLocally(payload.todo)
    })
    .listen('.deleteTodo', (payload) => {
      console.log('payload :>> ', payload);
      todoStore.deleteTodoLocally(payload.todo)
    });
})

onUnmounted(() => {
  todoStore.todosLoading = true
  todoStore.clearTodos()
  echo.leaveChannel(`todochannel.1`)
  todoStore.leaveOnlineUsersChannel()
})

const date = ref('2025-02-11 12:44')
</script>

<style>
.bg-gradient{
  background: linear-gradient(180deg, rgb(0, 168, 132) 0%, rgba(224,224,224,1) 100%);
}
</style>