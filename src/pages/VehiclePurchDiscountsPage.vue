<template>
  <q-page padding>
    <q-table
      separator="cell"
      dense
      title="Einkaufsnachlässe Alle"
      :rows="vehicleStore.purchDiscounts"
      :columns="vehicleStore.columnspurchDiscounts"
      row-key="UNIQUE_IDENT"
      v-model:pagination="vehicleStore.initialPaginationPurchDiscounts"
      binary-state-sort
      @request="request"
    >
    </q-table>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useVehicleStore } from 'stores/vehicle-store';

const vehicleStore = useVehicleStore();
onMounted(async() => {
  await vehicleStore.getpurchDiscounts();
})

const request = async (props) => {
  // const { page, rowsPerPage, sortBy, descending } = props.pagination
  console.log('props :>> ', props);
  await vehicleStore.getpurchDiscounts();
}
</script>
