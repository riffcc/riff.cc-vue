<template>
  <main class="bg-gray-900 min-h-screen py-6 sm:py-10 px-4 sm:px-10 text-white">
    <div v-if="walletStore.address && walletStore.accountId && walletStore.isAdmin" class="grid h-full gap-3">
      <div class="flex flex-col gap-3">
        <h1 class='font-bold text-lg sm:text-xl border-b border-slate-500 pb-2'>Content</h1>
        <p class="font-semibold ml-4 text-md sm:text-lg text-center">Approved</p>
        <div class='border rounded-xl border-slate-400 min-h-[20rem] flex'>
          <PieceList v-if="pieces.approved.length > 0" :list="pieces.approved" table />
          <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
        </div>
        <p class="font-semibold ml-4 text-md sm:text-lg text-center">Pending</p>
        <div class='border rounded-xl border-slate-400 min-h-[20rem] flex'>
          <PieceList v-if="pieces.pending.length > 0" :list="pieces.pending" table />
          <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
        </div>
        <p class="font-semibold ml-4 text-md sm:text-lg text-center">Rejected</p>
        <div class='border rounded-xl border-slate-400 min-h-[20rem] flex'>
          <PieceList v-if="pieces.rejected.length > 0" :list="pieces.rejected" table />
          <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
        </div>
      </div>
      <div class='flex flex-col w-full mt-10 border-t-2 border-slate-500 py-2'>
        <h1 class='font-bold text-lg sm:text-xl flex-none mb-2'>Subscriptions</h1>
        <div class='grid border-t border-slate-500 py-4 min-h-[20rem]'>
          <SubscriptionSearch :subscriptionList="subscriptionList" />
          <SubscriptionList 
            v-if="subscriptionList.length > 0"
            :subscriptionList="subscriptionList" 
          />
          <p v-else class='m-auto'>No subscriptions found.</p>
        </div>
      </div>
      <div class='flex flex-col w-full mt-10 border-t-2 border-slate-500 py-2'>
        <h1 class='font-bold text-lg sm:text-xl flex-none mb-2'>Featured</h1>
        <div class='grid border-t border-slate-500 py-4 min-h-[20rem]'>
          <NewFeatured />
        </div>
      </div>
      <div v-if="walletStore.adminIsSuper" class='grid w-full mt-10 border-t-2 border-slate-500 py-2'>
        <h1 class='font-bold text-lg sm:text-xl mb-2'>Admins</h1>
        <div class="flex flex-col lg:flex-row justify-center items-center py-10 border-t border-slate-500  min-h-[20rem] gap-10">
          <NewAdmin :refetchAdmins="refetchAdmins" />
          <div class='w-80 sm:w-[25rem] mx-auto'>
            <AdminList v-if="adminList && adminList.length > 0" :list="adminList" />
            <p v-else class='m-auto text-sm text-center'>No extra admins found.</p>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-else-if="!walletStore.address"
      class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20"
    >
      <p>Please connect your wallet</p>
      <Connect />
    </div>
    <div 
      v-else-if="!walletStore.isAdmin"
      class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20"
    >
    <p>Unauthorized</p>
    <v-icon name="hi-x-circle" class="h-12 w-12 text-red-400" />
  </div>
  </main>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable"
import { 
  GET_PINS, 
  GET_SUBSCRIPTION_INDEX, 
  GET_ADMINS, 
  GET_SUBSCRIPTIONS, 
  websiteDataQueryParams, 
GET_CATEGORIES
} from "../utils/constants";
import { computed, provide } from "vue";
import { useWalletStore } from "../stores/wallet";
import PieceList from "../components/PieceList.vue"
import Connect from "../components/Layout/Connect.vue"
import SubscriptionSearch from "../components/SubscriptionSearch.vue"
import SubscriptionList from "../components/SubscriptionList.vue"
import NewFeatured from "../components/NewFeatured.vue"
import NewAdmin from "../components/NewAdmin.vue"
import AdminList from "../components/AdminList.vue"


const walletStore = useWalletStore()
const id = import.meta.env.VITE_WEBSITE_ID;
const {
  result: pinsResult,
  loading: pinsLoading,
  error: pinsError,
  fetchMore: fetchMorePins,
  refetch: refetchPins
} = useQuery(GET_PINS, {
  id,
  pageSize: websiteDataQueryParams.pageSizeMedium
}, {
  fetchPolicy: "network-only"
});

const {
  result: adminsResult,
  loading: adminsLoading,
  error: adminsError,
  refetch: refetchAdmins
} = useQuery(GET_ADMINS, {
  id,
  pageSize: websiteDataQueryParams.pageSizeMax
});

useQuery(GET_CATEGORIES, { id, pageSize: 50 })


const {
  result: subscriptionIndexResult,
  loading: subscriptionIndexLoading,
  error: subscriptionIndexError,
  fetchMore: fetchMoreSubscriptionIndex,
} = useQuery(GET_SUBSCRIPTION_INDEX, {
  pageSize: websiteDataQueryParams.pageSizeMedium
});

const {
  result: subscriptionResult,
  loading: subscriptionLoading,
  error: subscriptionError,
  fetchMore: fetchMoreSubscription,
  refetch: refetchSubscriptions
} = useQuery(GET_SUBSCRIPTIONS, {
  id,
  pageSize: websiteDataQueryParams.pageSizeMedium
});
provide('refetchPins', refetchPins)
provide('refetchSubscriptions', refetchSubscriptions)

const pieces = computed(() => {
  if (!walletStore.address || !walletStore.accountId || !pinsResult || !(pinsResult.value.node.pins.edges.length > 0)) {
    return {
      approved: [],
      pending: [],
      rejected: []
    }
  }
  const list = pinsResult.value.node.pins.edges
  const approved = list && list.filter(pin => (!pin.node.deleted && pin.node.approved && !pin.node.rejected))
  const pending = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && !pin.node.rejected))
  const rejected = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && pin.node.rejected))
  return {
    approved,
    pending,
    rejected
  }
})

const adminList = computed(() => {
  if (!adminsResult.value) {
    return []
  }
  const list = adminsResult.value.node.admins.edges
  const activeAdminsList = list.filter((edge) => !edge.node.inactive)
  return activeAdminsList.length > 0 ? activeAdminsList.filter((edge) => edge.node.id !== walletStore.adminId) : []
})

const subscriptionList = computed(() => {
  const list = subscriptionResult.value.node.subscriptions.edges
  return list.length > 0 ? list.filter(subscription => !subscription.node.inactive) : []
})

// const subscriberList = computed(() => {
//   const list = subscriptionIndexResult.value.subscriptionIndex.edges
//   return list.length > 0 ? list.filter((edge) => edge.node.subscribedID === id) : []
// })

</script>