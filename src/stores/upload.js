import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import checkCID from '../utils/checkCID';
import getCIDContent from '../utils/getCIDContent';
import getFileType from '../utils/getFileType';

const detailsDefault = {
  imageThumbnailCID: ref(undefined),
  tags: ref(undefined),
  musicBrainzID: ref(undefined),
  albumTitle: ref(undefined),
  initialReleaseYear: ref(undefined),
  releaseType: ref(undefined),
  format: ref(undefined),
  bitrate: ref(undefined),
  media: ref(undefined),
  releaseDescription: ref(undefined),
  poster: ref(undefined),
  TMDBID: ref(undefined),
  IMDBID: ref(undefined),
  type: ref(undefined),
};

export const useUploadStore = defineStore('upload', () => {
  const name = ref(null);
  const CID = ref(null);
  const category = ref(null);
  const artist = ref(null);
  const details = ref(detailsDefault);

  const isValidCID = computed(() => {
    if (!CID.value) {
      return false
    }
    return checkCID(CID.value);
  });

  const thumbnailIsValidCID = computed(() => {
    if (!details.value.imageThumbnailCID) {
      return false
    }
    return checkCID(details.value.imageThumbnailCID);
  });

  const checkingContent = ref(false)

  const contentIsValid = ref(false)
  const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;
  watch(() => [category.value, CID.value], async ([_category, _CID]) => {
    if (!_CID || !_category) {
      return;
    }
    console.log('_category', _category);
    try { 
      checkingContent.value = true
      if (_category === "Music") {
        const files = await getCIDContent(ipfsGateway, _CID)
        
        let someoneInvalid = false
        for (let index = 0; index < files.length; index++) {
          const type = await getFileType(ipfsGateway, files[index].cid)

          if (!type.startsWith("audio")) {
            someoneInvalid = true
            break
          }
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        if(!someoneInvalid) {
          contentIsValid.value = true 
        }

      } else if (_category === "Videos") {
        const type = await getFileType(ipfsGateway, _CID)
        if (type.startsWith("video")) {
          contentIsValid.value = true
        }
      } else {
        contentIsValid.value = true
      }
      checkingContent.value = false
    } catch (error) {
      contentIsValid.value = false
      checkingContent.value = false
      console.log(error);
    }

  })

  
  const isLoading = ref(false);
  const isError = ref(false);
  const isSuccess = ref(false);

  const reset = () => {
    name.value = null;
    CID.value = null;
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
    CID,
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
    resetDetails
   }
})
