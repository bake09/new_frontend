<template>
    <div class="q-pa-mds">
        <div class="fixed-full drawer-backdrop" :style="backdropStyle" aria-hidden="true" @click="animateDrawerTo(drawerMinHeight)"></div>

        <q-card
            style="z-index: 2001; max-width: 600px; margin: 0 auto;"
            class="slide-drawer slide-drawer--bottom fixed-bottom column no-wrap"
            :class="`slide-drawer--open-${drawerMode}`" 
            :style="drawerStyle" v-touch-pan.mouse.vertical="slideDrawer" >
            <q-card-section class="slide-drawer__handler--horizontal row flex-center q-pa-sm cursor-pointer" @click="cycleDrawer">
                <div class="cursor-pointer"></div>
            </q-card-section>

            <q-card-section class="col bottomSheet">
                <slot name="form-content"></slot>
            </q-card-section>
            
            <!-- If Heigt of the BottomSheet ist full: -->
            <!-- <q-card-section v-if="drawerMode !== 'handler'" class="col">
                <div class="text-h6">Our Changing Planet - only shown when drawer is open</div>
                <div class="text-subtitle2">by John Doe</div>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
            </q-card-section> -->
        </q-card>
    </div>
</template>
  
<script setup>
import { ref, computed, onBeforeUnmount, nextTick, onMounted, watch } from 'vue';

const drawerMinHeight = 0
const drawerTopOffset = 50
const drawerOpenRatioHalf = 50

const drawerPos = ref(drawerMinHeight)
let animateTimeout

const emit = defineEmits(['onOpen', 'onClose']);

const drawerMaxHeight = computed(() => Math.max(0, window.innerHeight - drawerTopOffset))

const drawerOpenRatio = computed(() =>
    Math.max(0, drawerPos.value - drawerMinHeight) / Math.max(1, drawerMaxHeight.value - drawerMinHeight)
)

const backdropStyle = computed(() => {
    const opacity = Math.min(0.8, drawerOpenRatio.value * 0.8);
    return {
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        pointerEvents: drawerOpenRatio.value > 0 ? 'auto' : 'none',
    }
})

const drawerStyle = computed(() => ({
    height: `${drawerMaxHeight.value}px`,
    transform: `translateY(${-drawerPos.value}px)`,
}))

const drawerMode = computed(() => {
    if (drawerOpenRatio.value > drawerOpenRatioHalf / 100) {
        return 'full'
    }
    return drawerOpenRatio.value > 0 ? 'half' : 'handler'
})

const slideDrawer = (ev) => {
    const { direction, delta, isFinal } = ev

    drawerPos.value = Math.max(
        drawerMinHeight,
        Math.min(drawerMaxHeight.value, drawerPos.value - delta.y)
    )
    if (isFinal) {
        nextTick(() => {
            const aboveHalf = drawerOpenRatio.value > drawerOpenRatioHalf / 100
            const targetHeight =
                direction === 'up'
                ? aboveHalf
                    ? drawerMaxHeight.value
                    : Math.round(drawerMaxHeight.value / 2)
                : aboveHalf
                ? Math.round(drawerMaxHeight.value / 2)
                : drawerMinHeight

            animateDrawerTo(targetHeight)
        })
    }
}

const cycleDrawer = () => {
  let targetHeight

  if (drawerMode.value === 'handler') {
    targetHeight = Math.round(drawerMaxHeight.value / 2) // Halbe Höhe
  } else if (drawerMode.value === 'half') {
    targetHeight = drawerMaxHeight.value // Maximale Höhe
  } else {
    targetHeight = drawerMinHeight // Minimale Höhe
  }

  animateDrawerTo(targetHeight)
}

const animateDrawerTo = (height) => {
    clearTimeout(animateTimeout)

    const diff = height - drawerPos.value

    if (diff !== 0) {
        drawerPos.value += Math.abs(diff) < 2 ? diff : Math.round(diff / 2)

        animateTimeout = setTimeout(() => {
            animateDrawerTo(height)
        }, 30)
    }
}

let wasOpen = false;
watch(drawerOpenRatio, (newValue) => {
  if (newValue > 0 && !wasOpen) {
    emit('onOpen'); // Event auslösen
    wasOpen = true;
  } else if (newValue === 0 && wasOpen) {
    emit('onClose'); // Event auslösen
    wasOpen = false;
  }
})

onBeforeUnmount(() => {
    clearTimeout(animateTimeout)
})

defineExpose({
    animateDrawerTo,
})
</script>
  
<style lang="scss">
.drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
}
  
.slide-drawer {
    z-index: 10;
    &--bottom {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      //  background-color: #333;
      //  background-image: radial-gradient(
      //  circle,
      //  rgba(0, 0, 0, 0.1) 0%,
      //  rgba(0, 0, 0, 0.4) 100%
      //);
      bottom: unset;
      top: 100%;
      transition: background-color 0.3s ease-in-out;
  
      > div:last-child,
      > img:last-child {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
  
      &.slide-drawer--open-half {
        // background-color: #014a88;
      }
  
      &.slide-drawer--open-full {
        // background-color: #01884a;
      }
    }
  
    &__handler {
        &--horizontal {
            cursor: grab;
            > div {
                // margin-top: 2px;
                width: 60px;
                height: 4px;
                border-radius: 4px;
                background-color: rgba(200, 200, 200, 0.7);
            }
        }
    }
}
</style>

<style>
.body--dark .bottomSheet{
    color: #fff;
}
</style>
  