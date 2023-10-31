<template>
    <v-container>
      <v-sheet min-height="75vh">
        <v-container>
          <div class="pa-6">
            <p class="text-h4 mb-4 text-center">Cookie Policy</p>
            <div v-for="paraph in cookiePolicyParaphs" class="pa-4 mb-6">
            <p class="text-h5 mb-2">{{ paraph.title }}</p>
            <p class="text-body-1">{{ paraph.content }}</p>
            
            </div>
          </div>
        </v-container>
      </v-sheet>
      </v-container>
</template>

<script setup>
import { cookiePolicyParaphs } from '@config/constants'
</script>