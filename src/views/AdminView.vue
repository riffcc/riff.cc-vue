<template>
  <main class="min-h-screen py-2 sm:py-4 px-8 sm:px-12 md:px-24 xl:px-72 text-white">
    <div v-if="!walletStore.address"
      class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20">
      <p>Please connect your wallet</p>
      <Connect />
    </div>
    <div v-else-if="!walletStore.isAdmin"
      class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20">
      <p>Unauthorized</p>
      <v-icon name="hi-x-circle" class="h-12 w-12 text-red-400" />
    </div>
    <div v-else-if="walletStore.accountId">
      <div class="flex justify-evenly py-4">
        <button 
          v-for="item in tabs" 
          :class="activeTab === item ? 'py-1 flex-1 px-4 bg-primary' : 'border border-slate-700 py-1 flex-1 px-4'"
          @click="() => handleSelectTab(item)"
        >
        {{ item }}
        </button>
      </div>
      <div v-if="activeTab === 'content'" class="grid h-full py-10">
        <h1 class='font-bold text-lg sm:text-xl'>Content</h1>
        <div class="grid mt-4 border-t border-slate-600 py-4 relative">
          <p class="font-semibold ml-4 text-md sm:text-lg text-center">Approved</p>
          <div class='border border-slate-600 min-h-[20rem] flex my-4'>
            <PieceList v-if="pins.approved.length > 0" :list="pins.approved" table />
            <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
          </div>
          <p class="font-semibold ml-4 text-md sm:text-lg text-center">Pending</p>
          <div class='border border-slate-600 min-h-[20rem] flex my-4'>
            <PieceList v-if="pins.pending.length > 0" :list="pins.pending" table />
            <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
          </div>
          <p class="font-semibold ml-4 text-md sm:text-lg text-center">Rejected</p>
          <div class='border border-slate-600 min-h-[20rem] flex my-4'>
            <PieceList v-if="pins.rejected.length > 0" :list="pins.rejected" table />
            <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'subscriptions'" class="grid h-full py-10">
        <h1 class='font-bold text-lg sm:text-xl flex-none'>Subscriptions</h1>
        <div class='grid mt-4 border-t border-slate-600 py-10'>
          <SubscriptionSearch />
          <Spinner v-if="subscriptionsLoading" class-name="w-5 h-5 mx-auto" />
          <SubscriptionItem v-else-if="subscriptionsResult?.subscriptionIndex?.edges?.length > 0"
            v-for="subscription in subscriptionsResult?.subscriptionIndex?.edges" :key="subscription.node.id"
            :subscription="subscription.node.subscribedSite" />
          <p v-else class='m-auto'>No subscriptions found.</p>
        </div>
      </div>
      <div v-else-if="activeTab === 'featured'" class="grid h-full py-10">
        <h1 class='font-bold text-lg sm:text-xl flex-none'>Featured</h1>
        <div class='grid mt-4 border-t border-slate-600 py-10'>
          <NewFeatured />
        </div>
      </div>
      <div v-else-if="activeTab === 'admins' && walletStore.isSuperAdmin" class="grid h-full py-10">
        <h1 class='font-bold text-lg sm:text-xl'>Admins</h1>
        <div class="flex flex-col lg:flex-row justify-center items-center mt-4 border-t border-slate-600 py-10">
          <NewAdmin @refetchUserAdmins="refetch" />
          <div class='w-80 sm:w-[25rem] mx-auto'>
            <ul v-if="adminEdgesResult?.ethAccountIndex?.edges && adminEdgesResult?.ethAccountIndex.edges.length > 0">
              <AdminItem @refetchUserAdmins="refetch" v-for="admin in adminEdgesResult?.ethAccountIndex?.edges"
                :key="admin.node.id" :admin="admin.node" />
            </ul>
            <p v-else class='m-auto text-sm text-center'>No extra admins found.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable"
import {
  GET_PINS,
  GET_SUBSCRIPTIONS,
  GET_ETH_ACCOUNT,
  GET_CATEGORIES
} from "../config/constants";
import { computed, provide, ref, watch } from "vue";
import { useWalletStore } from "../stores/wallet";
import PieceList from "../components/PieceList.vue"
import Connect from "../components/Layout/Connect.vue"
import SubscriptionSearch from "../components/SubscriptionSearch.vue"
import SubscriptionItem from "../components/SubscriptionItem.vue";
import NewFeatured from "../components/NewFeatured.vue"
import NewAdmin from "../components/NewAdmin.vue"
import AdminItem from "../components/AdminItem.vue";
import Spinner from "../components/Layout/Spinner.vue";


const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID;
const activeTab = ref('content')

const tabs = [
  "content",
  "admins",
  "featured",
  "subscriptions"
]

const handleSelectTab = (tab) => {
  activeTab.value = tab
}
 
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

</script>