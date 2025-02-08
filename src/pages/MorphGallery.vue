<template>
  <q-page class="" padding style="overflow: hidden;">
    <!-- <div class="text-h6 text-center text-white">{{ gameStore.currentQuestion }}</div>
    <transition
      appear
      mode="out-in"
      enter-active-class="animated backInLeft "
      leave-active-class="animated backOutRight "
      >
      <q-card class="text-center flex column justify-between" style="height: 60vh; width: 100%;" v-if="currentQuestionData" :key="gameStore.currentQuestion">
        <q-card-section>
          <div class="text-h6">John Doe, du bist dran.</div>
          <div class="text-h4">{{ currentQuestionData.type }}</div>
          <q-separator class="q-my-md" />
          <div class="text-body1">{{ currentQuestionData.content }}</div>
          <div class="text-subtitle2">Punkte: {{ currentQuestionData.difficulty * 100 }}</div>
        </q-card-section>
        <q-card-actions vertical>
          <q-btn color="positive" @click="gameStore.nextQuestion" size="lg">Erfüllt</q-btn>
          <q-btn color="negative" size="lg">Nicht Erfüllt</q-btn>
        </q-card-actions>
        <div>
          <q-separator />
          <q-card-actions vertical>
            <q-btn outline color="black" @click="gameStore.resetQuestion" size="lg">Überspringen</q-btn>
            <div class="text-h6">StrafeStufe:
              <q-rating
                readonly
                v-model="currentQuestionData.difficulty"
                max="6"
                size="sm"
                color="black"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
              />
            </div>
          </q-card-actions>
        </div>
      </q-card>
    </transition> -->
    <h4>Settings</h4>
    <div
      class="fixed-full image-gallery__blinder bg-grey-8"
      :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
      @click="zoomImage()"
    />

    <div
      class="row justify-center q-gutter-sm q-mx-auto scroll relative-position"
      style="max-width: 80vw; max-height: 80vh"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        :ref="el => { thumbRef[index] = el }"
        class="image-gallery__image"
        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>

    <q-img
      ref="fullRef"
      class="image-gallery__image image-gallery__image-full fixed-center"
      :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
      :src="images[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
  </q-page>
</template>

<!--<script setup>
import { onActivated, computed, ref } from 'vue';
import { useGameStore } from 'src/stores/game-store';
const gameStore = useGameStore()

const model1 = ref(3.5)
const currentQuestionData = computed(() => {
  return gameStore.game.find(q => q.id === gameStore.currentQuestion)
});
</script>

<style>
.card-bg{
  background: radial-gradient(circle, #35a2ff 0%, #014a88 100%);
}
</style>-->

<script setup>
  import { ref, onBeforeUpdate } from 'vue'
  import { morph } from 'quasar'

    const thumbRef = ref([])
    const fullRef = ref(null)
    const slide = ref(1)

    const indexZoomed = ref(void 0)
    const images = ref(Array(6).fill(null).map((_, i) => 'https://picsum.photos/id/' + i + '/500/300'))
    const imgLoaded = {
      promise: Promise.resolve(),
      resolve: () => {},
      reject: () => {}
    }

    function imgLoadedResolve () {
      imgLoaded.resolve()
    }

    function imgLoadedReject () {
      imgLoaded.reject()
    }

    function zoomImage (index) {
      const indexZoomedState = indexZoomed.value
      let cancel = void 0

      imgLoaded.reject()

      const zoom = () => {
        if (index !== void 0 && index !== indexZoomedState) {
          imgLoaded.promise = new Promise((resolve, reject) => {
            imgLoaded.resolve = () => {
              imgLoaded.resolve = () => {}
              imgLoaded.reject = () => {}

              resolve()
            }
            imgLoaded.reject = () => {
              imgLoaded.resolve = () => {}
              imgLoaded.reject = () => {}

              reject()
            }
          })

          cancel = morph({
            from: thumbRef.value[ index ].$el,
            to: fullRef.value.$el,
            onToggle: () => {
              indexZoomed.value = index
            },
            waitFor: imgLoaded.promise,
            duration: 400,
            hideFromClone: true,
            onEnd: end => {
              if (end === 'from' && indexZoomed.value === index) {
                indexZoomed.value = void 0
              }
            }
          })
        }
      }

      if (
        indexZoomedState !== void 0 &&
        (cancel === void 0 || cancel() === false)
      ) {
        morph({
          from: fullRef.value.$el,
          to: thumbRef.value[ indexZoomedState ].$el,
          onToggle: () => {
            indexZoomed.value = void 0
          },
          duration: 200,
          keepToClone: true,
          onEnd: zoom
        })
      }
      else {
        zoom()
      }
    }

    // Make sure to reset the dynamic refs before each update.
    onBeforeUpdate(() => {
      thumbRef.value = []
    })
</script>

<style lang="sass">
.image-gallery
  &__image
    border-radius: 3%/5%
    width: 150px
    max-width: 20vw
    cursor: pointer

    &-full
      width: 800px
      max-width: 70vw
      z-index: 2002
      pointer-events: none

      &--active
        pointer-events: all
  &__blinder
    opacity: 0
    z-index: 2000
    pointer-events: none
    transition: opacity 0.3s ease-in-out

    &--active
      opacity: 0.6
      pointer-events: all

      + div > .image-gallery__image
        z-index: 2001
</style>


