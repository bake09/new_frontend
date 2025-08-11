<template>
  <q-dialog
    v-if="vehicleStore.selectedVehicle"
    v-model="vehicleStore.showEditDialog"
    @before-hide="closeDialog"
    :backdrop-filter="'brightness(60%)'"
    :maximized="$q.screen.gt.sm ? false : true"
    transition-show="jump-up"
    transition-hide="jump-down"
  >
    <q-layout view="lhh LpR lff">
      <q-header elevated>
        <q-toolbar :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-blue-grey-1 text-black'">
          <q-btn flat round dense icon="arrow_back" v-close-popup />
            <q-toolbar-title>bearbeiten</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-tabs
          v-model="vehicleStore.editDialogTab"
          align="justify"
          :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-blue-grey-1 text-black'"
        >
          <q-tab name="ausstattung" label="Ausstattung"/>
          <q-tab name="reservierung" label="Reservierung" />
          <q-tab name="sonstiges" label="Sonstiges" />
        </q-tabs>
      </q-header>
      <q-page-container>
        <q-page>
          <q-tab-panels
            v-model="vehicleStore.editDialogTab"
            animated
            swipeable
            :style="$q.screen.gt.sm ? 'min-height: 50vh;' : 'height: calc(100vh - 98px);'"
          >
            <q-tab-panel name="ausstattung">
              <q-card class="q-mb-md">
                <q-card-section>
                  <div class="text-h6">Ausstattung</div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat, atque! Recusandae sint fugiat eum expedita laborum illum, dolores voluptatibus, similique veritatis sequi quidem eveniet qui perspiciatis, quos tempore minus et?</p>
                </q-card-section>
              </q-card> 
            </q-tab-panel>

            <q-tab-panel name="reservierung">
              <q-card class="q-mb-md">
                <q-card-section>
                  <div class="text-h6">Reservierung</div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat, atque! Recusandae sint fugiat eum expedita laborum illum, dolores voluptatibus, similique veritatis sequi quidem eveniet qui perspiciatis, quos tempore minus et?</p>
                </q-card-section>
              </q-card> 
            </q-tab-panel>

            <q-tab-panel name="sonstiges">
              <q-card class="q-mb-md">
                <q-card-section>
                  <div class="text-h6">Sonstiges</div>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat, atque! Recusandae sint fugiat eum expedita laborum illum, dolores voluptatibus, similique veritatis sequi quidem eveniet qui perspiciatis, quos tempore minus et?</p>
                </q-card-section>
              </q-card> 
            </q-tab-panel>
          </q-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup>
  import { useVehicleStore } from 'src/stores/vehicle-store'
  import { watch } from 'vue'
  const vehicleStore = useVehicleStore()


  const closeDialog = () => {
    setTimeout(() => {
      vehicleStore.setSelectedVehicle(null)
    }, 200) 
  }

  watch(() => vehicleStore.selectedVehicle, async (newValue) => {
    if (newValue) {
      vehicleStore.showEditDialog = true
    }
  })
</script>