<template>
    <q-footer elevated class="q-pa-xs bg-blue-grey-10 text-white">
        <q-input dense rounded outlined bg-color="white" color="grey-5" placeholder="Label" clearable clear-icon="close" v-model="todoStore.newTodo" ref="inputRef">
            <template v-slot:append>
                <q-icon name="schedule" />
            </template>
            <template v-slot:after>
                <q-btn outline round color="grey-5" icon="send" size="13px" @click="addTodo()" :disable="todoStore.newTodo ? false : true"/>
            </template>
        </q-input>
    </q-footer>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

const inputRef = ref(null)

const addTodo = async () => {
    await todoStore.addTodo()
    inputRef.value?.focus()
}

onMounted(() => {
    // inputRef.value?.focus()
})
</script>

<style>
.q-field__native, .q-field__input {
    padding-left: 4px;
}

.body--dark .q-placeholder {
    color: black;
}

.body--dark .q-field--outlined .q-field__control:before{
    border: 1px solid rgba(0, 0, 0, 0.24);
}
</style>

