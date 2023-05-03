<template>
  <main class="bg-gray-900 min-h-screen p-10 text-white">
    <div class='grid'>
      <div class='mx-auto w-full md:w-5/6 min-h-screen '>
        <div class='border rounded-xl border-slate-500 min-h-[20rem]'>
          <div class='px-4 sm:px-8 lg:px-10 py-6 space-y-4'>
            <button class="-ml-2" @click="() => $router.push('/')">
              <p class='text-slate-200 hover:underline'>
                Back to Home
              </p>
            </button> 
            <div v-if="pinResultLoading" class='w-full flex py-4'>
              <Spinner class='m-auto h-8 w-8 animate-spin' />
            </div>
            <div v-else-if="pinResultError" class='w-full flex py-4'>
              <p class='m-auto text-red-400'>Error to fetch pin</p>
            </div>
            <div v-else-if="(!pinResult && !pinResultLoading) || (pinResult && !pinResult.node.approved)" class='w-full flex py-4'>
              <p class='m-auto'>Pin not found.</p>
            </div>
            <div v-else class='flex gap-1 w-full xl:w-5/6 bg-slate-800 mx-auto rounded-lg'>
              <a :href="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.CID}`" target='_blank'>
                <div class="rounded-xl p-2 h-36 w-36 md:h-44 md:w-44 relative mx-auto bg-gradient-to-b from-slate-700 to-slate-600">
                  <img class="h-full w-full" :src="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.CID}`" alt="">
                </div>
              </a>
              <div class='p-2 w-full flex flex-col'>
                <div class='flex w-48 place-self-end h-6 items-center justify-evenly'>
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
                <p class="font-bold text-lg lg:text-xl truncate text-ellipsis ml-2">{{pinResult.node.piece.name}}</p>
                <p class="font-medium truncate text-ellipsis ml-2">{{pinResult.node.category.name}}</p>
                <p class="font-medium truncate text-ellipsis ml-2">{{pinResult.node.piece.details?.artistNames}}</p>
                <p class="font-medium truncate text-ellipsis ml-2">{{pinResult.node.piece.details?.initialReleaseYear}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useApolloClient, useMutation, useQuery } from '@vue/apollo-composable';
import { GET_PIN, CREATE_PIN_LIKE, CREATE_PIN_DISLIKE, GET_USER_LIKES_AND_DISLIKES } from '../utils/constants';
import Spinner from '../components/Layout/Spinner.vue';
import { onMounted, ref, watch } from 'vue';
import { useWalletStore } from '../stores/wallet';
const props = defineProps({
  streamID: String
})

const walletStore = useWalletStore()

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY

const { result: pinResult, error: pinResultError, loading: pinResultLoading, refetch: refetchPin } = useQuery(GET_PIN, {
  id: props.streamID,
  pageSize: 1000
})

const alreadyLiked = ref(false)
const alreadyDisliked = ref(false)

const { client } = useApolloClient()

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

watch(() => [walletStore.accountId, pinResult.value], async (accountId) => {
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

onMounted(async () => {
  if (walletStore.address) {
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
</script>