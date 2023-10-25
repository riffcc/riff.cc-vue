<template>
  <v-container class="py-14">
    <v-sheet min-height="75vh">
      <v-sheet v-if="!walletStore.address" width="320px" height="160px" class="pa-10 d-flex flex-column mx-auto">
        <p class="text-center mb-auto">Please connect your wallet</p>
        <div>
          <Connect block />
        </div>
      </v-sheet>
      <v-sheet v-else-if="!walletStore.isAdmin" width="320px" height="160px" class="pa-10 d-flex mx-auto">
        <v-alert type="error" title="Unauthorized" class="ma-auto"></v-alert>
      </v-sheet>
      <div v-else style="min-height: inherit;" class="d-flex flex-column">
        <v-tabs v-model="tab" center-active fixed-tabs>
          <v-tab slider-color="primary" value="content">Content</v-tab>
          <v-tab slider-color="primary" value="admins">Admins</v-tab>
          <v-tab slider-color="primary" value="featured">Featured</v-tab>
          <v-tab slider-color="primary" value="subscriptions">Subscriptions</v-tab>
          <v-tab slider-color="primary" value="site">Site</v-tab>

        </v-tabs>
        <v-window v-model="tab" class="flex-1-0">
          <v-window-item value="content" class="py-10 px-4 px-sm-12 px-md-16">
            <PinTable :pins="pins.approved" title="Approved" />
            <PinTable :pins="pins.pending" title="Pending" />
            <PinTable :pins="pins.rejected" title="Rejected" />
          </v-window-item>
          <v-window-item value="admins" class="py-10 px-4 px-sm-12 px-md-16">
            <NewAdmin @refetchUserAdmins="refetch" />
            <v-list v-if="adminEdgesResult?.ethAccountIndex?.edges && adminEdgesResult?.ethAccountIndex.edges.length > 0"
              class="ma-auto" max-width="500px">
              <AdminItem @refetchUserAdmins="refetch" v-for="admin in adminEdgesResult?.ethAccountIndex?.edges"
                :key="admin.node.id" :admin="admin.node" />
            </v-list>
            <p v-else class='m-auto text-sm text-center'>No extra admins found.</p>
          </v-window-item>
          <v-window-item value="featured" class="py-10 px-4 px-sm-12 px-md-16">
            <NewFeatured />
          </v-window-item>
          <v-window-item value="subscriptions" class="py-10 px-4 px-sm-12 px-md-16">
            <SubscriptionSearch />
            <v-sheet max-height="75%" class="overflow-y-auto">
              <v-sheet width="450px" class="my-2 mx-auto" v-if="subscriptionsResult?.subscriptionIndex?.edges?.length > 0"
                v-for="subscription in subscriptionsResult?.subscriptionIndex?.edges" :key="subscription.node.id">
                <SubscriptionItem :subscription="subscription.node.subscribedSite" />
              </v-sheet>
              <p v-else class='m-auto'>No subscriptions found.</p>
            </v-sheet>
          </v-window-item>
          <v-window-item value="site" class="py-10 px-4 px-sm-12 px-md-16">
            <v-sheet max-height="75%" class="d-flex">
              <v-container>
                <v-row>
                  <v-col>
                    <v-sheet class="h-100 pa-2">
                      <v-sheet position="relative">
                        <v-file-input v-model="file" accept="image/*" label="Site Image" prepend-icon="">
                          <template v-slot:prepend-inner>
                            <v-sheet border class="mr-2">
                              <v-img v-if="settingsStore?.siteImage" width="120px" height="120px" cover
                                :src="fileBlobUrl ? fileBlobUrl : `https://${IPFS_GATEWAY}/ipfs/${settingsStore.siteImage}`"></v-img>
                            </v-sheet>
                          </template>
                        </v-file-input>
                      </v-sheet>
                      <v-text-field label="Site Name" v-model="settingsStore.siteName"></v-text-field>
                      <v-textarea variant="solo-filled" label="Site Description"
                        v-model="settingsStore.siteDescription"></v-textarea>
                    </v-sheet>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <div v-if="settingsStore.colors" v-for="([key, value]) in Object.entries(settingsStore.colors)"
                      class="d-flex align-center">
                      <v-sheet class="ma-1" :color="value">
                        <v-menu no-click-animation :close-on-content-click="false">
                          <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" height="24px" variant="text">
                            </v-btn>
                          </template>
                          <v-color-picker position="static" v-model="settingsStore.colors[key]"
                            class="bg-background-lighten-1" mode="hex" color="white"></v-color-picker>

                        </v-menu>
                      </v-sheet>
                      <p class="ml-4 text-subtitle-1">{{ key }}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-btn :loading="isLoading" @click="handleSave" text="save" size="large" color="primary" rounded="0"
                  class="float-right mt-4"></v-btn>
                <v-snackbar color="success" v-model="isSuccess" timeout="3000">
                  <p class="text-center">{{ `Saved successfully!` }}</p>
                </v-snackbar>
                <v-snackbar color="error" v-model="isError" timeout="3000">
                  <p class="text-center">{{ `Has ocurred an error :(` }}</p>
                </v-snackbar>
              </v-container>

            </v-sheet>
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
  GET_SUBSCRIPTIONS,
  GET_ETH_ACCOUNT,
  GET_CATEGORIES,
  IPFS_GATEWAY
} from "@/config/constants";
import { computed, inject, provide, ref, watch } from "vue";
import { useWalletStore } from "@stores/wallet";
import {
  Connect,
  SubscriptionSearch,
  SubscriptionItem,
  NewFeatured,
  NewAdmin,
  PinTable,
  AdminItem
} from "@components"
import { useSettingsStore } from "@stores/settings";
import { parseColors, callAdminServer, uploadToIPFS } from "@utils"
const settingsStore = useSettingsStore()
const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID;
const tab = ref(null)
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;
const file = ref(null)
const fileBlobUrl = ref(null)
useQuery(GET_CATEGORIES, { id: siteID })


const {
  result: adminEdgesResult,
  loading: adminEdgesLoading,
  error: adminEdgesError,
  refetch
} = useQuery(GET_ETH_ACCOUNT, {
  items: 1000,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      isAdmin: {
        equalTo: true
      },
      address: {
        notEqualTo: walletStore.address
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});

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

const {
  result: subscriptionsResult,
  loading: subscriptionsLoading,
  error: subscriptionsError,
  fetchMore: fetchMoreSubscriptions,
  refetch: refetchSubscriptions
} = useQuery(GET_SUBSCRIPTIONS, {
  items: 20,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      inactive: {
        equalTo: false
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});
provide('refetchPins', refetchPins)
provide('refetchSubscriptions', refetchSubscriptions)

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
const handleSave = async () => {
  let msgToSign
  let signature
  msgToSign = "Update theme"



  const colors = parseColors(settingsStore.colors, true)

  try {
    isLoading.value = true
    signature = await window.ethereum.request({
      method: "personal_sign",
      params: [
        msgToSign,
        walletStore.address
      ]
    })
    let newSiteImageCID

    if (file.value?.[0]) {
      newSiteImageCID = await uploadToIPFS(file.value)
    }
    await callAdminServer(
      `${adminServerUrl}/site`, {
      action: "update",
      siteId: siteID,
      data: {
        name: settingsStore.siteName,
        description: settingsStore.siteDescription,
        image: newSiteImageCID ?? settingsStore.siteImage,
        colors
      },
      msg: msgToSign,
      signature,
      address: walletStore.address
    })
    isSuccess.value = true
    const result = await refetchSite()
    console.log('result of refetchSite', result)
  } catch (error) {
    console.log('error', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>