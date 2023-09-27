<template>
  <div class="mx-auto">
    <button class="h-10 w-10 border text-white hover:bg-primary" v-if="page > 1" @click="handlePrevPage">{{ `<`}}</button>
    <button class="h-10 w-10 border text-white cursor-default" v-if="page > 1">{{ page - 1 }}</button>
    <button class="h-10 w-10 border text-white bg-primary cursor-default">{{ page }}</button>
    <button class="h-10 w-10 border text-white cursor-default" v-if="hasNextPage">{{ page + 1 }}</button>
    <button class="h-10 w-10 border text-white hover:bg-primary" v-if="hasNextPage" @click="handleNextPage">{{ `>` }}</button>
  </div>
</template>

<script setup>


defineProps({
  page: {
    type: Number,
    required: true
  },
  hasNextPage: {
    type: Boolean,
    required: true
  },
  handlePrevPage: {
    type: Function,
    required: true
  },
  handleNextPage: {
    type: Function,
    required: true
  }
})
</script>