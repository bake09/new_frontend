import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from "boot/axios";

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const isLoading = ref(false)
  const selectedUser = ref(null)
  const showEditDialog = ref(false)
  const allRoles = ref(["admin",])
  const allPermissions = ref([
    "create_todo",
    "read_todo",
    "update_todo",
    "delete_todo",
  ])
  const allRolesWithPermissions = ref([])
  const allPermissionsWithRoles = ref([])

  // Getters
  const roles = computed(() => {
    return allRolesWithPermissions.value.map((role) => ({
      id: role.id,
      name: role.name.charAt(0).toUpperCase() + role.name.slice(1), // Name mit Großbuchstaben
      permissions: [], // Leeres Array für Permissions
    }));
  });
  const sections = computed(() => {
    return allRolesWithPermissions.value.map((role) => ({
      id: role.id,
      name: role.name.charAt(0).toUpperCase() + role.name.slice(1), // Name mit Großbuchstaben
      permissions: role.permissions.map((permission) => ({
        id: permission.id, // ID aus der Permission
        name: permission.name, // Name aus der Permission
      })),
    }));
  });

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const res = await api.get('user')
      console.log("users-store : ", res.data.data)
      users.value = res.data.data
      // selectedUser.value = users.value[0]
      showEditDialog.value = true
      isLoading.value = false
    } catch (err) {
      console.error(err)
      isLoading.value = false
    }
  }
  const fetchRoles = async () => {
    try {
      const res = await api.get('roles')
      console.log("response : ", res.data)
      allRolesWithPermissions.value = res.data.roles
      allPermissionsWithRoles.value = res.data.permissions
      isLoading.value = false
    } catch (err) {
      console.error(err)
      isLoading.value = false
    }
  }
  const createRole = async (role) => {
    try {
      const res = await api.post('roles', role);
      console.log("Role created:", res.data);
      await fetchRoles(); // Rollen neu laden
    } catch (error) {
      console.error("Error creating role:", error);
    }
  }
  const assignPermissionToRole = async (roleId, permissionId) => {
    try {
      const res = await api.post(`roles/${roleId}/permissions`, { permission: permissionId });
      console.log("Permission assigned:", res.data);
      await fetchRoles(); // Rollen neu laden
    } catch (error) {
      console.error("Error assigning permission:", error);
    }
  }
  const removePermissionFromRole = async (roleId, permissionId) => {
    try {
      const res = await api.delete(`roles/${roleId}/permissions/${permissionId}`);
      console.log("Permission removed:", res.data);
      await fetchRoles(); // Rollen neu laden
    } catch (error) {
      console.error("Error removing permission:", error);
    }
  }
  const columns = (fields = []) => {
    if (users.value.length === 0) return []; // Wenn keine Benutzer geladen sind, keine Spalten erstellen

    // Wenn keine Felder übergeben werden, alle Felder verwenden
    const columnsToUse = fields.length ? fields : Object.keys(users.value[0]);

    return columnsToUse.map((key) => {
      let label = key.charAt(0).toUpperCase() + key.slice(1); // Erstes Zeichen groß machen
      // Anpassen der Label-Bezeichner für spezielle Felder
      if (key === 'avatar') {
        label = 'Avatar';
      }
      return {
        name: key,
        label: label,
        field: key,
        sortable: true,
      };
    });
  }
  const updateUser = async (user) => {
    // try {
    //   const res = await api.put(`user/${user.id}`, user)
    //   console.log("users-store : ", res)
    //   fetchUsers()
    // } catch (err) {
    //   console.error(err)
    // }
    console.log('selectedUser.value :>> ', selectedUser.value);
  }
  const toggleRole = (role, isChecked) => {
    console.log('isChecked :>> ', isChecked);
    console.log('permission :>> ', role);
    if (isChecked) {
      if (!selectedUser.value.roles.includes(role)) {
        selectedUser.value.roles.push(role);
      }
    } else {
      selectedUser.value.roles = selectedUser.value.roles.filter(
        (perm) => perm !== role
      );
    }
  }
  const togglePermission = (permission, isChecked) => {
    console.log('isChecked :>> ', isChecked);
    console.log('permission :>> ', permission);
    if (isChecked) {
      if (!selectedUser.value.permissions.includes(permission)) {
        selectedUser.value.permissions.push(permission);
      }
    } else {
      selectedUser.value.permissions = selectedUser.value.permissions.filter(
        (perm) => perm !== permission
      );
    }
  }

  // RETURN everything
  return {
    // State
    users,
    isLoading,
    selectedUser,
    showEditDialog,
    allPermissions,
    allRoles,
    allRolesWithPermissions,
    allPermissionsWithRoles,
    roles,
    sections,
    createRole,
    assignPermissionToRole,
    removePermissionFromRole,


    // Getters

    // Actions
    fetchUsers,
    columns,
    updateUser,
    toggleRole,
    togglePermission,
    fetchRoles,

  } 
})
