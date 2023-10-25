<template>
  <div class="relative w-12 h-12 flex items-center justify-center">
    <svg class="w-full h-full absolute" viewBox="0 0 50 50">
      <circle @click="handleClick" cx="25" cy="25" r="20" fill="none" stroke="#A020F0" stroke-width="3"
        stroke-opacity="0.3"></circle>
      <circle @click="handleSecondCircleClick" cx="25" cy="25" r="20" fill="none" stroke="#A020F0" stroke-linecap="round"
        stroke-width="3" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"></circle>
    </svg>
    <div class="absolute flex items-center justify-center z-20">
      <v-icon v-if="volume === 0" name="io-volume-off" class="h-4 w-4 m-auto cursor-pointer" @click="unmute" />
      <v-icon v-else name="io-volume-medium" class="h-4 w-4 m-auto cursor-pointer" @click="mute" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  volume: {
    type: Number,
    required: true
  }
})

const initialDashoffset = 125.6637;
const maxDashoffset = 251.3274
const dasharray = ref(`${initialDashoffset} ${maxDashoffset}`);
const dashoffset = ref(0);

const r = 20;
const cx = 25;
const cy = 25;

const emit = defineEmits(['updateVolume']);

function handleClick(event) {
  const svg = event.target;
  const svgRect = svg.getBoundingClientRect();
  const clickX = event.clientX - svgRect.left;
  const clickY = event.clientY - svgRect.top;

  let angle = Math.atan2(clickY - cy, clickX - cx);

  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  const length = Math.min(251.3274, Math.max(0, angle * r));

  const newDashoffset = initialDashoffset - length;
  dashoffset.value = newDashoffset + 1;

  const positionPercentage = (length / 251.3274) * 2;
  const newVolumeValue = parseFloat(positionPercentage.toFixed(1));
  emit('updateVolume', newVolumeValue);
}

function handleSecondCircleClick(event) {
  const svg = event.target;
  const svgRect = svg.getBoundingClientRect();
  const clickX = event.clientX - svgRect.left;
  const clickY = event.clientY - svgRect.top;

  let angle = Math.atan2(clickY - cy, clickX - cx);

  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  const length = Math.min(maxDashoffset, Math.max(0, angle * r));

  const newDashoffset = initialDashoffset - length;
  dashoffset.value = newDashoffset;

  const positionPercentage = (length / 251.3274) * 2;
  const newVolumeValue = parseFloat(positionPercentage.toFixed(1));
  emit('updateVolume', newVolumeValue);
}

const mute = () => {
    emit('updateVolume', 0);
    dashoffset.value = initialDashoffset
}

const unmute = () => {
    emit('updateVolume', 1);
    dashoffset.value = 0
}

</script>
