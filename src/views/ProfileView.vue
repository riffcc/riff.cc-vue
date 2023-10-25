<template>
  <v-container class="py-14">
    <v-sheet min-height="75vh">
      <v-sheet v-if="!walletStore.address" width="320px" height="160px" class="pa-10 d-flex flex-column mx-auto">
        <p class="text-center mb-auto">Please connect your wallet</p>
        <div>
          <Connect block />
        </div>
      </v-sheet>
      <div style="min-height: inherit;" class="d-flex flex-column">
        <v-tabs v-model="tab" center-active fixed-tabs>
          <v-tab slider-color="primary" value="content">Content</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="flex-1-0">
          <v-window-item value="content" class="py-10 px-4 px-sm-12 px-md-16">
            <PinTable :pins="pins.approved" title="Approved" />
            <PinTable :pins="pins.pending" title="Pending" />
            <PinTable :pins="pins.rejected" title="Rejected" />
          </v-window-item>
        </v-window>
      </div>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable"
import {
  GET_PINS,
  GET_CATEGORIES,
  IPFS_GATEWAY
} from "@/config/constants";
import { computed, inject, provide, ref, watch } from "vue";
import { useWalletStore } from "@stores/wallet";
import {
  Connect,
  PinTable,
} from "@components"
import { useSettingsStore } from "@stores/settings";
const settingsStore = useSettingsStore()
const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID;
const tab = ref(null)
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;
const file = ref(null)
const fileBlobUrl = ref(null)
useQuery(GET_CATEGORIES, { id: siteID })


const {
  result: pinsResult,
  loading: pinEdgesLoading,
  error: pinEdgesError,
  refetch: refetchPins
} = useQuery(GET_PINS, {
  items: 1000,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      deleted: {
        equalTo: false
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});

const pins = computed(() => {
  if (!pinsResult.value?.pinIndex?.edges?.length > 0) {
    console.log('arre')
    return {
      approved: [],
      pending: [],
      rejected: []
    }
  }
  const list = pinsResult.value.pinIndex.edges
  const approved = list.filter(pin => (pin.node.approved))
  const pending = list.filter(pin => (!pin.node.approved && !pin.node.rejected && !pin.node.deleted))
  const rejected = list.filter(pin => (pin.node.rejected))

  return {
    approved,
    pending,
    rejected
  }
})
const isError = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)

watch(file, (v) => {
  if (!v[0]) {
    fileBlobUrl.value = null
    return
  }
  fileBlobUrl.value = URL.createObjectURL(v[0])
})

const refetchSite = inject('refetchSite')
</script>