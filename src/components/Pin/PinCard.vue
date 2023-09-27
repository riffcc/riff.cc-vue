<template>
  <div id="piece-card" class='flex flex-col md:flex-row p-10 min-h-80 gap-16'>
    <div id="piece-thumbnail">
      <a v-if="pinResult.node.piece.details?.thumbnailCid"
        :href="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.details?.thumbnailCid}`" target='_blank'>
        <img class="h-48 w-56 md:h-64 md:w-72 max-w-none mx-auto"
          :src="`https://${ipfsGateway}/ipfs/${pinResult.node.piece.details?.thumbnailCid}`" alt="" />
      </a>
      <div v-else class="h-48 w-56 md:h-64 md:w-72 flex border border-background-secondary-alt">
        <v-icon name="pr-image" class="h-20 w-20 m-auto text-slate-300" />
      </div>
    </div>
    <div id="piece-info" class='h-11/12'>
      <!-- <div id="piece-thumbs" class='flex w-36 mx-auto sm:place-self-end sm:mx-0 h-6 items-center justify-evenly'>
            <div class='flex gap-2 items-center'>
              <button @click="handleOnLike" :disabled="!walletStore.accountId || alreadyLiked">
                <v-icon name="hi-thumb-up"
                  :class="alreadyLiked ? 'h-5 w-5 shadow-sm shadow-slate-900 text-slate-400' : 'h-5 w-5'" />
              </button>
              <p class='text-sm select-none'>{{ pinResult.node.likesCount }}</p>
            </div>
            <div class='flex gap-2 items-center'>
              <button @click="handleOnDislike" :disabled="!walletStore.accountId || alreadyDisliked">
                <v-icon name="hi-thumb-down"
                  :class="alreadyDisliked ? 'h-5 w-5 shadow-sm shadow-slate-900 text-slate-400' : 'h-5 w-5'" />
              </button>
              <p class='text-sm select-none'>{{ pinResult.node.dislikesCount }}</p>
            </div>
          </div> -->
      <div id="piece-content" class="py-2 md:max-w-md h-full grid text-center md:text-left gap-6">
        <h2 class="font-bold text-3xl">{{ pinResult.node.piece.name }}</h2>
        <p class="text-sm text-slate-400">
          Dream your moments, Until I Met You, Gimme Some Courage, Dark Alley, One More Of A Stranger, Endless
          Things,
          The Heartbeat Stops, Walking Promises, Desired Games and many more..
        </p>
        <p class="text-sm"
          v-if="pinResult.node.category.name === 'Music' && pinResult.node.artist.name && pinResult.node.piece.details?.initialReleaseYear">
          Album {{ pinResult.node.artist.name }} {{ pinResult.node.piece.details?.initialReleaseYear }}</p>
        <div class="flex gap-4 h-11 mx-auto md:mx-0 items-center">
          <button class="bg-primary py-2 px-3 lg:px-5 flex items-center gap-2 w-40 justify-center" @click="() => {
            handlePlay(0)
          }">
            <v-icon name="md-playarrow-round" class="h-6 w-6 " />
            <h4 class="text-sm" mx-auto>Play now</h4>
          </button>
          <button class="border border-slate-200 py-2 px-3 lg:px-5 flex items-center gap-1 w-40 justify-center">
            <v-icon name="md-libraryadd" class="h-5 w-5" />
            <h4 class="text-sm">Add to library</h4>
          </button>
          <v-icon name="md-morevert" class="w-7 h-7" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY

defineProps({
  pinResult: {
    type: Object,
    required: true
  },
  handlePlay: {
    type: Function,
    required: true
  }
})

</script>