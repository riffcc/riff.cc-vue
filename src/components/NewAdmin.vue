<template>
  <div class="grid w-80 sm:w-[25rem] h-48 mx-auto">
    <p class="font-medium mx-auto">New admin</p>
    <div class="py-4 relative mb-2">
      <p class="text-sm mb-1 ml-1">Address:</p>
      <input placeholder="0xa5Cf4DDFe4BfDbE712bD2f54EAadaCebb809fAED" type="text"
        class="form-input bg-background-secondary w-full h-9 px-1.5" v-model="newAdminAddress" />
      <p v-if="newAdminAddress && !isValidAddress" class="text-xs text-red-500 absolute -bottom-1">Not a valid address.
      </p>
    </div>
    <div class="flex items-center gap-3">
      <p class="text-sm ml-1">Super:</p>
      <input type="checkbox" v-model="adminSuper" />
    </div>
    <div class="flex justify-end">
      <button @click="handleOnSubmit"
        class="py-1.5 px-6 rounded-lg w-fit bg-cyan-400 disabled:text-slate-300 disabled:bg-cyan-700"
        :disabled="!newAdminAddress || !isValidAddress">
        Add
      </button>
    </div>
  </div>
</template>

<script setup>
import { useApolloClient } from '@vue/apollo-composable';
import { computed, ref, watch } from 'vue';
import { GET_ETH_ACCOUNT, defaultUserSettings } from '../config/constants'
import { useWalletStore } from '../stores/wallet';
import callAdminServer from '../utils/callAdminServer';

const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER

const newAdminAddress = ref(null)
const adminSuper = ref(false)
const { resolveClient } = useApolloClient()

const isValidAddress = computed(() => {
  return newAdminAddress.value.startsWith("0x") && newAdminAddress.value.length === 42;
})

const emit = defineEmits()

const handleOnSubmit = async () => {
  const client = resolveClient()
  console.log('newAdminAddress.value', newAdminAddress.value)
  try {
    const result = await client.query({
      query: GET_ETH_ACCOUNT,
      variables: {
        items: 10,
        filters: {
          where: {
            address: {
              equalTo: newAdminAddress.value
            }
          }
        }
      },
      fetchPolicy: 'network-only'
    })
    const node = result.data.ethAccountIndex.edges[0]?.node
    if (node) {
      const msgToSign = "Create new admin"
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
      console.log(signature)
      const result = await callAdminServer(
        `${adminServerUrl}/account`,
        {
          action: 'edit',
          accountId: node.id,
          data: {
            isAdmin: true,
            isSuperAdmin: adminSuper.value,
            updatedAt: (new Date).toISOString(),
          },
          msg: msgToSign,
          signature,
          address: walletStore.address,
        });
    } else {
      const msgToSign = "Create new admin"
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
      console.log(signature)
      const result = await callAdminServer(
        `${adminServerUrl}/account`,
        {
          action: 'create',
          data: {
            address: newAdminAddress.value,
            siteID,
            isAdmin: true,
            isSuperAdmin: adminSuper.value,
            createdAt: (new Date).toISOString(),
            updatedAt: (new Date).toISOString(),
            settings: defaultUserSettings
          },
          msg: msgToSign,
          signature,
          address: walletStore.address,
        });
    }
    newAdminAddress.value = null
    emit("refetchUserAdmins")
  } catch (error) {
    console.log('error on handleOnsubmit in NewAdmin', error)
  }

}
</script>