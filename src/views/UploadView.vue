<template>
  <main class="bg-gray-900 h-screen p-10 text-white">
    <div class="w-[25rem] border border-slate-400 px-6 pt-8 pb-12 m-auto rounded-lg relative">
      <p class="text-lg font-medium mb-4 text-center">Pin a new item</p>
      <div class='grid h-96'>
        <UploadForm />
        <button v-if="walletStore.accountId"
          class="bg-cyan-500 px-4 py-2 rounded  disabled:cursor-default disabled:text-slate-300 disabled:bg-cyan-600"
          @click="onSubmit" :disabled="!isAllowedToSubmit || uploadStore.isLoading">
          <Spinner v-if="uploadStore.isLoading" :class="'h-5 w-5 text-slate-200 animate-spin m-auto'" />
          <p v-else class="font-medium">Submit</p>
        </button>
        <Connect v-else />
        <Badge 
          v-if="uploadStore.isSuccess"
          :class="'h-14 bg-green-200 rounded-lg flex mt-6'"
          :message="'Piece created succesfully!'"
        />
        <Badge 
          v-if="uploadStore.isError"
          :class="'h-14 bg-red-200 rounded-lg flex mt-6'"
          :message="'Has ocurred an error :('"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useUploadStore } from '../stores/upload';
import { useWalletStore } from '../stores/wallet';
import { 
  CREATE_PIECE, 
  GET_CATEGORIES, 
  CategoryFragment 
} from '../utils/constants';
import mutatePin from '../utils/mutatePin'
import Connect from '../components/Layout/Connect.vue';
import Spinner from '../components/Layout/Spinner.vue';
import Badge from '../components/Layout/Badge.vue';
import UploadForm from '../components/UploadForm.vue';


import { useApolloClient, useQuery } from '@vue/apollo-composable';

const uploadStore = useUploadStore();
const walletStore = useWalletStore();

const isAllowedToSubmit = computed(() => (
  uploadStore.name &&
  uploadStore.CID &&
  uploadStore.category &&
  uploadStore.isValidCID
));
const websiteID = import.meta.env.VITE_WEBSITE_ID;
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;

useQuery(GET_CATEGORIES, { id: websiteID, pageSize: 1000})

const { resolveClient } = useApolloClient();

const getCategoryID = (client, category) => {
  const result = client.readFragment({
    id: client.cache.identify({ __typename: "Category", name: category }),
    fragment: CategoryFragment
  })
  return result.id
}

const onSubmit = async () => {
  const apolloClient = resolveClient();
  try {
    uploadStore.isLoading = true;
    const resultCreatePiece = await apolloClient.mutate({
      mutation: CREATE_PIECE,
      variables: {
        input: {
          content: {
            name: uploadStore.name,
            CID: uploadStore.CID,
            details: uploadStore.details ?? undefined,
            metadata: {
              createdAt: Date.now().toString(),
              updatedAt: Date.now().toString()
            }
          }
        }
      }
    });
    const categoryID = getCategoryID(apolloClient, uploadStore.category);
    const resultMutatePin = await mutatePin(
      adminServerUrl,
      {
        data: {
          ownerID: walletStore.accountId,
          websiteID,
          categoryID,
          pieceID: resultCreatePiece.data.createPiece.document.id,
          approved: false,
          rejected: false
        },
        action: 'create'
      }
    );
    uploadStore.isLoading = false;
    uploadStore.isSuccess = true;
    uploadStore.reset();
    console.log('resultMutatePin', resultMutatePin);
    setTimeout(() => uploadStore.isSuccess = false, 4000);

  } catch (error) {
    console.log('error on createPin', error);
    uploadStore.isLoading = false;
    uploadStore.isError = true;
    setTimeout(() => uploadStore.isError = false, 4000);
  }
}


</script>

