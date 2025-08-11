import { defineStore } from 'pinia'
import { api } from "boot/axios";
import { computed, ref } from 'vue'
import { exportFile } from 'quasar'

function mapLaravelPaginationToQuasar(response) {
  const {
    current_page,
    per_page,
    total,
    data,
    ...rest
  } = response;

  return {
    page: current_page,
    rowsPerPage: per_page,
    rowsNumber: total,
    ...rest
  };
}

export const useVehicleStore = defineStore('vehicle', () => {
  // State
  const isLoading = ref(true)
  const vehicles = ref([])
  const columns = ref([])
  const visibleColumns = ref([
    'MAKE_CD', 
    // 'MODEL_LINE', 
    'MOD_LIN_SPECIFY',
    'BASIS_NUMBER', 
    'REGISTER_NUMBER', 
    // 'CHASSIS_NUMBER', 
    'ECC_STATUS', 
    'SPECIFY', 
    // 'CAR_GROUP', 
    // 'ORIG_MODEL_CODE1', 
    // 'COLOUR_CF', 
    // 'UNIT_NUMBER', 
    // 'VEHICLE_TYPE', 
    // 'CATEGORY', 
    // 'CAR_CREATION_DATE'
  ])
  const filter = ref('')
  const initialPagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 5,
    rowsNumber: null,
  })
  const showEditDialog = ref(false)
  const selectedVehicle = ref(null)
  const editDialogTab = ref('ausstattung')

  // Getters
  const vehiclesCount = computed(() => vehicles.value.length)
  const buildcolumns = () => {
    if (!vehicles.value || !vehicles.value.length) return [];
    columns.value.push(...Object.keys(vehicles.value[0]).map(key => ({
      name: key,
      label: key,
      // label: key.replace(/_/g, ' '),
      field: key,
      sortable: true
    })));
  }

  // Actions
  const getVehicles = async (page = initialPagination.value.page, rowsPerPage = initialPagination.value.rowsPerPage) => {
    isLoading.value = true
    try {
      const res = await api.get('vehicle', { 
        params: { 
          page, 
          per_page: rowsPerPage,
          MAKE_CD: ['FO', 'OP', 'HY', 'VO', 'FI', 'MG']
          // ECC_STATUS: [21],
          // SPECIFY: ['Auf Lager']
        }
      })

      const { data, ...pagination } = res.data.vehicles
      initialPagination.value = mapLaravelPaginationToQuasar(pagination)
      vehicles.value = data
      buildcolumns()
      isLoading.value = false
    } catch (err) {
      console.error("Error fetching vehicles: ", err)
      isLoading.value = false
    }
  }
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
    const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
      vehicles.value.map(row => columns.value.map(col => wrapCsvValue(
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
  const exportTableExcel = () => {
    // naive encoding to csv format
    const content = [columns.value.map(col => wrapCsvValue(col.label))].concat(
      vehicles.value.map(row => columns.value.map(col => wrapCsvValue(
        typeof col.field === 'function'
          ? col.field(row)
          : row[ col.field === void 0 ? col.name : col.field ],
        col.format,
        row
      )).join(','))
    ).join('\r\n')

    const status = exportFile(
      'table-export.xlsx',
      content,
      'text/xlsx' // Excel MIME type
    )
  }
  const setSelectedVehicle = (vehicle) => {
    selectedVehicle.value = vehicle
  }

  return { 
    // State
    isLoading,
    vehicles,
    visibleColumns,
    filter,
    initialPagination,
    showEditDialog,
    selectedVehicle,
    editDialogTab,

    // Getters
    vehiclesCount,
    columns,

    // Actions
    getVehicles,
    buildcolumns,
    wrapCsvValue,
    exportTable,
    exportTableExcel,
    setSelectedVehicle,

  }
})
