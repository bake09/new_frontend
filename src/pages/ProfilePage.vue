<template>
  <q-page padding>
    <div class="text-h5 text-center">Profile Image Upload</div>
    <q-card
      class="image-selection-dropzone flex flex-center"
      flat
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      @dragleave="onDragLeave"
      :class="{ 'drop-active': isDragging }"
    >
      <q-card-section>
        <div class="text-center">
          <q-btn label="Select Image(s)" color="blue-grey-7" icon="image" @click="triggerFileInput" />
          <div class="q-mt-sm">or drag and drop files here</div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleImageSelection"
          />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-mt-lg">
      <div class="text-subtitle2">
        {{ images.length }} Image(s) Selected:
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-6 col-md-2"
        v-for="(image, index) in images"
        :key="index"
        >
        <q-img :src="image.preview" ratio="1" fit="contain">
          <div class="absolute-top text-right flex items-center justify-between">
            <q-list dense class="text-left" style="font-size: 10px; min-height: 10px; padding: 0px 0px; width: 60%;">
              <q-item style="font-size: 10px; min-height: 10px; padding: 0px 0px;">
                <q-item-section avatar>Name:</q-item-section>
                <q-item-section class="ellipsis" style="width: 75%;">{{ image.file.name }}</q-item-section>
              </q-item>

              <q-item style="font-size: 10px; min-height: 10px; padding: 0px 0px;">
                <q-item-section avatar>Format:</q-item-section>
                <q-item-section class="ellipsis" style="width: 75%;">{{ image.file.type }}</q-item-section>
              </q-item>

              <q-item style="font-size: 10px; min-height: 10px; padding: 0px 0px;">
                <q-item-section avatar>Typ:</q-item-section>
                <q-item-section class="ellipsis" style="width: 75%;">{{ (image.file.size / 1024).toFixed(2) }} KB</q-item-section>
              </q-item>
            </q-list>
            
            <q-btn round icon="close" @click="removeImage(index)"/>
          </div>
        </q-img>
      </div>
    </div>

    <q-btn
      label="Upload Images"
      color="primary"
      @click="uploadImages"
      :disable="!images.length"
      class="q-mt-md"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from "boot/axios";
import { Notify } from 'quasar';

import { useAuthStore } from 'src/stores/auth-store';
const authStore = useAuthStore()

const fileInput = ref(null)
const images = ref([])
const isDragging = ref(false)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleImageSelection = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        images.value.push({ file, preview: e.target.result })
      }
      reader.readAsDataURL(file)
    } else {
      Notify.create({
        type: 'warning',
        message: 'Only image files are allowed.',
      })
    }
  })
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const uploadImages = async () => {
  const formData = new FormData()
    images.value.forEach((image) => {
      formData.append('images[]', image.file)
    })
    try {
      const response = await api.post('/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log('response :>> ', response);
      Notify.create({
        type: 'positive',
        message: 'Images uploaded successfully!',
      })
      images.value = []
    } catch (error) {+
      console.error('error :>> ', error);
      Notify.create({
        type: 'negative',
        message: 'Failed to upload images.',
      })
    }
}
// Abrufen aller hochgeladenen Bilder beim Mounten der Komponente
const fetchImages = async () => {
  try {
    const response = await api.get('/images', {
    });
    // Serverantwort verarbeiten und Bilder hinzufügen
    response.data.images.forEach((image) => {
      images.value.push({
        file: {
          name: image.name,
          type: image.type,
          size: image.size,
        },
        preview: `${image.path}`, // URL für die Vorschau
      });
    });
  } catch (error) {
    console.error('Failed to fetch images:', error);
    Notify.create({
      type: 'negative',
      message: 'Failed to fetch images.',
    });
  }
};

onMounted(() => {
  fetchImages(); // Bilder vom Server abrufen
});
</script>

<style>
.image-selection-dropzone {
  border: 3px dotted #636363;
  border-radius: 10px;
  height: 100px;
  transition: background-color 0.2s;
  background-color: #f9f9f9;
}

.body--dark .image-selection-dropzone {
  background-color: transparent !important;
}
.image-selection-dropzone.drop-active {
  background-color: #e6f7ff;
  border-color: #1890ff;
}
.hidden {
  display: none;
}
.q-img__content > div {
  padding: 8px;
}
</style>
