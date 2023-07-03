<template>
  <div>
    <LayoutHeader />
    <slot></slot> <!-- Utiliza el slot para mostrar el contenido dinámico pasado como children -->
    <Modal v-if="settingsStore.show">
      <Settings />
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LayoutHeader from './Header.vue' // Importa el componente LayoutHeader
import Modal from './Modal.vue';
import Settings from '../Settings.vue'; 
import { useSettingsStore } from '../../stores/settings';
const settingsStore = useSettingsStore();

</script>

<style scoped>
/* Estilos específicos del layout si es necesario */
</style>
