<template>
  <q-page class="q-pa-md">
    <q-list bordered >
      <q-item-label header class="text-center">{{ t('settings')}}</q-item-label>
      <q-separator inset/>
      <q-item tag="label" v-ripple dense>
        <q-item-section side>
          <q-icon :name="$q.dark.isActive ? 'dark_mode' : 'light_mode'"  />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $q.dark.isActive ? 'DarkMode' : 'LightMode' }}</q-item-label>
        </q-item-section>
        <q-item-section side >
          <q-toggle color="blue" v-model="isDark" val="battery" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-list>
      <q-item v-for="i in 20">
        <q-item-section>
          <q-item-label>Lorem ipsum</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const  { t } = useI18n()
import { watch } from 'vue'

import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)

import { useQuasar } from 'quasar'
const $q = useQuasar()
  
$q.dark.set(isDark.value)

// DarkMode in combination with VueUSE
watch(() => isDark.value, val => {
  // console.log('val Dark :>> ', val)
  $q.dark.set(val)
})

</script>

<style scoped>
.truncate-chip-labels > .q-chip {
  max-width: 130px;
}
</style>