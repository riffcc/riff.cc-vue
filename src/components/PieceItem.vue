<template>
  <v-sheet border width="128px" heigth="128px">
    <v-img v-if="pin.piece.details?.thumbnailCid" cover :src="`https://${IPFS_GATEWAY}/ipfs/${pin.piece.details?.thumbnailCid}`" />
    <v-img v-else-if="pin.piece?.contentCid" cover :src="`https://${IPFS_GATEWAY}/ipfs/${pin.piece?.contentCid}`" />
    <p @click="handleOnClick" class="text-xs">{{ pin.piece?.name }}</p>
  </v-sheet>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { IPFS_GATEWAY } from '@/config/constants'

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
