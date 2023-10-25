<template>
  <v-container>
    <v-sheet min-height="75vh" class="px-sm-6">
      <v-container class="fill-height">
        <v-row align="center" justify="center" justify-md="start">
          <v-col cols="12" md="4" class="">
            <v-sheet class="d-flex mx-auto" max-width="240px">
              <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" min-width="240px" cover
                aspect-ratio="1"></v-img>
            </v-sheet>
          </v-col>
          <v-col md="7" lg="6" class="">
            <v-sheet color="transparent" class="my-10 d-flex flex-column align-center align-md-start" max-height="240px">
              <p class="text-h5 text-lg-h4 mb-3"> This Month’s Record Breaking Albums !</p>
              <p class="text-subtitle-2 text-medium-emphasis mb-3" style="line-height: 1.1em;">Dream your moments,
                Until
                I Met You, Gimme Some Courage, Dark Alley, One More Of A Stranger, Endless Things, The Heartbeat
                Stops,
                Walking Promises, Desired Games and many more..
              </p>
              <p class="text-subtitle-2 text-medium-emphasis" style="line-height: 1em;"> Album Adam McHeffey 2009</p>
              <p class="text-subtitle-2 text-medium-emphasis">12 songs 43 Minutes</p>
              <div class="d-flex mt-6 align-center">
                <v-btn color="primary" rounded="0" prepend-icon="fas fa-play" class="text-none mr-4"
                  text="Play Now"></v-btn>
                <v-btn color="transparent" border rounded="0" prepend-icon="fas fa-square-plus" class="text-none"
                  text="Add to Library"></v-btn>
                <v-btn icon>
                  <v-icon icon="fas fa-ellipsis-vertical"></v-icon>
                </v-btn>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <Playlist :handlePlay="handlePlay" :musicAlbum="musicAlbum" />
    </v-sheet>

  </v-container>
  <AudioPlayer v-if="selectedAudio" :selectedAudio="selectedAudio" :onCloseCallback="onCloseCallback"
    :handleNext="handleNext" :handlePrevious="handlePrevious" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable';
import { GET_PIN, CREATE_PIN_LIKE, CREATE_PIN_DISLIKE, IPFS_GATEWAY } from '@/config/constants';
import { getCIDContent } from '@utils';

import { useWalletStore } from '@stores/wallet';
import { useSettingsStore } from '@stores/settings';

import { Playlist, AudioPlayer } from '@components';

const props = defineProps({
  streamID: {
    required: true,
    type: String
  }
})
const showAudioPlayer = ref(true)


const route = useRoute()

watch(() => route.params, (params) => {
  refetchPin({ id: params.streamID, pageSize: 1000 })
})

const walletStore = useWalletStore()

const {
  result: pinResult,
  error: pinResultError,
  loading: pinResultLoading,
  refetch: refetchPin,
  onResult
} = useQuery(GET_PIN, {
  id: props.streamID,
  pageSize: 1000,
}, {
  fetchPolicy: "network-only"
})

const alreadyLiked = ref(false)
const alreadyDisliked = ref(false)

const { client } = useApolloClient()


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

onResult((v) => {
  console.log('v from onresult', v)
  musicAlbum.value.files = undefined
  musicAlbum.value.index = 0
  musicAlbum.value.selected = undefined
  musicAlbum.value.is = false


  if (!v.data.node) {
    return
  }
  if (v.data.node.category.name === "Movies" || v.data.node.category.name === "Videos") {
    isVideo.value = true
    videoSource.value = {
      name: v.data.node.piece.name,
      cid: v.data.node.piece.contentCid
    }
  } else if (v.data.node.category.name === "Music") {
    getCIDContent(v.data.node.piece.contentCid)
      .then(files => {
        console.log('files from then', files)
        musicAlbum.value.is = true
        musicAlbum.value.files = files
        musicAlbum.value.index = 0
        if (walletStore.accountId && settingsStore.autoplay) {
          console.log('autoplay!')
          // handleOnSelectAndPlay(musicAlbum.value.index)
        }
      })

  }

})

const isVideo = ref(false)
const musicAlbum = ref({
  is: false,
  files: null,
  selected: null,
  index: null
})


const selectedAudio = ref(null)
const videoSource = ref(null)

const handleOnSelectAndPlay = (index) => {
  selectedAudio.value = { name: musicAlbum.value.files[index].name, cid: musicAlbum.value.files[index].cid }
}

const settingsStore = useSettingsStore()

// onMounted(() => {


// })


const handlePrevious = () => {
  musicAlbum.value.index = musicAlbum.value.index - 1
  if (musicAlbum.value.index < 0) {
    musicAlbum.value.index = 0
    return
  }
  handleOnSelectAndPlay(musicAlbum.value.index)
}

const handleNext = () => {
  musicAlbum.value.index = musicAlbum.value.index + 1
  if ((musicAlbum.value.files.length - 1) < musicAlbum.value.index) {
    musicAlbum.value.index = 0
  }
  handleOnSelectAndPlay(musicAlbum.value.index)
}

const handlePlay = (i) => {
  musicAlbum.value.index = i
  handleOnSelectAndPlay(i)
}

const onCloseCallback = () => {
  selectedAudio.value = null;
}
</script>

<style scoped></style>