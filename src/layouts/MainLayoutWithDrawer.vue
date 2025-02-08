<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-center">
          mobileApp
        </q-toolbar-title>

        <q-btn icon="more_vert" round flat>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup to="/" exact>
                <q-item-section>Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="login" exact>
                <q-item-section>Login</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup to="settings" exact>
                <q-item-section>Settings</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-touch-pan.horizontal.prevent.mouse="handlePan" :style="`transform: translateX(${xOffset}px);`" />
    </q-page-container>

    <q-footer elevated>
      <q-tabs v-model="tab" switch-indicator dense>
        <q-route-tab to="/" exact icon="home" label="home" />
        <q-route-tab to="login" icon="person" label="login" />
        <q-route-tab to="settings" icon="settings" label="settings" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const xOffset = ref(0)

const info = ref(null)
const panning = ref(false)

const handlePan = ({ evt, ...newInfo }) => {
  info.value = newInfo

  // native Javascript event
  // console.log(evt)

  xOffset.value = info.value.offset.x
  console.log('info.value :>> ', info.value.offset.x);

  if (newInfo.isFirst) {
    panning.value = true
  }
  else if (newInfo.isFinal) {
    panning.value = false
  }
}

const linksList = [
  {
    title: 'Home',
    caption: 'Home PAge',
    icon: 'home',
    to: '/'
  },
  {
    title: 'Login',
    caption: 'Login PAge',
    icon: 'person',
    to: 'login'
  },
  {
    title: 'Settings',
    caption: 'Settings PAge',
    icon: 'person',
    to: 'settings'
  },
]

const tab = ref('settings')
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
