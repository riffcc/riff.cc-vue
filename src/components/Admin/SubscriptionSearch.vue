<template>
  <v-sheet width="450px" class="mx-auto" position="relative">
    <v-text-field v-model="siteTargetID" validate-on="input" :rules="[rules.isValidID, rules.isNotOwnSiteID]"
      label="Site ID">
      <template v-slot:append="{ isValid }">
        <v-btn :disabled="!isValid.value || !siteTargetID" color="primary" rounded="0" :loading="loading" @click="toggleResult" icon>
          <v-icon icon="fas fa-magnifying-glass" size="small"></v-icon>
        </v-btn>
      </template>
    </v-text-field>
    <v-sheet v-if="showResult && site" v-click-outside="closeSearchResult" position="absolute" class="w-100"
      style="z-index: 1;">
      <SubscriptionItem :closeSearchResult="closeSearchResult" :subscription="site?.node" />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
import { GET_SITE } from '@config/constants';
import { SubscriptionItem } from '@components'

const siteID = import.meta.env.VITE_WEBSITE_ID;
const siteTargetID = ref(null)

const { load, result: site, loading, refetch } = useLazyQuery()
const rules = {
  isValidID: value => value?.length === 63 && value?.startsWith('k') || 'Invalid site ID',
  isNotOwnSiteID: value => value !== siteID || "You can't subscribe to your own site."
}

const fetchSite = (query, variables, options) => {
  load(query, variables, options) || refetch(query, variables, options)
}

const showResult = ref(false)

const openSearchResult = () => {
  showResult.value = true
}
const closeSearchResult = () => {
  showResult.value = false
  siteTargetID.value = null
  site.value = null
}

const toggleResult = () => {
  if (showResult.value) {
    closeSearchResult()
  } else {
    handleOnSearch()
    openSearchResult()
  }
}
const handleOnSearch = () => {
  if (!siteTargetID.value) {
    return
  }
  fetchSite(GET_SITE, { id: siteTargetID.value }, { fetchPolicy: 'network-only' })
}

</script>