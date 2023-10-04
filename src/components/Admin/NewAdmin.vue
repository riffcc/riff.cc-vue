<template>
  <v-sheet width="450px" class="ma-auto d-flex flex-column mb-6">
    <v-text-field label="Admin ETH Address" validate-on="input" v-model="newAdminAddress"
      :rules="[rules.required, rules.isValidAddress]"></v-text-field>
    <v-checkbox v-model="adminSuper" label="Super Admin"></v-checkbox>
    <v-btn color="primary" class="w-50 mx-auto mt-4" :loading="isLoading" :disabled="!newAdminAddress || rules.isValidAddress(newAdminAddress) !== true"
      @click="handleSubmit" text="Create">
    </v-btn>
    <v-snackbar color="success" v-model="isSuccess" timeout="3000">
    <p class="text-center">{{ `Succesfully!` }}</p>
    </v-snackbar>
    <v-snackbar color="error" v-model="isError" timeout="3000">
    <p class="text-center">{{ `Has ocurred an error :(` }}</p>
    </v-snackbar>
  </v-sheet>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useApolloClient } from '@vue/apollo-composable';
import { GET_ETH_ACCOUNT, defaultUserSettings } from '@config/constants'
import { useWalletStore } from '@stores/wallet';
import {callAdminServer} from '@utils';

const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER

const newAdminAddress = ref(null)
const adminSuper = ref(false)
const { resolveClient } = useApolloClient()

const rules = {
  required: value => !!value || 'Required',
  isValidAddress: value => value?.length === 42 && value?.startsWith('0x') || 'Invalid ETH Address'
}
const emit = defineEmits()
const isLoading = ref(false)
const isError = ref(false)
const handleSubmit = async () => {
  const client = resolveClient()
  console.log('newAdminAddress.value', newAdminAddress.value)
  try {
    isLoading.value = true
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

      isSuccess.value = true
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
    emit("refetchUserAdmins")
  } catch (error) {
    isError.value = true
    console.log('error on handleOnsubmit in NewAdmin', error)
  } finally {
    isLoading.value = false
    newAdminAddress.value = null
    adminSuper.value = false
  }

}
</script>