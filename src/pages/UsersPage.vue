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
        <q-tab name="mails"  label="Benutzerverwaltung"  />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="mails" class="q-pa-xs">
          <UserManagement />
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import UserManagement from 'src/components/UserManagement.vue';
import { ref } from 'vue';
const tab = ref('mails')

const result = ref(null)

</script>
