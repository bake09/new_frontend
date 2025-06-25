<template>
    <q-footer elevated class="q-pa-xs" :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-white'">
        <q-input dense rounded outlined  placeholder="Label" clearable clear-icon="close" v-model="todoStore.newTodo" ref="inputRef" autocomplete="off" @keydown.enter="addTodo()">
            <template v-slot:append>
                <q-icon name="schedule"  />
            </template>
            <template v-slot:after>
                <q-btn
                    outline
                    round
                    color="grey-5"
                    icon="send"
                    size="13px"
                    @mousedown.prevent="addTodo()"
                    @touchstart.prevent="addTodo()" 
                    :disable="todoStore.newTodo ? false : true"/>
            </template>
        </q-input>
    </q-footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar()

import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

const inputRef = ref(null)

const addTodo = async () => {
    await todoStore.addTodo()
    inputRef.value?.focus()
}

onMounted(() => {
    console.log('$q :>> ', $q);
})
</script>

<style>
.q-field__native, .q-field__input {
    padding-left: 4px;
}
</style>

