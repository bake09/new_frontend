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
  const initialPaginationPurchDiscounts = ref(null)
  const showEditDialog = ref(false)
  const selectedVehicle = ref(null)
  const editDialogTab = ref('ausstattung')
  const purchDiscTypes = ref([])
  const doublepurchDiscTypes = ref([])
  const columnsdoublepurchDiscTypes = ref([])
  const purchDiscounts = ref([])
  const columnspurchDiscounts = ref([])

  // Getters
  const vehiclesCount = computed(() => vehicles.value.length)
  const buildcolumns = () => {
    if (!vehicles.value || !vehicles.value.length) return [];
    columns.value.push(...Object.keys(vehicles.value[0]).map(key => ({
      name: key,
      label: key,
      field: key,
      sortable: true
    })));
  }
  const buildcolumnsdoublepurchDiscTypes = () => {
    if (!doublepurchDiscTypes.value || !doublepurchDiscTypes.value.length) return [];
    columnsdoublepurchDiscTypes.value.push(...Object.keys(doublepurchDiscTypes.value[0]).map(key => ({
      name: key,
      label: key,
      align: 'left',
      field: key,
      sortable: true,
    })));
  }
  const buildcolumnspurchDiscounts = () => {
    if (!purchDiscounts.value || !purchDiscounts.value.length) return [];
    columnspurchDiscounts.value.push(...Object.keys(purchDiscounts.value[0]).map(key => ({
      name: key,
      label: key,
      align: 'left',
      field: key,
      // sortable: true,
      sortable: false,
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
  const getPurchDiscTypes = async () => {
      isLoading.value = true
      purchDiscTypes.value =[]
    try {
      const res = await api.get('purchdisctype')
      console.log('res.data :>> ', res.data);
      purchDiscTypes.value = res.data
      isLoading.value = false
    } catch (err) {
      console.error("Error fetching purchase discount types: ", err)
      isLoading.value = false
    }
  }
  const getDoublePurchDiscTypes = async () => {
      isLoading.value = true
      doublepurchDiscTypes.value = []
    try {
      const res = await api.get('doublepurchdisctype')
      console.log('res.data :>> ', res.data);
      doublepurchDiscTypes.value = res.data.data
      buildcolumnsdoublepurchDiscTypes()
      isLoading.value = false
    } catch (err) {
      console.error("Error fetching purchase discount types: ", err)
      isLoading.value = false
    }
  }
  const getpurchDiscounts = async () => {
    isLoading.value = true
    purchDiscounts.value = []

    // const { page, rowsPerPage, sortBy, descending } = initialPaginationPurchDiscounts.value
    // const params = { page, per_page: rowsPerPage, sort_by: sortBy, sort_desc: descending }

    try {
      const res = await api.get(`purchdiscounts`, { params: initialPaginationPurchDiscounts.value })
      console.log('res.data :>> ', res.data);
      
      const { data, ...pagination } = res.data
      console.log('pagination :>> ', pagination);

      // // ✅ URLs kürzen (nur ?page=... behalten)
      // const urlFields = [
      //   'first_page_url',
      //   'last_page_url',
      //   'next_page_url',
      //   'prev_page_url'
      // ]

      // urlFields.forEach(key => {
      //   if (pagination[key]) {
      //     const query = pagination[key].split('?')[1]
      //     pagination[key] = query ? `?${query}` : null
      //   }
      // })

      // // Auch die Links-Liste kürzen
      // pagination.links = pagination.links.map(link => ({
      //   ...link,
      //   url: link.url
      //     ? `?${link.url.split('?')[1]}`
      //     : null
      // }))

      initialPaginationPurchDiscounts.value = mapLaravelPaginationToQuasar(pagination.meta)
      purchDiscounts.value = data
      buildcolumnspurchDiscounts()
      isLoading.value = false
    } catch (err) {
      console.error("Error fetching purchase discount types: ", err)
      isLoading.value = false
    }
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
    purchDiscTypes,
    doublepurchDiscTypes,
    purchDiscounts,
    initialPaginationPurchDiscounts,

    // Getters
    vehiclesCount,
    columns,
    columnsdoublepurchDiscTypes,
    columnspurchDiscounts,

    // Actions
    getVehicles,
    buildcolumns,
    wrapCsvValue,
    exportTable,
    exportTableExcel,
    setSelectedVehicle,
    getPurchDiscTypes,
    getDoublePurchDiscTypes,
    buildcolumnsdoublepurchDiscTypes,
    getpurchDiscounts,
    buildcolumnspurchDiscounts,

  }
})
