<template>
  <q-page padding>
    Todos: LB importieren, gruppieren, POST Method verwenden, UserEmails senden
    <br />
    <q-btn label="Create Report" @click="cdrStore.createCDRreports"/>
    <q-table
      v-if="!cdrStore.sfUsersLoading"
      dense
      :rows="cdrStore.sfUsers"
      row-key="sf_id"
      :selection="cdrStore.sfUsersLoading ? '' : 'multiple'"
      v-model:selected="cdrStore.selectedSFUsers"
      separator="cell"
      virtual-scroll
      :style="cdrStore.sfUsersLoading ? '' : 'height: 100%; max-height: 310px;'"
      :rows-per-page-options="[0]"
      :class="cdrStore.sfUsersLoading ? '' : 'my-sticky-header-table'"
      :filter="cdrStore.SFUserSearchFilter"
    >
      <template v-slot:top>
        <q-input outlined dense debounce="300" color="primary" clearable clear-icon="close" v-model="cdrStore.SFUserSearchFilter" placeholder="Benutzer Filtern">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <div class="text-h6">Alle Starface Benutzer {{ cdrStore.sfUsers?.length }}</div>
      </template>
    </q-table>

    <div class="row q-mt-md">
      <div class="col-10 q-gutter-xs">
        <q-chip dense v-for="chip in cdrStore.selectedSFUsers" removable  @remove="cdrStore.removeChip(chip)" color="purple-5" text-color="white" icon="person">
          {{ chip.firstname }} {{ chip.surname }}
        </q-chip>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "boot/axios";
import { onMounted, ref } from 'vue';

import { useCdrStore } from 'src/stores/cdr-store'
const cdrStore = useCdrStore()

const result = ref(null)

onMounted(async() => {
  api.get('/sf-rest').then(res => {
    console.log('res :>> ', res);
    result.value = res.data
  }).catch(err => {
    console.log('err :>> ', err);
  })

  await cdrStore.fetchSFUsers()
  // await cdrStore.createCDRreports()
})
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #e1e1e1

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
