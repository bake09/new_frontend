import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGameStore = defineStore('game', () => {
  
  // State
  const game = ref([
    {
      id: 1,
      type: 'Wahrheit',
      content: 'Wie / wo / wann / was ?',
      difficulty: 2,
    },
    {
      id: 2,
      type: 'Pflicht',
      content: 'Was ?',
      difficulty: 1
    },
    {
      id: 3,
      type: 'Wahrheit',
      content: 'Wann ?',
      difficulty: 4
    },
    {
      id: 4,
      type: 'Pflicht',
      content: 'Wo ?',
      difficulty: 4.5
    },
  ])
  const users = ref([
    {
      id: 1,
      name: 'John'
    },
    {
      id: 2,
      name: 'Jane'
    },
  ])
  const currentQuestion = ref(1)
  const currentUser = ref(1)

  // Getters
  
  // Actions
  const nextQuestion = () => {
    if(currentQuestion.value < 4){
      currentQuestion.value++
    }
    else{
      currentQuestion.value = 1
    }
  }
  const resetQuestion = () => {
    currentQuestion.value = 1
  }

  return {
    // State
    game,
    currentQuestion,
    currentUser,
    users,

    // Getters
    
    // Actions
    nextQuestion,
    resetQuestion,
  }
})
