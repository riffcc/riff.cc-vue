<template>
  <table class="w-full">
    <tbody>
      <tr v-for="pin in pins" :key="pin.node.id" class="flex items-center justify-between px-4 sm:px-10 h-20 text-sm sm:text-md">
        <td class="w-2/12 flex">
          <div v-if="pin.node.piece.details?.imageThumbnailCID" class="w-20 h-14 rounded-xl">
            <img class="w-full h-full rounded-xl" :src="`https://${ipfsGateway}/ipfs/${pin.node.piece.details?.imageThumbnailCID}`" alt="" />
          </div>
          <div v-else class="w-20 h-14 border border-slate-600 rounded-xl flex">
            <v-icon name="pr-image" class="h-12 w-12 m-auto" />
          </div>
        </td>
        <td class="w-5/12">
          <p class="text-center">{{ pin.node.piece.name }}</p>
        </td>
        <td class="w-2/12">
          <p class="text-center">{{ pin.node.category.name }}</p>
        </td>
        <td class="w-2/12">
          <a 
            :href="`https://ipfs.io/ipfs/${pin.node.piece.CID}`" 
            target="_blank"
            class="hover:text-cyan-200"
          >
            {{ pin.node.piece.CID.substring(0, 2) }}...{{ pin.node.piece.CID.substring(pin.node.piece.CID.length - 4) }}
          </a>
        </td>
        <td class="w-1/12">
          <div v-if="pin.node">
            <PinActions :pin="pin.node" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import PinActions from './PinActions.vue'

defineProps({
  pins: Array
})

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
</script>

<style scoped>
</style>
