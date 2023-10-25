import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { checkCID } from '@utils';

const detailsDefault = {
  thumbnailCid: ref(null),
  tags: ref(null),
  musicBrainzID: ref(null),
  albumTitle: ref(null),
  initialReleaseYear: ref(null),
  releaseType: ref(null),
  format: ref(null),
  bitrate: ref(null),
  media: ref(null),
  releaseDescription: ref(null),
  poster: ref(null),
  TMDBID: ref(null),
  IMDBID: ref(null),
  type: ref(null),
};

export const useUploadStore = defineStore('upload', () => {

  const name = ref(null);
  const contentCid = ref(null);
  const category = ref(null);
  const artist = ref(null);
  const details = ref(detailsDefault);

  const inputHasFiles = ref(false)

  const thumbnailIsValidCID = computed(() => {
    if (!details.value.thumbnailCid) {
      return false
    }
    return checkCID(details.value.thumbnailCid);
  });

  const isValidCID = computed(() => {
    if (!contentCid.value) {
      return false
    }
    return checkCID(contentCid.value);
  });

  const checkingContent = ref(false)
  const contentIsValid = ref(false)

  const isLoading = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);

  const reset = () => {
    name.value = null;
    contentCid.value = null;
    category.value = null;
    artist.value = null;

    for (const key of Object.keys(detailsDefault)) {
      detailsDefault[key].value = undefined
    }
    details.value = detailsDefault
  }

  const resetDetails = () => {
    name.value = null;
    category.value = null;
    details.value = detailsDefault
  }

  return {
    name,
    contentCid,
    category,
    artist,
    details,
    isValidCID,
    thumbnailIsValidCID,
    checkingContent,
    contentIsValid,
    isLoading,
    isError,
    isSuccess,
    reset,
    resetDetails,
    inputHasFiles
  }
})
