<template>
  <div class="w-40">
    <div class=" h-36 w-36 relative mx-auto">
      <a :href="`https://ipfs.io/ipfs/${pin.piece?.CID}`" target="_blank">
        <img class="absolute w-full h-full rounded-xl" :alt="''" :src="`https://ipfs.io/ipfs/${pin.piece?.CID}`" />
      </a>
    </div>
    <div class="w-full h-8">
      
      <p class="text-xs mt-2 text-center font-medium text-slate-50 hover:cursor-pointer">{{ pin.piece?.name }}</p>
      <!-- <a ="`/pin/${pin.id}`">
      </a> -->
    </div>
  </div>
</template>

<script>

export default {
  name: "PieceItem",
  props: {
    pin: Object
  },
};
</script>

<style scoped>
/* Estilos específicos del componente PieceItem */
</style>
