<template>
  <div class="grid w-80 sm:w-[25rem] h-full mx-auto">
    <p class="font-medium mx-auto">New featured</p>
    <div class="h-24">
      <p class="text-sm mb-1 ml-1">Pin ID:</p>
      <input type="text" class="form-input bg-background-secondary w-full h-9 px-1.5"
        :min="(new Date).toISOString().replace(/.\d+Z$/g, 'Z')" v-model="pinID" />
      <p v-if="pinID && !isPin" class="text-xs text-red-600 mt-1 ml-2">Not pin exists.</p>
    </div>
    <div class="h-24 text-slate-100">
      <p class="text-sm mb-1 ml-1">Start at:</p>
      <input type="datetime-local" :min="(new Date).toISOString().substring(0, 16)"
        class="form-datetime-local bg-background-secondary w-full cursor-pointer h-9 px-1.5" v-model="startAt" />
      <!-- {startAt !== '' && endAt !== '' && !startAtIsValid && <p class="text-xs text-red-600 mt-1 ml-2">Invalid date.</p>} -->
    </div>
    <div class="h-24">
      <p class="text-sm mb-1 ml-1">End at:</p>
      <input type="datetime-local" :min="(new Date).toISOString().substring(0, 16)"
        class="form-datetime-local bg-background-secondary w-full cursor-pointer h-9 px-1.5" v-model="endAt" />
    </div>
    <button
      class="py-2 px-4 h-10 w-1/3 mx-auto rounded-lg bg-cyan-500 disabled:hover:bg-cyan-900 disabled:bg-cyan-900 disabled:text-slate-400 hover:cursor-point disabled:hover:cursor-default delay-100 hover:bg-cyan-600"
      :disabled="!isPin || !startAtIsValid || loadingNewFeatured" @click="handleSubmit">
      <Spinner v-if="loadingNewFeatured" class="h-5 w-5 text-white animate-spin mx-auto" />
      <p v-else>Create</p>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { CREATE_FEATURED, GET_PIN } from '../config/constants'
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import Spinner from '../components/Layout/Spinner.vue';
import callAdminServer from '../utils/callAdminServer';
import { useWalletStore } from '../stores/wallet';
const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID;
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;
const { resolveClient } = useApolloClient()
const pinID = ref(null)
const startAt = ref(null)
const endAt = ref(null)
const isPin = ref(false)
watch(pinID, async (newPinID) => {
  if (!newPinID) {
    isPin.value = false
    return
  }
  const client = resolveClient()
  const result = await client.query({
    query: GET_PIN,
    variables: { id: newPinID },
    fetchPolicy: 'network-only'
  })
  console.log(result.data)
  if (result.data?.node?.id) {
    isPin.value = true
  } else {
    isPin.value = false
  }
})

const { mutate: createFeatured, loading: loadingNewFeatured } = useMutation(CREATE_FEATURED)

const startAtIsValid = computed(() => {
  return Date.now() < Date.parse(startAt.value) && Date.parse(startAt.value) < Date.parse(endAt.value)
})

const resetForm = () => {
  pinID.value = null
  startAt.value = null
  endAt.value = null
}

const handleSubmit = async () => {
  let data = {}
  let msgToSign
  let signature
  msgToSign = "Create featured pin"
  signature = await window.ethereum.request({
    method: "personal_sign",
    params: [
      msgToSign,
      walletStore.address
    ]
  })
  await callAdminServer(
    `${adminServerUrl}/featured`, {
    action: "create",
    data: {
     siteID,
      pinID: pinID.value,
      startAt: (new Date(startAt.value)).toISOString(),
      endAt: (new Date(endAt.value)).toISOString()
    },
    msg: msgToSign,
    signature,
    address: walletStore.address
  })
  resetForm()
}
</script>