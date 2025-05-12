<template>
  <q-footer elevated :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-black'">
    <q-tabs
      v-model="settingStore.tab"
      inline-label
      switch-indicator
      @update:model-value="tabsModelUpdated"
    >
      <q-tab name="home" icon="home" label="home" />
      <q-tab name="login" icon="person" label="login" />
      <q-tab name="settings" icon="settings" label="settings" />
    </q-tabs>
  </q-footer>
</template>

<script setup>

import { useSettingStore } from 'src/stores/settings-store';
const settingStore = useSettingStore()

import { useQuasar } from 'quasar';
const $q = useQuasar()

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const tabsModelUpdated = () => {
  router.push({name: settingStore.tab})
}

</script>