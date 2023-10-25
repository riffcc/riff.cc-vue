<template>
  <v-container>
    <v-sheet min-height="75vh" class="py-4">
      <v-container class="h-100 px-md-16">
        <p class="text-h5 font-weight-bold mb-4">Account Setting</p>
        <v-row>
          <v-col cols="12" sm="4">
            <v-sheet class="d-flex flex-column align-center py-6" color="background-darken-1" position="relative">
              <v-btn variant="text" class="text-none mt-2" position="absolute" location="top right">Edit</v-btn>
              <v-img class="ma-auto" inline width="120px" src="/avatar.png"></v-img>
              <p class="text-h5 mt-4">John Doe</p>
              <div class="py-4 px-10">
                <p class="text-caption text-center text-medium-emphasis" style="line-height: 0.8rem;">

                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s.

                </p>
              </div>

            </v-sheet>
          </v-col>
          <v-col cols="12" sm="8">
            <v-sheet color="background-darken-1" class="pa-4">
              <p class="text-h5 mb-2">Personal Details</p>
              <v-divider></v-divider>
              <v-list-item title="Email" subtitle="example@gmail.com" class="pa-0 my-4">
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Change</v-btn>
                </template>
              </v-list-item>
              <v-list-item title="Password" subtitle="********" class="pa-0 my-4">
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Change</v-btn>
                </template>
              </v-list-item>
              <v-list-item title="Dafe of Birth" subtitle="08-03-1995" class="pa-0 my-4">
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Change</v-btn>
                </template>
              </v-list-item>
              <v-list-item title="Language" subtitle="English" class="pa-0 my-4">
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Change</v-btn>
                </template>
              </v-list-item>
              <p class="text-h5 mb-2">Billings Details</p>
              <v-divider></v-divider>
              <v-list-item class="pa-0 my-4">
                <template v-slot:title>
                  <p class="text-subtitle-2">Your next billing date is 19 September 2020.</p>
                </template>
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Update Payment info</v-btn>
                </template>
              </v-list-item>
              <v-btn color="primary" class="text-none mb-4" text="Cancel Membership" rounded="0"></v-btn>
              <p class="text-h5 mb-2">Plan Details</p>
              <v-divider></v-divider>
              <v-list-item subtitle="Premium" class="pa-0 my-4">
                <template v-slot:append>
                  <v-btn variant="text" class="text-none text-primary">Change</v-btn>
                </template>
              </v-list-item>
              <p class="text-h5 mb-2">Setting</p>
              <v-divider></v-divider>
              <v-list class="mt-4" bg-color="background-darken-1">
                <v-list-item subtitle="Recent device streaming activity" class="pa-0" min-height="18px"></v-list-item>
                <v-list-item subtitle="Sign out of all devices" class="pa-0" min-height="18px"></v-list-item>
                <v-list-item subtitle="Download your person information" class="pa-0" min-height="18px"></v-list-item>

              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-container>

  <!-- <main class="min-h-screen py-5 px-4 md:px-28 text-white">
    <div class="bg-background-secondary px-10 md:px-10 xl:px-24 2xl:px-60 py-14">
      <h2 class="text-4xl font-bold mb-5 text-center md:text-left">Account Settings</h2>
      <section class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div class="bg-background-secondary-alt lg:max-w-[22rem] h-fit px-14 py-12 space-y-6 relative">
          <button class="absolute top-5 right-3 text-slate-300">Edit</button>
          <img src="/avatar.png" class="w-36 h-36 rounded-ful mx-auto" alt="">
          <h4 class="text-3xl text-center">Jhon Doe</h4>
          <p class="text-sm text-slate-400 text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
            quia, magnam assumenda voluptas fugit ab</p>
        </div>
        <div class="bg-background-secondary-alt px-6 py-5 space-y-10 xl:col-span-2">
          <div>
            <h4 class="text-3xl border-b border-b-slate-400 mb-6 pb-2 text-center md:text-left">Personal Details</h4>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-xl">Email</h4>
                <h6 class="text-slate-400">example@email.com</h6>
              </div>
              <button class="text-primary">
                Change
              </button>
            </div>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-xl">Password</h4>
                <h6 class="text-slate-400">*******</h6>
              </div>
              <button class="text-primary">
                Change
              </button>
            </div>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-xl">Date of Birth</h4>
                <h6 class="text-slate-400">08-03-1995</h6>
              </div>
              <button class="text-primary">
                Change
              </button>
            </div>
            <div class="flex justify-between items-center mb-4">
              <div>
                <h4 class="text-xl">Language</h4>
                <h6 class="text-slate-400">English</h6>
              </div>
              <button class="text-primary">
                Change
              </button>
            </div>
          </div>
          <div>
            <h4 class="text-3xl border-b border-b-slate-400 mb-6 pb-2 text-center md:text-left">Billing Details</h4>
            <div class="flex justify-between items-center mb-4">
              <h6 class="text-slate-400">Your next billing date is 19 September 2020.</h6>
              <button class="text-primary">
                Update Payment info
              </button>
            </div>
            <button class="bg-[settingsStore.primary] px-6 py-2 ml-2">Cancel Membership</button>
          </div>
          <div>
            <h4 class="text-3xl border-b border-b-slate-400 mb-6 pb-2 text-center md:text-left">Plan Details</h4>
            <div class="flex justify-between items-center">
              <h6 class="text-slate-400">Premium</h6>
              <button class="text-primary">
                Change Plan
              </button>
            </div>
          </div>
          <div>
            <h4 class="text-3xl border-b border-b-slate-400 mb-6 pb-2 text-center md:text-left">Setting</h4>
            <h6 class="text-slate-400">Recent device streaming activity</h6>
            <h6 class="text-slate-400">Sign out of all devices</h6>
            <h6 class="text-slate-400">Download your person information</h6>
          </div>
        </div>
      </section>
    <div v-if="walletStore.address && walletStore.accountId" class="grid h-full gap-3">
      <p class="font-semibold ml-4 text-md sm:text-lg flex-none">Approved</p>
      <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
        <PieceList v-if="pieces.approved.length > 0" :list="pieces.approved" table />
        <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
      </div>
      <p class="font-semibold ml-4 text-md sm:text-lg flex-none">Pending</p>
      <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
        <PieceList v-if="pieces.pending.length > 0" :list="pieces.pending" table />
        <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
      </div>
      <p class="font-semibold ml-4 text-md sm:text-lg flex-none">Rejected</p>
      <div className='border rounded-xl border-slate-400 min-h-[20rem] flex'>
        <PieceList v-if="pieces.rejected.length > 0" :list="pieces.rejected" table />
        <p v-else class="m-auto text-sm text-slate-200">No items found.</p>
      </div>
    </div>
    <div v-else class="w-64 h-40 border border-slate-400 rounded-lg m-auto flex flex-col items-center justify-evenly mt-20">
      <p>Please connect your wallet</p>
      <Connect />
    </div> 
  </main> -->
</template>

<script setup>
import { useQuery } from "@vue/apollo-composable"
import { GET_PINS } from "../config/constants";
import { computed } from "vue";
import { useWalletStore } from "../store/wallet";
import Connect from "../components/Layout/Connect.vue"

const walletStore = useWalletStore()
const id = import.meta.env.VITE_WEBSITE_ID;
// const {
//   result: pinsResult,
//   loading: pinsLoading,
//   error: pinsError,
//   fetchMore: fetchMorePins
// } = useQuery(GET_PINS, {
//   id,
//   pageSize: siteDataQueryParams.pageSizeMedium
// }, {
//   fetchPolicy: "network-only"
// });

const pieces = computed(() => {
  if (!walletStore.address || !walletStore.accountId || !pinsResult.value || !(pinsResult.value.node.pins.edges.length > 0)) {
    return {
      approved: [],
      pending: [],
      rejected: []
    }
  }
  const list = pinsResult.value.node.pins.edges.filter(pin => pin.node.owner.address === walletStore.address)
  const approved = list && list.filter(pin => (!pin.node.deleted && pin.node.approved && !pin.node.rejected))
  const pending = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && !pin.node.rejected))
  const rejected = list && list.filter(pin => (!pin.node.deleted && !pin.node.approved && pin.node.rejected))
  return {
    approved,
    pending,
    rejected
  }
})

</script>