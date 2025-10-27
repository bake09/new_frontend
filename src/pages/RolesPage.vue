<template>
  <q-page padding>
    <div class="row">
      <div class="col-4">
        <q-list bordered padding class="rounded-borders text-blue-grey-4">
         <q-item>
          <q-item-section>
            <q-item-label>Select a Role to Edit</q-item-label>
          </q-item-section>
        </q-item>
        <template v-for="role in usersStore.returnAllRolesForSelect" :key="role.id">
          <q-item dense clickable v-ripple :active="selectedRole?.label == role?.label" @click="setSelection(role)" active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="lock_person" />
            </q-item-section>
            <q-item-section>{{ role.label }}</q-item-section>
          </q-item>
        </template>
        </q-list>
      </div>
      <q-card class="col-8" flat bordered>
        <q-card-section>
          Edit Persmissions of Role: {{ usersStore.selectedRole?.label }}
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="row q-gutter-xs" v-if="usersStore.selectedRole !== null">
            ️<template v-for="permission in usersStore.returnAllPermissionsForCheckboxes" :key="permission.id">
              <q-checkbox
                dense
                class="q-pa-xs"
                :class="objectExists(usersStore.selectedRole?.permissions, permission) ? 'bg-green-13' : 'bg-blue-grey-2'"
                :model-value="objectExists(usersStore.selectedRole?.permissions, permission)"
                :val="permission"
                @click="onClick(permission)"
              >
              {{ permission.name }} <q-icon size="xs" :name="objectExists(usersStore.selectedRole?.permissions, permission) ? 'key' : 'key_off'" :color="objectExists(usersStore.selectedRole?.permissions, permission) ? '' : 'grey-6'"/>
              </q-checkbox>
            </template>
          </div>
          <q-inner-loading :showing="usersStore.selectedRole !== null && usersStore.isLoading">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card-section>
      </q-card>
    </div>
    <div class="row">
      <pre>{{ usersStore?.selectedRole }}</pre>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUsersStore } from 'src/stores/users-store'
const usersStore = useUsersStore()

// Role Selection for Permission Editing
const selectedRole = ref(null);
const setSelection = (role) => {
  useUsersStore.selectedRole = null;
  console.log('role :>> ', role);
  selectedRole.value = role;
  usersStore.selectedRole = role;
}

function objectExists(array, obj) {
  if(!array) return false;
  return array.some(item => JSON.stringify(item) === JSON.stringify(obj))
}
const onClick = async (permission) => {
  if(objectExists(usersStore.selectedRole?.permissions, permission)){
    console.log('Permission already exists : ', permission)
    usersStore.selectedRole.permissions = usersStore.selectedRole.permissions.filter(p => p.id !== permission.id)
    console.log('usersStore.selectedRole.id :>> ', usersStore.selectedRole.id);
    await usersStore.syncPermissionsToRole(usersStore.selectedRole.id)
  } else {
    console.log('Permission does not exist : ', permission)
    usersStore.selectedRole.permissions.push(permission)
    await usersStore.syncPermissionsToRole(usersStore.selectedRole.id)
  }
}

onMounted(() => {
  usersStore.selectedRole = null;
  usersStore.fetchRoles();
});
</script>

<style  scoped>
.my-menu-link{
  color: white;
  background: #F2C037;
}

.q-checkbox{
  border: 1px solid #90a4ae;
  border-radius: 4px;
}
</style>
