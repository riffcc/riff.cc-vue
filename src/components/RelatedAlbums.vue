<template>
  <div v-if="pinList.length > 0" class="p-4 border border-slate-600 mt-10">
    <p>More from {{ artist.name }}</p>
    <div class="flex justify-between items-center p-4">
      <PieceItem v-for="pin in pinList" :pin="pin.node" />
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import PieceItem from "../components/PieceItem.vue"
const props = defineProps({
  artist: {
    required: true,
    type: Object
  },
  streamID: {
    required: true,
    type: String  
  }
})

const pinList = computed(() => {
  return props.artist.pins.edges.filter(edge => edge.node.id !== props.streamID)
})
</script>