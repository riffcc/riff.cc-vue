<template>
  <v-footer class="bg-background-darken-2" position="relative">
    <v-container class="fill-height" fluid>
      <v-row class="px-2 px-sm-6 px-md-16">
        <v-col cols="12" md="3">
          <v-sheet height="320px" class="d-flex flex-column justify-space-around py-10">
            <v-img height="90px" inline width="90px"
              :src="`https://${IPFS_GATEWAY}/ipfs/${settingsStore.siteImage}`"></v-img>
            <v-list-item :subtitle="settingsStore.siteDescription" class="pa-0"></v-list-item>
            <div class="w-50 d-flex justify-space-around">
              <v-icon icon="fab fa-facebook-f" size="x-small"></v-icon>
              <v-icon icon="fab fa-instagram" size="x-small"></v-icon>
              <v-icon icon="fab fa-skype" size="x-small"></v-icon>
              <v-icon icon="fab fa-twitter" size="x-small"></v-icon>

            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="6">
          <v-sheet height="320px" class="pt-16">
            <v-list class="mx-auto" max-width="200px">
              <v-list-title>
                <p class="text-h5 font-weight-bold mb-2">About</p>
              </v-list-title>
              <v-list-item v-for="item in listItems.about" :subtitle="item" @click="$route.push(`/${item}`)" class="pa-0" min-height="25px">
                <template v-slot:prepend>
                  <div class="pr-2 d-flex pb-1">
                    <v-icon icon="fas fa-circle" size="7px" color="primary"></v-icon>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
  <v-sheet color="primary" height="64px" class="d-flex align-center justify-center">
    <p class="text-subtitle-2">Copyright 2023 Company All Rights Reserved.</p>
  </v-sheet>
</template>

<script setup>
import { useSettingsStore } from "@stores/settings"
import { IPFS_GATEWAY } from '@/config/constants'


const settingsStore = useSettingsStore()
const listItems = {
  about: [
    'Privacy Policy',
    'About the Riff.CC Project',
    'Contact Us'
  ]
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Hace el desplazamiento suave
  });
};
</script>
