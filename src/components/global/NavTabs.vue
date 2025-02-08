<template>
    <q-footer elevated>
      <q-tabs
        v-model="settingStore.tab"
        class="text-grey-5 bg-primary"
        active-color="white"
        indicator-color="white"
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

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const tabsModelUpdated = () => {
  router.push({name: settingStore.tab})
}

</script>