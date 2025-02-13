<template>
  <q-page class="q-pa-md">
    <q-card flat>
      <q-tabs
        v-model="tab"
        align="left"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        no-caps
      >
        <q-tab name="benutzer"  :label="t('user')"  />
        <q-tab name="rollen" :label="t('roles')" />
        <q-tab name="filialen" :label="t('branches')" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="benutzer" class="q-pa-xs">
          <UserManagement />
        </q-tab-panel>

        <q-tab-panel name="rollen">
          <div class="text-h6">{{ t('roles') }}</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="filialen">
          <div class="text-h6">{{ t('branches') }}</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import UserManagement from 'src/components/UserManagement.vue';
import { ref } from 'vue';
const tab = ref('benutzer')

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const result = ref(null)

</script>
