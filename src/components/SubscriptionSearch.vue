<template>
  <div class='h-20 relative'>
    <div class='flex items-center justify-center gap-2 h-full'>
      <input type="text" class='form-input sm:w-80 md:w-96 bg-background-secondary h-9 px-1.5' placeholder='Site ID' v-model="siteTargetID" />
      <button
        class='w-fit sm:w-20 px-1.5 h-10 uppercase text-sm font-semibold border border-slate-500 disabled:text-slate-400'
        @click="handleOnSearch" :disabled="!siteTargetID || loading || !isValidID || isEqualToOwnSite">
        Search
      </button>
    </div>
    <p v-if="siteTargetID && isEqualToOwnSite" class="text-xs absolute -bottom-3 inset-x-0 w-fit mx-auto text-red-400">You
      can't subscribe to your own site.</p>
    <p v-else-if="siteTargetID && !isValidID" class="text-xs absolute -bottom-3 inset-x-0 w-fit mx-auto text-red-400">
      Invalid site ID.</p>
    <div v-if="siteTargetID && showResult" @mouseleave="delayClose"
      class="absolute inset-x-0 -mt-3 bg-slate-900 border border-slate-500 z-10 w-full md:w-[29.5rem] mx-auto py-5 flex">
      <SubscriptionItem v-if="site && site.node" :subscription="site.node" />
      <p v-else class="m-auto text-sm">No site found.</p>
    </div>
  </div>
</template>

<script setup>
import { useApolloClient, useLazyQuery } from '@vue/apollo-composable';
import { computed, ref, watch } from 'vue';
import { GET_SUBSCRIPTIONS, GET_WEBSITE } from '../config/constants';
import SubscriptionItem from '../components/SubscriptionItem.vue'

const { resolveClient } = useApolloClient()

const siteID = import.meta.env.VITE_WEBSITE_ID;
const siteTargetID = ref(null)
const showResult = ref(false)

const { load: getSite, result: site, restart } = useLazyQuery(GET_WEBSITE)
const isEqualToOwnSite = computed(() => {
  return siteID === siteTargetID.value
})
const isValidID = computed(() => {
  return !!(siteTargetID && siteTargetID.value.length === 63 && siteTargetID.value.startsWith('k'))
})


const openResult = () => showResult.value = true
const closeResult = () => showResult.value = false
const delayClose = () => {
  setTimeout(() => {
    closeResult()
    restart()
    siteTargetID.value = null
  }, 1000)

};

const handleOnSearch = async () => {
  if (!siteTargetID.value) {
    return
  }
  openResult()
  getSite(GET_WEBSITE, { id: siteTargetID.value })
}

</script>