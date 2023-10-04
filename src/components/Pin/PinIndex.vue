<template>
  <!-- <div class="w-full">
    <PinCard :pinResult="pinResult" :handlePlay="handlePlay" />
    <div v-if="isVideo" class="w-full h-full md:p-4">
      <VideoPlayer v-if="videoSource" :videoSource="videoSource" />
    </div>
    <div v-if="musicAlbum.is" class="py-10 divide-y divide-background">
      <PinPlaylist :handlePlay="handlePlay" :musicAlbum="musicAlbum" />
      <RelatedAlbums v-if="pinResult.node.artist.name !== 'Unknown'" :artist="pinResult.node.artist"
        :streamID="pinResult.node.id" :onCloseCallback="onCloseCallback" />
    </div>
      <AudioPlayer v-if="selectedAudio" :selectedAudio="selectedAudio" :onCloseCallback="onCloseCallback"
        :handleNext="handleNext" :handlePrevious="handlePrevious" />
  </div> -->
</template>

<script setup>

// import AudioPlayer from '../AudioPlayer.vue';
// import VideoPlayer from '../VideoPlayer.vue';
// import PinCard from './PinCard.vue'
// import PinPlaylist from './PinPlaylist.vue'
// import RelatedAlbums from './RelatedAlbums.vue';

import { onMounted, ref } from 'vue';
import { useWalletStore } from '../../store/wallet';
import { useSettingsStore } from '../../store/settings';
import getCIDContent from '../../utils/getCIDContent';
// import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

const props = defineProps({
  pinResult: {
    type: Object,
    required: true
  },
  handleOnLike: {
    type: Function,
    required: true
  },
  handleOnDislike: {
    type: Function,
    required: true
  }
})

const isVideo = ref(false)
const musicAlbum = ref({
  is: false,
  files: null,
  selected: null,
  index: null
})

const selectedAudio = ref(null)
const videoSource = ref(null)

const handleOnSelectAndPlay = (index) => {
  selectedAudio.value = { name: musicAlbum.value.files[index].name, cid: musicAlbum.value.files[index].cid }
}

const walletStore = useWalletStore()
const settingsStore = useSettingsStore()
const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY

onMounted(() => {

  musicAlbum.value.files = undefined
  musicAlbum.value.index = 0
  musicAlbum.value.selected = undefined
  musicAlbum.value.is = false


  if (!props.pinResult.node) {
    return
  }
  if (props.pinResult.node.category.name === "Movies" || props.pinResult.node.category.name === "Videos") {
    isVideo.value = true
    videoSource.value = {
      name: props.pinResult.node.piece.name,
      cid: props.pinResult.node.piece.contentCid
    }
  } else if (props.pinResult.node.category.name === "Music") {
    getCIDContent(ipfsGateway, props.pinResult.node.piece.contentCid)
      .then(files => {
        musicAlbum.value.is = true
        musicAlbum.value.files = files
        musicAlbum.value.index = 0
        if (walletStore.accountId && settingsStore.autoplay) {
          handleOnSelectAndPlay(musicAlbum.value.index)
        }
      })

  }
})


const handlePrevious = () => {
  musicAlbum.value.index = musicAlbum.value.index - 1
  if (musicAlbum.value.index < 0) {
    musicAlbum.value.index = 0
    return
  }
  handleOnSelectAndPlay(musicAlbum.value.index)
}

const handleNext = () => {
  musicAlbum.value.index = musicAlbum.value.index + 1
  if ((musicAlbum.value.files.length - 1) < musicAlbum.value.index) {
    musicAlbum.value.index = 0
  }
  handleOnSelectAndPlay(musicAlbum.value.index)
}

const handlePlay = (i) => {
  musicAlbum.value.index = i
  handleOnSelectAndPlay(i)
}

const onCloseCallback = () => {
  selectedAudio.value = null;
}
// const breakpoints = useBreakpoints(breakpointsTailwind)
// const isGreatherThanMedium = breakpoints.greater("md");

</script>