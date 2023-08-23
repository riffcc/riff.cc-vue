<template>
  <ul v-for="file, i in musicAlbum.files" :key="file.cid">
    <li class="p-8 h-20 flex items-center justify-between">
      <div id="song-index" class="w-16 h-16 flex">
        <h4 class="text-3xl m-auto">{{ i + 1 }}</h4>
      </div>
      <div id="song-play" class="w-16 h-16 bg-background flex">
        <v-icon name="md-playarrow-round" class="h-6 w-6 m-auto  cursor-pointer" @click="() => {
          handlePlay(i)
        }" />
      </div>
      <div id="song-name-artist" class="flex-1 ml-4">
        <h6 class="cursor-pointer" @click="() => {
          handlePlay(i)
        }">{{ file.name }}</h6>
        <h6 class="text-sm text-slate-400">Artist</h6>
      </div>
      <h4 class="text-slate-400 text-sm">00:00</h4>
    </li>
  </ul>
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