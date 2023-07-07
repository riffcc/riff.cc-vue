<template>
  <div class="bg-black border border-slate-700">
    <div id="video-player" class="my-auto lg:w-10/12 mx-auto relative" @mouseenter="openControls" @mouseleave="delayCloseControls">
      <button v-if="showControls" @click="$router.push('/')" class="absolute top-3 left-4 z-10">
        <v-icon name="hi-arrow-circle-left" class="h-12 w-12 mt-0.5 text-slate-50"></v-icon>
      </button>
      <video 
        ref="videoPlayer" 
        class="w-full" 
        :src="`https://${ipfsGateway}/ipfs/${videoSource.cid}`" 
        :controls="false"
        @loadeddata="onLoad"
        @click="togglePlay"
      >
      </video>
      <Spinner v-if="isLoading" className="h-8 w-8 text-slate-400 text-opacity-50 absolute inset-0 m-auto animate-spin" />
      <div v-if="showControls" class="flex items-center gap-2 mt-4 w-full absolute bottom-0 px-2 pb-1 bg-gray-900 bg-opacity-50">
        <button @click="togglePlay">
          <v-icon v-if="isPlaying" name="hi-pause" class="h-10 w-10 mt-0.5 text-slate-50" />
          <v-icon v-else name="hi-play" class="h-10 w-10 mt-0.5 text-slate-50" />
        </button>
        <div class="flex-1 bg-video-progress rounded-full cursor-pointer">
          <div id="progress-bar" class="h-3 flex items-center" @click="seekingTrack">
            <div class="h-full bg-video-current-progress rounded-full" :style="{ width: progress + '%' }"></div>
            <div class="rounded-full w-5 h-5 bg-gray-200 border border-slate-700 -ml-0.5"></div>
          </div>
        </div>
        <div class="flex cursor-pointer">
          <v-icon v-if="videoPlayer.volume > 0" name="hi-volume-up" class="h-7 w-7 text-slate-50" @click="mute" />
          <v-icon v-else name="hi-volume-off" class="h-7 w-7 text-slate-50" @click="unmute" />
        </div>
        <button @click="toggleFullscreen">
          <v-icon name="md-fullscreen" class="h-10 w-10 mt-0.5 text-slate-50" />
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Spinner from "./Layout/Spinner.vue"
const props = defineProps({
  videoSource: {
    type: Object,
    required: true
  }
})

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
const videoPlayer = ref(null);
const isPlaying = ref(false);
const showControls = ref(false);
const isLoading = ref(true)
const videoDuration = ref(0);
const progress = ref(0);

const openControls = () => {
  showControls.value = true;
}
const delayCloseControls = () => setTimeout(() => {
  showControls.value = false
}, 500);


watch(
  () => props.videoSource,
  () => {
    videoPlayer.value.load();
    videoPlayer.value.addEventListener('loadedmetadata', () => {
      videoDuration.value = videoPlayer.value.duration;
    });
  }
);

const seekingTrack = (e) => {
  isLoading.value = true
  pause();
  const targetPercent = parseFloat((e.offsetX / e.target.parentElement.offsetWidth).toFixed(4));
  const targetCurrenTime = videoPlayer.value.duration * targetPercent;
  videoPlayer.value.currentTime = parseInt(targetCurrenTime);

  resume();
  isLoading.value = false
};


const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

const onLoad = (e) => {
  console.log(e);
  play()
}

const pause = () => {
  videoPlayer.value.pause();
  isPlaying.value = false
};

const resume = () => {
  // videoPlayer.value.play();
  isPlaying.value = true
};

const mute = () => {
  showControls.value = true
  videoPlayer.value.volume = 0
    showControls.value = false
}

const unmute = () => {
  showControls.value = true
  videoPlayer.value.volume = 1
    showControls.value = false
}

const play = () => {
  isLoading.value = false
  if (progress.value !== 0) {
    progress.value = 0
  }
  videoPlayer.value.play();
  isPlaying.value = true
};

const updateProgress = () => {
  if (videoPlayer.value) {
    const currentProgress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100;
    progress.value = currentProgress.toFixed(2);
    if (isPlaying.value) {
      requestAnimationFrame(updateProgress);
    }
  }
};

const toggleFullscreen = () => {
  if (videoPlayer.value.requestFullscreen) {
    videoPlayer.value.requestFullscreen();
  } else if (videoPlayer.value.mozRequestFullScreen) {
    videoPlayer.value.mozRequestFullScreen();
  } else if (videoPlayer.value.webkitRequestFullscreen) {
    videoPlayer.value.webkitRequestFullscreen();
  } else if (videoPlayer.value.msRequestFullscreen) {
    videoPlayer.value.msRequestFullscreen();
  }
};

onMounted(() => {
  videoPlayer.value.addEventListener('timeupdate', updateProgress);

});

onUnmounted(() => {
  if (!videoPlayer.value) {
    return;
  }
  videoPlayer.value.removeEventListener('timeupdate', updateProgress);
});

</script>