<template>
  <v-sheet v-if="selectedAudio" position="sticky" color="white" style="opacity: 0.8;" location="bottom right"
    height="100px">
    <audio class="d-none" ref="audio" :src="`https://${ipfsGateway}/ipfs/${selectedAudio.cid}`" @play="onPlay"
      @pause="onPause" @loadeddata="onLoad" @ended="handleNext"></audio>
    <v-container class="fill-height">
      <v-sheet color="transparent" height="100%" max-width="920px"
        class="d-flex align-center mx-auto justify-center w-100">
        <v-avatar size="x-large" image="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg">
        </v-avatar>
        <v-btn @click="handlePrevious" variant="plain" icon>
          <v-icon size="small" icon="fas fa-backward-step"></v-icon>
        </v-btn>
        <v-btn @click="togglePlay" variant="plain" icon>
          <v-icon size="large" :icon="isPlaying ? 'fas fa-circle-pause' : 'fas fa-circle-play'"></v-icon>
        </v-btn>
        <v-btn @click="handleNext" variant="plain" icon>
          <v-icon size="small" icon="fas fa-forward-step"></v-icon>
        </v-btn>
        <div class="flex-1-0 mx-4 mt-2">
          <v-sheet color="transparent" height="24px">
            <v-slider trackColor="primary" trackFillColor="primary" thumbColor="primary" @update:modelValue="seekingTrack"
              color="background" v-model="progress"></v-slider>
          </v-sheet>
          <p class="d-inline-flex float-left text-subtitle-2">{{ currentTime }}</p>
          <p class="d-inline-flex float-right text-subtitle-2">{{ duration }}</p>

        </div>

        <div class="d-flex ml-6">
          <v-menu>
            <template v-slot:activator="{props}">
            <v-btn v-bind="props" class="mx-1" icon variant="outlined" size="small"><v-icon icon="fas fa-volume-high"
                size="x-small"></v-icon></v-btn>
            </template>
            <v-sheet color="background" class="overflow-hidden">
              <v-slider v-model="volume" min="0" max="1" step="0.1" hide-details density="compact" color="primary" direction="vertical" class="ma-4"></v-slider>
            </v-sheet>
            
          </v-menu>
          <v-btn  class="mx-1" icon variant="outlined" size="small"><v-icon icon="fas fa-rotate-left"
            size="x-small"></v-icon></v-btn>
          <v-btn class="mx-1" icon variant="outlined" size="small"><v-icon icon="fas fa-shuffle"
              size="x-small"></v-icon></v-btn>
        </div>
      </v-sheet>
    </v-container>
  </v-sheet>
</template>


<script setup>
import { onUnmounted, ref, watch, computed } from 'vue';


const props = defineProps({
  selectedAudio: Object,
  onCloseCallback: Function,
  handleNext: Function,
  handlePrevious: Function
})

const seekingTrack = (percent) => {
  pause();
  const targetCurrenTime = audio.value.duration * percent / 100;
  audio.value.currentTime = parseInt(targetCurrenTime);

  resume();
};

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
const audio = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
const isLoading = ref(true)
const volume = ref(0)
const formatTime = (ms) => {
  let [min, sec] = (ms / 60).toFixed(2).split('.')
  sec = ((sec / 100) * 60).toFixed()
  sec = sec < 10 ? `0${sec}` : sec
  return `${min}:${sec}`
}
watch(volume, (v) => {
  audio.value.volume = v
})
const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};
const currentTime = ref('00:00')
const duration = ref('00:00')
watch(() => props.selectedAudio, (_audio) => {
  if (!_audio) {
    return
  }
  isLoading.value = true
})

const onLoad = (e) => {
  console.log(e);
  play()
}

const pause = () => {
  audio.value.pause();
  isPlaying.value = false
};

const resume = () => {
  audio.value.play();
  isPlaying.value = true
};

const handleVolume = (v) => {
  audio.value.volume = v
  console.log(audio.value.volume)
}

const play = () => {
  isLoading.value = false
  if (progress.value !== 0) {
    progress.value = 0
  }
  audio.value.play();
  isPlaying.value = true
};

const updateProgress = () => {
  if (audio.value) {
    const currentProgress = (audio.value.currentTime / audio.value.duration) * 100;
    currentTime.value = formatTime(audio.value.currentTime ?? 0)
    duration.value = formatTime(audio.value.duration ?? 0)

    progress.value = currentProgress;
    if (isPlaying.value) {
      requestAnimationFrame(updateProgress);
    }
  }
};

const onPlay = () => {
  isPlaying.value = true;
  updateProgress();
};

const onPause = () => {
  isPlaying.value = false;
};

// const onClosePlayer = () => {
//   pause()
//   isPlaying.value = false;
//   progress.value = 0
//   props.onCloseCallback()
// }

watch(audio, (ref) => {
  if (!ref) {
    return;
  }
  ref.addEventListener('timeupdate', updateProgress);
});

onUnmounted(() => {
  if (!audio.value) {
    return;
  }
  audio.value.removeEventListener('timeupdate', updateProgress);
});
</script>