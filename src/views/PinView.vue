<template>
  <main class="bg-background py-8 px-4 md:px-8 lg:px-24 text-white">
    <div class='bg-background-secondary min-h-screen flex'>
      <Spinner v-if="pinResultLoading" class='m-auto h-10 w-10 animate-spin' />
      <h4 v-else-if="pinResultError" class='m-auto text-red-400'>Error to fetch pin.</h4>
      <h4 class='m-auto' v-else-if="(!pinResult && !pinResultLoading) || (pinResult && !pinResult.node.approved)">Pin not
        found.</h4>
      <PinIndex v-else :pinResult="pinResult" :handleOnLike="handleOnLike" :handleOnDislike="handleOnDislike"/>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useApolloClient, useLazyQuery, useMutation } from '@vue/apollo-composable';
import { GET_PIN, CREATE_PIN_LIKE, CREATE_PIN_DISLIKE } from '../config/constants';
import { useWalletStore } from '../stores/wallet';
import { useRoute } from 'vue-router';

import Spinner from '../components/Layout/Spinner.vue';
import PinIndex from '../components/Pin/PinIndex.vue'

const props = defineProps({
  streamID: {
    required: true,
    type: String
  }
})


const route = useRoute()

watch(() => route.params, (params) => {
  refetchPin({ id: params.streamID, pageSize: 1000 })
})

const walletStore = useWalletStore()

const {
  load: loadPin,
  result: pinResult,
  error: pinResultError,
  loading: pinResultLoading,
  refetch: refetchPin
} = useLazyQuery(GET_PIN, {
  id: props.streamID,
  pageSize: 1000,
}, {
  fetchPolicy: "network-only"
})

const alreadyLiked = ref(false)
const alreadyDisliked = ref(false)

const { client } = useApolloClient()


onMounted(() => {
  loadPin(undefined, undefined, { fetchPolicy: "network-only" })
})

// const getUserLikesAndDislikes = async (variables) => {
//   return await client.query({
//     query: GET_USER_LIKES_AND_DISLIKES,
//     variables: {
//       id: walletStore.accountId,
//       pageSize: 1000,
//       ...variables
//     },
//     fetchPolicy: 'no-cache'
//   })
// }

const { mutate: createPinLike } = useMutation(CREATE_PIN_LIKE);
const { mutate: createPinDislike } = useMutation(CREATE_PIN_DISLIKE);

watch(() => [walletStore.accountId, pinResult.value], async ([accountId]) => {
  if (!accountId) {
    alreadyLiked.value = false
    alreadyDisliked.value = false
    return
  }

  // const result = await getUserLikesAndDislikes()
  // for (const like of result.data.node.pinLikes.edges) {
  //   if (like.node.pinID === props.streamID) {
  //     alreadyLiked.value = true;
  //   }
  // }

  // for (const dislike of result.data.node.pinDislikes.edges) {
  //   if (dislike.node.pinID === props.streamID) {
  //     alreadyDisliked.value = true;
  //   }
  // }
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

<style scoped></style>