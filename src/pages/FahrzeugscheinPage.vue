<template>
  <q-page class="flex flex-center">
    <q-spinner v-if="!result" size="xl" color="grey"/>
    <pre v-else>{{ result }}</pre>
    <div class="text-h4">Fahrzeugschein Erkennung</div>
  </q-page>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const result = ref(null)

onMounted(() => {
  axios.get('http://localhost:8000/api/test').then(res => {
    console.log('res :>> ', res);
    result.value = res.data
  }).catch(err => {
    console.log('err :>> ', err);
  })
})
</script>
