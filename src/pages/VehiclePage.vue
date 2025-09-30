<template>
  <q-page padding>
    <div class="text-h6 row q-px-sm">Alle Fahreuge ab Anlagedatum 01.01.2023<span class="q-mx-xs">| Anzahl (<q-spinner-ball class="q-mb-sm" color="primary" v-if="vehicleStore.isLoading"/>{{ !vehicleStore.isLoading ? vehicleStore.initialPagination.rowsNumber : ''}})</span></div>
    <q-table
      separator="cell"
      dense
      :rows="vehicleStore.vehicles"
      :columns="vehicleStore.columns"
      :loading="vehicleStore.isLoading"
      row-key="BASIS_NUMBER"
      v-model:pagination="vehicleStore.initialPagination"
      binary-state-sort
      @request="onRequest"
    >
      <!-- Table Head -->
      <template v-slot:top>
        <div v-if="$q.screen.gt.xs" class="col q-gutter-sm">
          <div class="row q-pa-md q-gutter-xs items-center">
            <span class="self-center q-mr-md text-weight-bold">Filter:</span>
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="MAKE_CD" label="MAKE_CD" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="MODEL_LINE" label="MODEL_LINE" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="MOD_LIN_SPECIFY" label="MOD_LIN_SPECIFY" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="BASIS_NUMBER" label="BASIS_NUMBER" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="REGISTER_NUMBER" label="REGISTER_NUMBER" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="CHASSIS_NUMBER" label="CHASSIS_NUMBER" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="ECC_STATUS" label="ECC_STATUS" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="SPECIFY" label="SPECIFY" />
            <!-- <q-toggle dense v-model="vehicleStore.visibleColumns" val="CAR_GROUP" label="CAR_GROUP" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="ORIG_MODEL_CODE1" label="ORIG_MODEL_CODE1" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="COLOUR_CF" label="COLOUR_CF" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="UNIT_NUMBER" label="UNIT_NUMBER" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="VEHICLE_TYPE" label="VEHICLE_TYPE" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="CATEGORY" label="CATEGORY" />
            <q-toggle dense v-model="vehicleStore.visibleColumns" val="CAR_CREATION_DATE" label="CAR_CREATION_DATE " /> -->
          </div>
        </div>
        <q-select
          v-else
          v-model="vehicleStore.visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="vehicleStore.columns"
          option-value="name"
          style="min-width: 150px"
        />
        <q-space />
        <div class="row q-gutter-sm">
          <q-input clearable clear-icon="close" outlined dense debounce="300" placeholder="Suche..." color="primary" v-model="vehicleStore.filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            icon-right="archive"
            label="CSV"
            no-caps
            @click="vehicleStore.exportTable"
          />
          <!-- <q-btn
            color="primary"
            icon-right="archive"
            label="Excel"
            no-caps
            @click="vehicleStore.exportTableExcel"
          /> -->
        </div>
      </template>

      <!-- Table Header -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in vehicleStore.visibleColumns" :key="col" :props="props">
            <!-- {{ console.log('props :>> ', props) }} -->
            {{ col }}
            <div class="column" @click.stop>
              <q-select dense outlined v-model="model" :options="options" :label="col" />
            </div>
          </q-th>
          <q-th auto-width>Aktionen</q-th>
        </q-tr>
      </template>

      <!-- Table Body -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <td v-for="col in vehicleStore.visibleColumns" :key="col" :props="props">{{ props.row[col] }}</td>
          <q-td auto-width align="right">
            <q-btn
              round
              dense
              flat
              size="sm"
              icon="edit"
              color="primary"
              @click="vehicleStore.setSelectedVehicle(props.row)"
            />
          </q-td>
        </q-tr>
        <!-- Expanded row content -->
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
              <q-tr v-for="discount in props.row.purch_discounts" :key="discount.id" :class="discount.AMOUNT > 600 ? 'bg-red-13' : 'bg-green-13'" class="row">
                <q-td>Fahrzeugnummer: <span class="text-weight-bold">{{ discount.VEHICLE_NUMBER }}</span></q-td>
                <q-td>Nachlass Cd.: <span class="text-weight-bxold">{{ discount.DISCOUNT_CD }}</span></q-td>
                <q-td>Anlagedatum: <span class="text-weight-bold">{{ discount.DATE }}</span></q-td>
                <q-td>Betrag: <span class="text-weight-bold">{{ discount.AMOUNT }}</span></q-td>
                <q-td>Status: <span class="text-weight-bold">{{ discount.STATUS_X }}</span></q-td>
                <q-td>Fahrgestellnummer: <span class="text-weight-bold">{{ discount.CHASSIS_NO_MODIF }}</span></q-td>
                <q-td>Belegnr.: <span class="text-weight-bold">{{ discount.VOUCHER_NUMBER_X }}</span></q-td>
              </q-tr>
          </q-td>
        </q-tr>
      </template>

      <!-- Custom Loading -->
      <!-- <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template> -->
    </q-table>


    <!-- <div>Test erstellt am 05.08.2025: 'EX7984'</div>
    <div>Listengenrator 8510 Anzahl: '103359'</div>
    <div>Listengenrator m500 Anzahl: '157614'</div> -->
  </q-page>
    <EditVehicleModal />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useVehicleStore } from 'stores/vehicle-store';
const vehicleStore = useVehicleStore();

import EditVehicleModal from 'components/vehicle/EditModal.vue';

onMounted(async() => {
  await vehicleStore.getVehicles();
  vehicleStore.editDialogTab = 'ausstattung'
})

const onRequest = (props) => {
  console.log('props :>> ', props);
  vehicleStore.getVehicles(props.pagination.page, props.pagination.rowsPerPage)
}

const model = ref(null)
const options = ref([
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ])

// const showVehicle = async (vehicle) => {
//   console.log('vehicle :>> ', vehicle);
//   vehicleStore.selectedVehicle = vehicle;
//   vehicleStore.showEditDialog = true;
// } 
</script>
