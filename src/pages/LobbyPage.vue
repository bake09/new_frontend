<template>
  <q-page class="">
    <q-card flat class="q-pt-sm">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="purple-4"
        indicator-color="purple-4"
        align="justify"
        narrow-indicator
      >
        <q-tab name="create" label="create" />
        <q-tab name="challenges" label="challenges" />
        <q-tab name="account" label="account" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="create">
          <q-card flat class="q-gutter-y-md"> 
            <q-card-section style="background-color: rgb(24 24 35 / 25%); border-radius: 10px;">
              <div class="row items-center"><q-icon name="qr_code"/>CODE</div>
              <div class="row justify-between">
                <div class="text-bold text-h4">{{ partyCode }}</div>
                <q-btn label="Invite" color="indigo-7"></q-btn>
              </div>
            </q-card-section>

            <q-card-section class="q-pa-none">
              <div class="row q-mb-sm">
                <div class="text-center col">TEAM A</div>
                <div class="text-center col">TEAM B</div>
              </div>
              <div class="row flex q-gutter-md">
                <div class="col" style="background-color: rgb(24 24 35 / 25%); border-radius: 10px;">
                  <div class="row q-pt-md">
                    <q-avatar class="col">
                      <img src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                  </div>
                  <div class="row q-py-md">
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                  </div>
                </div>
                
                <div class="col" style="background-color: rgb(24 24 35 / 25%); border-radius: 10px;">
                  <div class="row q-pt-md">
                    <q-avatar class="col">
                      <img src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                  </div>
                  <div class="row q-py-md">
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                    <q-avatar class="col">
                      <img size="xl" src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-px-none q-py-sm">
              <q-btn rounded size="lg" color="black" class="full-width" label="Start Game" no-caps/>
            </q-card-section>

            <q-card-section class="q-px-none">
              <div class="row">
                <q-checkbox class="col q-ml-xs" v-model="difficultySelect" label="Difficulty" dense/>
                <q-select class="col" borderless v-model="difficulty" :options="options" dense dropdown-icon="chevron_right"/>
              </div>
              <div class="row">
                <q-item dense class="col q-px-none" :clickable="false">
                  <q-item-section side class="q-px-none">
                    <q-icon color="primary" name="sports_kabaddi"  class="q-px-none"/>
                  </q-item-section>
                  <q-item-section class="q-px-none q-pl-xs">Punishment</q-item-section>
                </q-item>
                <q-toggle
                  v-model="punishment"
                  dense
                />
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <q-tab-panel name="challenges">
          <div class="text-h6">Challenges</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="account">
          <div class="text-h6">Account</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <q-footer class="bg-transparent">
      <q-tabs v-model="footerTab" indicator-color="transparent" :class="$q.dark.isActive ? 'text-white' : 'text-black'">
        <q-tab name="help" icon="help" />
        <q-tab name="settings" icon="settings"/>
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
const $q = useQuasar()
const tab = ref('create')
const partyCode = ref('ABCD1234')

const difficultySelect = ref(true)

const difficulty = ref('Easy')
const options = ref([
  'Easy', 'Medium', 'Hard'
])
const punishment = ref(true)
const footerTab = ref('help')
onMounted(() => {
})
</script>

<style scoped>
.q-field__native, .q-field__input {
  padding-left: 0px !important;
}
</style>