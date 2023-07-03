<template>
  <button class="absolute top-3 right-5" @click="onClose">
    <v-icon class="h-4 w-4 text-slate-200" name="hi-x" />
  </button>
</template>

<script setup>
defineProps({
  onClose: {
    type: Function,
    required: true
  }
})

</script>