<template>
  <div :class="className">
    <p class="text-gray-900 text-sm font-medium m-auto">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  className: String,
  message: String
})
</script>

<style scoped>
</style>