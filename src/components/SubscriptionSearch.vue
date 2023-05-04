<template>
  <div class='h-20 relative'>
    <div class='flex items-center justify-center gap-2 h-full'>
      <input
        type="text"
        class=' sm:w-80 md:w-96 bg-slate-800 h-9 px-1.5'
        placeholder='Site ID'
        v-model="siteID"
      />
      <button
        class='w-fit sm:w-20 px-1.5 h-10 uppercase text-sm font-semibold border border-slate-500 disabled:text-slate-400'
        @click="handleOnSearch"
        :disabled="!siteID || loading || !isValidID || isEqualToOwnSite"
      >
        Search
      </button>
    </div>
    <p v-if="siteID && isEqualToOwnSite" class="text-xs absolute -bottom-3 inset-x-0 w-fit mx-auto text-red-400">You can't subscribe to your own site.</p>
    <p v-else-if="siteID && !isValidID" class="text-xs absolute -bottom-3 inset-x-0 w-fit mx-auto text-red-400">Invalid site ID.</p>
    <div
      v-if="siteID && showResult"
      class="absolute inset-x-0 -mt-3 bg-slate-900 border border-slate-500 z-10 w-full md:w-[29.5rem] mx-auto py-5 flex"
      @mouseleave="delayHideResult"
    >
      <SubscriptionItem v-if="site && site.node" :subscription="site.node" :isSubscribed="isSubscribed" />
      <p v-else class="m-auto text-sm">No website found.</p>
    </div>
  </div>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable';
import { computed, ref } from 'vue';
import { GET_WEBSITE } from '../utils/constants';
import SubscriptionItem from '../components/SubscriptionItem.vue'
const id = import.meta.env.VITE_WEBSITE_ID;
const siteID = ref(null)
const showResult = ref(false)

const props = defineProps({
  subscriptionList: Array
})

const {load: getWebsite, result: site, restart} = useLazyQuery(GET_WEBSITE)
const isEqualToOwnSite = computed(() => {
  return id === siteID.value
})
const isValidID = computed(() => {
  return !!(siteID && siteID.value.length === 63 && siteID.value.startsWith('k'))
})


const openResult = () => showResult.value = true
const hideResult = () => showResult.value = false
const delayHideResult = () => {
  setTimeout(() => {
    hideResult()
    restart()
    siteID.value = null
  }, 700)
  
};

const isSubscribed = computed(() => {
  if (!siteID.value) {
    return false
  }
  const index = props.subscriptionList.findIndex((edge) => edge.node.subscribedID === siteID.value && !edge.node.inactive)
  return index === -1 ? false : true
})

const handleOnSearch = async () => {
  if(!siteID.value) {
    return
  }
  hideResult()
  getWebsite(GET_WEBSITE, { id: siteID.value })
  openResult()
}

</script>