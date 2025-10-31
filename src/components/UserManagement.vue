<template>
  <q-table
    dense
    title="Users"
    :rows="usersStore.users"
    :loading="usersStore.isLoading"
    row-key="id"
    separator="cell"
  >
    <!-- Custom header with extra column for expand button -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <!-- <q-th key="id" :props="props">Id</q-th> -->
        <q-th key="avatar" :props="props">#</q-th>
        <q-th key="name" :props="props">Name</q-th>
        <q-th key="email" :props="props">Email</q-th>
        <q-th key="email" :props="props">Rolle(n)</q-th>
        <q-th key="email" :props="props">Aktiv?</q-th>
        <!-- <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th> -->
        <q-th auto-width>Aktionen</q-th> <!-- Action column header -->
      </q-tr>
    </template>

    <!-- Custom body with expand button and other cells -->
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
        <!-- <td key="id" :props="props">{{ props.row.id }}</td> -->
        <td key="avatar" :props="props">
          <q-avatar size="sm">
            <img :src="`${apiUrl}/${props.row.avatar}`" alt="Avatar" />
          </q-avatar>
        </td>
        <td key="name" :props="props">{{ props.row.name }}</td>
        <td key="email" :props="props">{{ props.row.email }}</td>
        <td key="roles" :props="props">{{ props.row.roles.map(role => role.name).join(', ') }}</td>
        <td key="aktiv" :props="props">aktiv</td>
        <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td> -->
        <!-- Add actions column with buttons -->
        <q-td auto-width align="right">
          <q-btn
            round
            dense
            flat
            size="sm"
            icon="edit"
            color="primary"
            @click="editUser(props.row)"
          />
        </q-td>
      </q-tr>

      <!-- Expanded row content -->
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            This is the expanded slot for row: {{ props.row.name }}.
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <EditModal />
</template>

<script setup>
  import { watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  const route = useRoute()
  const router = useRouter()

  import { useUsersStore } from 'src/stores/users-store'
  import EditModal from './user/EditModal.vue';
  const usersStore = useUsersStore()

  const apiUrl = process.env.VUE_APP_API_URL.replace(/\/api\/?$/, '')

  const editUser = async (user) => {
    console.log('Editing user:', user);
    usersStore.selectedUser = user
    usersStore.selectedUserRole = { 
      label: user.roles[0].name, 
      id: user.roles[0].id,
      permissions: user.roles[0].permissions.map(permission => ({
        id: permission.id,
        name: permission.name
      }))
    }
    await router.replace({ name: 'edit-modal', params: { id: usersStore.selectedUser.id, tab: usersStore.editDialogTab } })
    usersStore.showEditDialog = true
  }

  watch(() => route, async (to, from) => {
      if(to.params.id !== null && to.params.tab !== null) {
        // console.log('to.params.tab :>> ', to.params.tab);
        // usersStore.editDialogTab = to.params.tab
        if(!usersStore.users.length) {
          await usersStore.fetchUsers()
          const user = usersStore.users.find(u => u.id == to.params.id)
          if(user) {
            editUser(user, to.params.tab)
          }
        }else{
          console.log("users exists in Store  ");
        }
      }
    },
    { immediate: true }
  )

  onMounted(async () => {
    await usersStore.fetchRoles()
  })
</script>