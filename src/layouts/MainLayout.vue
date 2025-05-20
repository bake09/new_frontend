<template>
  <q-layout view="hHh LpR fFf">
    <!-- <q-resize-observer @resize="onResize" /> -->
    <q-header elevated>
      <q-toolbar class="q-px-sm " :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-black'">
        <q-btn
          dense
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="settingStore.toggleLeftDrawer"
        />
        <!-- LanguageSwitcher -->
        <LanguageSwitcher class="q-ml-sm"/>

        <q-toolbar-title class="text-center">
          <!-- wellorderMobile -->
          <q-list>
            <q-item no-caps clickable v-ripple class="non-selectable q-pa-xs" to="/" exact active-class="none">
              <div style="margin:0 auto;">
                <span style="color: #d6c29c; font-weight: 700; font-size: 26px; font-style: italic;">weller</span><span>Automobile</span>
              </div>
            </q-item>
          </q-list>
        </q-toolbar-title>
        
        <!-- DarkModeSwitcher -->
        <DarkModeSwitcher class="q-mr-sm"/>
        
        <q-btn
          dense
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="settingStore.toggleRightDrawer"
          v-show="$q.screen.gt.sm"
        />

        <q-btn dense icon="more_vert" v-show="$q.screen.lt.md" round flat>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>
                <q-item-section>Home</q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup to="/calendar" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="calendar_month" />
                </q-item-section>
                <q-item-section>Calendar</q-item-section>
              </q-item> -->
              <q-item clickable v-close-popup to="login" exact v-if="!authStore.user">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Login</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="roles" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Roles</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="settings" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="profile" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="users" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Users</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="logout" exact v-if="authStore.user">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="settingStore.leftDrawerOpen" show-if-above bordered :width="240" :breakpoint="1025" class="mybgs">
      <q-list>
        <q-item-label header>Main Menue </q-item-label>
        <q-separator inset/>
        <EssentialLink
          v-for="link in settingStore.linksList"
          :key="link.title"
          v-bind="link"
          v-show="link.requiresAuth && authStore.user"
        />
        <q-item clickable @click="authStore.handleTokenLogout"  v-show="authStore.user">
          <q-item-section avatar>
            <q-icon name="logout"/>
          </q-item-section>
          <q-item-section >
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Function</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above v-model="settingStore.rightDrawerOpen" bordered :width="240" :breakpoint="1025" side="right">
      <q-list>
        <q-item-label header>Live Logs </q-item-label>
        <q-separator inset/>
        <q-item clickable @click="authStore.handleTokenLogout"  v-show="authStore.user">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
            <q-item-label caption>Function</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-page-container>
      <router-view v-slot="{ Component }" v-if="settingStore.isExternalRoute">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view> -->

      
      <!-- <q-tab-panels v-else v-model="settingStore.tab" :animated="settingStore.animateTabs" swipeable @transition="modelUpdated" keep-alive>
        <q-tab-panel name="home" class="q-pa-none">
          <IndexPage />
        </q-tab-panel>

        <q-tab-panel name="login" class="q-pa-none">
          <LoginPage />
        </q-tab-panel>

        <q-tab-panel name="settings" class="q-pa-none">
          <SettingsPage />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container> -->

    <!-- <NavTabs v-if="route.name != 'home'"/> -->
    
    <q-inner-loading
      :showing="authStore.isAuthProceeding.loading"
      :label="authStore.isAuthProceeding.label"
      label-style="font-size: 1.1em"
    />
  </q-layout>
</template>

<script setup>
import { onMounted, watch, ref, onUnmounted, onActivated, onDeactivated } from 'vue'
import { echo } from "../boot/echo";

import { useQuasar } from 'quasar';
const $q = useQuasar()

import LanguageSwitcher from 'src/components/global/LanguageSwitcher.vue';  
import DarkModeSwitcher from 'src/components/global/DarkModeSwitcher.vue';  

import NavTabs from 'src/components/global/NavTabs.vue';

import IndexPage from 'src/pages/TodoPage.vue';
import LoginPage from 'src/pages/auth/LoginPage.vue';
import SettingsPage from 'src/pages/SettingsPage.vue';

import EssentialLink from 'components/EssentialLink.vue'
import TodoInput from 'src/components/Todo/TodoInput.vue';

import { useSettingStore } from 'src/stores/settings-store';
const settingStore = useSettingStore()

import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

import { useTodoStore } from 'src/stores/todo-store';
const todoStore = useTodoStore()

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

watch(() => route.name,(newRouteName) => {
    if (newRouteName !== settingStore.tab) {
      settingStore.tab = newRouteName
    }
  }
)

const loggingOut = ref(false)
const handleLogout = async () => {
  loggingOut.value = true
  await settingStore.handleTokenLogout()
  todoStore.leaveOnlineUsersChannel()
  loggingOut.value = false
}

const modelUpdated = (newVal, oldVal) => {
  router.push({name: settingStore.tab})
}

watch(() => route.name,(newRouteName) => {
    if (newRouteName !== settingStore.tab) {
      settingStore.tab = newRouteName
    }
  }
)

watch(() => $q.dark.isActive, (value) => {
    console.log('isDarkValue :>> ', value);
    if(value){
      $q.addressbarColor.set('#212121') // bg-grey-10
    }else{
      $q.addressbarColor.set('#fff')
    }
  }
)

onMounted(async() => {
  // console.log('$q :>> ', $q);

  settingStore.tab = route.name
  settingStore.animateTabs = true

  if (authStore.user && authStore.user.roles.length > 0) {
    // console.log("true");
    // Abonniere den privaten Kanal für die Rolle des Benutzers
    echo.private(`roles.${authStore.user.roles[0].id}`)
      .listen('RolePermissionsUpdated', (data) => {
        console.log('Role updated:', data.role);
        authStore.updateBroadcastetPermissionChanges(data.role);
        // Aktualisiere die Rollenliste im Store (optional)
        // usersStore.updateRole(data.role);
      });
  } else {
    console.error('Benutzer ist nicht authentifiziert oder hat keine Rolle.');
  }
})

onUnmounted(() => {
  // echo.leave(`roles.${authStore.user.roles[0].id}`)
})

watch(() => $q.appVisible, val => {
  // console.log(val ? 'App became visible' : 'App went in the background')
  if(authStore.user){
    val ? todoStore.joinAndListenOnlineUsersChannel() : todoStore.leaveOnlineUsersChannel()
  }
})

</script>

<style scoped>
.q-item.q-router-link--active, .q-item--active {
  background: #4fa4ff30;
}
</style>

<style>
.mybg{
  background: linear-gradient(180deg, #b55dcd 0, #724ebf 100%);  
}
</style>