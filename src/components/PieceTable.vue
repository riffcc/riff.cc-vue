<template>
  <table class="table-auto w-full mx-auto">
    <tbody>
      <tr v-for="pin in pins" :key="pin.node.id">
        <td class="px-8">
          <div class="h-16 w-16 mx-auto relative my-1">
            <img :src="`https://ipfs.io/ipfs/${pin.node.piece.CID}`" alt="" />
          </div>
        </td>
        <td class="px-8">
          <p class="text-center">{{ pin.node.piece.name }}</p>
        </td>
        <td class="px-8">
          <p class="text-center">{{ pin.node.category.name }}</p>
        </td>
        <td class="px-8">
          <div>
            <a :href="`https://ipfs.io/ipfs/${pin.node.piece.CID}`" target="_blank"
              class="hover:text-cyan-200">
              {{ pin.node.piece.CID.substring(0, 5) }}...{{ pin.node.piece.CID.substring(pin.node.piece.CID.length - 5) }}
            </a>
          </div>
        </td>
        <td class="px-8">
          <div v-if="pin.node">
            <pin-actions :pin="pin.node" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PinActions from './PinActions.vue'

export default {
  props: {
    pins: Array // Pins array prop
  },
  components: {
    PinActions // Componente PinActions
  }
}
</script>

<style scoped>
/* Estilos CSS para la tabla */
.table-auto {
  width: auto;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.my-1 {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.h-16 {
  height: 4rem;
}

.w-16 {
  width: 4rem;
}

.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.text-center {
  text-align: center;
}

.hover:text-cyan-200:hover {
  color: #9cdbff;
}</style>
