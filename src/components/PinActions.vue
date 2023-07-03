<template>
  <button class="w-full" @click="toggleShowActions">
    <v-icon name="hi-dots-vertical" class="h-6 w-6 text-slate-50" />
  </button>
  <div v-if="showActions" class="absolute right-6 sm:right-16 lg:right-20" @mouseleave="delayCloseActions">
    <div class="grid w-24 py-1 border border-slate-600 rounded-lg bg-gray-900 ">
    <button v-if="walletStore.isAdmin && !pin.approved"  @click="handleApprove">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-check-circle" 
          class="text-green-400 h-4 w-4 mr-1 mt-0.25" 
        />
        Approve
      </p>
    </button>
    <button v-if="walletStore.isAdmin && !pin.rejected" @click="openRejectionModal">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-x-circle" 
          class="text-red-400 h-4 w-4 mr-1 mt-0.25" 
        />
        Reject
      </p>
    </button>
    <button v-if="walletStore.isAdmin || (!walletStore.isAdmin && !pin.approved && !pin.rejected)"  @click="openEditModal">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-pencil-alt" 
          class="h-4 w-4 mr-1 mt-0.25" 
        />
        Edit
      </p>
    </button>
    <button v-if="walletStore.isAdmin && pin.rejected"  @click="handleUnreject">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-clock" 
          class="text-blue-400 h-4 w-4 mr-1 mt-0.25" 
        />
        Unreject
      </p>
    </button>
    <button v-if="walletStore.isAdmin" @click="handleDelete">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-trash" 
          class="h-4 w-4 mr-1 mt-0.25"
        />
        Delete
      </p>
    </button>
    <button v-if="pin.rejected && pin.rejectedReason">
      <p class="text-sm inline-flex items-center justify-between w-full px-2">
        <v-icon 
          name="hi-eye" 
          class="h-4 w-4 mr-1 mt-0.25"
        />
        Reject Reason
      </p>
    </button>
  </div>
  </div>
  <Modal v-if="showRejectionModal">
    <div class="h-44 w-80 bg-gray-900 m-auto border border-slate-400 rounded-lg px-6 py-4 relative">
      <CloseButton :onClose="hideRejectionModal" />
      <div class="h-full flex flex-col justify-center">
        <p class="text-sm mb-1 ml-1">Reason:</p>
        <input 
          name="reject-reason" 
          type="text" 
          class=" bg-slate-800 h-9 px-1.5 mb-4"
          v-model="rejectionReason" 
        />
        <button class="bg-cyan-500 px-4 py-2 rounded" @click="handleReject">
          Reject
        </button>
      </div>
    </div>
  </Modal>
  <Modal v-if="showEditModal">
    <div class="w-[25rem] border border-slate-400 bg-gray-900 px-6 pt-8 pb-12 m-auto rounded-lg relative">
      <CloseButton :onClose="hideEditModal" />
      <p class="text-lg font-medium mb-4 text-center">Edit item</p>
      <div class='grid h-96'>
        <UploadForm />
        <button 
          class="bg-cyan-500 px-4 py-2 rounded disabled:cursor-default disabled:text-slate-400 disabled:bg-cyan-900" 
          @click="handleEdit" :disabled="!isAllowedToEdit"
        >
          Edit
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { useWalletStore } from '../stores/wallet';
import { useUploadStore } from '../stores/upload';

import callAdminServer from '../utils/callAdminServer';
import { useApolloClient } from '@vue/apollo-composable';
import { CREATE_PIECE, GET_PIN } from '../utils/constants';
import { computed, inject, ref } from 'vue';
import Modal from './Layout/Modal.vue'
import CloseButton from './Layout/CloseButton.vue'
import UploadForm from './UploadForm.vue'
import getCategoryID from '../utils/getCategoryId';

const uploadStore = useUploadStore();
const walletStore = useWalletStore();
const props = defineProps({
  pin: Object
})
const websiteID = import.meta.env.VITE_WEBSITE_ID;
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;

const { resolveClient } = useApolloClient()

const showActions = ref(false)
const toggleShowActions = () => showActions.value = !showActions.value
const delayCloseActions = () => setTimeout(() => showActions.value = false, 600)
const rejectionReason = ref(null)
const showRejectionModal = ref(false)
const openRejectionModal = () => showRejectionModal.value = true
const hideRejectionModal = () => showRejectionModal.value = false

const loadingAction = ref(false)

const refetchPins = inject('refetchPins')
const showEditModal = ref(false)
const openEditModal = () => {
  uploadStore.reset()
  uploadStore.name = props.pin.piece.name;
  uploadStore.CID = props.pin.piece.CID;
  uploadStore.category = props.pin.category.name;
  if (props.pin.piece.details) {
    for (const [key, value] of Object.entries(props.pin.piece.details)) {
      if(key === '__typename' || !value) {
        continue
      } else {
        uploadStore.details[key] = value
      }
    }
  }

  showEditModal.value = true
}
const hideEditModal = () => showEditModal.value = false

const isAllowedToEdit = computed(() => {
  return !!(
    uploadStore.name &&
    uploadStore.CID &&
    uploadStore.category &&
    uploadStore.details.imageThumbnailCID &&
    uploadStore.isValidCID &&
    !uploadStore.checkingContent &&
    uploadStore.contentIsValid
  )
});
const getPin = async (id) => {
  const apolloClient = resolveClient()
  return await apolloClient.query({
    query: GET_PIN,
    variables: { id, pageSize: 1000 },
    fetchPolicy: 'network-only'
  })
}

const handleApprove = async () => {
  showActions.value = false
  if (!walletStore.isAdmin || !walletStore.adminId) {
    return
  }
  try {
    loadingAction.value = true
    const response = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action: 'approve',
        adminID: walletStore.adminId,
        pinID: props.pin.id,
        data: {}
      }
    )
    await getPin(response.pinID)
    loadingAction.value = false
  } catch (error) {
    console.log('error on approvePin', error)
    loadingAction.value = false
  }
}

const handleReject= async () => {
  showActions.value = false
  if (!walletStore.isAdmin || !walletStore.adminId) {
    return
  }
  try {
    loadingAction.value = true
    const response = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action: 'reject',
        adminID: walletStore.adminId,
        pinID: props.pin.id,
        data: {
          rejectionReason: rejectionReason.value ?? undefined
        }
      }
    )
    await getPin(response.pinID)
    rejectionReason.value = ''
    loadingAction.value = false
    hideRejectionModal()
  } catch (error) {
    console.log('error on approvePin', error)
    loadingAction.value = false
  }
}

const handleEdit = async () => {
  showActions.value = false
  const apolloClient = resolveClient();
  try {
    loadingAction.value = true
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
    const resultcallAdminServer = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action: 'edit',
        pinID: props.pin.id,
        data: {
          ownerID: props.pin.owner.id,
          websiteID,
          categoryID,
          pieceID: resultCreatePiece.data.createPiece.document.id,
          approved: props.pin.approved ? props.pin.approved : undefined,
          rejected: props.pin.rejected ? props.pin.rejected : undefined,
          rejectedReason: props.pin.rejectedReason ? props.pin.rejectedReason : undefined
        }
      }
    );
    uploadStore.isLoading = false;
    hideEditModal()
    uploadStore.reset()
    await refetchPins()
    loadingAction.value = false
  } catch (error) {
    console.log('error on createPin', error);
    uploadStore.isLoading = false;
    loadingAction.value = false
  }
  
}

const handleUnreject = async () => {
  showActions.value = false
  if (!walletStore.isAdmin || !walletStore.adminId) {
    return
  }
  try {
    loadingAction.value = true
    const response = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action: 'unreject',
        adminID: walletStore.adminId,
        pinID: props.pin.id,
        data: {}
      }
    )
    await getPin(response.pinID)
    loadingAction.value = false
  } catch (error) {
    console.log('error on approvePin', error)
    loadingAction.value = false
  }
}

const handleDelete = async () => {
  showActions.value = false
  if (!walletStore.isAdmin || !walletStore.adminId) {
    return
  }
  try {
    loadingAction.value = true
    const response = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action: 'delete',
        adminID: walletStore.adminId,
        pinID: props.pin.id,
        data: {
          ownerID: props.pin.owner.id,
          websiteID: props.pin.website.id,
          categoryID: props.pin.category.id,
          pieceID: props.pin.piece.id,
        }
      }
    )
    await getPin(response.pinID)
    loadingAction.value = false
  } catch (error) {
    console.log('error on approvePin', error)
    loadingAction.value = false
  }
}


</script>

<style scoped>
</style>
