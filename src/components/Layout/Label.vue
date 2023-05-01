<template>
  <div class="flex gap-1 mb-1 ml-1 items-center">
    <p class="text-sm">{{ title }}</p>
    <div v-if="infoIcon" class="rounded-full bg-slate-600 h-4 w-4 flex"> 
      <p class="m-auto text-xs font-semibold cursor-pointer">?</p>
      <!-- 
      content="A thumbnail for the music, specified as an IPFS CID."
    -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  infoIcon: Boolean,
  title: String,
  content: String
})
</script>