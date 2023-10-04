<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon icon="fas fa-ellipsis-vertical" size="small"></v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-if="walletStore.isAdmin && !pin.approved">
        <v-btn text="Approve" @click="() => handleAction('approve')" block>
          <template v-slot:prepend>
            <v-icon icon="fas fa-circle-check" size="small" color="success"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="walletStore.isAdmin && !pin.rejected">
        <v-btn text="Reject" @click="openRejectionModal" id="reject-button" block>
          <template v-slot:prepend>
            <v-icon icon="fas fa-circle-xmark" size="small" color="error"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="walletStore.isAdmin || (!walletStore.isAdmin && !pin.approved && !pin.rejected)">
        <v-btn text="Edit" @click="openEditModal" id="edit-button" block>
          <template v-slot:prepend>
            <v-icon icon="fas fa-pen-to-square" size="small"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="walletStore.isAdmin && pin.rejected">
        <v-btn text="Unreject" @click="() => handleAction('unreject')" block>
          <template v-slot:prepend>
            <v-icon icon="fas fa-clock" size="small" color="info"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="walletStore.isAdmin">
        <v-btn text="Delete" @click="() => handleAction('delete')" block>
          <template v-slot:prepend>
            <v-icon icon="fas fa-trash" size="small" color="error"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="pin.rejected && pin.rejectedReason" block>
        <v-btn text="Reject Reason">
          <template v-slot:prepend>
            <v-icon icon="fas fa-eye" size="small"></v-icon>
          </template>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-dialog v-model="showEditModal" activator="edit-button" width="auto">
    <v-card width="360px">
      <v-card-text>
        <p>jaja arre</p>

      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="showEditModal = false" text="Cancel"></v-btn>
        <v-btn color="primary" @click="() => handleAction('reject')" text="Save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showRejectionModal" activator="reject-button" width="auto">
    <v-card width="360px">
      <v-card-text>
        <v-text-field v-model="rejectionReason" label="Reject Reason"></v-text-field>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="showRejectionModal = false" text="Cancel"></v-btn>
        <v-btn color="primary" @click="() => handleAction('reject')" text="Reject"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useApolloClient } from '@vue/apollo-composable';
import { useWalletStore } from '@stores/wallet';
import { useUploadStore } from '@stores/upload';
import { useSettingsStore } from '@stores/settings';
import {callAdminServer, getCategoryId } from '@utils';
import { CREATE_PIECE, GET_PIN } from '@config/constants';


const settingsStore = useSettingsStore();

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
      const categoryID = getCategoryId(client, uploadStore.category);
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
