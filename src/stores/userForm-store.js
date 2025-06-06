import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from "boot/axios";

export const useUserFormStore = defineStore('userForm', () => {
  // State
  const usersFound = ref([])
  const step1Form = ref({
    email: {
      content: '',
      error: false,
      done: false
    },
    title: {
      content: '',
      error: false,
      done: false
    },
    firstName: {
      content: '',
      error: false,
      done: false
    },
    lastName: {
      content: '',
      error: false,
      done: false
    },
    birthdate: {
      content: '01.01.1900',
      error: false,
      done: false
    }
  })

  // Getters

  // Actions  
  async function checkEmail() {
    usersFound.value = []
    const email = step1Form.value.email.content
    console.log('email :>> ', email);
    if(email.length != ''){
      try {
        const res = await api.post('/check-email', {email: email})
        console.log("check-email : ", res.data)
        if(res.data.length > 0){
          usersFound.value = res.data
          step1Form.value.email.done = true
        }
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  return {
    // State
    step1Form,

    // Getters

    // Actions
    checkEmail,

  }
})
