<template>
 <v-card width="450px" class="ma-auto d-flex flex-column py-4" border>
          <v-card-title>
            <p class="text-center">Create Featured Pin</p>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-text-field label="Pin ID" validate-on="input" v-model="pinID" :rules="[rules.required, rules.isValidID]">
              <template v-slot:details="{ isValid }">
                <div class="w-100" v-if="isValid.value && !pinExists">
                  <p class="text-error text-start">Pin don't exists.</p>
                </div>
              </template>
            </v-text-field>
            <v-text-field type="datetime-local" :min="minDate" :max="maxDate" label="Start at"
              v-model="startAt"></v-text-field>
            <v-text-field :disabled="!startAt" type="datetime-local" :min="minEndDate" :max="maxDate" label="End at"
              v-model="endAt"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" class="w-50 mx-auto mt-4" :loading="isLoading"
              :disabled="!pinExists || !startAt || !endAt" @click="handleSubmit" text="Create">
            </v-btn>
          </v-card-actions>
        </v-card>
  <v-snackbar color="success" v-model="isSuccess" timeout="3000">
    <p class="text-center">{{ `Featured created succesfully!` }}</p>
  </v-snackbar>
  <v-snackbar color="error" v-model="isError" timeout="3000">
    <p class="text-center">{{ `Has ocurred an error :(` }}</p>
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { GET_PIN } from '@config/constants'
import { useApolloClient } from '@vue/apollo-composable';
import { callAdminServer } from '@utils';
import { useWalletStore } from '@stores/wallet';


const walletStore = useWalletStore()
const siteID = import.meta.env.VITE_WEBSITE_ID;
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER;
const { resolveClient } = useApolloClient()
const pinID = ref(null)
const startAt = ref(null)
const endAt = ref(null)
const isPin = ref(false)
const isError = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const pinExists = ref(false)

const fetchPin = async (pinId) => {
  const client = resolveClient();
  const res = await client.query({
    query: GET_PIN,
    variables: {
      id: pinId,
    },
    errorPolicy: 'ignore'
  });
  console.log('res from fetch', res)
  const pin = res?.data?.node;
  if (pin && pin.__typename === 'Pin') {
    return true;
  } else {
    return false;
  }
}


watch(pinID, async (newPinID) => {
  if (!newPinID) {
    isPin.value = false
    return
  }
  pinExists.value = await fetchPin(newPinID)
})

const rules = {
  required: value => !!value || 'Required',
  isValidID: value => value?.length === 63 && value?.startsWith('k') || 'Invalid pin ID'
}

const minDate = ref(null)
const maxDate = ref(null)

const minEndDate = ref(null);

const now = new Date();
const max = new Date(now);
max.setFullYear(now.getFullYear() + 1);
minDate.value = now.toISOString().substring(0, 16);
maxDate.value = max.toISOString().substring(0, 16);

watch(startAt, (newStartAt) => {
  const newDate = new Date(newStartAt);
  newDate.setDate(newDate.getDate() + 1);
  minEndDate.value = newDate.toISOString().substring(0, 16);
});

const resetForm = () => {
  pinID.value = null
  startAt.value = null
  endAt.value = null
}

const handleSubmit = async () => {
  let data = {}
  let msgToSign
  let signature
  msgToSign = "Create featured pin"
  try {
    isLoading.value = true
    signature = await window.ethereum.request({
      method: "personal_sign",
      params: [
        msgToSign,
        walletStore.address
      ]
    })
    await callAdminServer(
      `${adminServerUrl}/featured`, {
      action: "create",
      data: {
        siteID,
        pinID: pinID.value,
        startAt: (new Date(startAt.value)).toISOString(),
        endAt: (new Date(endAt.value)).toISOString()
      },
      msg: msgToSign,
      signature,
      address: walletStore.address
    })
    isSuccess.value = true
    resetForm()
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}
</script>
