import { defineStore } from 'pinia'
import { api } from "boot/axios";
import { ref } from 'vue'

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref([])

  const getVehicles = async () => {
    try {
      const res = await api.get('vehicle')
      vehicles.value = res.data.data
      console.log("Fetched vehicles: ", vehicles.value)
    } catch (err) {
      console.error("Error fetching vehicles: ", err)
    }
  }

  return { 
    // State
    vehicles,

    // Actions
    getVehicles,
  }
})
