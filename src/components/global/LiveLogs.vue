<template>
  <q-list>
      <q-item clickable @click="activityStore.toggleActivityListVisibility">
        <q-item-section>
            <q-item-label >Live Logs</q-item-label>
            <q-item-label caption>Shows all App - activities</q-item-label>
        </q-item-section>
        <q-item-section side top class="self-center">
            <q-toggle
                dense
                v-model="activityStore.logListVisible"
                checked-icon="visibility"
                color="green"
                unchecked-icon="visibility_off"
            />
        </q-item-section>
      </q-item>
      <q-item dense clickable @click="activityStore.clearActivities">
        <q-item-section>
            <q-item-label caption>Clear/Reset activities</q-item-label>
        </q-item-section>
        <q-item-section side  class="self-center">
            <q-btn icon="delete" rounded dense flat/>
            <!-- <q-btn icon="delete_sweep" rounded dense flat/> -->
        </q-item-section>
      </q-item>
      <q-separator />
  </q-list>
  <q-scroll-area class="scroll-fade" style="height: calc(100vh - 187px); max-width: auto;" @scroll="scrollBaby">
    <q-list v-auto-animate="{ duration: 150 }">
      <div v-for="activity in activityStore.activities" v-if="activityStore.logListVisible" :key="activity.id">
        <q-item class="q-py-xs">
          <q-item-section>
            <q-tooltip anchor="center left" self="center left">{{ activity.properties.item }} </q-tooltip>
            <q-item-label class="" lines="1" style="max-width: 100px; width: 100%;">
              <q-icon name="error_outline" style="transform: rotate(180deg)"/> <span>{{ activity.properties.item }}</span>
              <!-- <q-icon name="warning_amber" color="red"/> {{ activity.properties.item }} -->
            </q-item-label>
            <q-item-label class="q-mt-none">
              <q-badge color="blue-5" style="font-size: 11px;">
                {{ activity.properties.action.type }} <q-icon name="check" class="q-ml-xs" />
              </q-badge>
            </q-item-label>
            <q-item-label caption style="font-size: 10px">from {{ activity.properties.causer }}</q-item-label>
          </q-item-section>
          <q-item-section side top style="max-width:50%; padding-left: 0 !important;">
            <q-item-label caption class="text-right">{{ getRelativeTime(activity.created_at) }}</q-item-label>
            <q-item-label caption lines="1">
              <q-badge outline color="blue-grey-3 q-pa-none" style="font-size: 11px;">
                <q-icon name="schedule" class="q-mr-xs" /> {{ activity.time }} 
              </q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />
      </div>
    </q-list> 
  </q-scroll-area>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
  <div style="position: absolute; bottom: 12px; right: 12px;">
    <q-btn fab icon="keyboard_arrow_up" color="accent"/>
  </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, onActivated } from 'vue';
import { echo } from "../../boot/echo";
import { useQuasar, scroll } from 'quasar'
const { getVerticalScrollPosition, setVerticalScrollPosition } = scroll
const $q = useQuasar()

import { useActivityStore } from 'src/stores/activity-store';
const activityStore = useActivityStore()

import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

import { useI18n } from 'vue-i18n'
import { formatDistanceToNow } from 'date-fns'
// Locale Objekte importieren
import { de, enUS, it, tr } from 'date-fns/locale'  // Beispiel für ein paar Sprachen

const scrollBaby = (info) => {
  console.log("triggered ", info);
}

const { locale } = useI18n({ useScope: 'global' })
// Hilfsfunktion: mappt locale.value (String) auf date-fns locale-Objekt
function localeObject(langStr) {
  // Du kannst hier erweitern, je nach den Sprachcodes, die du benutzt
  switch (langStr) {
    case 'de':
    case 'de-DE':
      return de
    case 'it':
    case 'it-IT':
      return it
    case 'tr':
    case 'tr-TR':
      return tr
    case 'en':
    case 'en-US':
    default:
      return enUS
  }
}

// Damit die Anzeige automatisch aktualisiert, wenn locale geändert wird:
watch(locale, (newLocale) => {
  // eventuell: force re-render, aber da wir getRelativeTime jedes Mal aufrufen, sollte es automatisch greifen
})

// Intervall, damit “vor 1 Minute” → “vor 2 Minuten” aktualisiert wird
// Wir speichern einfach einen „trigger“-State, den wir ändern, damit die Komponente neu gerendert wird
const trigger = ref(0)
let intervalId

onMounted(() => {
  console.log("MOUNTED");
  // echo.channel('activities')
  echo.private('activities')
    .listen('ActivityCreated', (e) => {
        console.log('Neue Activity:', e);
        activityStore.pushActivityToArray(e)
    });

    // Setze locale basierend auf Quasar / aktueller Seite
    locale.value = $q.lang.getLocale()  // z. B. “de-DE” oder “en-US”
    intervalId = setInterval(() => {
        // erhöhe trigger, damit Vue neu rendert
        trigger.value++
    }, 60 * 1000)  // jede Minute
})
onUnmounted(() => {
  console.log("UNMOUNTED");
  if (intervalId != null) {
    clearInterval(intervalId)
  }
  echo.leave('private-activities')
})
// Funktion, die relative Zeit berechnet
function getRelativeTime(isoString) {
  // nutze trigger so, dass die Funktion „reaktiv“ ist
  trigger.value

  const date = new Date(isoString)
  if (isNaN(date.getTime())) {
    return ''
  }
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: localeObject(locale.value)
  })
}

// watch(() => authStore.user,(newUser, oldUser) => 
//   {
//     console.log('newUser :>> ', newUser)
//     console.log('oldUser :>> ', oldUser)
//     if (newUser) 
//     {
//       console.log("subscribe ist triggered");
//     //   // ✅ User ist eingeloggt -> subscribe auf Kanal
//       echo.private('activities')
//         .listen('ActivityCreated', (e) => {
//           console.log('Neue Activity:', e)
//           activityStore.pushActivityToArray(e)
//         })
//     } 
//     else 
//     {
//       console.log("unsubscribing");
//         // ❌ User ist ausgeloggt -> Kanal verlassen
//         echo.leave('private-activities') // wichtig: private- prefix
//         activityStore.clearActivities()
//     }
//   },
//   // { immediate: true } // sorgt dafür, dass beim ersten Rendern geprüft wird
// )
</script>

<style>
.scroll-fade {
  position: relative;
}

.scroll-fade::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
}

/* Dark mode via Quasar body classes */
.body--dark .scroll-fade::after,
.q-dark .scroll-fade::after {
  background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1));
}

/* Fallback: user's system dark preference */
@media (prefers-color-scheme: dark) {
  .scroll-fade::after {
    background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1));
  }
}
</style>