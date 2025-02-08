<template>
  <q-page class="text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 20vh">
        403
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Forbidden.
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
