<template>
  <div class="h-96 w-80 sm:w-96 rounded-xl bg-gray-900 border border-slate-500 inset-0 m-auto p-4 relative">
    <CloseButton :on-close="settingsStore.hide"/>
    <p class="text-lg font-medium text-slate-50 mb-2">Settings</p>
    <div class="w-full p-4 h-5/6 flex flex-col">
      <div class="flex-1">
        <div class="flex justify-between">
          <p class="text-sm text-slate-100">Autoplay:</p>
          <input type="checkbox" v-model="settingsStore.autoplay" />
        </div>
      </div>
      <button class="h-8 w-16 bg-cyan-400 px-2 py-1 text-slate-50 text-sm rounded self-end" @click="onSave">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import CloseButton from './Layout/CloseButton.vue';
import { useSettingsStore } from '../stores/settings';
import { useWalletStore } from '../stores/wallet';
import callAdminServer from "../utils/callAdminServer"
import { useQuery } from '@vue/apollo-composable';
import { GET_ACCOUNT_SETTINGS } from '../config/constants'
const settingsStore = useSettingsStore();
const walletStore = useWalletStore();
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;

const { onResult } = useQuery(GET_ACCOUNT_SETTINGS, {
  id: walletStore.accountId,
}, {
  fetchPolicy: "network-only",
  
});

onResult((result) => {
  const settings = result.data.node.settings
  settingsStore.autoplay = settings.autoplay
})

const onSave = async () => {
  console.log(settingsStore.autoplay);
  const msg = `edit settings account ${walletStore.accountId}:${walletStore.address}`
  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [
      msg,
      walletStore.address
    ]
  })
  await callAdminServer(
    `${adminServerUrl}/account`,
    {
      action: 'edit',
      data: {
        settings: {
          autoplay: settingsStore.autoplay
        }
      },
      msg,
      signature,
      accountId: walletStore.accountId,
      address: walletStore.address
    }
  )
  settingsStore.hide()
}

</script>
<style scoped></style>