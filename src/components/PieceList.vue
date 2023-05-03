<template>
  <div class="flex-1 flex flex-wrap justify-center py-8 gap-2 content-evenly">
    <PieceTable v-if="table" :pins="list" />
    <PieceItem 
      v-else
      v-for="edge in list"
      :key="edge.node.__typename === 'Featured' ? edge.node.pin.id : edge.node.id"
      :pin="edge.node.__typename === 'Featured' ? edge.node.pin : edge.node" 
    />
  </div>
</template>

<script setup>
import PieceItem from "./PieceItem.vue";
import PieceTable from "./PieceTable.vue";

defineProps({
  list: {
    type: Array,
    required: true,
  },
  table: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
/* Estilos específicos para este componente */
</style>
