<template>
  <q-list bordered separator>
    <q-item v-for="i in 3">
      <q-item-section avatar>
        <q-skeleton dense type="QRadio" animation="fade" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-skeleton width="50%" type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-skeleton dense type="QRadio" animation="fade" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
