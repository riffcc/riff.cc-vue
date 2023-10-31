<template>
  <v-div v-if="isThemeLoading" class="h-screen d-flex">
    <v-progress-circular indeterminate :size="50" class="ma-auto"></v-progress-circular>
  </v-div>
  <v-theme-provider v-else theme="default">
    <v-layout class="d-flex flex-column">
      <Header :cidImageSite="siteResult.node.image" />
      <v-main class="bg-background">
        <slot></slot>
      </v-main>
      <Footer />
    </v-layout>
  </v-theme-provider>
  <!-- <div v-for="key in Object.keys(newTheme.colors)" class="d-flex align-center w-auto">
            <v-sheet width="24px" height="24px" :color="newTheme.colors[key]" border></v-sheet>
            <span class="text-overline">{{ newTheme.colors[key] }}</span>
          </div>
    <div v-else> -->
</template>

<script setup>

import { watch, provide } from 'vue';
import { useTheme } from 'vuetify';
import { useQuery } from '@vue/apollo-composable';
import {
  defaultThemeColors,
  defaultThemeVariables,
  GET_SITE
} from '@config/constants'
import { ref } from 'vue';
import { Header, Footer } from '@components'
import {parseColors} from '@utils'
import { useSettingsStore } from "@stores/settings";


const siteID = import.meta.env.VITE_WEBSITE_ID
const settingsStore = useSettingsStore()
const {
  result: siteResult,
  onResult,
  refetch: refetchSite,
  loading: siteResultLoading
} = useQuery(GET_SITE, {
  id: siteID
})
const theme = useTheme()
const isThemeLoading = ref(true)
const addTheme = (newThemeObj) => {
  theme.themes.value = newThemeObj
}
const setTheme = (name) => {
  theme.global.name.value = name
}
watch(siteResult, (value) => {
  if (!value?.node) {
    return
  }
console.log('siteResult', siteResult)
  settingsStore.siteName = value.node?.name
  settingsStore.siteDescription = value.node?.description
  settingsStore.siteImage = value.node?.image
  settingsStore.featuredCategories = value.node?.featuredCategories


  const parsedColors = parseColors(value.node?.colors)
  settingsStore.colors = parsedColors
  const siteTheme = {
    dark: false,
    colors: parsedColors,
    variables: defaultThemeVariables
  }
  addTheme({ siteTheme })
  setTheme('siteTheme')
  isThemeLoading.value = false
})
provide('refetchSite', refetchSite)


</script>

<style scoped>
/* Estilos específicos del layout si es necesario */
</style>
