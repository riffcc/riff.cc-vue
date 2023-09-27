<template>
  <div class="flex flex-col gap-3 relative">
    <div class="min-h-screen py-10 px-4 sm:px-8 md:px-16 flex">
      <div v-if="pinList" class="w-full">
        <div class="flex flex-wrap h-3/4 p-10 justify-center gap-4">
          <PieceItem v-for="edge in pinList" :key="edge.node.id" :pin="edge.node" />
        </div>
        <div class="flex items-center">
          <Pagination
            v-if="pageInfo?.hasNextPage || page > 1"
            :page="page"
            :hasNextPage="pageInfo?.hasNextPage"
            :handlePrevPage="handlePrevPage"
            :handleNextPage="handleNextPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useLazyQuery, useQuery } from '@vue/apollo-composable';
import Spinner from '../components/Layout/Spinner.vue';

import {
  GET_PINS,
  GET_SUBSCRIPTIONS,
  GET_FEATUREDS
} from '../config/constants';
import Pagination from '../components/Pagination.vue';
import PieceItem from '../components/PieceItem.vue';

const siteID = import.meta.env.VITE_WEBSITE_ID

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

const {
  result: pinsResult,
  load: fetchPins,
  loading: pinsResultLoading,
  error: pinsResultError,
  fetchMore: fetchMorePins
} = useLazyQuery(GET_PINS, undefined, {
  fetchPolicy: 'network-only'
});

const pinList = computed(() => pinsResult.value?.pinIndex?.edges ?? [])
const pageInfo = computed(() => pinsResult.value?.pinIndex?.pageInfo ?? null)
const pinsFilters = computed(() => {
  let ids = [siteID]
  const subscriptions = subscriptionsResult.value?.subscriptionIndex?.edges
  if (subscriptions && subscriptions.length > 0) {
    ids = [...ids, ...subscriptions.map(subscription => subscription.node.subscribedID)]
  }
  return {
    where: {
      siteID: {
        in: ids
      },
      approved: {
        equalTo: true
      }
    }
  }
})



watch(pinsFilters, async (filters) => {
  if (!filters) return;

  await fetchPins(
    undefined,
    {
      items: 2,
      filters
    }
  )
})



const {
  result: featuredResult,
  loading: featuredEdgesLoading,
  error: featuredEdgesError,
  refetch: refetchFeatured,
  fetchMore: fetchMoreFeatured
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


const page = ref(1)
const handleNextPage = async () => {
  console.log('from handleNextPage')
  await fetchMorePins({
    variables: {
      items: 2,
      filters: pinsFilters.value,
      after: pageInfo.value.endCursor
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      return fetchMoreResult ?? previousResult
    }
  })
    page.value += 1

}
const handlePrevPage = async () => {
  if (page.value - 1 === 0) return
  console.log('from handlePrevPage')

  await fetchMorePins({
    variables: {
      items: 2,
      filters: pinsFilters.value,
      before: pageInfo.value.startCursor
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      return fetchMoreResult ?? previousResult
    }
  })
    page.value -= 1

}
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

