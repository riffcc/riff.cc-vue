<template>
  <div class="h-32 bg-gray-900 border border-slate-700 fixed bottom-0 inset-x-0 rounded-t-3xl mx-2 lg:mx-20 flex">
    <button @click="onClosePlayer" class="absolute -top-2 right-2 bg-gray-900 rounded-full w-fit h-fit">
      <v-icon name="hi-x-circle" class="h-7 w-7 text-slate-50" />
    </button>
    <div v-if="selectedAudio" class="audio-player my-auto w-full">
      <audio ref="audio" :src="`https://${ipfsGateway}/ipfs/${selectedAudio.cid}`" @play="onPlay" @pause="onPause" autoplay></audio>
      <p class="text-center text-lg font-medium mb-2">{{ selectedAudio.name }}</p>
      <div class="flex items-center justify-between h-14 bg-slate-800 rounded-full mx-4 sm:mx-10 px-4 gap-2">
        <button @click="togglePlay">
          <v-icon v-if="isPlaying" name="hi-pause" class="h-8 w-8 mt-0.5 text-slate-50" />
          <v-icon v-else name="hi-play" class="h-8 w-8 mt-0.5 text-slate-50" />
        </button>
        <div class="flex-1">
          <div class="h-1.5 bg-gray-200 rounded-full">
            <div class="h-1.5 bg-blue-600 rounded-full" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        <p 
          v-if="audio && audio.currentTime && audio.duration"
        >
        {{ `${(audio.currentTime / 60).toFixed(2)}/${(audio.duration / 60).toFixed(2)}` }}
        </p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  selectedAudio: Object,
  onCloseCallback: Function
})

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;

const audio = ref(null);
const isPlaying = ref(false);
const progress = ref(0);

const togglePlay = () => {
  if (isPlaying.value) {
    audio.value.pause();
  } else {
    audio.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const updateProgress = () => {
  const currentProgress = (audio.value.currentTime / audio.value.duration) * 100;
  progress.value = currentProgress.toFixed(2);
  if (isPlaying.value) {
    requestAnimationFrame(updateProgress);
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
  props.onCloseCallback()
  progress.value = 0
  isPlaying.value = false;
}


watch(audio, () => {
  if (!audio.value) {
    return;
  }
  audio.value.addEventListener('timeupdate', updateProgress);
});

onMounted(() => {
  watch(audio, () => {
    if (!audio.value) {
      return;
    }
    audio.value.addEventListener('timeupdate', updateProgress);
  });
});

onUnmounted(() => {
  if (!audio.value) {
    return;
  }
  audio.value.removeEventListener('timeupdate', updateProgress);
});
</script>