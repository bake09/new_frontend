<template>
  <q-list>
    <q-item v-for="i in 7" class="my-item q-mb-xs q-py-sm q-px-sm">
      <q-item-section avatar>
        <q-skeleton dense type="QRadio" animation="fade" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton width="55%" type="text" animation="fade" />
          <q-skeleton width="75%" type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
      
      <q-item-section>
        <q-item-label class="flex column items-end">
          <q-skeleton width="45%" type="text" animation="fade" />
          <q-skeleton width="35%" type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
      
      <q-item-section side>
        <div class="row q-gutter-xs">
          <q-skeleton dense type="QRadio" animation="fade" />
          <q-skeleton dense type="QRadio" animation="fade" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
