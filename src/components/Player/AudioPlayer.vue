<template>
  <div class="h-32 backdrop-blur-sm bg-white/30 w-screen fixed bottom-0 inset-x-0 flex z-20">
    <!-- <button @click="onClosePlayer" class="absolute -top-2 right-2 bg-gray-900 rounded-full w-fit h-fit">
      <v-icon name="hi-x-circle" class="h-7 w-7 text-slate-50" />
    </button> -->
    <div v-if="selectedAudio" id="audio-player" class="m-auto w-full md:px-8 lg:px-10 md:max-w-4xl">
      <audio ref="audio" :src="`https://${ipfsGateway}/ipfs/${selectedAudio.cid}`" @play="onPlay" @pause="onPause"
        @loadeddata="onLoad" @ended="handleNext"></audio>
      <div v-if="!isLoading" class="flex items-center justify-between gap-6">
        <img src="/artist.png" alt="" class="rounded-full w-28 h-28">
        <div class="flex items-center gap-2">
          <button @click="handlePrevious">
            <v-icon name="ri-skip-back-fill" class="h-7 w-7 text-white" />
          </button>
          <button @click="togglePlay">
            <v-icon v-if="isPlaying" name="md-pausecirclefilled" class="h-8 w-8 text-white" />
            <v-icon v-else name="md-playcirclefilled" class="h-8 w-8 text-white" />
          </button>
          <button @click="handleNext">
            <v-icon name="ri-skip-forward-fill" class="h-7 w-7 text-white" />
          </button>
        </div>
        <div class="flex-1 mt-5">
          <div id="progress-bar" class=" bg-white bg-opacity-30 rounded-full cursor-pointer">
            <div  class="h-1 flex items-center" @click="seekingTrack">
              <div class="h-1  bg-primary bg-opacity-50 rounded-full" :style="{ width: progress + '%' }"></div>
              <div class="rounded-full w-3 h-3 bg-primary outline outline-offset-0 outline-primary/30"></div>
            </div>
          </div>
          <div class="flex justify-between text-sm mt-1.5">
            <h4>{{ `${formatTime(audio.currentTime)}`}}</h4>
            <h4>{{ `${formatTime(audio.duration)}` }}</h4>
          </div>
        </div>
        <div class="flex gap-4 items-center ">
          <VolumeControl @updateVolume="handleVolume" :volume="audio.volume" />
          <div class="border-2 rounded-full border-opacity-50 h-10 w-10 flex ">
            <v-icon name="pr-replay" class="h-4 w-4 m-auto" />
          </div>
          <div class="border-2 rounded-full border-opacity-50 h-10 w-10 flex ">
            <v-icon name="io-shuffle" class="h-4 w-4 m-auto" />
          </div>
        </div>
      </div>
      <Spinner v-else class="h-7 w-7 text-primary animate-spin mx-auto" />
    </div>
  </div>
</template>


<script setup>
import { onUnmounted, ref, watch } from 'vue';
import VolumeControl from './VolumeControl.vue'
import Spinner from '../Layout/Spinner.vue'


const props = defineProps({
  selectedAudio: Object,
  onCloseCallback: Function,
  handleNext: Function,
  handlePrevious: Function
})

const seekingTrack = (e) => {
  pause();
  const targetPercent = parseFloat((e.offsetX / e.target.parentElement.offsetWidth).toFixed(4));
  const targetCurrenTime = audio.value.duration * targetPercent;
  audio.value.currentTime = parseInt(targetCurrenTime);

  resume();
};

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
const audio = ref(null);
const isPlaying = ref(false);
const progress = ref(0);
const isLoading = ref(true)

const formatTime = (ms) => {
  let [min, sec] = (ms / 60).toFixed(2).split('.')
  sec = ((sec / 100) * 60).toFixed()
  sec = sec < 10 ? `0${sec}` : sec
  return `${min}:${sec}`
}

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

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
    progress.value = currentProgress.toFixed(2);
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