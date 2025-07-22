<template>
  <q-page class="q-pa-md flex">
    <q-btn
      v-morph:btn:mygroup:300.resize="morphGroupModel"
      class="absolute-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="nextMorph"
    />

    <q-card
      v-morph:card1:mygroup:300.resize="morphGroupModel"
      class="absolute-bottom-left  q-ma-md bg-primary text-white"
      style="width: calc(100% - 32px); border-bottom-left-radius: 2em"
    >
      <q-card-section class="text-h6">
        New user
      </q-card-section>

      <q-card-section class="text-subtitle1">
        Please fill the details for a new user.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Next" @click="nextMorph" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  const nextMorphStep = {
    btn: 'card1',
    card1: 'btn',
  }

  const morphGroupModel = ref('btn')

  const nextMorph = () => {
    morphGroupModel.value = nextMorphStep[ morphGroupModel.value ]
  }

  onMounted(() => {
    setTimeout(() => {
      nextMorph()
    }, 1000)
  })
</script>
