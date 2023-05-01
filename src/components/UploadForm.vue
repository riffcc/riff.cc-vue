<template>
  <p class="text-sm mb-1 ml-1">Name:</p>
  <input 
    placeholder="Nyan Cat Meme" 
    name="name" 
    type="text" 
    class="form-input bg-slate-800 mb-4 h-9 px-1.5"
    v-model="uploadStore.name" 
  />
  <p class="text-sm mb-1 ml-1">IPFS CID:</p>
  <div class="relative">
    <input 
      placeholder="bafkreico2zlmcinytg2ri26o4mt73i25ikisd3vth6p4du5gcpek4fsace" 
      name="cid" 
      type="text"
      class="form-input  w-full bg-slate-800 mb-4 h-9 px-1.5" 
      v-model="uploadStore.CID" 
    />
    <p 
      class="absolute text-xs text-red-400 -bottom-1"
      v-if="uploadStore.CID && uploadStore.CID.length > 0 && !uploadStore.isValidCID"
    >
      Please enter a valid CIDv0 or CIDv1 ID.
    </p>
  </div>
  <p class="text-sm mb-1 ml-1">Category:</p>
  <select class="form-select bg-slate-800 mb-4 h-9 px-1.5" v-model="uploadStore.category">
    <option disabled hidden value="null">Select a category</option>
    <option v-for="category in pinCategories" :key="category" :value="category">
      {{ category }}
    </option>
  </select>
  <button
    class="py-1.5 px-3 border border-slate-400 rounded mb-4 disabled:text-slate-400"
    @click="openAdvanced"
    :disabled="!(uploadStore.category === 'Music' || uploadStore.category === 'Movies')"
  >
    Advanced
  </button>
  <div v-if="advancedIsOpen" class="absolute inset-0 z-10 flex h-full">
    <div class="bg-gray-900 w-[25rem] h-full rounded-lg relative">
      <button class="absolute right-6 top-4 text-slate-50 font-bold" @click="closeAdvanced">x</button>
      <div class="pt-12 pb-8 px-4 h-5/6">
        <p class="text-sm mb-2 text-center">Please fill out any extra information about the content that might be useful.</p>
        <div v-if="uploadStore.category === 'Music'" class="grid py-4 h-full overflow-y-auto">
          <Label 
            :title="'Image/thumbnail IPFS CID:'"
            :info-icon="true"
            :content="'A thumbnail for the music, specified as an IPFS CID.'"
          />
          <input
            placeholder="QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"
            name="image-thumbnail-cid"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.imageThumbnailCID"
          />
          <Label 
            :title="'Tags:'"
            :info-icon="true"
            :content="'Any tags you feel are appropriate for the media - such as rock, country, or pop.'"
          />
          <input
            placeholder="Values separatted with ','"
            name="tags"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.tags"
          />
          <Label 
            :title="'MusicBrainz ID:'"
            :info-icon="true"
            :content="'If the content has an entry on MusicBrainz, enter it here to pre-fill the rest of this form.'"
          />
          <input
            placeholder=""
            name="music-brainz-id"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.musicBrainzID"
          />
          <Label :title="'Artist name(s):'" />
          <input
            placeholder="Values separatted with ','"
            name="artist-names"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.artistNames"
          />
          <Label :title="'Album title:'" />
          <input
            placeholder=""
            name="album-title"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.albumTitle"
          />
          <Label :title="'Initial release year:'" />
          <input
            placeholder=""
            name="initial-release-year"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.initialReleaseYear"
          />
          <Label :title="'Release type:'" />
          <select class="form-select bg-slate-800 mb-4 h-9 px-1.5" v-model="uploadStore.details.releaseType">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="releaseType in releaseTypesOptions" :key="releaseType" :value="releaseType">
              {{ releaseType }}
            </option>
          </select>
          <Label :title="'Format:'" />
          <select class="form-select bg-slate-800 mb-4 h-9 px-1.5" v-model="uploadStore.details.format">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="format in formatOptions" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
          <Label :title="'Bitrate:'" />
          <input
            placeholder=""
            name="bitrate"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.bitrate"
          />
          <Label :title="'Media:'" />
          <select class="form-select bg-slate-800 mb-4 h-9 px-1.5" v-model="uploadStore.details.media">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="media in mediaOptions" :key="media" :value="media">
              {{ media }}
            </option>
          </select>
          <Label :title="'Release description:'" />
          <input
            placeholder=""
            name="release-description"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.releaseDescription"
          />
        </div>
        <div v-if="uploadStore.category === 'Movies'" class="grid py-4 h-full overflow-y-auto">
          <Label 
            :title="'Image/thumbnail IPFS CID:'"
            :info-icon="true"
            :content="'A thumbnail for the music, specified as an IPFS CID.'"
          />
          <input
            placeholder="QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"
            name="image-thumbnail-cid"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.imageThumbnailCID"
          />
          <Label :title="'Poster:'" />
          <input
            placeholder=""
            name="poster"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.poster"
          />
          <Label :title="'TMDB ID:'" />
          <input
            placeholder=""
            name="tmbd-id"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.TMDBID"
          />
          <Label :title="'IMDB ID:'" />
          <input
            placeholder=""
            name="imbd-id"
            type="text"
            class="form-input bg-slate-800 mb-4 h-9 px-1.5"
            v-model="uploadStore.details.IMDBID"
          />
          <Label :title="'Type:'" />
          <select class="form-select bg-slate-800 mb-4 h-9 px-1.5" v-model="uploadStore.details.type">
            <option disabled hidden value="undefined">Select a option</option>
            <option v-for="movieType in movieTypeOptions" :key="movieType" :value="movieType">
              {{ movieType }}
            </option>
          </select>
        </div>
        <button @click="closeAdvanced" class="bg-cyan-500 px-4 py-2 w-full rounded mt-2">
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
} from '../utils/constants';
import { useUploadStore } from '../stores/upload';
import Label from '../components/Layout/Label.vue';

const uploadStore = useUploadStore();

const advancedIsOpen = ref(false)
const openAdvanced = () => advancedIsOpen.value = true;
const closeAdvanced = () => advancedIsOpen.value = false;
</script>