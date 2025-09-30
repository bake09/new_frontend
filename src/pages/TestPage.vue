<template>
  <q-page padding>
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5">Challenges</div>
      <q-btn color="primary" label="Neue Challenge" @click="showDialog = true" />
    </div>

    <q-table :rows="result" :columns="columns" row-key="id" />

    <!-- Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px; max-width: 90vw;">
        <q-card-section class="text-h6">
          Neue Challenge
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="saveChallenge">
            <q-select
              v-model="form.type_id"
              :options="types"
              option-value="id"
              option-label="name"
              label="Type"
              filled
              class="q-mb-md"
            />

            <q-select
              v-model="form.subtype_id"
              :options="subTypes"
              option-value="id"
              option-label="name"
              label="Sub-Type"
              filled
              class="q-mb-md"
            />

            <q-select
              v-model="form.category_id"
              :options="categories"
              option-value="id"
              option-label="name"
              label="Category"
              filled
              class="q-mb-md"
            />

            <q-select
              v-model="form.gender_id"
              :options="genders"
              option-value="id"
              option-label="name"
              label="Gender"
              filled
              class="q-mb-md"
            />

            <q-select
              v-model="form.difficulty_id"
              :options="difficulties"
              option-value="id"
              option-label="name"
              label="Difficulty"
              filled
              class="q-mb-md"
            />

            <q-input v-model="form.title" label="Title" filled class="q-mb-md" />
            <q-input v-model="form.description" label="Description" type="textarea" filled class="q-mb-md" />
            <q-input
              v-model.number="form.time_to_answer_in_seconds"
              label="Zeit (Sekunden)"
              type="number"
              filled
              class="q-mb-md"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Abbrechen" v-close-popup />
              <q-btn color="primary" label="Speichern" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const result = ref([])
const showDialog = ref(false)

const form = ref({
  type_id: null,
  subtype_id: null,
  category_id: null,
  gender_id: null,
  difficulty_id: null,
  title: '',
  description: '',
  time_to_answer_in_seconds: 60,
})

const types = ref([])
const subTypes = ref([])
const categories = ref([])
const genders = ref([])
const difficulties = ref([])

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'type', label: 'Type', field: row => row.type.name, align: 'left' },
  { name: 'category', label: 'Category', field: row => row.category.name, align: 'left' },
  { name: 'difficulty', label: 'Difficulty', field: row => row.difficulty.name, align: 'left' },
  { name: 'creator', label: 'Creator', field: row => row.creator?.name ?? '—', align: 'left' },
]

onMounted(() => {
  fetchChallenges()
  fetchSelectOptions()
})

function fetchChallenges() {
  api.get('/challenges')
    .then(res => result.value = res.data)
    .catch(err => console.error(err))
}

function fetchSelectOptions() {
  // ⚠️ Hier brauchst du später echte Endpunkte:
  Promise.all([
    api.get('/challenge-types'),
    api.get('/challenge-subtypes'),
    api.get('/challenge-categories'),
    api.get('/challenge-genders'),
    api.get('/challenge-difficulties'),
  ])
    .then(([t, st, c, g, d]) => {
      types.value = t.data
      subTypes.value = st.data
      categories.value = c.data
      genders.value = g.data
      difficulties.value = d.data
    })
    .catch(err => console.warn('⚠️ Select-Optionen konnten nicht geladen werden:', err))
}

function saveChallenge() {
  api.post('/challenges', form.value)
    .then(() => {
      showDialog.value = false
      fetchChallenges()
    })
    .catch(err => console.error('Fehler beim Speichern:', err))
}
</script>
