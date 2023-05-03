<template>
  <ul>
    <AdminItem v-for="admin in list" :key="admin.node.id" :admin="admin.node" />
  </ul>
</template>

<script setup>
import AdminItem from './AdminItem.vue'

defineProps({
  list: Array
})
</script>