<template>
  <div v-if="pinList.length > 0" class="px-10 pt-8 pb-4 mt-10">
    <h3 class="text-xl mb-4">More from {{ artist.name }}</h3>
    <div class="flex gap-10 items-center p-4">
      <PieceItem v-for="pin in pinList" :pin="pin.node" :key="pin.node" :onCloseCallback="onCloseCallback" />
    </div>
  </div>
</template>
<script setup>

import { computed, onMounted } from "vue";
import PieceItem from "../PieceItem.vue"

const props = defineProps({
  artist: {
    required: true,
    type: Object
  },
  streamID: {
    required: true,
    type: String  
  },
  onCloseCallback: Function,

})

onMounted(() => console.log('from related albums', props.artist))
const pinList = computed(() => {
  return props.artist.pins.edges.filter(edge => edge.node.id !== props.streamID)
})
</script>