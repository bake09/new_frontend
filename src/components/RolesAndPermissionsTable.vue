<template>
  <q-table
    separator="cell"
    :class="!usersStore.isLoading ? 'my-sticky-column-table' : ''"
    dense flat bordered
    title="Roles and Permissions"
    :loading="usersStore.isLoading"
    :columns="usersStore.dynamicPermissions"
    :rows="usersStore.dynamicRoles"
    row-key="name"
  >
    <!-- Top Side -->
    <template v-slot:top>
      <div class="text-h6 q-pr-md">Übersicht Rollen und Rechte</div>
      <q-input outlined dense debounce="300" placeholder="Search..." color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space />
      <q-btn color="primary" icon="add" label="Add role" @click="addRole" dense class="q-px-md q-mr-md"/>
      <q-btn color="primary" icon="add" label="Add permission(s)" @click="addPermissions" dense class="q-px-md"/>
    </template>
    <!-- Alle Spalten Schleife -->
    <template #body-cell="props">
      <q-td :props="props" class="text-center">
        <template v-if="props.col.name === 'Role'">
          <!-- Erste Spalte: Nur Text -->
          <span  class="text-uppercase">{{ props.value }}</span>
        </template>
        <template v-else>
          <!-- Alle anderen Spalten: Check oder Close -->
          <q-icon
            class="text-bold"
            size="xs"
            :name="props.value ? 'check' : 'close'"
            :color="props.value ? 'positive' : 'negative'"
          />
        </template>
      </q-td>
    </template>

    <!-- Aktionen Spalte -->
    <template #body-cell-actions="props">
      <q-td :props="props" class="text-center">
        <q-btn
          dense outline round
          size="xs"
          icon="edit"
          @click="editRole(props.row)"
        />
      </q-td>
    </template>
  </q-table>
  
  <!-- Edit Dialog -->
  <q-dialog v-model="showEditdialog" @before-hide="usersStore.selectedRole = null">
    <q-card  style="min-width: 400px; max-width: 600px;">
      <q-toolbar>
        <q-toolbar-title>Edit Role: <span class="text-weight-bold">{{ usersStore.findAndReturnRoleWithPermissions?.name }}</span></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <q-list bordered separator>
          <q-item dense>
            <q-item-section class="text-bold">
              <q-item-label overline>PERMISSION</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>enabled?</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable dense v-for="permission in usersStore.allPermissionsWithRoles" @click="usersStore.togglePermission(permission)">
            <q-item-section >
              <q-item-label>{{ permission.name }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-checkbox :model-value="usersStore.currentRoleToEdit.permissions.some(p => p.id === permission.id)" @click="usersStore.togglePermission(permission)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showAddPermissionDialog">
    <q-card style="min-width: 400px; max-width: 600px;">
      <q-toolbar>
        <q-toolbar-title>Add Permission</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-card-section>
        <!-- Add permission form goes here -->
      </q-card-section>
    </q-card>
  
  </q-dialog>
</template>

<script setup>
import { onMounted, onActivated, ref } from 'vue'
import { usePermission } from '@vueuse/core' // ??? In Gebrauch ??? prüfen!

import { useUsersStore } from 'src/stores/users-store'
const usersStore = useUsersStore()

onMounted(async() => {
  console.log("activated RolesAndPermissionsTable");
  usersStore.fetchRoles()
  await usersStore.fetchUsers()
})

const showEditdialog = ref(false)
const editRole = (row) => {
  usersStore.selectedRole = row.id
  showEditdialog.value = true
  console.log('usersStore.findAndReturnRoleWithPermissions:', usersStore.findAndReturnRoleWithPermissions)
}

const showAddPermissionDialog = ref(false)

const addRole = () => {
  console.log('Add new role')
}
const addPermissions = () => {
  showAddPermissionDialog.value = true
}

const filter = ref('')
</script>

<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 2

  // Light‑Modus: helle Farbe
  thead tr:first-child th:first-child,
  td:first-child
    background-color: #fff  // oder var(--q-light-page)

  // Dark‑Modus: dunkle Farbe
  .q-dark &
    thead tr:first-child th:first-child,
    td:first-child
      background-color: var(--q-dark-page)
</style>