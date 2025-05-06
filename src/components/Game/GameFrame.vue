<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 20vh;"
      :disable="diableSplitter"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
    >
      <template v-slot:before>
        <div class="">
          <div class="text-h5 q-mb-md">Before</div>
          <div v-for="n in 1" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. </div>
        </div>
      </template>
      <template v-slot:after>
        <div class="">
          <div class="text-h5 q-mb-md">After</div>
          <div v-for="n in 1" :key="n" class="q-my-md">{{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit. </div>
        </div>
      </template>

    </q-splitter>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const splitterModel = ref(50); // Startwert des Splitters
const activePlayer = ref('player1'); // Beispiel: Spieler, der gerade aktiv ist ('player1' oder 'player2')
const diableSplitter = ref(false); // Beispiel: Zustand, ob der Splitter deaktiviert ist

const animateSplitter = () => {
  const targetValue = activePlayer.value === 'player1' ? 25 : 75; // Zielwert basierend auf dem aktiven Spieler
  const duration = 450; // Dauer der Animation in Millisekunden
  const steps = 30; // Anzahl der Schritte für die Animation
  const stepTime = duration / steps; // Zeit pro Schritt
  const stepSize = (targetValue - splitterModel.value) / steps; // Schrittweite

  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval); // Stoppe das Intervall, wenn die Animation abgeschlossen ist
      splitterModel.value = targetValue; // Setze den Zielwert sicherheitshalber
      return;
    }

    splitterModel.value += stepSize; // Inkrementiere oder dekrementiere den Wert
    currentStep++;
  }, stepTime);
};

onMounted(() => {
  console.log('GameFrame component mounted');

  // Beispiel: Starte die Animation nach 1 Sekunde
  setTimeout(() => {
    // animateSplitter();
  }, 1000);
});
</script>