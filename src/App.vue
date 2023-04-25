<template>
  <div>
    <LayoutIndex>
      <RouterView /> <!-- Utiliza el RouterView como contenido de la ranura (slot) en LayoutHeader -->
    </LayoutIndex>
  </div>
</template>

<script>
import LayoutIndex from './components/Layout/Index.vue' // Importa el componente LayoutHeader
// eslint-disable-next-line no-unused-vars
import { RouterView } from 'vue-router' // Importa el componente RouterView de vue-router

export default {
  components: {
    LayoutIndex // Registra el componente LayoutHeader como un componente hijo
  }
}
</script>

<style scoped></style>
