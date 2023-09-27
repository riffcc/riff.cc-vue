<template>
  <button class="w-full" @click="toggleShowActions">
    <v-icon name="hi-dots-vertical" class="h-6 w-6 text-slate-50" />
  </button>
  <div v-if="showActions" class="absolute right-6 sm:right-16 lg:right-20" @mouseleave="delayCloseActions">
    <div class="grid w-24 py-1 border bg-background-secondary">
      <button v-if="walletStore.isAdmin && !pin.approved" @click="() => handleAction('approve')">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-check-circle" class="text-green-400 h-4 w-4" />
          Approve
        </p>
      </button>
      <button v-if="walletStore.isAdmin && !pin.rejected" @click="openRejectionModal">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-x-circle" class="text-red-400 h-4 w-4" />
          Reject
        </p>
      </button>
      <button v-if="walletStore.isAdmin || (!walletStore.isAdmin && !pin.approved && !pin.rejected)"
        @click="openEditModal">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-pencil-alt" class="h-4 w-4" />
          Edit
        </p>
      </button>
      <button v-if="walletStore.isAdmin && pin.rejected" @click="() => handleAction('unreject')">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-clock" class="text-blue-400 h-4 w-4" />
          Unreject
        </p>
      </button>
      <button v-if="walletStore.isAdmin" @click="() => handleAction('delete')">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-trash" class="h-4 w-4" />
          Delete
        </p>
      </button>
      <button v-if="pin.rejected && pin.rejectedReason">
        <p class="text-sm inline-flex items-center justify-between w-full px-2">
          <v-icon name="hi-eye" class="h-4 w-4" />
          Reject Reason
        </p>
      </button>
    </div>
  </div>
  <Modal v-if="showRejectionModal">
    <div class="h-40 w-80 bg-background m-auto border px-6 py-4 relative">
      <CloseButton :onClose="hideRejectionModal" />
      <div class="h-full flex flex-col justify-center">
        <p class="text-sm mb-1 ml-1">Reason:</p>
        <input name="reject-reason" type="text" class="bg-background-secondary h-9 px-1.5 mb-4" v-model="rejectionReason" />
        <button class="bg-cyan-500 px-4 py-2 rounded" @click="() => handleAction('reject')">
          Reject
        </button>
      </div>
    </div>
  </Modal>
  <Modal v-if="showEditModal">
    <div class="w-[25rem] border bg-background px-6 pt-8 pb-12 m-auto relative">
      <CloseButton :onClose="hideEditModal" />
      <p class="text-lg font-medium mb-4 text-center">Edit item</p>
      <div class='grid h-96'>
        <UploadForm />
        <button class="bg-primary px-4 py-2 disabled:cursor-default disabled:text-slate-400 disabled:bg-slate-600"
          @click="() => handleAction('edit')" :disabled="!isAllowedToEdit">
          Edit
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { useWalletStore } from '../../stores/wallet';
import { useUploadStore } from '../../stores/upload';

import callAdminServer from '../../utils/callAdminServer';
import { CREATE_PIECE, GET_PIN } from '../../config/constants';
import { computed, inject, ref } from 'vue';
import Modal from '../Layout/Modal.vue'
import CloseButton from '../Layout/CloseButton.vue'
import UploadForm from '../Upload/UploadForm.vue'
import getCategoryID from '../../utils/getCategoryId';
import { useApolloClient } from '@vue/apollo-composable';

const uploadStore = useUploadStore();
const walletStore = useWalletStore();
const props = defineProps({
  pin: Object
})
const siteID = import.meta.env.VITE_WEBSITE_ID;
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
  uploadStore.contentCid = props.pin.piece.contentCid;
  uploadStore.category = props.pin.category.name;
  for (const [key, value] of Object.entries(props.pin.piece.details)) {
    if (!value || key === '__typename') continue
    uploadStore.details[key] = value
  }
  showEditModal.value = true
}
const hideEditModal = () => showEditModal.value = false

const isAllowedToEdit = computed(() => {
  return !!(
    uploadStore.name &&
    uploadStore.contentCid &&
    uploadStore.category &&
    uploadStore.details.thumbnailCid &&
    uploadStore.isValidCID &&
    !uploadStore.checkingContent &&
    uploadStore.contentIsValid
  )
});

const getPin = async (client, id) => {
  return await client.query({
    query: GET_PIN,
    variables: { id },
    fetchPolicy: 'network-only'
  })
}

const handleAction = async (action) => {
  const client = resolveClient()
  showActions.value = false
  if (!walletStore.isAdmin) {
    return
  }
  try {
    loadingAction.value = true
    let data = {}
    let msgToSign
    let signature
    if (action === 'approve') {

      msgToSign = "Approve pin"
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
    } else if (action === 'reject') {
      data = {
        rejectionReason: rejectionReason.value ?? undefined
      }
      msgToSign = "Reject pin"
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
    } else if (action === 'edit') {
      data = {
        rejectionReason: rejectionReason.value ?? undefined
      }
      msgToSign = "Edit pin"
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
      uploadStore.isLoading = true;


      const resultCreatePiece = await client.mutate({
        mutation: CREATE_PIECE,
        variables: {
          input: {
            content: {
              name: uploadStore.name,
              contentCid: uploadStore.contentCid,
              details: uploadStore.details,
              createdAt: (new Date).toISOString(),
              updatedAt: (new Date).toISOString()
            }
          }
        }
      });
      const categoryID = getCategoryID(client, uploadStore.category);
      console.log('props.pin vefore data', props.pin)
      data = {
        ownerID: props.pin.owner.id,
        artistID: props.pin.artist.id,
        siteID,
        categoryID,
        pieceID: resultCreatePiece.data.createPiece.document.id,
        approved: props.pin.approved ?? undefined,
        rejected: props.pin.rejected ?? undefined,
        deleted: false,
        rejectedReason: props.pin.rejectedReason ?? undefined
      }
      console.log('data', data)
      uploadStore.isLoading = false;
      hideEditModal()
      uploadStore.reset()
      refetchPins()
    } else if (action === 'unreject') {
      msgToSign = "Unreject pin"
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })

    } else if (action === 'delete') {
      msgToSign = "Delete pin"
      signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })

    } else {
      console.log('invalid action')
      return
    }
    const response = await callAdminServer(
      `${adminServerUrl}/pin`,
      {
        action,
        data,
        signature,
        pinId: props.pin.id,
        msg: msgToSign,
        address: walletStore.address
      }
    )
    await getPin(client, response.pinID)
    loadingAction.value = false
  } catch (error) {
    console.log('error on handleAction', error)
    loadingAction.value = false
  }
}

</script>

<style scoped></style>
