<template>
  <v-container>
    <v-sheet min-height="75vh">
      <v-carousel hide-delimiters height="400px">
        <template v-slot:prev="{ props }">
          <v-btn v-bind="props" variant="solo">
          </v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn v-bind="props" variant="solo">
          </v-btn>
        </template>
        <v-carousel-item src="/movie-abc.png" cover gradient="to right, rgba(0,0,0,.80), rgba(0,0,0,.01)">
          <!-- <v-div class="d-flex align-center justify-center justify-md-start h-100"> -->
          <v-container class="fill-height">
            <v-row justify="center" align="center" justify-sm="space-around" class="px-sm-12">
              <v-col cols="12" sm="7" md="6" lg="5">

                <v-sheet color="transparent" class="my-10">
                  <p class="mb-4 text-h5 text-lg-h4">The Dinosaur</p>
                  <div class="d-flex align-center">
                    <v-rating half-increments size="small" v-model="rating" color="primary"></v-rating>
                    <p class="ml-4">{{ `${rating} (Imbd)` }}</p>
                  </div>
                  <div class="d-flex align-center">
                    <p class="ml-4 bg-background.lighten-2 pa-1 mr-2">PG</p>
                    <p class="text-subtitle-2 text-medium-emphasis mr-2">1 hr : 44 mins</p>
                    <v-icon style="font-size: 8px;" icon="fas fa-circle"></v-icon>
                    <p class="text-subtitle-2 text-medium-emphasis ml-2">Fer 2018</p>
                  </div>
                  <p class="text-subtitle-2 text-medium-emphasis mb-4" style="line-height: 1.1em;">Dream your moments,
                    Dinosaurs are a diverse group of reptiles[note 1] of the clade Dinosauria. They first appeared during
                    the Triassic period, between 243 and 233.23 million years ago (mya), although the exact origin and
                    timing of the evolution of dinosaurs is the subject of active research.
                  </p>
                  <div class="d-flex mt-8">
                    <v-btn color="primary" rounded="0" prepend-icon="fas fa-play" class="text-none mr-4"
                      text="Play Now"></v-btn>
                  </div>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="2">

                <v-btn variant="plain" class="text-none text-h6" :ripple="false" size="x-large">
                  <template v-slot:prepend>
                    <v-icon icon="far fa-circle-play" class="mb-1" size="small"></v-icon>
                  </template>
                  Watch Trailer</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <!-- </v-div> -->
        </v-carousel-item>
      </v-carousel>
      <v-container class="mt-4">
        <v-container class="d-flex justify-between w-100">
          <p class="text-h5 font-weight-bold mb-6 mr-auto">TV Popular Shows</p>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-left" size="x-small"></v-icon>
          </v-btn>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-right" size="x-small" color="primary"></v-icon>
          </v-btn>
        </v-container>
        <v-row justify="center">
          <v-col v-for="col in staticData['tv-popular-shows']" :key="col">
            <v-sheet height="160px" max-width="260px" color="background" position="relative">
              <v-img :src="col.img" height="100%" cover gradient="to bottom, rgba(0,0,0,.4), rgba(0,0,0,.41)"></v-img>
              <v-sheet color="transparent" position="absolute" location="inset"
                class="px-4 d-flex align-center justify-between">
                <div class="flex-1-0">
                  <p class="text-subtitle-1">{{ col.title }}</p>
                  <p class="text-subtitle-2">{{ col.subtitle }}</p>
                  <v-btn color="primary" rounded="0" prepend-icon="fas fa-play" size="small" class="mt-3 text-none"
                    text="Play Now"></v-btn>
                </div>
                <div class="d-flex flex-column w-auto">
                  <v-btn size="x-small" class="my-1" color="white" icon><v-icon icon="fas fa-share-nodes"
                      size="small"></v-icon></v-btn>
                  <v-btn size="x-small" class="my-1" color="white" icon><v-icon icon="fas fa-heart"
                      size="small"></v-icon></v-btn>
                  <v-btn size="x-small" class="my-1" color="white" icon><v-icon icon="fas fa-plus"
                      size="small"></v-icon></v-btn>
                </div>
              </v-sheet>
            </v-sheet>

          </v-col>

        </v-row>
      </v-container>
      <v-container class="mt-4">
        <v-container class="d-flex justify-between w-100">
          <p class="text-h5 font-weight-bold mb-10 mr-auto">Featured Music</p>
          <v-btn variant="text" text="View All" class="text-none"></v-btn>
        </v-container>
        <v-row>
          <v-col v-for="(col, i) in staticData['featured-music']" :key="i">
            <v-sheet class="mx-auto" width="170px">
              <v-img :src="col?.img" width="170px" cover aspect-ratio="1"></v-img>
              <p class="text-body-2 text-center" tag="p">
                {{ col?.title }}
              </p>
              <p class="text-caption text-center text-medium-emphasis">
                {{ col?.subtitle }}
              </p>
            </v-sheet>
          </v-col>

        </v-row>
      </v-container>
      <v-container class="mt-4">
        <v-container class="d-flex justify-between w-100">
          <p class="text-h5 font-weight-bold mb-10 mr-auto">Latest Movies</p>
          <v-btn variant="text" text="View All" class="text-none"></v-btn>
        </v-container>
        <v-row v-for="(row, i) in staticData['latest-movies']" :key="i" align="center" justify="center">
          <v-col v-for="(col, k) in row" :key="k">
            <v-sheet color="transparent" class="pa-1" position="relative">
              <v-img :src="col.img" width="240px" class="mx-auto" cover :aspect-ratio="3 / 3.5"></v-img>
              <v-btn position="absolute" size="x-large" location="center" icon variant="solo"><v-icon icon="fas fa-play"
                  size="x-large" color="primary"></v-icon></v-btn>
            </v-sheet>
            <p class="text-body-2 text-center" tag="p">
              {{ col.title }}
            </p>
            <p class="text-caption text-center text-medium-emphasis">
              {{ col.subtitle }}
            </p>
          </v-col>

        </v-row>
      </v-container>
      <!-- <PieceItem v-for="edge in pinList" :key="edge.node.id" :pin="edge.node" /> -->
    </v-sheet>
  </v-container>

  <!-- <div class="flex flex-col gap-3 relative">
    <div class="min-h-screen py-10 px-4 sm:px-8 md:px-16 flex">
      <div v-if="pinList" class="w-full">
        <div class="flex flex-wrap h-3/4 p-10 justify-center gap-4">
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
  </div> -->
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useLazyQuery, useQuery } from '@vue/apollo-composable';

import {
  GET_PINS,
  GET_SUBSCRIPTIONS,
  GET_FEATUREDS
} from '@config/constants';
import { PieceItem } from '@components';

const siteID = import.meta.env.VITE_WEBSITE_ID
const rating = ref(4.5)
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

const staticData = {
  'tv-popular-shows': [
    {
      title: "Zombie World",
      subtitle: "2 Seasons",
      img: "/tv-show-1.png"
    },
    {
      title: "Zombie World",
      subtitle: "2 Seasons",
      img: "/tv-show-2.png"
    },
    {
      title: "Zombie World",
      subtitle: "2 Seasons",
      img: "/tv-show-3.png"
    },
    {
      title: "Zombie World",
      subtitle: "2 Seasons",
      img: "/tv-show-4.png"
    }
  ],
  'featured-music': [
    {
      title: "Nine Inch Nails",
      subtitle: "The Slip",
      img: "/featured-music-5.png"
    },
    {
      title: "Adam McHeffey",
      subtitle: "Let' Kick Fire",
      img: "/featured-music-4.png"
    },
    {
      title: "Swear and Sheke",
      subtitle: "Maple Ridge",
      img: "/featured-music-3.png"
    },
    {
      title: "Nine Inch Nails",
      subtitle: "The Slip",
      img: "/featured-music-2.png"
    },
    {
      title: "Adam McHeffey",
      subtitle: "Let' Kick Fire",
      img: "/featured-music-1.png"
    }
  ],
  'latest-movies': [
    [
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie1.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie2.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie3.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie4.png"
      }
    ],
    [
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie5.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie6.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie7.png"
      },

      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie8.png"
      },
    ], [
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie9.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie10.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie11.png"
      },
      {
        title: "Adam McHeffey",
        subtitle: "Let' Kick Fire",
        img: "/latest-movie12.png"
      },
    ]
  ]
}


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

