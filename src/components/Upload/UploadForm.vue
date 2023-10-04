<template>
  <v-form validate-on="submit lazy" @submit.prevent="handleOnSubmit">
    <v-text-field v-model="uploadStore.name" label="Name" :rules="[rules.required]"></v-text-field>
    <v-file-input label="Files" multiple @update:modelValue="handleFileChange"
      accept="image/*,audio/*,video/*"></v-file-input>
    <p class="text-subtitle-2 text-center mb-2">or type a valid CID content:</p>
    <v-text-field v-model="uploadStore.contentCid" label="CID Content" :rules="[rules.isValidContent]"
      :disabled="uploadStore.inputHasFiles"></v-text-field>
    <v-text-field v-model="uploadStore.thumnbailCid" label="CID Thumbnail"
      :rules="[rules.required, rules.isValidCid]"></v-text-field>
    <v-select :items="pinCategories" v-model="uploadStore.category" :rules="[rules.required]" label="Category"></v-select>
    <v-btn rounded="0" @click="openAdvanced" text="Advanced" variant="outlined" class="mb-4" block :disabled="advancedDisabled"></v-btn>
    <v-btn rounded="0" v-if="walletStore.formattedAddress" :loading="uploadStore.isLoading" color="primary" type="submit" block  text="Submit"></v-btn>
    <Connect block="true" v-else />

  </v-form>
  <v-dialog v-model="showAdvanced" width="auto">
    <v-sheet width="400px" max-height="620px" class="pa-8 ma-auto">
      <p class="text-subtitle mb-2 text-center">Please fill out any extra information about the content that might be
        useful.
      </p>
      <template v-if="uploadStore.category === 'Music'">
        <v-text-field label="Tags" placeholder="Values sepatared by comma" v-model="uploadStore.details.tags">
          <template v-slot:append-inner>
            <IconTooltip icon="fas fa-circle-question"
              content="Any tags you feel are appropriate for the media - such as rock, country, or pop." />
          </template>
        </v-text-field>
        <v-text-field label="MusicBrainz ID" v-model="uploadStore.details.musicBrainzID">
          <template v-slot:append-inner>
            <IconTooltip icon="fas fa-circle-question"
              content="If the content has an entry on MusicBrainz, enter it here to pre-fill the rest of this form." />
          </template>
        </v-text-field>
        <v-text-field label="Artist name(s)" placeholder="Values sepatared by comma"
          v-model="uploadStore.artits"></v-text-field>
        <v-text-field label="Album title" v-model="uploadStore.details.albumTitle"></v-text-field>
        <v-text-field label="Initial release year" v-model="uploadStore.details.initialReleaseYear"></v-text-field>
        <v-select :items="releaseTypesOptions" v-model="uploadStore.details.releaseType" label="Release type"></v-select>
        <v-select :items="formatOptions" v-model="uploadStore.details.format" label="Format"></v-select>
        <v-text-field label="Bitrate" v-model="uploadStore.details.bitrate"></v-text-field>
        <v-select :items="mediaOptions" v-model="uploadStore.details.media" label="Media"></v-select>
        <v-text-field label="Release description" v-model="uploadStore.details.releaseDescription"></v-text-field>
      </template>
      <template v-if="uploadStore.category === 'Videos'">
        <v-text-field label="Poster" v-model="uploadStore.details.poster"></v-text-field>
        <v-text-field label="TMDB ID" v-model="uploadStore.details.TMDBID"></v-text-field>
        <v-text-field label="IMDB ID" v-model="uploadStore.details.IMDBID"></v-text-field>
        <v-select :items="movieTypeOptions" v-model="uploadStore.details.type" label="Media"></v-select>
      </template>
      <v-btn @click="closeAdvanced" rounded="0" text="Save" color="primary" block></v-btn>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  pinCategories,
  releaseTypesOptions,
  formatOptions,
  mediaOptions,
  movieTypeOptions,
} from '@config/constants';
import { useUploadStore } from '@stores/upload';
import { useWalletStore } from '@stores/wallet';
import { IconTooltip, Connect } from '@components'
import { checkCID } from '@utils'
defineProps({
  handleFileChange: Function,
  handleOnSubmit: Function

})
const walletStore = useWalletStore()
const uploadStore = useUploadStore()
const advancedDisabled = computed(() => {
  return !(uploadStore.category === "Music" || uploadStore.category === "Videos")
})

const rules = {
  required: value => !!value || 'Required field.',
  isValidContent: value => uploadStore.inputHasFiles ? true : checkCID(value) || 'Please enter a valid CID or upload your files',
  isValidCid: value => checkCID(value) || 'Please enter a valid CID.',
}

const showAdvanced = ref(false)
const openAdvanced = () => showAdvanced.value = true;
const closeAdvanced = () => showAdvanced.value = false;
</script>