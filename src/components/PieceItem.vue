<template>
  <v-sheet border width="128px" heigth="128px">
    <v-img v-if="pin.piece.details?.thumbnailCid" cover :src="`https://${ipfsGateway}/ipfs/${pin.piece.details?.thumbnailCid}`" />
    <v-img v-else-if="pin.piece?.contentCid" cover :src="`https://${ipfsGateway}/ipfs/${pin.piece?.contentCid}`" />
    <p @click="handleOnClick" class="text-xs">{{ pin.piece?.name }}</p>
  </v-sheet>
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
