<template>
  <q-page class="q-pa-md">
    <!-- Table Head Outer -->
      <div class="row justify-end q-px-xs">
        <div class="col-4">
          <q-btn size="xs" icon="add" label="Add Role" @click="addEditRolePermission('add')" v-if="usersStore.allPermissionsWithRoles.length != 0"/>
        </div>
        <div class="col-4 text-right" v-for="(role, index) in usersStore.allRolesWithPermissions" :key="role.id">
          {{ role.name }}
        </div>
      </div>

      <span v-for="(group, groupName) in usersStore.allPermissionsWithRoles" :key="groupName">
        <!-- Table Head Inner -->
        <div class="row justify-between bg-grey-3 q-pa-xs">
          <div class="col-4" style="border-right: 1px solid #ccc;">{{ groupName }}</div>
          <div class="col text-right">
            <q-btn size="xs" color="primary" icon="add" label="Add / Edit Permission(s)" @click="addEditRolePermission('edit', groupName)" />
          </div>
        </div>
        <!-- Table Body -->
        <div v-for="perm in group" :key="perm.id">
          <div class="row bg-yellow-3 q-pa-xs" style="border-bottom: 1px solid #ccc;">
            <div class="col" style="border-right: 1px solid #ccc;">
              {{ perm.name }}
            </div>
            <!-- Checkboxen für jede Rolle -->
            <div class="col text-right" v-for="role in usersStore.allRolesWithPermissions" :key="role.id">
              <q-checkbox
                dense
                :model-value="hasPermissionToFillCheckbox(role, perm)"
                @update:model-value="(value) => updatePermission(role, perm, value)"
                color="green"
              />
            </div>
          </div>
        </div>
      </span>

    <q-inner-loading
      :showing="usersStore.isLoading"
      label="Loading..."
      label-style="font-size: 1.1em"
    />

    <q-dialog v-model="dialogRef">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-pl-xs">Role:</div>
          <q-form
            style="width: 400px"
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              dense
              outlined
              v-model="newRoleForm.newRoleName.name"
              label="Role Name *"
              hint="Example: Admin, User, etc."
              lazy-rules
              clearable
              :rules="[ val => val && val.length > 0 || 'Please type a Role Name']"
            />

            <q-input
              dense
              outlined
              v-model="newRoleForm.newPermissionName.name"
              label="Add Permission(s) *"
              hint="Use underscores and Crud-Syntax Example: create_article."
              lazy-rules
              clearable
              :rules="[
                val => val !== null && val !== '' || 'Please type a permission',
                val => val > 0 && val < 100 || 'Please type a real age'
              ]"
            />
            <q-separator />
            <div class="text-h6 q-pl-xs">{{ newRoleForm.permissions.length }} Permissions:</div>
            <div style="min-height: 80px;" class="flex flex-center permissions-bg">
              <div class="text-subtitle2 text-grey-5" v-if="!newRoleForm.permissions.length">No Permission(s) added</div>
              <div class="q-gutter-xs row truncate-chip-labels" style="max-width: 300px;" v-else>
                <transition-group
                  appear
                  enter-active-class="animated flipInX"
                  leave-active-class="animated flipOutX"
                >
                  <q-chip
                    v-for="(permission, index) in newRoleForm.permissions"
                    :key="permission.name"
                    removable
                    v-model="permission[index]"
                    color="black"
                    text-color="white"
                    icon="lock"
                    icon-remove="delete"
                    :label="permission.name"
                    @remove="newRoleForm.permissions.splice(index, 1)"
                  >
                    <q-tooltip>{{ permission.name }}</q-tooltip>
                  </q-chip>
                </transition-group>
              </div>
            </div>
            <q-separator />
            <div class="row justify-end q-gutter-md">
              <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
              <q-btn label="Save" type="submit" color="primary" icon="save"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onActivated, onDeactivated, ref } from "vue"

import { useUsersStore } from 'src/stores/users-store'
const usersStore = useUsersStore()

const dialogRef = ref(false)
const dialogType = ref('add')
const newRoleForm = ref({
  newRoleName: { name: "" },
  newPermissionName: { name: "" },
  permissions: [],
})

// Überprüft, ob eine Rolle eine bestimmte Berechtigung hat
const hasPermissionToFillCheckbox = (role, permission) => {
  return role.permissions.some((perm) => perm.id === permission.id)
}

// Aktualisiert die Berechtigung für eine Rolle
const updatePermission = (role, permission, value) => {
  if (value) {
    usersStore.assignPermissionToRole(role.id, permission.id)
  } else {
    usersStore.removePermissionFromRole(role.id, permission.id)
  }
}

// Neue Rolle hinzufügen
const addEditRolePermission = (type, groupName = null) => {
  console.log('type :>> ', type)
  console.log('groupName :>> ', groupName)
  dialogRef.value = true
}

// Formular absenden
const onSubmit = async () => {
  try {
    const newRole = {
      name: newRoleForm.value.newRoleName.name,
      permissions: newRoleForm.value.permissions.map((perm) => perm.name),
    };
    await usersStore.createRole(newRole);
    dialogRef.value = false;
    await usersStore.fetchRoles(); // Rollen neu laden
  } catch (error) {
    console.error("Error creating role:", error);
  }
}

// Formular zurücksetzen
const onReset = () => {
  newRoleForm.value = {
    newRoleName: { name: "" },
    newPermissionName: { name: "" },
    permissions: [],
  };
}

// Beim Aktivieren der Seite Rollen laden
onActivated(async () => {
  usersStore.isLoading = true;
  await usersStore.fetchRoles();
})

onDeactivated(() => {

})
</script>

<style scoped>
.truncate-chip-labels > .q-chip {
  max-width: 130px;
}
</style>