import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from "boot/axios";

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const isLoading = ref()
  const selectedUser = ref(null)
  const selectedUserRole = ref(null)
  const selectedRole = ref(null)
  const showEditDialog = ref(false)
  const allRolesWithPermissions = ref([])
  const allPermissionsWithRoles = ref([])
  const currentRoleToEdit = ref([])

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
  const dynamicRoles = computed(() => {
    return allRolesWithPermissions.value.map(role => {
      const capitalized = role.name;

      // Bau das Objekt: start mit name, dann für jede permission ein Key/Value
      const permsObj = role.permissions.reduce((acc, permission) => {
        acc[permission.name] = permission.name
        return acc;
      }, {});

      return {
        id: role.id,
        name: capitalized,
        ...permsObj
      };
    });
  });
  const dynamicPermissions = computed(() => {
    const mapped = allPermissionsWithRoles.value.map(p => ({
      id: p.id,
      name: p.name,
      label: p.name.replace('_', ' '),
      field: p.name,
    }));

    const staticFirst = {
      align: 'left',
      name: 'Role',
      label: 'Role',
      field: 'name',
    };

    const actionEdit = { 
      name: 'actions', 
      label: 'Edit', 
      field: 'actions', 
      align: 'right'
    }

    return [staticFirst, ...mapped, actionEdit];
  });
  const findAndReturnRoleWithPermissions = computed(() => {
    const foundRole = allRolesWithPermissions.value.find(role => role.id == selectedRole.value);
    if (foundRole) {
      currentRoleToEdit.value = JSON.parse(JSON.stringify(foundRole));
      return currentRoleToEdit.value;
    }
    currentRoleToEdit.value = null;
    return null;
  })
  const returnRoleOfSelectedUser = computed(() => {
    if (selectedUser.value && selectedUser.value.roles && selectedUser.value.roles.length > 0) {
      return {
        value: selectedUser.value.roles[0].id,
        label: selectedUser.value.roles[0].name,
      }; // Nimm die erste Rolle des Benutzers
    }
    return null; // Falls kein Benutzer oder keine Rolle vorhanden ist
  });
  const returnAllRolesForSelect = computed(() => {
    return allRolesWithPermissions.value.map(role => ({
      label: role.name,
      value: role.id,
      permissions: role.permissions.map(permission => ({
        id: permission.id,
        name: permission.name,
        isChecked: true
      })),
    }));
  });

  
  const returnAllPermissionsForCheckboxes = computed(() => {
    return allPermissionsWithRoles.value.map(permission => ({
      id: permission.id,
      name: permission.name,
    }));
  });
  
  watch(findAndReturnRoleWithPermissions, (newRole, oldRole) => {
    if (newRole && oldRole != null) {
      updatePermissionsFromRole(newRole)
    }
  }, {deep: true});

  // Actions
  const fetchUsers = async () => {
    isLoading.value = true
    try {
      const res = await api.get('user')
      console.log("users-store : ", res.data.data)
      users.value = res.data.data
      showEditDialog.value = true
      isLoading.value = false
    } catch (err) {
      console.error(err)
      isLoading.value = false
    }
  }
  const isRoleSelected = (role) => {
    return selectedUser.value.roles.some(r => r.id === role.id);
  }
  const isPermissionSelected = (permission) => {
    return selectedUserRole.value.permissions.some(p => p.id === permission.id);
  }
  const fetchRoles = async () => {
    isLoading.value = true
    try {
      const res = await api.get('roles')
      console.log("response api.get('roles') : ", res.data)
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
    // if (isChecked) {
    //   if (!selectedUser.value.roles.includes(role)) {
    //     selectedUser.value.roles.push(role);
    //   }
    // } else {
    //   selectedUser.value.roles = selectedUser.value.roles.filter(
    //     (perm) => perm !== role
    //   );
    // }
    const roles = selectedUser.value.roles;

    if (isChecked) {
      // Nur hinzufügen, wenn noch nicht vorhanden (vergleich auf id)
      const exists = roles.some(r => r.id === role.id);
      if (!exists) {
        selectedUser.value.roles = [...roles, role];
      }
    } else {
      // Entfernen aller übereinstimmenden Rollen (nach id)
      selectedUser.value.roles = roles.filter(r => r.id !== role.id);
    }
  }
  const togglePermission = (permission) => {
    const perms = currentRoleToEdit.value.permissions;
    const index = perms.findIndex(p => p.id === permission.id);
    if (index === -1) {
      perms.push(permission);
    } else {
      perms.splice(index, 1);
    }
  }
  const updatePermissionsFromRole = async (role) => {
    try {
      const res = await api.patch(`roles/${role.id}/updateRole`, role);
      console.log("Role updated:", res);
      // await fetchRoles(); // Rollen neu laden
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }
  const assignRole = async () => {
    const roleId = selectedUserRole.value.value;
    const userId = selectedUser.value.id;
    try {
      const res = await api.patch(`user/${userId}/assignRole`, { role: roleId });
      console.log("Role assigned to user:", res.data);
      // await fetchUsers(); // Benutzer neu laden
    } catch (error) {
      console.error("Error assigning role to user:", error);
    }
  }

  // RETURN everything
  return {
    // State
    users,
    isLoading,
    selectedUser,
    selectedUserRole,
    selectedRole,
    showEditDialog,
    allRolesWithPermissions,
    allPermissionsWithRoles,
    roles,
    sections,
    createRole,
    assignPermissionToRole,
    removePermissionFromRole,
    currentRoleToEdit,

    // Getters
    dynamicRoles,
    dynamicPermissions,
    findAndReturnRoleWithPermissions,
    returnRoleOfSelectedUser,
    returnAllRolesForSelect,
    returnAllPermissionsForCheckboxes,

    // Actions
    fetchUsers,
    columns,
    updateUser,
    toggleRole,
    togglePermission,
    fetchRoles,
    isRoleSelected,
    isPermissionSelected,
    assignRole,

  } 
})
