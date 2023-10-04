<template>
  <v-tooltip max-width="140px" :text="content">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" :icon="icon" size="x-small">
      </v-icon>
    </template>
  </v-tooltip>
</template>

<script setup>
defineProps({
  icon: String,
  content: String
})
</script>