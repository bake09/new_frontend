<template>
    <q-btn dense icon="language" round flat>
        <q-menu>  
            <q-list style="min-width: 100px">
                <q-item
                    clickable 
                    v-close-popup 
                    v-for="localeOption in localeOptions" :key="localeOption"
                    @click="setLocale(localeOption.value)"
                    :class="localeOption.value == locale ? 'bg-blue-1' : ''"
                >
                    <q-item-section avatar>
                        <q-avatar square size="sm"> 
                            <img size="xs" :class="localeOption.value == locale ? '' : 'inactive'" :src="`./flags/${localeOption.value}.svg`">
                        </q-avatar>
                    </q-item-section>

                    <q-item-section class="text-capitalize" :class="localeOption.value == locale ? 'text-black text-bold' : 'text-grey-8'">
                        {{ t(localeOption.label) }}
                    </q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-btn>
</template>

<script setup>
import { ref, onActivated, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({useScope: 'global'})
import { useQuasar } from 'quasar'
const $q = useQuasar()

const setLocale = (code) => {
  locale.value = code
}

const { t } = useI18n()

const localeOptions = ref([
  { label: 'German', value: 'de-DE' },
  { label: 'English', value: 'en-US' },
  { label: 'Turkish', value: 'tr-TR' },
  { label: 'Italian', value: 'it-IT' },
])

onMounted(() => {
  // Sprache ...
  locale.value = $q.lang.getLocale()
})
</script>

<style scoped>
.inactive{
  /* filter: brightness(50); */
  filter: opacity(0.5);
}

.body--dark .bg-blue-1{
    background: #e3f2fd2b !important;
}
.body--dark .text-black{
    color: #fff !important;
}
</style>