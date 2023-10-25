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
        <v-carousel-item src="/7459209.png" gradient="to right, rgba(0,0,0,.80), rgba(0,0,0,.01)" cover>
          <!-- <v-div class="d-flex align-center justify-center justify-md-start h-100"> -->
          <v-container class="fill-height">
            <v-row justify="center" align="center" justify-sm="space-around" class="px-12">
              <v-col cols="12" sm="7" md="6" lg="5">

                <v-sheet color="transparent" class="my-10">
                  <p class="text-h5 text-lg-h4 mb-4"> This Month’s Record Breaking Albums !</p>
                  <p class="text-subtitle-2 text-medium-emphasis mb-4" style="line-height: 1.1em;">Dream your moments,
                    Until
                    I Met You, Gimme Some Courage, Dark Alley, One More Of A Stranger, Endless Things, The Heartbeat
                    Stops,
                    Walking Promises, Desired Games and many more..
                  </p>
                  <p class="text-subtitle-2 text-medium-emphasis" style="line-height: 1em;"> Album Adam McHeffey 2009</p>
                  <p class="text-subtitle-2 text-medium-emphasis">12 songs 43 Minutes</p>
                  <div class="d-flex mt-8">
                    <v-btn color="primary" rounded="0" prepend-icon="fas fa-play" class="text-none mr-4"
                      text="Play Now"></v-btn>
                    <v-btn color="transparent" border rounded="0" prepend-icon="fas fa-square-plus" class="text-none"
                      text="Add to Library"></v-btn>
                  </div>
                </v-sheet>
              </v-col>
              <v-col cols="12" md="2"></v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>
      <v-container class="mt-4">
        <v-container class="d-flex justify-between w-100">
          <p class="text-h5 font-weight-bold mb-10 mr-auto">Featured Music</p>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-left" size="x-small"></v-icon>
          </v-btn>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-right" size="x-small" color="primary"></v-icon>
          </v-btn>
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
        <v-container>

          <p class="text-h5 font-weight-bold mb-6">Weekly Top 15</p>

        </v-container>

        <v-row justify="center">
          <v-col v-for="col in 5" :key="col">
            <v-sheet v-for="item in 3" :key="item" class="d-flex pa-1 mb-2 mb-sm-6 mx-auto" height="60px"
              min-width="200px" max-width="260px" color="background">
              <v-sheet position="relative">
                <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" inline cover width="60px"></v-img>
                <v-btn block variant="solo" position="absolute" location="center" class="h-100">
                  <v-icon icon="fas fa-play" size='small'></v-icon>
                </v-btn>
              </v-sheet>
              <div class="pl-4">
                <p class="text-subtitle-2">Album Name</p>
                <p class="text-caption text-medium-emphasis">Artist Name</p>
              </div>
            </v-sheet>

          </v-col>

        </v-row>
      </v-container>
      <v-container class="mt-4">
        <v-container>

          <p class="text-h5 font-weight-bold mb-6">Top Genres</p>

        </v-container>

        <v-row align="center">
          <v-col cols="4">
            <v-sheet height="360px" color="background" class="d-flex" position="relative">
              <v-img :src="staticData['top-genres'][0][0].img" gradient="to top, rgba(var(--v-theme-background-lighten-2), .8), rgba(var(--v-theme-background-lighten-2), .01)" aspect-ratio="1" cover></v-img>
              <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{ staticData['top-genres'][0][0].title
              }}</v-btn>
            </v-sheet>
          </v-col>
          <v-col cols="6">
            <v-sheet height="360px">
              <v-row>
                <v-col>
                  <v-sheet color="primary" position="relative">
                    <v-img :src="staticData['top-genres'][1][0][0].img" gradient="to top, rgba(var(--v-theme-background-lighten-2), .8), rgba(var(--v-theme-background-lighten-2), .01)" aspect-ratio="1" cover height="164px"></v-img>
                    <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{
                      staticData['top-genres'][1][0][0].title }}</v-btn>
                  </v-sheet>
                </v-col>
                <v-col cols="8">
                  <v-sheet color="primary" position="relative">
                    <v-img :src="staticData['top-genres'][1][0][1].img" gradient="to top, rgba(var(--v-theme-background-lighten-2), .8), rgba(var(--v-theme-background-lighten-2), .01)" aspect-ratio="16/9" cover height="164px"></v-img>
                    <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{
                      staticData['top-genres'][1][0][1].title }}</v-btn>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8">
                  <v-sheet color="primary" position="relative">
                    <v-img :src="staticData['top-genres'][1][1][0].img" gradient="to top, rgba(var(--v-theme-background-lighten-2), .8), rgba(var(--v-theme-background-lighten-2), .01)" aspect-ratio="16/9" cover height="164px"></v-img>
                    <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{
                      staticData['top-genres'][1][1][0].title }}</v-btn>
                  </v-sheet>
                </v-col>
                <v-col>
                  <v-sheet color="primary" position="relative">
                    <v-img :src="staticData['top-genres'][1][1][1].img" gradient="to top, rgba(var(--v-theme-background-lighten-2), .8), rgba(var(--v-theme-background-lighten-2), .01)" aspect-ratio="1" cover height="164px"></v-img>
                    <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{
                      staticData['top-genres'][1][1][1].title }}</v-btn>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="2">
            <v-sheet height="360px" position="relative">
              <v-img :src="staticData['top-genres'][2][0].img" gradient="to top, rgba(var(--v-theme-primary), .8), rgba(var(--v-theme-primary), .01)" cover></v-img>
              <v-btn position="absolute" location="bottom left" variant="text" class="text-none">{{ staticData['top-genres'][2][0].title
              }}</v-btn>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mt-4">
        <v-container class="d-flex justify-between w-100">
          <p class="text-h5 font-weight-bold mb-10 mr-auto">New Releases</p>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-left" size="x-small"></v-icon>
          </v-btn>
          <v-btn icon class="justify-self-end">
            <v-icon icon="fas fa-caret-right" size="x-small" color="primary"></v-icon>
          </v-btn>
        </v-container>
        <v-row v-for="(row, i) in staticData['new-releases']" :key="i">
          <v-col v-for="(col, k) in row" :key="k">
            <v-sheet class="mx-auto" width="160px">
              <v-img :src="col?.img" width="160px" cover aspect-ratio="1"></v-img>
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
      <!-- <PieceItem v-for="edge in pinList" :key="edge.node.id" :pin="edge.node" /> -->
    </v-sheet>
  </v-container>
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
const staticData = {
  'new-releases': [
    [
      {
        title: "Bloodlust",
        subtitle: "Anna Ellison, Max Glover",
        img: "/new-release-10.png"
      },
      {
        title: "Endless Things 2",
        subtitle: "Harry Jackson, Max Glover",
        img: "/new-release-9.png"
      },
      {
        title: "Gimme Some Courage",
        subtitle: "Harry Jackson, Carl Brown",
        img: "/new-release-8.png"
      },
      {
        title: "Desired Games",
        subtitle: "Jennifer Kelly, Virginia Harris",
        img: "/new-release-7.png"
      },
      {
        title: "The Heartbeat Stops",
        subtitle: "Anna Ellison",
        img: "/new-release-6.png"
      }
    ],
    [
      {
        title: "Bloodlust",
        subtitle: "Anna Ellison, Max Glove",
        img: "/new-release-5.png"
      },
      {
        title: "Endless Things 2",
        subtitle: "Harry Jackson, Max Glover",
        img: "/new-release-4.png"
      },
      {
        title: "Gimme Some Courage",
        subtitle: "Harry Jackson, Carl Brown",
        img: "/new-release-3.png"
      },
      {
        title: "Desired Games",
        subtitle: "Jennifer Kelly, Virginia Harris",
        img: "/new-release-2.png"
      },
      {
        title: "The Heartbeat Stops",
        subtitle: "Anna Ellison",
        img: "/new-release-1.png"
      }
    ]
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
  'top-genres': [
    [{
      title: "Blues",
      img: "/genre-6.png"
    }],
    [[{
      title: "Classical",
      img: "/genre-5.png"
    },
    {
      title: "Folk",
      img: "/genre-4.png"
    }],
    [{
      title: "House",
      img: "/genre-1.png"
    },
    {
      title: "Dancing",
      img: "/genre-2.png"
    }]],
    [{
      title: "Hip hop",
      img: "/genre-3.png"
    }],


  ]
}
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

