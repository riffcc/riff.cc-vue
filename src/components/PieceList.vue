<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div class="flex-1 flex flex-wrap justify-center py-8 gap-2 content-evenly">
    <PieceTable v-if="table" :pins="list" />
    <PieceItem 
      v-for="edge in list"
      :key="edge.node.id"
      :pin="edge.node" 
    />
  </div>
</template>

<script>
import PieceItem from "./PieceItem.vue";
import PieceTable from "./PieceTable.vue";


export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    table: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PieceItem,
    PieceTable,
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente */
</style>
