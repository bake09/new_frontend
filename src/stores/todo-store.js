import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios';

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref([])
  const todosLoading = ref(true)
  const newTodo = ref('')
  const showDone = ref(true)
  const showOpen = ref(true)
  const toggleAlphabeticFilter = ref(false)
  const renderFilter = ref('all')
  const bottomSheetShowing = ref({
    show: false,
    todo: null
  })
  const onlineUsers = ref([])
  const processing = ref({
    id: null,
    state: false
  })

  // Getters
  const totalTodosCount = computed(() => todos.value.length)
  const doneTodosCount = computed(() => todos.value.filter(todo => todo.done).length)
  const openTodosCount = computed(() => todos.value.filter(todo => !todo.done).length)

  const filteredTodos = computed(() => {
    let result = [...todos.value];

    // Filter anwenden
    if (renderFilter.value === 'active') {
      result = result.filter(todo => !todo.done); // Nur offene Todos
    } else if (renderFilter.value === 'completed') {
      result = result.filter(todo => todo.done); // Nur erledigte Todos
    }

    // Alphabetische Sortierung
    result.sort((a, b) => {
      if (toggleAlphabeticFilter.value) {
        return a.content.localeCompare(b.content); // A-Z
      } else {
        return b.content.localeCompare(a.content); // Z-A
      }
    });

    return result;
  });

  const sortTodos = () => {
    toggleAlphabeticFilter.value = !toggleAlphabeticFilter.value
    // Sortiere das zugrunde liegende Array
    todos.value.sort((a, b) => {
        if (toggleAlphabeticFilter.value) {
            return a.content.localeCompare(b.content);
        } else {
            return b.content.localeCompare(a.content);
        }
    })
  }

  const setFilter = (filter) => {
    renderFilter.value = filter
    console.log('renderFilter.value :>> ', renderFilter.value);
  }

  // Actions
  const getTodos = () => {
    clearTodos()
    api.get('/todo').then(res => {
      res.data.data.forEach(item => {
        todos.value.push(item)
      })
      todosLoading.value = false
    }).catch(err => {
      console.log('err :>> ', err);
      todosLoading.value = false
    })
  }
  const clearTodos = () => {
    todos.value = []
  }
  const deleteTodo = async (todo) => {
    let currentTodo = todo
    
    api.delete(`/todo/${todo.id}`).then(res => {
      console.log('res :>> ', res);
      deleteTodoLocally(todo)
      todosLoading.value = false
    }).catch(err => {
      console.log('err :>> ', err);
      todosLoading.value = false
    })
  }
  const addTodo = async () => {
    todosLoading.value = true;
    try {
        const res = await api.post(`/todo`, { content: newTodo.value });
        todos.value.unshift(res.data.data);
        newTodo.value = ''; // Reset erst nach erfolgreicher Antwort
    } catch (err) {
        console.error('Error adding todo:', err);
    } finally {
        todosLoading.value = false;
    }
  }
  const deleteTodoLocally = (todo) => {
    if (findLocalIndexById(todo) !== -1) {
      todos.value.splice(findLocalIndexById(todo), 1);
    }
  }
  const findLocalIndexById = (todo) => {
    const localIndex = todos.value.findIndex(item => item.id === todo.id)
    return localIndex
  }
  const toggleDone = async (todo) =>{
    console.log('todo :>> ', todo);
    processing.value.id = todo.id
    processing.value.state = true
    await api.patch(`/todo/toggledone/${todo.id}`, { done: !todo.done }).then(res => {
      toggleTodoDoneLocally(res.data)
      resetProccesing()
    }).catch(err => {
      console.log(err)
    })
  }
  const updateTodo = async () =>{
    console.log('update todo :>> ', bottomSheetShowing.value.todo);
    await api.patch(`/todo/${bottomSheetShowing.value.todo.id}`, bottomSheetShowing.value.todo).then(res => {
      console.log('updated todo :>> ', res.data.data);
      bottomSheetShowing.value.show = false
    }).catch(err => {
      console.log(err)
    })
  }
  const toggleTodoDoneLocally = (todo) => {
    if (findLocalIndexById(todo) !== -1) {
        todos.value[findLocalIndexById(todo)] = todo
    }
  }
  const renderAvatarHelper = ((avatar) => {
    if(avatar){
      return `http://${process.env.VUE_APP_SERVER_IP}:8000/${avatar}`
    }
  })
  const toggleBottomSheet = (todo = null) => {
    if(todo) {
      bottomSheetShowing.value.show = true
      bottomSheetShowing.value.todo = todo
    }else{
      bottomSheetShowing.value.show = false
      bottomSheetShowing.value.todo = null
      return
    }
  }
  const joinAndListenOnlineUsersChannel = () => {
    Echo.join('users.1')
      .here((users) => {
        // console.log("USERS here : ", users);
        users.forEach(user => {
          // Nur hinzufügen, wenn die ID noch nicht im Array ist
          if (!onlineUsers.value.includes(user.id)) {
            onlineUsers.value.push(user.id);
          }
        });
      })
      .joining((user) => {
        console.log("USER joining : ", user);
        // Nur hinzufügen, wenn die ID noch nicht im Array ist
        if (!onlineUsers.value.includes(user.id)) {
          onlineUsers.value.push(user.id);
        }
      })
      .leaving((user) => {
        console.log("USER leaving : ", user);
        // Entfernen, wenn die ID im Array vorhanden ist
        if (onlineUsers.value.includes(user.id)) {
          onlineUsers.value = onlineUsers.value.filter(u => u !== user.id);
        }
      });
  }

  const joinOnlineUsersChannel = () => {
    Echo.join('users.1')
  }
  const leaveOnlineUsersChannel = () => {
    Echo.leave('users.1')
  }

  const resetProccesing = () => {
    processing.value.id = null
    processing.value.state = false
  }

  return {
    // State
    todos,
    todosLoading,
    newTodo,
    showDone,
    showOpen,
    toggleAlphabeticFilter,
    renderFilter,
    bottomSheetShowing,
    onlineUsers,
    processing,

    // Getters
    totalTodosCount,
    doneTodosCount,
    openTodosCount,
    filteredTodos,


    // Actions
    getTodos,
    clearTodos,
    deleteTodo,
    addTodo,
    updateTodo,
    deleteTodoLocally,
    toggleDone,
    toggleTodoDoneLocally,
    renderAvatarHelper,
    sortTodos,
    setFilter,
    toggleBottomSheet,
    joinAndListenOnlineUsersChannel,
    joinOnlineUsersChannel,
    leaveOnlineUsersChannel,
    resetProccesing,

  }
})
