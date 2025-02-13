<template>
    <q-btn 
      round 
      dense
      flat
      :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'" 
      @click="toggleDark()"
    >
      <q-tooltip v-if="$q.screen.gt.sm">
        {{ t('colorModeBtn') }}
      </q-tooltip>
    </q-btn>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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

<style>

</style>