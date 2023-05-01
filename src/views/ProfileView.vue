<template>
  <main class="bg-gray-900 min-h-screen p-10 text-white">
    <div v-if="walletStore.address && walletStore.accountId" class="grid h-full gap-3">
      <p class="font-semibold ml-4 text-lg flex-none">Approved</p>
      <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
        <PieceList
          v-if="pieces.approved.length > 0"
          :list="pieces.approved"
          table
        /> 
      </div>
      <p class="font-semibold ml-4 text-lg flex-none">Pending</p>
        <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
          <PieceList
            v-if="pieces.pending.length > 0"
            :list="pieces.pending"
            table
          /> 
        </div>
        <p class="font-semibold ml-4 text-lg flex-none">Rejected</p>
        <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
          <PieceList
            v-if="pieces.rejected.length > 0"
            :list="pieces.rejected"
            table
          /> 
        </div>
    </div>
    <div v-else class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20">
      <p>Please connect your wallet</p>
      <Connect />
    </div>
  </main>
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable"
import { GET_PINS, websiteDataQueryParams } from "../utils/constants";
import { computed } from "vue";
import { useWalletStore } from "../stores/wallet";
import PieceList from "../components/PieceList.vue"
import Connect from "../components/Layout/Connect.vue"

const walletStore = useWalletStore()
const id = import.meta.env.VITE_WEBSITE_ID;
const {
  result: pinsResult,
  loading: pinsLoading,
  error: pinsError,
  fetchMore: fetchMorePins
} = useQuery(GET_PINS, {
  id,
  pageSize: websiteDataQueryParams.pageSizeMedium
});

const pieces = computed (() => {
  if (!walletStore.address || !walletStore.accountId || !(pinsResult.value.node.pins.edges.length > 0)) {
    return {
      approved: [],
      pending: [],
      rejected: []
    }
  }
  const list = pinsResult.value.node.pins.edges.filter(pin => pin.node.owner.address === walletStore.address)
  const approved = list && list.filter(pin => (!pin.node.deleted && pin.node.approved && !pin.node.rejected))
  const pending = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && !pin.node.rejected))
  const rejected = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && pin.node.rejected))
  return {
    approved,
    pending,
    rejected
  }
})

</script>