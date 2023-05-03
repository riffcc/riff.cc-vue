<template>
  <div class="grid lg:grid-cols-2 gap-3 mt-4 px-24">
    <SubscriptionItem 
      v-for="subscription in subscriptionList" 
      :key="subscription.node.id" 
      :subscription="subscription.node.subscribedWebsite"
      :isSubscribed="true"
    />
  </div>
</template>


<script setup>

import SubscriptionItem from '../components/SubscriptionItem.vue'

defineProps({
  subscriptionList: Array
})

</script>