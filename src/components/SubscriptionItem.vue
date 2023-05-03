<template>
  <div class="flex items-center gap-1 justify-center w-full px-6">
    <div class="h-24 w-24 border-slate-800 border relative flex">
      <img v-if="subscription.image" :src="`https://${ipfsGateway}/ipfs/${subscription.image}`" alt="" class="my-auto">
      <v-icon v-else name="hi-credit-card" class="h-12 w-12 text-slate-200" />
    </div>
    <div class="border-slate-800 border h-24 px-2 py-1 flex-1">
      <div class="flex items-center justify-between w-full h-8">
        <p class="truncate text-sm font-medium">{{ subscription.websiteName }}</p>
        <button 
          v-if="!isSubscribed" 
          class="border border-slate-600 px-1.5 py-0.5 bg-cyan-500 delay-400 text-sm uppercase font-semibold"
          @click="handleOnSubscribe"
        >
          Subscribe
        </button>
        <button 
          v-else class="border border-slate-600 px-1.5 py-0.5 bg-red-500 delay-400 text-sm uppercase font-semibold"
          @click="handleOnUnsubscribe"
        >
          Unsubscribe
        </button>
      </div>
      <div class="overflow-y-auto h-16 w-60 pt-1">
        <p class="text-xs text-slate-400">{{ subscription.description }}</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import { CREATE_SUBSCRIPTION, SubscriptionFragment, UPDATE_SUBSCRIPTION } from '../utils/constants';

const props = defineProps({
  subscription: Object,
  isSubscribed: Boolean
})

const ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY
const websiteID = import.meta.env.VITE_WEBSITE_ID

const { resolveClient } = useApolloClient()
const { mutate: createSubscription } = useMutation(CREATE_SUBSCRIPTION, {
  variables: {
    input: {
      content: {
        websiteID,
        subscribedID: props.subscription.id,
        metadata: {
          createdAt: Date.now().toString(),
          updatedAt: Date.now().toString()
        }
      }
    }
  }
})


const { mutate: updateSubscription } = useMutation(UPDATE_SUBSCRIPTION)

const getSubscriptionFromCache = (subscribedID) => {
  const apolloClient = resolveClient();
  return apolloClient.readFragment({
    id: apolloClient.cache.identify({ __typename: "Subscription", subscribedID}),
    fragment: SubscriptionFragment
  })
}

const handleOnSubscribe = async () => {
  const subscriptionExists = getSubscriptionFromCache(props.subscription.id)
  try {
    if (subscriptionExists && subscriptionExists.inactive) {
      await updateSubscription({
        input: {
          id: subscriptionExists.id,
          content: {
            inactive: false,
            metadata: {
              createdAt: subscriptionExists.metadata.createdAt,
              updatedAt: Date.now().toString()
            }
          }
        }
      })
    } else {
      await createSubscription()
    }
  } catch (error) {
    console.log('error on handleSubscribe', error)
  }
}

const handleOnUnsubscribe = async () => {
  const subscriptionExists = getSubscriptionFromCache(props.subscription.id)
  try {
    if (subscriptionExists && !subscriptionExists.inactive) {
      await updateSubscription({
        input: {
          id: subscriptionExists.id,
          content: {
            inactive: true,
            metadata: {
              createdAt: subscriptionExists.metadata.createdAt,
              updatedAt: Date.now().toString()
            }
          }
        }
      })
    } else {
      throw new Error('subscription not found')
    }
  } catch (error) {
    console.log('error on handleUnsubscribe', error)
  }
}

</script>