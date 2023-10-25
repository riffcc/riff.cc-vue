<template>
  <v-card rounded="0" elevation="2" class="d-flex" height="120px" :loading="subscriptionLoading">
    <v-sheet width="120px" height="120px" class="d-flex" :loading="subscriptionLoading">
      <v-img v-if="subscription.image" cover :src="`https://${IPFS_GATEWAY}/ipfs/${subscription.image}`"></v-img>
      <v-icon v-else icon="fas fa-pager" size="x-large" class="ma-auto"></v-icon>
    </v-sheet>
    <div class="flex-1-0 pt-2">
      <v-card-title>{{ subscription.name }}</v-card-title>
      <v-card-text>{{ subscription.description }}</v-card-text>
    </div>
    <v-card-actions class="" >
      <v-btn v-if="!isSubscribed || isSubscribed.inactive" text="Subscribe" color="info" size="small" @click="handleOnSubscribe" :disabled="subscriptionLoading"></v-btn>
      <v-btn v-else text="Unsubscribe" color="error" size="small" @click="handleOnUnsubscribe" :disabled="subscriptionLoading"></v-btn>
    </v-card-actions>
  </v-card>
</template>


<script setup>
import { computed, inject, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_SUBSCRIPTIONS, IPFS_GATEWAY } from '@config/constants';
import { callAdminServer } from '@utils';
import { useWalletStore } from '@stores/wallet';

const props = defineProps({
  subscription: Object,
  closeSearchResult: Function
})
const siteID = import.meta.env.VITE_WEBSITE_ID
const adminNodeUrl = import.meta.env.VITE_ADMIN_SERVER

const walletStore = useWalletStore()

const refetchSubscriptions = inject('refetchSubscriptions')

const {
  result: subscriptionExistResult
} = useQuery(GET_SUBSCRIPTIONS, {
  items: 1,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      subscribedID: {
        equalTo: props.subscription?.id
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});
const isSubscribed = computed(() => {
  const subscriptionNode = subscriptionExistResult.value?.subscriptionIndex?.edges[0]?.node
  if (!subscriptionNode) return null
  return subscriptionNode
})
const subscriptionLoading = ref(false)

const handleOnSubscribe = async () => {

  try {
    subscriptionLoading.value = true
    const msgToSign = "Create new subscription"
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [
        msgToSign,
        walletStore.address
      ]
    })
    if (!isSubscribed.value) {
      await callAdminServer(
        `${adminNodeUrl}/subscription`, {
        action: "create",
        data: {
          siteID,
          subscribedID: props.subscription.id,
          inactive: false,
          createdAt: (new Date).toISOString(),
          updatedAt: (new Date).toISOString()
        },
        msg: msgToSign,
        signature,
        address: walletStore.address
      })
    } else {
      await callAdminServer(
        `${adminNodeUrl}/subscription`, {
        action: "update",
        data: {
          id: isSubscribed.value.id,
          content: {
            inactive: false,
            updatedAt: (new Date).toISOString()
          }
        },
        msg: msgToSign,
        signature,
        address: walletStore.address
      })
    }
    refetchSubscriptions()
  } catch (error) {
    console.log('error on handleSubscribe', error)
  } finally {    
    props.closeSearchResult?.()
    subscriptionLoading.value = false
  }
}

const handleOnUnsubscribe = async () => {
  try {
    subscriptionLoading.value = true
    const msgToSign = "Delete subscription"
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [
        msgToSign,
        walletStore.address
      ]
    })
    await callAdminServer(
      `${adminNodeUrl}/subscription`, {
      action: "update",
      data: {
        id: isSubscribed.value.id,
        content: {
          inactive: true,
          createdAt: (new Date).toISOString()
        }
      },
      msg: msgToSign,
      signature,
      address: walletStore.address
    })
    refetchSubscriptions()
  } catch (error) {
    console.log('error on handleUnsubscribe', error)
  } finally {    
    props.closeSearchResult?.()
    subscriptionLoading.value = false
  }
}

</script>