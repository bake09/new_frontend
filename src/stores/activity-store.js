import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivityStore = defineStore('activity', () => {
  // State
  const activities = ref([])
  const logListVisible = ref(true)

  // Getters

  // Actions
  function pushActivityToArray (item) {
    activities.value.unshift(item)
  }

  function clearActivities () {
    activities.value = []
  }

  function toggleActivityListVisibility () {
    logListVisible.value = !logListVisible.value
  }

  const joinActivitiesChannel = () => {
    // Placeholder for future implementation
  }

  const leaveActivitiesChannel = () => {
    // Placeholder for future implementation
  }

  // Return Everything
  return {
    // State
    activities,
    logListVisible,

    // Getters
    
    // Actions
    pushActivityToArray,
    clearActivities,
    toggleActivityListVisibility,
  }
})
