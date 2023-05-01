import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import checkCID from '../utils/checkCID';

const detailsDefault = {
  imageThumbnailCID: undefined,
  tags: undefined,
  musicBrainzID: undefined,
  artistNames: undefined,
  albumTitle: undefined,
  initialReleaseYear: undefined,
  releaseType: undefined,
  format: undefined,
  bitrate: undefined,
  media: undefined,
  releaseDescription: undefined,
  poster: undefined,
  TMDBID: undefined,
  IMDBID: undefined,
  type: undefined,
};

export const useUploadStore = defineStore('upload', () => {
  const name = ref(null);
  const CID = ref(null);
  const category = ref(null);
  const details = ref(detailsDefault);

  const isValidCID = computed(() => {
    if (!CID.value) {
      return false
    }
    return checkCID(CID.value);
  });
  
  const isLoading = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);

  const reset = () => {
    name.value = null;
    CID.value = null;
    category.value = null;
    details.value = detailsDefault
  }

  const resetDetails = () => {
    name.value = null;
    CID.value = null;
    category.value = null;
    details.value = detailsDefault
  }

  return { 
    name,
    CID,
    category,
    details,
    isValidCID,
    isLoading,
    isError,
    isSuccess,
    reset,
    resetDetails
   }
})
