<template>
  <div class="h-32 bg-gray-900 border border-slate-700 fixed bottom-0 inset-x-0 rounded-t-3xl mx-2 lg:mx-20 flex">
    <button @click="onClosePlayer" class="absolute -top-2 right-2 bg-gray-900 rounded-full w-fit h-fit">
      <v-icon name="hi-x-circle" class="h-7 w-7 text-slate-50" />
    </button>
    <div v-if="selectedAudio" class="audio-player my-auto w-full">
      <audio ref="audio" :src="`https://${ipfsGateway}/ipfs/${selectedAudio.cid}`" @play="onPlay" @pause="onPause" @loadeddata="onLoad"></audio>
      <p class="text-center text-lg font-medium mb-2">{{ selectedAudio.name }}</p>
      <div v-if="!isLoading" class="flex items-center justify-between h-14 bg-slate-800 rounded-full mx-4 sm:mx-10 px-4 gap-2">
        <button @click="togglePlay">
          <v-icon v-if="isPlaying" name="hi-pause" class="h-8 w-8 mt-0.5 text-slate-50" />
          <v-icon v-else name="hi-play" class="h-8 w-8 mt-0.5 text-slate-50" />
        </button>
        <div class="flex-1">
          <div id="progress-bar" ref="progressBar" class="h-1.5 bg-gray-200 rounded-full cursor-pointer w-full flex items-center">
            <div class="h-1.5 bg-blue-600 rounded-full" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        <p 
          v-if="audio && audio.currentTime && audio.duration"
          class="text-sm"
        >
        {{ `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}` }}
        </p>
        <v-icon v-if="audio.volume === 0" name="hi-volume-off" class="h-5 w-5 text-slate-50" @click="unmute" />
        <v-icon v-else name="hi-volume-up" class="h-5 w-5 text-slate-50" @click="mute" />
      </div>
      <div v-else class="h-14 mx-4 sm:mx-10 rounded-full bg-slate-700 animate-pulse"></div>
    </div>
  </div>
</template>


<script setup>
import { onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  selectedAudio: Object,
  onCloseCallback: Function
})


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
  if (!audio) {
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


const mute = () => {
  audio.value.volume = 0
}

const unmute = () => {
  audio.value.volume = 1
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

const onClosePlayer = () => {
  pause()
  isPlaying.value = false;
  progress.value = 0
  props.onCloseCallback()
}


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