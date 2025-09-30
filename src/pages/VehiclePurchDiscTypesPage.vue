<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div class="text-h4">Datenbereinigung - Nachlass-Codes</div>
      <q-table
        title="Doppelte Nachlass-Codes | (Dracar-Funktion: 'EDM5')"
        dense
        :rows="vehicleStore.doublepurchDiscTypes"
        :columns="vehicleStore.columnsdoublepurchDiscTypes"
        row-key="UNIQUE_IDENT"
        :pagination="initialPagination"
        :loading="vehicleStore.isLoading"
      >
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-right="archive"
            label="Export to csv"
            no-caps
            @click="exportTable"
          />
        </template>
      </q-table>
      <q-table
        title="Alle Nachlass-Codes"
        dense
        :rows="vehicleStore.purchDiscTypes"
        :columns="vehicleStore.columnsdoublepurchDiscTypes"
        row-key="UNIQUE_IDENT"
        :pagination="initialPagination"
        :loading="vehicleStore.isLoading"
      >
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useVehicleStore } from 'stores/vehicle-store';
const vehicleStore = useVehicleStore();
import { exportFile } from 'quasar'

const initialPagination = ref({
  // sortBy: 'desc',
  // descending: false,
  page: 1,
  rowsPerPage: 5
  // rowsNumber: xx if getting data from a server
})

onMounted(async() => {
  await vehicleStore.getPurchDiscTypes();
  await vehicleStore.getDoublePurchDiscTypes();
})

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const exportTable = () => {
  // naive encoding to csv format
  const content = [vehicleStore.columnsdoublepurchDiscTypes.map(col => wrapCsvValue(col.label))].concat(
    vehicleStore.doublepurchDiscTypes.map(row => vehicleStore.columnsdoublepurchDiscTypes.map(col => wrapCsvValue(
      typeof col.field === 'function'
        ? col.field(row)
        : row[ col.field === void 0 ? col.name : col.field ],
      col.format,
      row
    )).join(','))
  ).join('\r\n')

  const status = exportFile(
    'table-export.csv',
    content,
    'text/csv'
  )
}
</script>
