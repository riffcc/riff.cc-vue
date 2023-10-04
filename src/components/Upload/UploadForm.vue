<template>
  <label class="text-sm mb-1 ml-1">Name:</label>
  <input name="name" type="text" class="form-input bg-background-secondary mb-4"
    v-model="uploadStore.name" />
  <label class="text-sm mb-1 ml-1">CID content:</label>
  <div>
    <p class="text-xs text-center mb-2">upload your files:</p>
    <div class="w-full mb-2 flex">
      <input type="file" ref="inputRef" @change="handleFileChange" multiple class="hidden" accept="image/*,audio/*,video/*" />
      <button class="bg-primary mx-auto flex-1 active:bg-purple-800 py-1" @click="() => inputRef.click()">
        <v-icon name="hi-folder-add" class="w-6 h-6"/>
      </button>
      <div class="flex-1 border border-slate-600 flex">
        <p class="m-auto text-xs">{{ inputRef?.files?.length ?? 'No' }} files selected</p>
        </div>
    </div>
    <p class="text-xs text-center mb-2">or type a valid CID content:</p>
    <input name="cid" type="text" :disabled="uploadStore.inputHasFiles"
      class="form-input w-full bg-background-secondary mb-2" v-model="uploadStore.contentCid" />
    <p v-if="uploadStore.contentCid && !uploadStore.isValidCID"
      class="text-xs text-red-400 text-center w-full">
      Please enter a valid CIDv0 or CIDv1 ID.
    </p>
  </div>
  <label class="text-sm mb-1 ml-1">CID thumbnail:</label>
  <div>
    <input name="cid" type="text"
      class="form-input w-full bg-background-secondary mb-2" v-model="uploadStore.details.thumbnailCid" />
    <p class="text-xs text-red-400 text-center w-full"
      v-if="uploadStore.details.thumbnailCid && !uploadStore.thumbnailIsValidCID">
      Please enter a valid CIDv0 or CIDv1 ID.
    </p>
  </div>
  <label class="text-sm mb-1 ml-1">Category:</label>
  <select class="form-select bg-background-secondary mb-5" v-model="uploadStore.category">
    <option disabled hidden value="null">Select a category</option>
    <option v-for="category in pinCategories" :key="category" :value="category" class="">
      {{ category }}
    </option>
  </select>
  <button class="px-3 py-2 border border-slate-400 mb-4 disabled:text-slate-400" @click="openAdvanced"
    :disabled="!(uploadStore.category === 'Music' || uploadStore.category === 'Movies')">
    Advanced
  </button>
  <div v-if="advancedIsOpen" class="absolute inset-0 z-10 flex h-full">
    <div class="bg-background w-[25rem] h-full relative">
      <button class="absolute right-6 top-4 text-slate-50 font-bold" @click="closeAdvanced">x</button>
      <div class="pt-12 pb-8 px-4 flex flex-col justify-between h-full">
        <p class="text-sm mb-2 text-center">Please fill out any extra information about the content that might be useful.
        </p>
        <div v-if="uploadStore.category === 'Music'" class="grid py-4 h-4/6 overflow-y-auto">
          <Label :title="'Tags:'" :info-icon="true"
            :content="'Any tags you feel are appropriate for the media - such as rock, country, or pop.'" />
          <input placeholder="Values separatted with ','" name="tags" type="text"
            class="form-input bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.tags" />
          <Label :title="'MusicBrainz ID:'" :info-icon="true"
            :content="'If the content has an entry on MusicBrainz, enter it here to pre-fill the rest of this form.'" />
          <input placeholder="" name="music-brainz-id" type="text"
            class="form-input bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.musicBrainzID" />
          <Label :title="'Artist name(s):'" />
          <input placeholder="Values separatted with ','" name="artist-names" type="text"
            class="form-input bg-background-secondary mb-4 mr-1" v-model="uploadStore.artist" />
          <Label :title="'Album title:'" />
          <input placeholder="" name="album-title" type="text" class="form-input bg-background-secondary mb-4 mr-1"
            v-model="uploadStore.details.albumTitle" />
          <Label :title="'Initial release year:'" />
          <input placeholder="" name="initial-release-year" type="text"
            class="form-input bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.initialReleaseYear" />
          <Label :title="'Release type:'" />
          <select class="form-select bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.releaseType">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="releaseType in releaseTypesOptions" :key="releaseType" :value="releaseType">
              {{ releaseType }}
            </option>
          </select>
          <Label :title="'Format:'" />
          <select class="form-select bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.format">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="format in formatOptions" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
          <Label :title="'Bitrate:'" />
          <input placeholder="" name="bitrate" type="text" class="form-input bg-background-secondary mb-4 mr-1"
            v-model="uploadStore.details.bitrate" />
          <Label :title="'Media:'" />
          <select class="form-select bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.media">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="media in mediaOptions" :key="media" :value="media">
              {{ media }}
            </option>
          </select>
          <Label :title="'Release description:'" />
          <input placeholder="" name="release-description" type="text"
            class="form-input bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.releaseDescription" />
        </div>
        <div v-if="uploadStore.category === 'Movies'" class="grid py-4 h-4/6 overflow-y-auto">
          <Label :title="'Poster:'" />
          <input placeholder="" name="poster" type="text" class="form-input bg-background-secondary mb-4 mr-1"
            v-model="uploadStore.details.poster" />
          <Label :title="'TMDB ID:'" />
          <input placeholder="" name="tmbd-id" type="text" class="form-input bg-background-secondary mb-4 mr-1"
            v-model="uploadStore.details.TMDBID" />
          <Label :title="'IMDB ID:'" />
          <input placeholder="" name="imbd-id" type="text" class="form-input bg-background-secondary mb-4 mr-1"
            v-model="uploadStore.details.IMDBID" />
          <Label :title="'Type:'" />
          <select class="form-select bg-background-secondary mb-4 mr-1" v-model="uploadStore.details.type">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="movieType in movieTypeOptions" :key="movieType" :value="movieType">
              {{ movieType }}
            </option>
          </select>
        </div>
        <button @click="closeAdvanced" class="bg-primary px-4 py-2 w-full mt-2">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  pinCategories,
  releaseTypesOptions,
  formatOptions,
  mediaOptions,
  movieTypeOptions,
} from '../../config/constants';
import Label from '../Layout/Label.vue';
import { useUploadStore } from '../../stores/upload';
defineProps({
  handleFileChange: Function
})

const inputRef = ref(null)
const uploadStore = useUploadStore()

const advancedIsOpen = ref(false)
const openAdvanced = () => advancedIsOpen.value = true;
const closeAdvanced = () => advancedIsOpen.value = false;
</script>