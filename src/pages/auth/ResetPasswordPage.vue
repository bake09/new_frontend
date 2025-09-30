<template>
  <q-page class="flex flex-center" padding>
    <q-card class="q-pa-md" style="width: 420px; margin: 0 auto;">
      <div class="text-h6 q-mb-md">Passwort zurücksetzen</div>

      <div v-if="!token || !email">
        <q-banner class="bg-negative text-white">
          Ungültiger Link oder fehlende Parameter.
        </q-banner>
      </div>

      <div v-else>
        <q-input
          v-model="password"
          type="password"
          label="Neues Passwort"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="password_confirmation"
          type="password"
          label="Passwort bestätigen"
          outlined
          class="q-mb-md"
        />

        <q-btn
          label="Passwort zurücksetzen"
          color="primary"
          @click="resetPassword"
          :loading="loading"
          :disable="loading"
          unelevated
          class="full-width"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../../boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const token = route.query.token || "";
const email = decodeURIComponent(route.query.email || "");

const password = ref("");
const password_confirmation = ref("");
const loading = ref(false);

async function resetPassword() {
  loading.value = true;
  try {
    await api.post("/auth/token/reset-password", {
      token,
      email,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    $q.notify({
      type: "positive",
      message: "Passwort erfolgreich geändert. Du kannst dich jetzt einloggen.",
    });

    router.push({ name: "login" });
  } catch (err) {
    $q.notify({
      type: "negative",
      message:
        err.response?.data?.message || "Fehler beim Zurücksetzen des Passworts.",
    });
  } finally {
    loading.value = false;
  }
}
</script>
