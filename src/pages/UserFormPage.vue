<template>
  <q-page padding>
    <q-stepper v-model="step" ref="stepper" color="primary" animated style="max-width: 600px !important; margin: 0 auto;"> 
      <q-step :name="1" class="ellipsis" title="Step 1" icon="settings" :done="step > 1">
        <q-form class="q-gutter-sm">
          <!-- Email -->
          <div class="row items-center">
            <q-input
              dense
              class="col"
              outlined
              label-slot
              clearable
              clear-icon="close"
              no-error-icon
              :disable="userFormStore.step1Form.email.done"
              v-model="userFormStore.step1Form.email.content"
              @blur="userFormStore.checkEmail"
              hint="Bitte Ihre Email Adresse angeben"
              :rules="[
                val => !!val || '* Das ist ein Pflichtfeld',
                val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Bitte eine gültige Email-Adresse eingeben',
              ]"
              lazy-rules
            >
            <template v-slot:before>
              1
            </template>
              <template v-slot:label>
                Email Adresse
                <span class="text-weight-bold text-red">*</span>
              </template>
            </q-input>
          </div>
          
          <!-- Anrede -->
          <div class="row items-center">
            <q-select
              dense
              class="col"
              outlined 
              label-slot
              clearable
              clear-icon="close"
              no-error-icon
              :disable="userFormStore.step1Form.email.done"
              v-model="userFormStore.step1Form.title.content"
              :error="userFormStore.step1Form.title.error"
              hint="Bitte Ihre Anrede wählen" 
              :options="anrede" 
              :rules="[val => !!val || '* Das ist ein Pflichtfeld']"
            >
              <template v-slot:before>
                2
              </template>
              <template v-slot:label>
                Anrede
                <span class="text-weight-bold text-red">*</span>
              </template>
            </q-select>
          </div>
          
          <!-- Vorname -->
          <div class="row items-center">
            <q-input
              disable
              dense
              class="col"
              outlined
              label-slot
              clearable
              clear-icon="close"
              no-error-icon
              :disable="userFormStore.step1Form.email.done"
              v-model="userFormStore.step1Form.firstName.content"
              :error="userFormStore.step1Form.title.error"
              :rules="[val => !!val || '* Das ist ein Pflichtfeld']"
              >
              <template v-slot:before>
                3
              </template>
              <template v-slot:label>
                Vorname
                <span class="text-weight-bold text-red">*</span>
              </template>
            </q-input>
          </div>

          <!-- Nachname -->
          <div class="row items-center">
            <q-input
              dense
              class="col"
              outlined
              label-slot
              clearable
              clear-icon="close"
              no-error-icon
              :disable="userFormStore.step1Form.email.done"
              v-model="userFormStore.step1Form.lastName.content"
              :rules="[val => !!val || '* Das ist ein Pflichtfeld']"
              >
              <template v-slot:before>
                4
              </template>
              <template v-slot:label>
                Nachname
                <span class="text-weight-bold text-red">*</span>
              </template>
            </q-input>
          </div>

          <!-- Geburtsdatum -->
          <div class="row items-center">
            <q-input 
              dense
              label-slot
              class="col" 
              outlined
              no-error-icon
              :disable="userFormStore.step1Form.email.done"
              v-model="userFormStore.step1Form.birthdate.content" 
              :rules="[val => !!val || '* Das ist ein Pflichtfeld']"
              >
              <template v-slot:before>
                5
              </template>
              <template v-slot:label>
                Geburtsdatum
                <span class="text-weight-bold text-red">*</span>
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="step1Form.birthdate.content" mask="DD.MM.YYYY">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-form>
      </q-step>

      <q-step :name="2" title="Step 2" caption="Opti" icon="create_new_folder" :done="step > 2">
        This is step 2
      </q-step>

      <template v-slot:navigation>
        <!-- <q-separator inset /> -->
        <div class="row q-px-lg">
        <q-slider
          readonly
          v-model="progress"
          :min="1"
          :max="9"
          :step="1"
          markers
          label
          :label-value="progress + ' / 11'"
          label-always
          color="light-green"
        />
        </div>
        <q-stepper-navigation class="q-mt-md items-between">
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Zurück" />
          <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 2 ? 'Fertig' : 'Weiter'"  class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserFormStore } from "stores/userForm-store";
const userFormStore = useUserFormStore()

onMounted(async () => {
  // await userFormStore.checkEmail()
})


const progress = ref(0)
const step = ref(1)

const anrede = [
  'Herr', 'Frau', 'Firma', 'Eheleute'
]

// :rules="[val => !!val || 'Das ist ein Pflichtfeld', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Bitte eine gültige Email-Adresse eingeben']"

const isValidEmail = computed(() => {
  const email = step1Form.value.email.content;
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
})
</script>
