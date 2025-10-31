<template>
  <q-dialog
    v-if="usersStore.selectedUser"
    v-model="usersStore.showEditDialog"
    @hide="closeDialog"
    :backdrop-filter="'brightness(60%)'"
    :maximized="$q.screen.gt.sm ? false : true"
    transition-show="jump-up"
    transition-hide="jump-down"
  >
    <q-layout view="lhh LpR lff">
      <q-header class="shadow-2">
        <q-toolbar :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-blue-grey-1 text-black'">
          <q-btn flat round dense icon="arrow_back" v-close-popup />
            <q-toolbar-title><span class="text-weight-bold">{{usersStore.selectedUser.name}}</span> bearbeiten</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-tabs
          v-model="usersStore.editDialogTab"
          align="justify"
          :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-blue-grey-1 text-black'"
        >
          <!-- <q-route-tab :to="{ name: 'edit-modal', params: { tab: 'allgemein' } }" name="allgemein" label="Allgemein"/>
          <q-route-tab :to="{ name: 'edit-modal', params: { tab: 'rollen' } }" name="rollen" label="Rollen" />
          <q-route-tab :to="{ name: 'edit-modal', params: { tab: 'team' } }" name="team" label="Team" /> -->
          
          <q-tab name="allgemein" label="Allgemein"/>
          <q-tab name="rollen" label="Rollen" />
          <q-tab name="team" label="Team" />
        </q-tabs>
      </q-header>
      <q-page-container>
        <q-page>
          <q-tab-panels
            v-model="usersStore.editDialogTab"
            animated
            swipeable
            :style="$q.screen.gt.sm ? 'min-height: 50vh;' : 'height: calc(100vh - 98px);'"
          >
            <q-tab-panel name="allgemein">
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

            <q-tab-panel name="rollen">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Rollen</div>
                  <q-select
                    dense
                    outlined
                    v-model="usersStore.selectedUserRole"
                    :options="usersStore.returnAllRolesForSelect"
                    emit-value
                    label="Rolle"
                  />
                    <!-- @update:model-value="usersStore.assignRole(usersStore.selectedUser.id, $event)" -->
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
                <q-separator />
                <q-card-actions align="right">
                  <q-btn color="dark" icon="save" @click.prevent="usersStore.assignRole()" label="Speichern" />
                </q-card-actions>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="team">
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
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue'

  import { useUsersStore } from 'src/stores/users-store'
  const usersStore = useUsersStore()
  import { useRoute, useRouter } from 'vue-router'
  const route = useRoute()
  const router = useRouter()

  const apiUrl = process.env.VUE_APP_API_URL.replace(/\/api\/?$/, '')
  
  const closeDialog = () => {
    console.log("closeDialog triggered");
    usersStore.selectedUser = null
    usersStore.selectedUserRole = null
    usersStore.editDialogTab = 'allgemein'
    router.replace({ name: 'users', params: { id: null, tab: null } }) 
  }

  const current_password = ref('')
  const new_password = ref('')
  const new_password_confirm  = ref('')
  const isPwd = ref(true)

  // watch(() => usersStore.editDialogTab, (newTab) => {
  //   console.log('newTab :>> ', newTab);
  //     // if (usersStore.selectedUser) {
  //     //   router.replace({
  //     //     name: 'edit-modal',
  //     //     params: {
  //     //       id: usersStore.selectedUser.id,
  //     //       tab: newTab
  //     //     }
  //     //   })
  //     // }
  //   }
  // )

  onMounted(() => {
    usersStore.editDialogTab = route.params.tab || 'allgemein'
  })

  const swipeHandle = (direction) => {
    console.log('direction :>> ', direction);
    // if (direction === 'top') {
    //   closeDialog()
    // }
  }
</script>