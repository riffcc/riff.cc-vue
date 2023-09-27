<template>
  <div class="border h-28 w-28 md:h-32 md:w-32">
    <img v-if="pin.piece.details?.thumbnailCid" class="w-full h-full" :alt="''" :src="`https://${ipfsGateway}/ipfs/${pin.piece.details?.thumbnailCid}`" />
    <img v-else-if="pin.piece?.contentCid" class="w-full h-full" :alt="''" :src="`https://${ipfsGateway}/ipfs/${pin.piece?.contentCid}`" />
    <p @click="handleOnClick" class="text-xs md:text-sm mt-2 text-center font-medium text-slate-50 hover:cursor-pointer">{{ pin.piece?.name }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;

const router = useRouter()
const handleOnClick = () => {
  if (props.onCloseCallback) {
    props.onCloseCallback()
  }
  router.push(`/pin/${props.pin.id}`)
}
const props = defineProps({
  pin: Object,
  onCloseCallback: Function,
})
</script>

<style scoped>
/* Estilos específicos del componente PieceItem */
</style>
