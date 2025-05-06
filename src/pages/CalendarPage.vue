<template>
  <q-page class="flex column">
    <div class="col bg-blue-2">
      <GameFrame />
    </div>
    <div class="row col flex flex-center bg-green-2">
        <q-btn @click="startSelection" label="Start Selection" color="purple"/>
    </div>
    <div class="row col flex flex-center bg-red-3">
      <div class="chessboard q-pa-md">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="cell"
        >
          <q-img
            src="https://picsum.photos/200/200"
            :ratio="1"
            class="image"
          />
          <q-card
            class="closed flex flex-center text-h3 text-white"
            v-if="!item.selected && !item.final"
          >
            ?
          </q-card>
          <q-card
            class="selection flex flex-center text-h3 text-white"
            v-if="item.selected"
          >
            !
          </q-card>
          <q-card
            class="final-selection flex flex-center text-h3 text-white"
            v-if="item.final"
          >
          :)</q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onActivated, onMounted, onUnmounted, ref } from 'vue';
import { echo } from "../boot/echo";
import GameFrame from 'src/components/Game/GameFrame.vue';

const roomId = ref(1);

onMounted(() => {
  // Abonniere den Kanal und höre auf das Whisper-Event
  echo.private(`game.${roomId.value}`)
    .listenForWhisper('selecting', (data) => {
      console.log('Received whisper:', data);

      // Setze die empfangene Animationssequenz
      animationSequence.value = data.sequence;

      // Setze das empfangene Item als `chooseWhenFinish`
      items.value.forEach((item) => {
        item.chooseWhenFinish = false; // Reset flags
        if (item.id === data.chosenItem.id) {
          item.chooseWhenFinish = true;
        }
      });

      // Starte die Animation basierend auf der empfangenen Sequenz
      runAnimation();
    });
});

onUnmounted(() => {
  echo.leave(`game.${roomId.value}`)
})

// Sound effects
const selectionSound = new Audio('/assets/sounds/correct-answer.mp3'); // Sound for each selection
const finalSound = new Audio('/assets/sounds/game-magic.mp3'); // Sound for the final selection

const items = ref([
  { id: 1, name: 'Item 1', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 2, name: 'Item 2', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 3, name: 'Item 3', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 4, name: 'Item 4', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 5, name: 'Item 5', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 6, name: 'Item 6', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 7, name: 'Item 7', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 8, name: 'Item 8', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 9, name: 'Item 9', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 10, name: 'Item 10', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 11, name: 'Item 11', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 12, name: 'Item 12', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 13, name: 'Item 13', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 14, name: 'Item 14', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 15, name: 'Item 15', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 16, name: 'Item 16', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 17, name: 'Item 17', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 18, name: 'Item 18', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 19, name: 'Item 19', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 20, name: 'Item 20', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 21, name: 'Item 21', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 22, name: 'Item 22', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 23, name: 'Item 23', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 24, name: 'Item 24', selectable: true, selected: false, final: false, chooseWhenFinish: false },
  { id: 25, name: 'Item 25', selectable: true, selected: false, final: false, chooseWhenFinish: false },
]);

const animationSequence = ref([]); // Speichert die Animationssequenz
const startSelection = () => {
  // Wähle ein zufälliges Item aus
  const selectableItems = items.value.filter((item) => item.selectable);
  const randomIndex = Math.floor(Math.random() * selectableItems.length);
  const chosenItem = selectableItems[randomIndex];
  chosenItem.chooseWhenFinish = true;

  // Generiere die Animationssequenz
  const sequence = [];
  const usedCounts = {}; // Zählt, wie oft jede Box in der Sequenz vorkommt

  // Füge alle Boxen mindestens einmal hinzu
  const shuffledItems = [...selectableItems].sort(() => Math.random() - 0.5);
  shuffledItems.forEach((item) => {
    sequence.push(item.id);
    usedCounts[item.id] = 1; // Jede Box wurde mindestens einmal verwendet
  });

  // Fülle die restliche Sequenz auf
  while (sequence.length < 20) {
    let nextIndex;
    let nextItem;

    do {
      nextIndex = Math.floor(Math.random() * selectableItems.length);
      nextItem = selectableItems[nextIndex];
    } while (
      sequence[sequence.length - 1] === nextItem.id || // Verhindere gleiche Zahlen hintereinander
      (usedCounts[nextItem.id] || 0) >= 2 // Verhindere mehr als zweimaliges Vorkommen
    );

    // Füge die ID zur Sequenz hinzu
    sequence.push(nextItem.id);

    // Aktualisiere die Zählung
    usedCounts[nextItem.id] = (usedCounts[nextItem.id] || 0) + 1;
  }

  // Füge das finale Item hinzu
  sequence.push(chosenItem.id); // Das finale Item wird immer zuletzt hinzugefügt

  console.log(`Generated sequence:`, sequence);

  // Sende die Sequenz und das finale Item an andere Clients
  echo.private(`game.${roomId.value}`)
    .whisper('selecting', {
      sequence,
      chosenItem,
    });

  // Speichere die Sequenz lokal und starte die Animation
  animationSequence.value = sequence;
  runAnimation();
};

const runAnimation = () => {
  let intervalTime = 50; // Start very fast
  let elapsedTime = 0;

  const animationLoop = (index) => {
    if (index >= animationSequence.value.length) {
      // Final selection
      const finalItemId = animationSequence.value[animationSequence.value.length - 1];
      const finalItem = items.value.find((item) => item.id === finalItemId);
      if (finalItem) {
        finalItem.final = true;
        finalItem.selectable = false;

        // Play final selection sound
        finalSound.play();
      }
      return;
    }

    // Reset all items' `selected` state
    items.value.forEach((item) => (item.selected = false));

    // Highlight the current item in the sequence
    const currentItemId = animationSequence.value[index];
    const currentItem = items.value.find((item) => item.id === currentItemId);
    if (currentItem) {
      currentItem.selected = true;

      // Play selection sound
      const soundClone = selectionSound.cloneNode();
      soundClone.play();
    }

    // Gradually slow down the interval
    elapsedTime += intervalTime;
    intervalTime += Math.min(50, (elapsedTime / 2000) * 50); // Exponentially slow down

    setTimeout(() => animationLoop(index + 1), intervalTime); // Nächster Schritt
  };
  animationLoop(0); // Starte die Animation bei Index 0
};
</script>

<style>
.chessboard {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 columns for the chessboard */
  grid-template-rows: repeat(5, 1fr); /* 5 rows for the chessboard */
  gap: 4px;
  width: 400px;
  height: 400px;
  border: 0px solid #000;
}

.cell {
  position: relative; /* Set the cell as a positioning context */
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.3s ease, box-shadow 0.3s ease;
  border-radius: 20px;
}

.closed {
  position: absolute; /* Overlay the image */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  transition: opacity 1.3s ease;
  border-radius: 20px;
}

.selection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #a300a3;
  box-shadow: 0px 0px 18px 10px #a300a3;
  z-index: 11;
  transition: background-color 1.3s ease, box-shadow 0.3s ease;
  border-radius: 20px;
}

.final-selection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: lime;
  box-shadow: 0px 0px 18px 10px lime;
  z-index: 12;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  animation: pulse 1.5s 3;
  border-radius: 20px;
}

/* Pulsating animation */
@keyframes pulse {
  0% {
    transform: scale(1) rotate(0deg); /* Normal size */
  }
  50% {
    transform: scale(1.3) rotate(45deg); /* Slightly larger */
  }
  100% {
    transform: scale(1) rotate(90deg); /* Back to normal size */
  }
}
</style>