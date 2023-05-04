<template>
  <main class="bg-gray-900 min-h-screen py-4 md:py-10 px-2 md:px-6 text-white">
    <div class='grid'>
      <div class='mx-auto w-full lg:w-5/6 min-h-screen '>
        <button class="ml-2 mb-2" @click="() => $router.push('/')">
          <p class='text-slate-200 hover:underline text-sm md:text-md'>
            Back to Home
          </p>
        </button> 
        <div class='border rounded-xl border-slate-500 min-h-[20rem]'>
          <div class='p-4 sm:p-8 space-y-4'>
            <div v-if="pinResultLoading" class='w-full flex py-4'>
              <Spinner class='m-auto h-8 w-8 animate-spin' />
            </div>
            <div v-else-if="pinResultError" class='w-full flex py-4'>
              <p class='m-auto text-red-400'>Error to fetch pin</p>
            </div>
            <div v-else-if="(!pinResult && !pinResultLoading) || (pinResult && !pinResult.node.approved)" class='w-full flex py-4'>
              <p class='m-auto'>Pin not found.</p>
            </div>
            <div id="piece-card" v-else class='bg-slate-800 mx-auto rounded-lg sm:flex p-4'>
              <div id="piece-thumbnail" class="rounded-xl p-2 h-36 w-44 md:h-44 md:w-52 border border-slate-600 mx-auto">
                <a 
                  v-if="pinResult.node.piece.details?.imageThumbnailCID"
                  :href="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.details?.imageThumbnailCID}`" target='_blank'
                >
                  <img class="h-full w-full" :src="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.details?.imageThumbnailCID}`" alt="">
                </a>
                <div v-else class="h-full flex">
                  <v-icon name="pr-image" class="h-20 w-20 m-auto text-slate-300" />
                </div>
              </div>
              <div id="piece-card" class='p-2 w-full flex flex-col'>
                <div id="card-thumbs" class='flex w-36 mx-auto sm:place-self-end sm:mx-0 h-6 items-center justify-evenly'>
                  <div class='flex gap-2 items-center'>
                    <button @click="handleOnLike" :disabled="!walletStore.accountId || alreadyLiked">
                      <v-icon 
                        name="hi-thumb-up"
                        :class="alreadyLiked ? 'h-5 w-5 shadow-sm shadow-slate-900 text-slate-400' : 'h-5 w-5'"
                      />
                    </button>
                    <p class='text-sm select-none'>{{pinResult.node.likesCount}}</p>
                  </div>
                  <div class='flex gap-2 items-center'>
                    <button @click="handleOnDislike" :disabled="!walletStore.accountId || alreadyDisliked">
                      <v-icon 
                        name="hi-thumb-down"
                        :class="alreadyDisliked ? 'h-5 w-5 shadow-sm shadow-slate-900 text-slate-400' : 'h-5 w-5'"
                      />
                    </button>
                    <p class='text-sm select-none'>{{pinResult.node.dislikesCount}}</p>
                  </div>
                </div>
                <div id="card-content" class="h-full px-4">
                  <p class="font-bold text-lg text-center sm:text-left lg:text-xl truncate text-ellipsis my-2">{{pinResult.node.piece.name}}</p>
                  <div class="font-medium truncate text-ellipsis text-sm md: text-md flex flex-col items-center sm:items-start">
                    <p><span class="font-normal mr-1">Category:</span> {{ pinResult.node.category.name }}</p>
                    <div v-if="pinResult.node.category.name === 'Music'" class="">
                      <p v-if="pinResult.node.piece.details?.artistNames"><span class="font-normal mr-1">Artist:</span>{{ pinResult.node.piece.details?.artistNames }}</p>
                      <p v-if="pinResult.node.piece.details?.initialReleaseYear"><span class="font-normal mr-1">Release Year:</span>{{ pinResult.node.piece.details?.initialReleaseYear }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isVideo" class="w-full h-full md:p-4">
              <video class="rounded-xl" :src="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.CID}`" controls></video>
            </div>
            <div v-else-if="musicAlbum.is" class="px-18">
              <ul
              v-for="file in musicAlbum.files"
              :key="file.cid"
              >
                <li class="border border-slate-700 mb-1 px-4 py-1 flex justify-between">
                  <p>{{ file.name }}</p>
                  <button @click="() => handleOnSelectAndPlay(file)">
                    <v-icon name="hi-play" class="h-5 w-5 text-slate-200" />
                  </button>
                </li>
              </ul>
              <AudioPlayer v-if="selectedAudio" :selectedAudio="selectedAudio" :onCloseCallback="onCloseCallback" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { GET_PIN, CREATE_PIN_LIKE, CREATE_PIN_DISLIKE, GET_USER_LIKES_AND_DISLIKES } from '../utils/constants';
import getCIDContent from '../utils/getCIDContent'
import Spinner from '../components/Layout/Spinner.vue';
import AudioPlayer from '../components/AudioPlayer.vue';

import { onMounted, ref, watch } from 'vue';
import { useWalletStore } from '../stores/wallet';
const props = defineProps({
  streamID: String
})

const walletStore = useWalletStore()

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY

const { 
  load: loadPin,
  result: pinResult, 
  error: pinResultError, 
  loading: pinResultLoading, 
  refetch: refetchPin 
} = useLazyQuery(GET_PIN, {
  id: props.streamID,
  pageSize: 1000,
})

const alreadyLiked = ref(false)
const alreadyDisliked = ref(false)

const { client } = useApolloClient()

const isVideo = ref(false)
const musicAlbum = ref({
  is: false,
  files: null,
  selected: null
})
const selectedAudio = ref(null)

onMounted(() => {
  loadPin(undefined, undefined, {fetchPolicy: "network-only"})
})

watch(pinResult, async (pin) => {
  if (!pin) {
    return
  }
  

  if (pin.node.category.name === "Videos") {
    isVideo.value = true
  } else if (pin.node.category.name === "Music") {
    const files = await getCIDContent(ipfsGateway, pin.node.piece.CID)
    console.log(files);
    musicAlbum.value.is = true
    musicAlbum.value.files = files
  }


})

const getUserLikesAndDislikes = async (variables) => {
  return await client.query({
    query: GET_USER_LIKES_AND_DISLIKES,
    variables: {
      id: walletStore.accountId,
      pageSize: 1000,
      ...variables
    },
    fetchPolicy: 'no-cache'
  })
}

const { mutate: createPinLike } = useMutation(CREATE_PIN_LIKE);
const { mutate: createPinDislike } = useMutation(CREATE_PIN_DISLIKE);

watch(() => [walletStore.accountId, pinResult.value], async ([accountId]) => {
  if (!accountId) {
    alreadyLiked.value = false
    alreadyDisliked.value = false
    return
  }

  const result = await getUserLikesAndDislikes()
  for (const like of result.data.node.pinLikes.edges) {
    if (like.node.pinID === props.streamID) {
      alreadyLiked.value = true;
    }
  }

  for (const dislike of result.data.node.pinDislikes.edges) {
    if (dislike.node.pinID === props.streamID) {
      alreadyDisliked.value = true;
    }
  }
})

const handleOnLike = async () => {
  await createPinLike({
    input: {
      content: {
        ownerID: walletStore.accountId,
        pinID: pinResult.value.node.id,
        categoryID: pinResult.value.node.category.id
      }
    }
  })
  await refetchPin()
}
const handleOnDislike = async () => {
  await createPinDislike({
    input: {
      content: {
        ownerID: walletStore.accountId,
        pinID: pinResult.value.node.id,
        categoryID: pinResult.value.node.category.id
      }
    }
  })
  await refetchPin()
}

// Audio logic
const handleOnSelectAndPlay = (file) => {
  selectedAudio.value = { name: file.name, cid: file.cid }
}

const onCloseCallback = () => {
  selectedAudio.value = null;
}
</script>

<style scoped>
</style>