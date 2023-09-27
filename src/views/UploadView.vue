<template>
  <main class="h-screen py-10 px-2 text-white">
    <div class="w-[21rem] sm:w-[25rem] border border-slate-600 px-4 sm:px-6 pt-8 pb-12 m-auto relative">
      <p class="text-lg font-medium mb-4 text-center">Pin a new item</p>
      <div class='grid h-fit '>
        <UploadForm :handleFileChange="handleFileChange" />
        <button v-if="walletStore.accountId"
          class="bg-primary px-4 py-2 disabled:cursor-default disabled:text-slate-400 disabled:bg-slate-600"
          @click="handleOnSubmit"
          :disabled="!isAllowedToSubmit"
          >
          <Spinner v-if="uploadStore.isLoading" :class="'h-5 w-5 text-slate-200 animate-spin m-auto'" />
          <p v-else class="font-medium">Submit</p>
        </button>
        <Connect v-else />
        <Badge v-if="uploadStore.isSuccess" :class="'h-14 bg-green-200 rounded-lg flex mt-6'"
          :message="'Piece created succesfully!'" />
        <Badge v-if="uploadStore.isError" :class="'h-14 bg-red-200 rounded-lg flex mt-6'"
          :message="'Has ocurred an error :('" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUploadStore } from '../stores/upload';
import { useWalletStore } from '../stores/wallet';
import {
  CREATE_PIECE,
  GET_CATEGORIES,
  CREATE_ARTIST,
  GET_ARTIST
} from '../config/constants';
import callAdminServer from '../utils/callAdminServer'
import Connect from '../components/Layout/Connect.vue';
import Spinner from '../components/Layout/Spinner.vue';
import Badge from '../components/Layout/Badge.vue';
import { checkArtist } from '../utils/checkArtist'

import { useApolloClient, useQuery } from '@vue/apollo-composable';
import getCategoryID from '../utils/getCategoryId';
import uploadToIPFS from '../utils/uploadToIPFS'
import UploadForm from '../components/Upload/UploadForm.vue';
const { resolveClient } = useApolloClient()
const uploadStore = useUploadStore();
const walletStore = useWalletStore();

const files = ref(undefined)

const isAllowedToSubmit = computed(() => {
  return !!(
    uploadStore.name &&
    (uploadStore.contentCid || files.value?.length > 0) &&
    uploadStore.category
  )
});
const siteID = import.meta.env.VITE_WEBSITE_ID;

useQuery(GET_CATEGORIES, { id: siteID, pageSize: 1000 })

const handleFileChange = (e) => {
  uploadStore.inputHasFiles = false
  if (e.target.files.length > 0) {
    uploadStore.inputHasFiles = true
    uploadStore.contentCid = null
    files.value = e.target.files
  }
};
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;

const handleOnSubmit = async () => {

  const client = resolveClient();
  try {
    uploadStore.isLoading = true;

    const msgToSign = "Upload pin"
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [
        msgToSign,
        walletStore.address
      ]
    })
    if (uploadStore.inputHasFiles) {
      console.log('uploading content to IPFS')
      console.log('files', files)
      const newCid = await uploadToIPFS(files.value)
      console.log('newCid', newCid)
      uploadStore.contentCid = newCid
    }

    const result = await client.query({
      query: GET_ARTIST,
      variables: {
        items: 10,
        filters: {
          where: {
            name: {
              equalTo: uploadStore.artist
            }
          }
        }
      },
      fetchPolicy: 'no-cache'
    })

    const artist = result.data.artistIndex.edges[0]?.node
    let artistID = artist?.id
    console.log('artist', artist)
    // if no exists, create the artist and return de id
    if (!artistID) {
      console.log('creating a new artist');
      const result = await client.mutate({
        mutation: CREATE_ARTIST,
        variables: {
          input: {
            content: {
              name: uploadStore.artist ? uploadStore.artist : "Unknown"
            }
          }
        }
      })
      artistID = result.data.createArtist.document.id
      console.log(artistID);
    }

    const resultCreatePiece = await client.mutate({
      mutation: CREATE_PIECE,
      variables: {
        input: {
          content: {
            name: uploadStore.name,
            contentCid: uploadStore.contentCid,
            details: uploadStore.details ?? undefined,
            createdAt: (new Date).toISOString(),
            updatedAt: (new Date).toISOString()
          }
        }
      }
    });

    const categoryID = getCategoryID(client, uploadStore.category);
    
    const resultcallAdminServer = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        data: {
          ownerID: walletStore.accountId,
          siteID,
          categoryID,
          artistID,
          pieceID: resultCreatePiece.data.createPiece.document.id,
          approved: false,
          rejected: false,
          deleted: false
        },
        action: 'create',
        msg: msgToSign,
        signature,
        address: walletStore.address
      }
    );
    uploadStore.isLoading = false;
    uploadStore.isSuccess = true;
    uploadStore.reset();
    files.value = []
    console.log('resultcallAdminServer', resultcallAdminServer);
    setTimeout(() => uploadStore.isSuccess = false, 4000);

  } catch (error) {
    console.log('error on createPin', error);
    uploadStore.isLoading = false;
    uploadStore.isError = true;
    setTimeout(() => uploadStore.isError = false, 4000);
  }
}
onMounted(() => {
  uploadStore.reset()
})

</script>

