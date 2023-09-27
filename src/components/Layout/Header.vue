<template>
  <header
    class="bg-background-secondary h-20 flex items-center px-6 lg:px-16 xl:px-36 py-5 justify-between text-slate-50 relative">
    <img src="/logo.png" class="w-10 h-10" alt="">
    <div v-if="isGreatherThanSmall" class="flex gap-10 flex-1 lg:pl-32u justify-center">
      <!-- 
      <button @click="() => $router.push('/movie')">
        Movie
      </button>
      <button @click="() => $router.push('/tv-shows')">
        Tv Shows
      </button>
      <button @click="() => $router.push('/music')">
        Music
      </button>
      <button @click="() => $router.push('/audio-books')">
        Audio Books
      </button>
      <button @click="() => $router.push('/contact')">
        Contact
      </button> -->
      <button @click="() => $router.push('/')">
        Home
      </button>
      <button :class="{ 'text-cyan-200': $route.path === '/upload' }" @click="() => $router.push('/upload')">
        Upload
      </button>
      <button v-if="walletStore.accountId" class="router-link" :class="{ 'text-cyan-200': $route.path === '/profile' }"
        @click="() => $router.push('/profile')">
        My Pins
      </button>
      <button v-if="walletStore.isAdmin" class="router-link" :class="{ 'text-cyan-200': $route.path === '/admin' }"
        @click="() => $router.push('/admin')">
        Admin Website
      </button>
    </div>
    <button v-else @click="toggleMenu">
      <v-icon name="hi-menu" class="h-7 w-8 text-slate-50" />
    </button>
    <div v-if="showMenu"
      class="fixed inset-x-0 top-14 mx-auto z-10 bg-gray-900 border border-slate-700 rounded-xl w-40 grid py-4">
      <button :class="{ 'text-cyan-200': $route.path === '/' }" @click="() => redirect('/')">
        Home
      </button>
      <button :class="{ 'text-cyan-200': $route.path === '/upload' }" @click="() => redirect('/upload')">
        Upload
      </button>
      <button v-if="walletStore.accountId" class="router-link" :class="{ 'text-cyan-200': $route.path === '/profile' }"
        @click="() => redirect('/profile')">
        My Pins
      </button>
      <button v-if="walletStore.isAdmin" class="router-link" :class="{ 'text-cyan-200': $route.path === '/admin' }"
        @click="() => redirect('/admin')">
        Admin Website
      </button>
    </div>
    <div class="flex items-center gap-2">
      <div v-if="walletStore.formattedAddress" class="flex items-center gap-4">
        <v-icon name="md-search" class="w-5 h-5 text-white" />
        <v-icon name="md-notificationsnone-outlined" class="w-5 h-5 text-white" />
        <button @click="() => $router.push('/profile')">
          <img src="/avatar.png" alt="" class="h-11 w-11">
        </button>
        <!-- <p class="text-slate-50 font-medium hover:cursor-pointer" @click="walletStore.showAccount">
          {{ walletStore.formattedAddress }}
        </p>
        <button @click="settingsStore.open">
          <v-icon name="hi-cog" class="h-5 w-5 text-slate-200 mt-0.5" />
        </button> -->
      </div>
      <Connect v-else />
    </div>
  </header>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { useApolloClient } from '@vue/apollo-composable'
import { useWalletStore } from "../../stores/wallet"
import { useSettingsStore } from '../../stores/settings';

import auth3IDConnect from '../../utils/auth3IDConnect'
import createCeramicClient from "../../utils/createCeramicClient"
import Connect from "../Layout/Connect.vue"
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRouter } from "vue-router";
import callAdminServer from "../../utils/callAdminServer"
import { GET_ETH_ACCOUNT } from "../../config/constants";
const settingsStore = useSettingsStore();


const breakpoints = useBreakpoints(breakpointsTailwind)
const isGreatherThanSmall = breakpoints.greater("md");

watch(isGreatherThanSmall, () => {
  showMenu.value = false
})

const router = useRouter()

const showMenu = ref(false)
const toggleMenu = () => showMenu.value = !showMenu.value

const redirect = (route) => {
  router.push(route)
  showMenu.value = false
}

const siteID = import.meta.env.VITE_WEBSITE_ID
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER
const walletStore = useWalletStore();
const initialCeramicClient = inject("ceramic");
const updateApolloClient = inject("updateApolloClient");
const { resolveClient } = useApolloClient();

watch(() => walletStore.address, async (address) => {
  console.log('from watchAddress', address)
  if (!address) {
    walletStore.accountId = null
    walletStore.isAdmin = false
    const clientDesauth = createCeramicClient()
    updateApolloClient(clientDesauth)
    return;
  }
  const { ceramic } = await auth3IDConnect(address, initialCeramicClient);
  console.log('ceramic is authenticated?', ceramic.did?.authenticated);

  if (ceramic.did?.authenticated) {
    updateApolloClient(ceramic);
    walletStore.threeIdAuthenticated = true;
    const client = resolveClient()
    const result = await client.query({
      query: GET_ETH_ACCOUNT,
      variables: {
        items: 100,
        filters: {
          where: {
            address: {
              equalTo: address
            }
          }
        }
      },
      fetchPolicy: 'network-only'
    })


    console.log('result', result)

    const node = result.data.ethAccountIndex.edges[0]?.node

    if (node) {
      walletStore.accountId = node.id;
      walletStore.isAdmin = node.isAdmin
      walletStore.isSuperAdmin = node.isSuperAdmin

    } else {
      const msgToSign = "Create new account"
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [
          msgToSign,
          walletStore.address
        ]
      })
      console.log(signature)
      const result = await callAdminServer(
        `${adminServerUrl}/account`,
        {
          action: 'create',
          data: {
            address,
            siteID,
            isAdmin: false,
            isSuperAdmin: false,
            createdAt: (new Date).toISOString(),
            updatedAt: (new Date).toISOString(),
            settings: defaultUserSettings
          },
          msg: msgToSign,
          signature,
          address,
        });

      walletStore.accountId = result.accountID;

    }

  } else {
    walletStore.error = "error on connect wallet"
    setTimeout(() => {
      walletStore.error = null
    }, 3000);
  }

})
</script>
