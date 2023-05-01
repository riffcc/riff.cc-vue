<template>
  <table class="w-full">
    <tbody>
      <tr v-for="pin in pins" :key="pin.node.id" class="flex items-center justify-between px-10 h-20">
        <td class="w-1/6 flex">
          <div class="w-20 m-auto">
            <img :src="`https://ipfs.io/ipfs/${pin.node.piece.CID}`" alt="" />
          </div>
        </td>
        <td class="w-2/6">
          <p class="text-center">{{ pin.node.piece.name }}</p>
        </td>
        <td class="w-1/6">
          <p class="text-center">{{ pin.node.category.name }}</p>
        </td>
        <td class="w-1/6">
          <div>
            <a :href="`https://ipfs.io/ipfs/${pin.node.piece.CID}`" target="_blank"
              class="hover:text-cyan-200">
              {{ pin.node.piece.CID.substring(0, 5) }}...{{ pin.node.piece.CID.substring(pin.node.piece.CID.length - 5) }}
            </a>
          </div>
        </td>
        <td class="w-1/6">
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

</script>

<style scoped>
</style>
