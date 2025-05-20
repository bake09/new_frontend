<template>
  <q-table
    dense
    title="Users"
    :columns="usersStore.columns(['id', 'name', 'email', 'avatar'])"
    :rows="usersStore.users"
    :loading="usersStore.isLoading"
    row-key="id"
    separator="cell"
  >
    <!-- Custom header with extra column for expand button -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th auto-width>Aktionen</q-th> <!-- Action column header -->
      </q-tr>
    </template>

    <!-- Custom body with expand button and other cells -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="accent"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
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
  <q-dialog v-if="usersStore.selectedUser" v-model="usersStore.showEditDialog" @hide="usersStore.selectedUser.value = null" :backdrop-filter="'brightness(60%)'">
    <q-card style="width: 800px;">
      <q-toolbar>
        <q-avatar>
          <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"> -->
          <q-icon name="edit" color="grey-7"/>
        </q-avatar>
        <q-toolbar-title><span class="text-weight-bold">{{usersStore.selectedUser.name}}</span> bearbeiten</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="usersStore.updateUser" class="q-gutter-md">
          <q-separator />
          <div>BenutzerInformationen</div>
          <q-input v-model="usersStore.selectedUser.name" label="Name" dense clearable outlined />
          <q-input v-model="usersStore.selectedUser.email" label="Email" dense clearable outlined />
          <q-separator />
          <div>Rollen & Rechte</div>
            <q-splitter v-model="splitterModel" disable>
              <template v-slot:before>
                <div class="text-h6 q-px-sm">Roles</div>
                <q-checkbox 
                  v-for="(role, index) in usersStore.allRoles"
                  :key="index"
                  :label="role" 
                  :model-value="usersStore.selectedUser.roles.includes(role)"
                  @update:model-value="(isChecked) => usersStore.toggleRole(role, isChecked)"
                  :val="role"
                />
              </template>

              <template v-slot:after>
                <div class="text-h6 q-px-sm">Permissions</div>
                <q-checkbox
                  disable
                  dense
                  v-for="(permission, index) in usersStore.allPermissions"
                  :key="index"
                  :label="permission"
                  :model-value="usersStore.selectedUser.permissions.includes(permission)"
                  @update:model-value="(isChecked) => usersStore.togglePermission(permission, isChecked)"
                  :val="permission"
                />
              </template>
            </q-splitter>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="usersStore.updateUser" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { useUsersStore } from 'src/stores/users-store'
const usersStore = useUsersStore()

const splitterModel = ref(50)

const selectUser = (user) => {
  console.log('user :>> ', user);
}

const editUser = (user) => {
  console.log('user :>> ', user)
  usersStore.selectedUser = user
  usersStore.showEditDialog = true
}

const columns = [
  { name: 'id',     label: 'ID',      field: 'id',    sortable: true, align: 'left', },
  { name: 'name',   label: 'Name',    field: 'name',  sortable: true },
  { name: 'email',  label: 'Email',   field: 'email' },
  { name: 'avatar', label: 'Avatar',  field: 'avatar' },
]

const rows = [
  {
    id: 1,
    name: 'User 1',
    email: 'test@test.com',
    avatar: 4.0,
  },
  {
    id: 2,
    name: 'User 2',
    email: 'test1@test.com',
    avatar: 4.3,
  },
  {
    id: 3,
    name: 'User 3',
    email: 'test2@test.com',
    avatar: 6.0,
  },
  {
    id: 4,
    name: 'User 4',
    email: 'test3@test.com',
    avatar: 4.3,
  }
]

const columns2 = [
  { name: 'id', align: 'left', label: '#', field: 'id' },
  { name: 'all', label: 'ALL', field: 'all' },
  { name: 'read', label: 'READ', field: 'read' },
  { name: 'write', label: 'WRITE', field: 'write' },
  { name: 'update', label: 'UPDATE', field: 'update' },
  { name: 'delete', label: 'DELETE', field: 'delete' },
]

const rows2 = ref([
  {
    id: 'Questions',
    all: false,
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    id: 'Users',
    all: false,
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    id: 'Todos',
    all: false,
    read: false,
    write: false,
    update: false,
    delete: false,
  }
])

onMounted(async () => {
  await usersStore.fetchUsers()
  // await usersStore.fetchRoles()
})
</script>