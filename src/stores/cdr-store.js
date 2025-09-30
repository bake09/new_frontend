import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios';

export const useCdrStore = defineStore('cdr', () => {
  // State
  const cdrs = ref([])
  const isLoading = ref(true)

  const sfUsers = ref([])
  const sfUsersLoading = ref(true)
  const selectedSFUsers = ref([])
  const SFUserSearchFilter = ref('')

  // Getters
  const totalCdrsCount = computed(() => cdrs.value.length)
  const totalIncomingCount = computed(() => cdrs.value.filter(cdr => cdr.incoming == 1).length)
  const totalOutgoingCount = computed(() => cdrs.value.filter(cdr => cdr.incoming == 0).length)
  const totalInternCallsCount = computed(() => cdrs.value.filter(cdr => cdr.calledaccountid != 0).length)
  const totalExternCallsCount = computed(() => cdrs.value.filter(cdr => cdr.calledaccountid == 0).length)
  const totalCallsConectedCount = computed(() => cdrs.value.filter(cdr => cdr.callresult == 'CONNECTED').length)
  const totalCallsNotConectedCount = computed(() => cdrs.value.filter(cdr => cdr.callresult == 'NOT_CONNECTED').length)

  const mapsf_LoginFromSelectedUsers = computed(() => selectedSFUsers.value.map(user => user.sf_login))

  // Actions
  async function fetchCdrs() {
    try {
      const response = await api.get('/cdr')
      cdrs.value = response.data.data
      console.log('response :>> ', response);
    } catch (error) {
      console.error('Error fetching CDRs:', error)
    } finally {
      isLoading.value = false
    }
  }
  async function fetchSFUsers() {
    try {
      const response = await api.get('/sf-users')
      console.log('response :>> ', response);
      sfUsers.value = response.data
    } catch (error) {
      console.error('Error fetching CDRs:', error)
    } finally {
      sfUsersLoading.value = false
    }
  }
  const removeChip = (chip) => {
    const index = selectedSFUsers.value.findIndex(user => user.sf_id === chip.sf_id)
    if (index !== -1) {
      selectedSFUsers.value.splice(index, 1)
    }
  }
  async function createCDRreports() {
    console.log('mapsf_LoginFromSelectedUsers :>> ', mapsf_LoginFromSelectedUsers.value);
    try {
      const response = await api.post('/cdr-reports', { users: mapsf_LoginFromSelectedUsers.value })
      console.log('response :>> ', response.data);
    } catch (error) {
      console.error('Error fetching CDRs:', error)
    } finally {
      sfUsersLoading.value = false
    }
  }

  return {
    // State
    cdrs,
    isLoading,
    sfUsers,
    sfUsersLoading,
    selectedSFUsers,
    SFUserSearchFilter,

    // Getters
    totalCdrsCount,
    totalIncomingCount,
    totalOutgoingCount,
    totalInternCallsCount,
    totalExternCallsCount,
    totalCallsConectedCount,
    totalCallsNotConectedCount,
    mapsf_LoginFromSelectedUsers,

    // Actions
    fetchCdrs,
    fetchSFUsers,
    removeChip,
    createCDRreports
  }
})
