<template>
  <div class="grid w-[25rem] h-full mx-auto">
    <p class="font-medium mx-auto">New featured</p>
    <div class="h-24">
      <p class="text-sm mb-1 ml-1">Pin ID:</p>
      <input
        type="text"
        class="form-input bg-slate-800 w-full h-9 px-1.5"
        :min="(new Date).toISOString().replace(/.\d+Z$/g, 'Z')"
        v-model="pinID"
      />
      <p v-if="pinID && !isPin" class="text-xs text-red-600 mt-1 ml-2">Not pin exists.</p>
    </div>
    <div class="h-24 text-slate-100">
      <p class="text-sm mb-1 ml-1">Start at:</p>
      <input
        type="datetime-local"
        :min="(new Date).toISOString().substring(0, 16)"
        class="form-datetime-local bg-slate-800 w-full cursor-pointer h-9 px-1.5"
        v-model="startAt"
      />
      <!-- {startAt !== '' && endAt !== '' && !startAtIsValid && <p class="text-xs text-red-600 mt-1 ml-2">Invalid date.</p>} -->
    </div>
    <div class="h-24">
      <p class="text-sm mb-1 ml-1">End at:</p>
      <input
        type="datetime-local"
        :min="(new Date).toISOString().substring(0, 16)"
        class="form-datetime-local bg-slate-800 w-full cursor-pointer h-9 px-1.5"
        v-model="endAt"
      />
    </div>
    <button
      class="py-2 px-4 h-10 w-1/3 mx-auto rounded-lg bg-cyan-500 disabled:hover:bg-cyan-900 disabled:bg-cyan-900 disabled:text-slate-400 hover:cursor-point disabled:hover:cursor-default delay-100 hover:bg-cyan-600"
      :disabled="!isPin || !startAtIsValid || loadingNewFeatured"
      @click="handleSubmit"
    >
      <Spinner v-if="loadingNewFeatured" class="h-5 w-5 text-white animate-spin mx-auto" />
      <p v-else>Create</p>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { CREATE_FEATURED, PinFragment } from '../utils/constants'
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import Spinner from '../components/Layout/Spinner.vue';

const websiteID = import.meta.env.VITE_WEBSITE_ID;

const pinID = ref(null)
const startAt = ref(null)
const endAt = ref(null)

const { client } = useApolloClient();

const isPin = ref(false)

watch(pinID, (newPinID) => {
  if (!newPinID){
    isPin.value = false
    return
  }
  const pinExists = client.readFragment({
    id: client.cache.identify({ __typename: "Pin", id: newPinID }),
    fragment: PinFragment
  })
  console.log(pinExists)
  if (pinExists?.id) {
    isPin.value = true
  } else {
    isPin.value = false
  }
})

const { mutate: createFeatured, loading: loadingNewFeatured } = useMutation(CREATE_FEATURED)

const startAtIsValid = computed(() => {
  return Date.now() < Date.parse(startAt.value) && Date.parse(startAt.value) < Date.parse(endAt.value)
})

const resetForm = () => {
  pinID.value = null
  startAt.value = null
  endAt.value = null
}

const handleSubmit = async () => {
  await createFeatured({
    input: {
      content: {
        websiteID,
        pinID: pinID.value,
        startAt: Date.parse(startAt.value).toString(),
        endAt: Date.parse(endAt.value).toString()
      }
    }
  })
  resetForm()
}
</script>