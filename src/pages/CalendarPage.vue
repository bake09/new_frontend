<template>
  <q-page class="flex flex-center">
    <!-- <h4>Calendar</h4> -->
    <q-date
    class="full-height"
      v-model="formattedString"
      :events="events"
    />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { date } from 'quasar';
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY/MM/DD')

const events = ref(['2025/04/01', '2025/04/05', '2025/04/06', '2025/04/09', '2025/04/23'])

onMounted(() => {
})
</script>
