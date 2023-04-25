<template>
  <div>
    <LayoutHeader />
    <slot></slot> <!-- Utiliza el slot para mostrar el contenido dinámico pasado como children -->
  </div>
</template>

<script>
import LayoutHeader from './Header.vue' // Importa el componente LayoutHeader

export default {
  name: 'LayoutIndex',
  components: {
    LayoutHeader // Registra el componente LayoutHeader como un componente hijo
  }
}
</script>

<style scoped>
/* Estilos específicos del layout si es necesario */
</style>
