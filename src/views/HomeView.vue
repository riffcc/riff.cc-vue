<template>
  <div class="flex flex-col gap-3 relative">
    <div class="bg-gray-900 min-h-screen py-10 px-4 sm:px-8 md:px-16 flex">
      <div class="flex flex-col w-full">
        <div v-if="featuredList.almostOneActive && featuredList.list.length > 0" class="min-h-[20rem]">
          <h1 class="font-bold text-xl border-b border-slate-500 flex-none pb-2">Featured</h1>
          <PieceList :list="featuredList.list" />
        </div>
        <h1 class="font-bold text-xl border-b border-slate-500 text-slate-50 flex-none pb-2">Content</h1>
        <p v-if="pinEdgesError || subscriptionEdgesError || featuredEdgesError">Something went wrong...</p>
        <Spinner v-if="pinEdgesLoading || subscriptionEdgesLoading || featuredEdgesLoading" :className="'animate-spin h-8 w-8 text-slate-50 m-auto'" />
        <PieceList v-if="pinList.length > 0" :list="pinList" />
        <!-- <p v-if="! && !(pinList.length > 0)" class="m-auto">No content found.</p> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import PieceList from '../components/PieceList.vue';
import Spinner from '../components/Layout/Spinner.vue';

import { 
  websiteDataQueryParams,
  GET_PINS, 
  GET_SUBSCRIPTIONS, 
  GET_FEATURED 
} from '../utils/constants';

import { getDate } from '../utils/getDate'

const runFeaturedTime = (featured) => {
  const now = getDate('number')
  return parseInt(featured.startAt) < now && parseInt(featured.endAt) > now
}

const websiteId = import.meta.env.VITE_WEBSITE_ID


const { 
  result: pinEdgesResult, 
  loading: pinEdgesLoading, 
  error: pinEdgesError,
  fetchMore: fetchMorePins
} = useQuery(GET_PINS, {
  id: websiteId,
  pageSize: websiteDataQueryParams.pageSizeMedium
});

const { 
  result: subscriptionEdgesResult, 
  loading: subscriptionEdgesLoading, 
  error: subscriptionEdgesError 
} = useQuery(GET_SUBSCRIPTIONS, {
  id: websiteId,
  pageSize: websiteDataQueryParams.pageSizeMedium
});

const {
  result: featuredEdgesResult,
  loading: featuredEdgesLoading,
  error: featuredEdgesError
} = useQuery(GET_FEATURED, {
  id: websiteId,
  pageSize: websiteDataQueryParams.pageSizeMedium
});


const featuredList = computed(() => {
  const empty = {
    list: [],
    almostOneActive: false
  }
  if (!featuredEdgesResult.value || !featuredEdgesResult.value.node) {
    return empty
  }
  const featuredPinsEdges = featuredEdgesResult.value.node.featured.edges
  const almostOneActive = featuredPinsEdges.map((edge) => runFeaturedTime(edge)).length > 0

  return {
    list: featuredPinsEdges,
    almostOneActive
  }
});

const pinList = computed(() => {
  if (!pinEdgesResult.value || !pinEdgesResult.value.node || !subscriptionEdgesResult.value || !subscriptionEdgesResult.value.node) {
    return []
  }
  const websitePinsEdges = pinEdgesResult.value.node.pins.edges
  const subscriptionsPieceEdges = subscriptionEdgesResult.value.node.subscriptions.edges.map(subscriptionEdge => subscriptionEdge.node.subscribedWebsite.pins.edges)
  const subscriptionsPieceEdgesFlat = subscriptionsPieceEdges.flat()
  const mergedList = websitePinsEdges.concat(subscriptionsPieceEdgesFlat) 
  return mergedList.filter(pin => pin.node.approved);
});

function loadMorePins() {
  fetchMorePins({
    variables: {
      cursor: pinEdgesResult.value.node.pins.pageInfo.endCursor,  // Utiliza el cursor de la pageInfo para obtener más resultados
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const newEdges = fetchMoreResult.node.pins.edges;
      const pageInfo = fetchMoreResult.node.pins.pageInfo;
      return newEdges.length ? {
        ...previousResult,
        node: {
          ...previousResult.node,
          pins: {
            ...previousResult.node.pins,
            edges: [
              ...previousResult.node.pins.edges,
              ...newEdges,
            ],
            pageInfo,
          }
        }
      } : previousResult;
    },
  });
}


</script>

<style scoped>
/* Estilos específicos del componente HomeView */
</style>
