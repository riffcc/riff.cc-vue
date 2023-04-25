<template>
  <div>
    <button @click="unpin" class="btn-unpin">
      Unpin
    </button>
    <button @click="download" class="btn-download">
      Download
    </button>
  </div>
</template>

<script>
export default {
  props: {
    pin: Object // Propiedad pin, se espera un objeto
  },
  methods: {
    unpin() {
      // Lógica para desanclar (unpin) el elemento
      console.log(`Unpin: ${this.pin.piece.name}`);
    },
    download() {
      // Lógica para descargar (download) el elemento
      console.log(`Download: ${this.pin.piece.name}`);
    }
  }
}
</script>

<style scoped>
/* Estilos CSS para los botones */
.btn-unpin,
.btn-download {
  cursor: pointer;
  background-color: #4a5568;
  color: #fff;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.btn-unpin:hover,
.btn-download:hover {
  background-color: #718096;
}
</style>
