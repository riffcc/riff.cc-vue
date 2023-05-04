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
        :disabled="!siteID || loading"
      >
        Search
      </button>
    </div>
    <div
      v-if="showResult"
      class="absolute inset-x-0 -mt-3 bg-slate-900 border border-slate-500 z-10 w-full md:w-[29.5rem] mx-auto py-5 flex"
      @mouseleave="delayHideResult"
    >
      <SubscriptionItem v-if="siteID && site" :subscription="site.node" :isSubscribed="isSubscribed" />
      <p v-else class="m-auto text-sm">No website found.</p>
    </div>
  </div>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable';
import { computed, ref } from 'vue';
import { GET_WEBSITE } from '../utils/constants';
import SubscriptionItem from '../components/SubscriptionItem.vue'

const siteID = ref(null)
const showResult = ref(false)

const props = defineProps({
  subscriptionList: Array
})

const {load: getWebsite, result: site} = useLazyQuery(GET_WEBSITE)

const openResult = () => showResult.value = true
const hideResult = () => showResult.value = false
const delayHideResult = () => {
  setTimeout(() => {
    hideResult()
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
  hideResult()
  getWebsite(GET_WEBSITE, { id: siteID })
  openResult()
}

</script>