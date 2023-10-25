<template>
  <v-list class="pb-10">
    <v-list-item v-for="(file, i) in musicAlbum.files" :key="i" min-height="70px" class="my-2">
      <template v-slot:prepend>
        <v-sheet width="48px">
          <p class="text-h4 text-center">{{ i + 1 }}</p>
        </v-sheet>
        <v-divider class="ml-2" color="primary" vertical></v-divider>
      </template>
      <template v-slot:default>
        <v-sheet class="ml-4 d-flex">
          <v-sheet position="relative">
            <v-img cover inline width="60px" aspect-ratio="1"
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"></v-img>
            <v-btn position="absolute" location="center" variant="plain"><v-icon icon="fas fa-play"
                @click="() => handlePlay(i)" size="small"></v-icon></v-btn>
          </v-sheet>
          <div class="ml-4 ">
            <p>{{ file.name }}</p>
            <p class="text-caption text-medium-emphasis">Artist</p>
          </div>
        </v-sheet>
        <v-divider></v-divider>
      </template>
      <template v-slot:append>
        <p class="text-subtitle-2 text-medium-emphasis">00:00</p>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup>

defineProps({
  musicAlbum: {
    type: Object,
    required: true
  },
  handlePlay: {
    type: Function,
    required: true
  }
})

</script>