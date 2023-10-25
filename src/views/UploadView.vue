<template>
  <v-container>
    <v-sheet color="transparent" min-height="100vh" class="d-flex align-start pt-10">
      <v-sheet width="420px" class="px-8 pb-16 pt-10 mx-auto">
        <p class="text-h6 text-center mb-5">Pin a new item</p>
        <UploadForm :handleFileChange="handleFileChange" :handleOnSubmit="handleOnSubmit" />
      </v-sheet>
    </v-sheet>
    <v-snackbar color="success" v-model="uploadStore.isSuccess" timeout="3000">
      <p class="text-center">{{ `Piece created succesfully!` }}</p>
    </v-snackbar>
    <v-snackbar color="error" v-model="uploadStore.isError" timeout="3000">
      <p class="text-center">{{ `Has ocurred an error :(` }}</p>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { UploadForm } from '@components';
import { useUploadStore } from '@stores/upload';
import { useWalletStore } from '@stores/wallet';
import {
  CREATE_PIECE,
  GET_CATEGORIES,
  CREATE_ARTIST,
  GET_ARTIST
} from '@config/constants';
import { callAdminServer, getCategoryId, uploadToIPFS } from '@utils'

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

const handleFileChange = (files) => {
  uploadStore.inputHasFiles = false
  if (files.length > 0) {
    uploadStore.inputHasFiles = true
    uploadStore.contentCid = null
    files.value = e.target.files
  }
};
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;

const handleOnSubmit = async (event) => {
  const result = await event
  if (!result.valid) return
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

    const categoryID = getCategoryId(client, uploadStore.category);

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
    uploadStore.isSuccess = true;
    uploadStore.reset();
    files.value = []
    console.log('resultcallAdminServer', resultcallAdminServer);

  } catch (error) {
    console.log('error on createPin', error);
    uploadStore.isError = true;
  } finally {
    uploadStore.isLoading = false;

  }
}
onMounted(() => {
  uploadStore.reset()
})

</script>

