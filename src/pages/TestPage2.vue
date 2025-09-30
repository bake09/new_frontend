<template>
  <q-page class="flex justify-center items-center">
    <div class="column items-center q-gutter-md">
      <q-btn label="Spin" color="primary" @click="rotate" />

      <div ref="containerRef" class="outer-center-container relative-position bg-red-2">
        <div class="inner-center-container absolute bg-green-2">
          <!-- Konva Stage -->
          <v-stage :config="stageConfig">
            <v-layer>
              <!-- Kreis -->
              <v-circle :config="circleConfig" />

              <!-- Segment-Linien -->
              <v-line
                v-for="(line, i) in segmentLines"
                :key="'line-' + i"
                :config="line"
              />

              <!-- Spieler-Buchstaben -->
              <v-text
                v-for="(player, i) in players"
                :key="'label-' + i"
                :config="getLabelConfig(player, i)"
              />

              <!-- Crosshair zur Kontrolle -->
              <v-line :config="centerCrossH" />
              <v-line :config="centerCrossV" />

              <!-- Flaschenbild -->
              <v-image :config="bottleImageConfig" @click="rotate" />

              <!-- 🔽 ALT: Material Icon (auskommentiert)
              <v-text :config="bottleIconConfig" />
              -->
            </v-layer>
          </v-stage>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const containerRef = ref(null)
const canvasSize = ref(500)

function updateCanvasSize() {
  if (containerRef.value) {
    canvasSize.value = containerRef.value.clientWidth
  }
}

onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize)
})

// 🎯 Spieler-Liste
const players = ref([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Deyzoğlu' },
  { id: 5, name: 'Eve' }
])

// Stage & Kreis dynamisch
const stageConfig = computed(() => ({
  width: canvasSize.value,
  height: canvasSize.value
}))

const circleConfig = computed(() => ({
  x: canvasSize.value / 2,
  y: canvasSize.value / 2,
  radius: canvasSize.value / 2 - 10,
  stroke: '#aaa',
  strokeWidth: 1
}))

// Segment-Linien dynamisch
const segmentLines = computed(() => {
  const total = players.value.length
  const radius = canvasSize.value / 2 - 10
  return Array.from({ length: total }, (_, i) => {
    const angle = (2 * Math.PI / total) * i
    return {
      points: [
        canvasSize.value / 2,
        canvasSize.value / 2,
        canvasSize.value / 2 + radius * Math.cos(angle),
        canvasSize.value / 2 + radius * Math.sin(angle)
      ],
      stroke: '#aaa',
      strokeWidth: 1
    }
  })
})

// Spieler-Label dynamisch
function getLabelConfig(player, index) {
  const total = players.value.length
  const angle = (2 * Math.PI / total) * (index + 0.5)
  const radius = canvasSize.value / 1.5 / 2
  return {
    x: canvasSize.value / 2 + radius * Math.cos(angle),
    y: canvasSize.value / 2 + radius * Math.sin(angle),
    text: player.name[0],
    fontSize: Math.max(16, canvasSize.value * 0.05), // skaliert mit Größe
    fontStyle: 'bold',
    fill: '#000',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 8,
    offsetY: 12
  }
}

// Crosshair (optional)
const centerCrossH = computed(() => ({
  points: [
    canvasSize.value / 2 - 8,
    canvasSize.value / 2,
    canvasSize.value / 2 + 8,
    canvasSize.value / 2
  ],
  stroke: '#ff0000',
  strokeWidth: 1
}))

const centerCrossV = computed(() => ({
  points: [
    canvasSize.value / 2,
    canvasSize.value / 2 - 8,
    canvasSize.value / 2,
    canvasSize.value / 2 + 8
  ],
  stroke: '#ff0000',
  strokeWidth: 1
}))

// Flasche
const bottleRotation = ref(0)
const bottleScale = ref(1)
const bottleImage = new window.Image()
bottleImage.src = '/images/bottle.png'

const bottleImageConfig = computed(() => ({
  x: canvasSize.value / 2,
  y: canvasSize.value / 2,
  image: bottleImage,
  width: canvasSize.value * 0.2,
  height: canvasSize.value * 0.4,
  rotation: bottleRotation.value,
  scaleX: bottleScale.value,
  scaleY: bottleScale.value,
  offsetX: (canvasSize.value * 0.2) / 2,
  offsetY: (canvasSize.value * 0.4) / 2
}))

// Spin-Logik
const rotating = ref(false)

function rotate() {
  if (rotating.value) return
  rotating.value = true

  let start = null
  const duration = 2000
  const startAngle = bottleRotation.value % 360
  const endAngle = startAngle + 720 + Math.random() * 360

  function step(timestamp) {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    bottleRotation.value = startAngle + (endAngle - startAngle) * eased
    bottleScale.value = 1 + 0.2 * Math.sin(progress * Math.PI * 4)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      bottleRotation.value = endAngle
      bottleScale.value = 1
      rotating.value = false
      logSelectedPlayer()
    }
  }

  requestAnimationFrame(step)
}

function logSelectedPlayer() {
  const total = players.value.length
  const normalizedAngle = (bottleRotation.value % 360 + 360) % 360
  const segmentAngle = 360 / total
  const pointingAngle = (normalizedAngle - 90 + 360) % 360

  const selectedIndex = Math.floor(pointingAngle / segmentAngle) % total
  const selectedPlayer = players.value[selectedIndex]

  console.log(`🎯 Spieler dran: ${selectedPlayer.name}`)
}
</script>

<style scoped>
.outer-center-container {
  width: 90vw;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inner-center-container {
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
