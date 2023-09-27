<template>
  <div class="flex flex-col gap-3 relative">
    <div class="min-h-screen py-10 px-4 sm:px-8 md:px-16 flex">
      <p v-if="pinsResultError">Something went wrong...</p>
      <Spinner v-else-if="pinsResultLoading" :className="'animate-spin h-8 w-8 text-slate-50 m-auto'" />
      <div v-else class="flex flex-col w-full">
        <div v-if="featuredResult?.featuredIndex?.edges?.length > 0" class=" bg-gray-700">
          <PieceList :list="featuredResult?.featuredIndex?.edges" />
        </div>
        <PieceList v-if="pinsResult?.pinIndex?.edges?.length > 0" :list="pinsResult?.pinIndex?.edges" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useLazyQuery, useQuery } from '@vue/apollo-composable';
import PieceList from '../components/PieceList.vue';
import Spinner from '../components/Layout/Spinner.vue';

import {
  GET_PINS,
  GET_SUBSCRIPTIONS,
  GET_FEATUREDS
} from '../config/constants';

const siteID = import.meta.env.VITE_WEBSITE_ID
const {
  result: pinsResult,
  load: fetchPins,
  loading: pinsResultLoading,
  error: pinsResultError,
  fetchMore: fetchMorePins
} = useLazyQuery(GET_PINS, {
  items: 100,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      approved: {
        equalTo: true
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});

const {
  result: subscriptionsResult,
  loading: subscriptionsLoading,
  error: subscriptionsError
} = useQuery(GET_SUBSCRIPTIONS, {
  items: 1000,
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


watch(subscriptionsResult, async (subscriptions) => {
  const subscriptionsNodes = subscriptions?.subscriptionIndex?.edges
  let filtersIds = [siteID]
  if (subscriptionsNodes && subscriptionsNodes.length > 0) {
    filtersIds = [...filtersIds, ...subscriptionsNodes.map(subscription => subscription.node.subscribedID)]
  }
  await fetchPins(
    undefined,
    {
      items: 1000,
      filters: {
        where: {
          siteID: {
            in: filtersIds
          },
          approved: {
            equalTo: true
          }
        }
      }
    }
  )
})

const {
  result: featuredResult,
  loading: featuredEdgesLoading,
  error: featuredEdgesError,
  refetch: refetchFeatured
} = useQuery(GET_FEATUREDS, {
  items: 1000,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      startAt: {
        lessThanOrEqualTo: (new Date).toISOString()
      },
      endAt: {
        greaterThanOrEqualTo: (new Date).toISOString()
      }
    }
  }
}, {
  fetchPolicy: 'network-only'
});


setInterval(() => refetchFeatured({
  items: 1000,
  filters: {
    where: {
      siteID: {
        equalTo: siteID
      },
      startAt: {
        lessThanOrEqualTo: (new Date).toISOString()
      },
      endAt: {
        greaterThanOrEqualTo: (new Date).toISOString()
      }
    }
  }
}), 60000)
</script>

