import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import checkCID from '../utils/checkCID';
import getCIDContent from '../utils/getCIDContent';
import getFileType from '../utils/getFileType';
import uploadToIPFS from '../utils/uploadToIPFS';

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
  const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY;



  // watch(() => [category.value, contentCid.value], async ([_category, _CID]) => {
  //   if (!_CID || !_category) {
  //     return;
  //   }
  //   console.log('_category', _category);
  //   try { 
  //     checkingContent.value = true
  //     if (_category === "Music") {
  //       const files = await getCIDContent(_CID)
  //       console.log('files', files)
  //       let someoneInvalid = false
  //       for (let index = 0; index < files.length; index++) {
  //         const type = await getFileType(ipfsGateway, files[index].cid)
  //         console.log('type', type)
  //         // if (!type.startsWith("audio")) {
  //         //   someoneInvalid = true
  //         //   break
  //         // }
  //         await new Promise(resolve => setTimeout(resolve, 500))
  //       }

  //       if(!someoneInvalid) {
  //         contentIsValid.value = true 
  //       }

  //     } else if (_category === "Videos") {
  //       const type = await getFileType(ipfsGateway, _CID)
  //       if (type.startsWith("video")) {
  //         contentIsValid.value = true
  //       }
  //     } else {
  //       contentIsValid.value = true
  //     }
  //   } catch (error) {
  //     contentIsValid.value = false
  //     checkingContent.value = false
  //     console.log(error);
  //   }

  // })

  
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
