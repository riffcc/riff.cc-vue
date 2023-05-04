<template>
  <div class="w-40">
    <div class="h-36 w-36 relative mx-auto border rounded-lg">
      <a
        v-if="pin.piece.details?.imageThumbnailCID"
        :href="`https://ipfs.io/ipfs/${pin.piece.details?.imageThumbnailCID}`" 
        target="_blank"
      >
        <img class="absolute w-full h-full rounded-xl" :alt="''" :src="`https://ipfs.io/ipfs/${pin.piece.details?.imageThumbnailCID}`" />
      </a>
      <div v-else class="flex h-full">
        <v-icon name="pr-image" class="h-20 w-20 m-auto text-slate-300" />
      </div>
    </div>
    <button @click="$router.push(`/pin/${pin.id}`)" class="w-full h-8">
      <p class="text-xs mt-2 text-center font-medium text-slate-50 hover:cursor-pointer">{{ pin.piece?.name }}</p>
    </button>
  </div>
</template>

<script setup>

defineProps({
  pin: Object
})
</script>

<style scoped>
/* Estilos específicos del componente PieceItem */
</style>
