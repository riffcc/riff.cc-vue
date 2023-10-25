<template>
  <v-app-bar class="px-md-16 bg-background-darken-2">
    <v-toolbar-title>
      <v-img cover max-width="48px" aspect-ratio="1" :src="`https://${IPFS_GATEWAY}/ipfs/${settingsStore.siteImage}`"></v-img>
    </v-toolbar-title>
    <div class="d-none d-md-flex">
      <v-btn text="Home" @click="() => redirect('/')" :class="router.currentRoute.value.path === '/' ? 'text-primary-lighten-1 text-none' : 'text-none'" />
                <v-btn v-bind="props" text="Tv" class="text-none" />
            <v-btn v-bind="props" text="Movies" class="text-none" />

      <v-btn text="Music" @click="() => redirect('/music')" :class="router.currentRoute.value.path === '/music' ? 'text-primary-lighten-1 text-none' : 'text-none'" />
      <v-divider vertical></v-divider>

      <v-btn text="Upload" @click="() => redirect('/upload')" :class="router.currentRoute.value.path === '/upload' ? 'text-primary-lighten-1 text-none' : 'text-none'" />
      <v-btn text="My Pins" v-if="walletStore.accountId" @click="() => redirect('/profile')" :class="router.currentRoute.value.path === '/profile' ? 'text-primary-lighten-1 text-none' : 'text-none'"
        />
      <v-btn text="Admin Site" v-if="walletStore.isAdmin" @click="() => redirect('/admin')" :class="router.currentRoute.value.path === '/admin' ? 'text-primary-lighten-1 text-none' : 'text-none'"
        />
    </div>
    <div class="d-block d-md-none">

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon icon="fas fa-bars" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item title="Home" @click="() => redirect('/')" class="text-none" />
          <v-list-item title="Upload" @click="() => redirect('/upload')" class="text-none" />
          <v-list-item title="My Pins" v-if="walletStore.accountId" @click="() => redirect('/profile')" class="text-none"
            />
          <v-list-item title="Admin Site" v-if="walletStore.isAdmin" @click="() => redirect('/admin')" class="text-none"
            />
        </v-list>
      </v-menu>
    </div>
    <v-spacer></v-spacer>
    <template v-if="walletStore.formattedAddress" slot:prepend>
      <v-btn icon>
        <v-icon icon="fas fa-magnifying-glass" size="x-small" />
      </v-btn>
      <v-btn icon>
        <v-icon icon="fas fa-bell" size="x-small" />
      </v-btn>
      <v-app-bar-nav-icon @click.stop="showMenu = !showMenu" class="ml-4">
        <v-avatar v-if="walletStore.cidAvatar" :image="`https://${IPFS_GATEWAY}/ipfs/${walletStore.cidAvatar}`"></v-avatar>
        <v-icon v-else icon="fas fa-circle-user" size="x-large" class="mb-1"></v-icon>
      </v-app-bar-nav-icon>
    </template>
    <template v-else slot:prepend>
      <Connect />
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="showMenu" temporary location="right" color="background-lighten-1" class="h-50">
    <template v-slot:prepend>
      <v-list-item lines="two" :title="walletStore.formattedAddress" subtitle="Logged in"></v-list-item>
    </template>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend title="Settings" value="settings" @click="() => redirect('/profile/settings')"></v-list-item>
      <v-list-item prepend title="Logout" value="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { useApolloClient } from '@vue/apollo-composable'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRouter } from "vue-router";

import Connect from "../Layout/Connect.vue"

import { GET_ETH_ACCOUNT, defaultUserSettings, IPFS_GATEWAY } from "../../config/constants";
import { useWalletStore } from "@stores/wallet"
import { useSettingsStore } from "@stores/settings"

import { auth3IDConnect, createCeramicClient, callAdminServer } from '@utils'

const router = useRouter()
console.log(router.currentRoute)
const routes = [
  { value: "/", label: "Home" },
  { value: "/upload", label: "Upload" },
  { value: "/profile", label: "My Pins" },
  { value: "/admin", label: "Admin Site" },
]

const breakpoints = useBreakpoints(breakpointsTailwind)
const isGreatherThanSmall = breakpoints.greater("md");

const siteID = import.meta.env.VITE_WEBSITE_ID
const adminServerUrl = import.meta.env.VITE_ADMIN_SERVER


const showMenu = ref(false)

const walletStore = useWalletStore();
const settingsStore = useSettingsStore();


const initialCeramicClient = inject("ceramic");
const updateApolloClient = inject("updateApolloClient");
const { resolveClient } = useApolloClient();

const redirect = (route) => {
  router.push(route)
  showMenu.value = false
}

watch(isGreatherThanSmall, () => {
  showMenu.value = false
})


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
            },
            siteID: {
              equalTo: siteID
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
      walletStore.cidAvatar = node.settings?.cidAvatar


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