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
        <td key="email" :props="props">{{ props.row.roles.map(role => role.name).join(', ') }}</td>
        <td key="email" :props="props">aktiv</td>
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

  <q-dialog v-if="usersStore.selectedUser" v-model="usersStore.showEditDialog" @hide="usersStore.selectedUser = null" :backdrop-filter="'brightness(60%)'" maximized transition-show="jump-up" transition-hide="jump-down">
    <q-card style="width: 800px;">
      <q-toolbar>
        <q-avatar>
          <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"> -->
          <q-icon name="edit" color="grey-7"/>
        </q-avatar>
        <q-toolbar-title><span class="text-weight-bold">{{usersStore.selectedUser.name}}</span> bearbeiten</q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-tabs
        v-model="tab"
        dense
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
        active-color="primary"
        indicator-color="purple-6"
        align="justify"
      >
        <q-tab name="allgemein" label="Allgemein"/>
        <q-tab name="rollen" label="Rollen" />
        <q-tab name="team" label="Team" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="allgemein"  style="min-height: 600px;">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6">Avatar</div>
              <div class="relative-position" >
                <q-avatar size="64px" class="relative-position">
                  <img :src="`${apiUrl}/${usersStore.selectedUser.avatar}`" alt="Avatar" />
                  <q-icon name="edit" class="absolute-position" size="xs" style="bottom: 4px; left: 4px;"/>
                </q-avatar>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn color="dark" icon="save">Speichern</q-btn>
            </q-card-actions>
          </q-card>

          <q-card class="q-mb-md">
            <q-card-section class="row">
              <div class="col-12 col-md-8">
                <div class="text-h6">Allgemein</div>
                <q-form class="q-gutter-md">
                  <q-input v-model="usersStore.selectedUser.name" label="Name" dense clearable outlined clear-icon="close"/>
                  <q-input v-model="usersStore.selectedUser.email" label="Email" dense clearable outlined clear-icon="close"/>
                </q-form>
              </div>
              <div class="col-12 col-md-4">
                <div class="text-h6">Status</div>
                <q-toggle v-model="usersStore.selectedUser.active" label="Aktiv" color="primary" />
              </div>  
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn color="dark" icon="save">Speichern</q-btn>
            </q-card-actions>
          </q-card>

          <q-card>
            <q-card-section>
              <div class="text-h6">Password</div>
              <q-form class="q-gutter-xs">
              <q-input v-model="current_password" dense clearable outlined :type="isPwd ? 'password' : 'text'" hint="Aktuelles Passwort" placeholder="Aktuelles Passwort" autocomplete="off">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input v-model="new_password" dense clearable outlined :type="isPwd ? 'password' : 'text'" hint="Neues Passwort" placeholder="Neues Passwort" autocomplete="off">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-input v-model="new_password_confirm" dense clearable outlined :type="isPwd ? 'password' : 'text'" hint="Neues Passwort wiederholen" placeholder="Neues Passwort wiederholen" autocomplete="off">
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              </q-form>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn color="dark" icon="save">Speichern</q-btn>
            </q-card-actions>
          </q-card> 
        </q-tab-panel>

        <q-tab-panel name="rollen" class="q-gutter-md" style="min-height: 600px;">
          <q-card>
            <q-card-section>
              <div class="text-h6">Rollen</div>
              <q-select
                dense
                outlined
                v-model="usersStore.selectedUserRole"
                :options="usersStore.returnAllRolesForSelect"
                label="Role"
                @update:model-value="usersStore.assignRole(usersStore.selectedUser.id, $event)"
              />
              <div class="text-caption q-my-none">enthaltene Rechte:</div>
              <div class="row q-my-none">
                <div class="col-1">
                  <q-icon name="subdirectory_arrow_right"/>
                </div>
                <div class="col-11">
                  <q-checkbox class="q-pr-sm" v-for="permission in usersStore.returnAllPermissionsForCheckboxes"
                    dense
                    disabled
                    :key="permission.id"
                    :label="permission.name"
                    :model-value="usersStore.isPermissionSelected(permission)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="team" class="q-gutter-md" style="min-height: 600px;">
          <q-card>
            <q-card-section>
              <div class="text-h6">Team</div>
              <div class="q-gutter-md">
                <div v-for="t in usersStore.selectedUser.team" :key="t.id">
                  <q-input v-model="t.name" label="Team" dense clearable outlined clear-icon="close"/>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
      <q-separator />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { useQuasar } from 'quasar';
const $q = useQuasar()

import { useUsersStore } from 'src/stores/users-store'
const usersStore = useUsersStore()

const apiUrl = process.env.VUE_APP_API_URL.replace(/\/api\/?$/, '')

const tab = ref('allgemein')

const editUser = (user) => {
  console.log('user :>> ', user)
  usersStore.selectedUser = user
  usersStore.selectedUserRole = { 
    label: user.roles[0].name, 
    value: user.roles[0].id,
    permissions: user.roles[0].permissions.map(permission => ({
      id: permission.id,
      name: permission.name,
      isChecked: true
    }))
  }
  usersStore.showEditDialog = true
}

const selectChanged = (value) => {
  console.log('Selected role changed:', value)
} 

onMounted(async () => {
  usersStore.fetchRoles()
  await usersStore.fetchUsers()
})

const current_password = ref('')
const new_password = ref('')
const new_password_confirm  = ref('')
const isPwd = ref(true)
</script>