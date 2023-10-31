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
      <v-banner position="fixed" v-if="showGdprConsent" location="bottom" border class="bg-background-darken-2 py-10 px-10 px-md-16" text="">
        <template v-slot:text>
            <p class="text-h5 mb-1 font-weight-bold">We value your privacy</p>
            <p class="text-subtitle-1 text-grey-lighten-2">We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.
              <router-link to="/cookie-policy" class="text-primary">Cookie Policy</router-link>
            </p>
          </template>
          <template v-slot:actions>
          <v-btn variant="flat" color="primary" @click="handleDeclineAll">Decline All</v-btn>
        
            <v-btn variant="flat" class="ml-2" color="primary" @click="handleAcceptAll">Accept All</v-btn>
          </template>
      </v-banner>
    </v-layout>
  </v-theme-provider>
  <!-- <div v-for="key in Object.keys(newTheme.colors)" class="d-flex align-center w-auto">
            <v-sheet width="24px" height="24px" :color="newTheme.colors[key]" border></v-sheet>
            <span class="text-overline">{{ newTheme.colors[key] }}</span>
          </div>
    <div v-else> -->
</template>

<script setup>

import { watch, provide, onMounted } from 'vue';
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

const showGdprConsent = ref(false)

onMounted(() => {
  if (!localStorage.getItem('gdprConsent')) {
    showGdprConsent.value = true
  }
})

const handleDeclineAll = () => {
  localStorage.setItem('gdprConsent', 'false')
    showGdprConsent.value = false

}

const handleAcceptAll = () => {
  localStorage.setItem('gdprConsent', 'true')
  showGdprConsent.value = false

}
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
