<template>
  <li class="flex items-center justify-between gap-1 h-7">
    <p v-if="admin.isSuperAdmin" class="text-xs">🇸</p>
    <v-icon v-else name="hi-user" class="h-4 w-4" />
    <p class="font-medium text-xs sm:text-sm">{{ admin.address }}</p>
    <button @click="handleDelete" class="flex">
      <v-icon name="hi-trash" class="h-4 w-4 text-red-400 hover:cursor-pointer my-auto" />
    </button>
  </li>
</template>

<script setup>
import { useWalletStore } from '../../stores/wallet';
import callAdminServer from '../../utils/callAdminServer';
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