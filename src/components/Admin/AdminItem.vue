<template>
  <v-list-item>
    <template v-slot:prepend>
      <v-icon :icon="admin.isSuperAdmin ? 'fas fa-s' : 'fas fa-user'" size="x-small"></v-icon>
    </template>
    <template v-slot:title>
        <p class="text-subtitle-1">{{ admin.address }}</p>
      </template>
    <template v-slot:append>
      <v-btn icon @click="handleDelete">
        <v-icon icon="fas fa-trash" size="x-small" color="error"></v-icon>
      </v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
import { useWalletStore } from '@stores/wallet';
import { callAdminServer } from '@utils';
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER

const walletStore = useWalletStore()
const props = defineProps({
  admin: Object
})
const emit = defineEmits()
const handleDelete = async () => {
  const msgToSign = "Delete admin"
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [
      msgToSign,
      walletStore.address
    ]
  })
  await callAdminServer(
    `${adminServerUrl}/account`,
    {
      action: 'edit',
      accountId: props.admin?.id,
      data: {
        isAdmin: false,
        isSuperAdmin: false,
        updatedAt: (new Date).toISOString(),
      },
      msg: msgToSign,
      signature,
      address: walletStore.address,
    });
  emit("refetchUserAdmins")
}
</script>