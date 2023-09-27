<template>
  <div class="flex items-center gap-1 justify-center w-[21rem] sm:w-[26rem] px-2 mx-auto">
    <div class="h-24 w-24 sm:h-28 sm:w-28 border-slate-800 border relative flex">
      <img v-if="subscription.image" :src="`https://${ipfsGateway}/ipfs/${subscription.image}`" alt="" class="my-auto">
      <v-icon v-else name="hi-credit-card" class="h-20 w-20 text-slate-200 m-auto" />
    </div>
    <div class="border-slate-800 border h-24 sm:h-28 px-2 py-1 flex-1">
      <div class="flex items-center justify-between w-full h-8">
        <p class="truncate text-sm font-medium">{{ subscription.name }}</p>
        <button v-if="!isSubscribed || isSubscribed.inactive"
          class="border border-slate-600 px-1.5 py-0.5 bg-cyan-500 delay-400 text-xs sm:text-sm uppercase font-semibold"
          @click="handleOnSubscribe">
          Subscribe
        </button>
        <button v-else
          class="border border-slate-600 px-1.5 py-0.5 bg-red-500 delay-400 text-xs sm:text-sm uppercase font-semibold"
          @click="handleOnUnsubscribe">
          Unsubscribe
        </button>
      </div>
      <div class="overflow-y-auto h-16 w-full md:w-60 pt-1">
        <p class="text-xs text-slate-400">{{ subscription.description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_SUBSCRIPTIONS } from '../config/constants';
import { computed, inject } from 'vue';
import callAdminServer from '../utils/callAdminServer';
import { useWalletStore } from '../stores/wallet';

const props = defineProps({
  subscription: Object
})
const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY
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
        equalTo: props.subscription.id
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

const handleOnSubscribe = async () => {

  try {
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
  }
}

const handleOnUnsubscribe = async () => {
  try {
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
  }
}

</script>