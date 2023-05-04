<template>
  <header class="bg-slate-800 h-14 flex items-center px-6 justify-between text-slate-50 relative">
    <p class="w-1/6 text-2xl font-bold text-white">Riff.CC</p>
    <div v-if="isGreatherThanSmall" class="flex gap-4">
      <button
        :class="{ 'text-cyan-200': $route.path === '/' }"
        @click="() => $router.push('/')"
      > 
        Home
      </button>
      <button
        :class="{ 'text-cyan-200': $route.path === '/upload' }"
        @click="() => $router.push('/upload')"
      >
        Upload
      </button>
      <button 
        v-if="walletStore.accountId" class="router-link" 
        :class="{ 'text-cyan-200': $route.path === '/profile' }"
        @click="() => $router.push('/profile')"
      >
        My Pins
      </button>
      <button 
        v-if="walletStore.isAdmin" class="router-link" 
        :class="{ 'text-cyan-200': $route.path === '/admin' }"
        @click="() => $router.push('/admin')"
      >
          Admin Website
      </button>
    </div>
    <button v-else @click="toggleMenu">
      <v-icon name="hi-menu" class="h-7 w-8 text-slate-50" />
    </button>
    <div v-if="showMenu" class="fixed inset-x-0 top-14 mx-auto z-10 bg-gray-900 border border-slate-700 rounded-xl w-40 grid py-4">
      <button
        :class="{ 'text-cyan-200': $route.path === '/' }"
        @click="() => redirect('/')"
      > 
        Home
      </button>
      <button
        :class="{ 'text-cyan-200': $route.path === '/upload' }"
        @click="() => redirect('/upload')"
      >
        Upload
      </button>
      <button 
        v-if="walletStore.accountId" class="router-link" 
        :class="{ 'text-cyan-200': $route.path === '/profile' }"
        @click="() => redirect('/profile')"
      >
        My Pins
      </button>
      <button 
        v-if="walletStore.isAdmin" class="router-link" 
        :class="{ 'text-cyan-200': $route.path === '/admin' }"
        @click="() => redirect('/admin')"
      >
          Admin Website
      </button>
    </div>
    <div class="w-1/6 grow-0 shrink-0 flex justify-end">
      <p v-if="walletStore.formattedAddress" class="text-slate-50 font-medium hover:cursor-pointer"
        @click="walletStore.showAccount">
        {{ walletStore.formattedAddress }}
      </p>
      <Connect v-else />
    </div>
  </header>
</template>

<script setup>
import { inject, ref, watch } from "vue";
import { useApolloClient } from '@vue/apollo-composable'
import { useWalletStore } from "../../stores/wallet"
import auth3IDConnect from '../../utils/auth3IDConnect'
import { checkAddressInAdmins, checkAccount } from '../../utils/checkAccount'
import { GET_USERS, GET_ADMINS, CREATE_ETH_ACCOUNT } from '../../utils/constants'
import createCeramicClient from "../../utils/createCeramicClient"
import Connect from "../Layout/Connect.vue"
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRouter } from "vue-router";

const breakpoints = useBreakpoints(breakpointsTailwind)
const isGreatherThanSmall = breakpoints.greater("sm");

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

const id = import.meta.env.VITE_WEBSITE_ID
const { resolveClient } = useApolloClient();
const walletStore = useWalletStore();
const initialCeramicClient = inject("ceramic");
const updateApolloClient = inject("updateApolloClient");

watch(() => walletStore.address, async (address) => {
  if (!address) {
    walletStore.accountId = null
    walletStore.isAdmin = false
    const clientDesauth = createCeramicClient()
    updateApolloClient(clientDesauth)
    return;
  }
  const { ceramic} = await auth3IDConnect(address, initialCeramicClient);
  console.log('ceramic is authenticated?', ceramic.did?.authenticated);
  if(ceramic.did?.authenticated) {
    updateApolloClient(ceramic);
    walletStore.threeIdAuthenticated = true;

    const client = resolveClient()

    const getUsers = async (variables) => {
      return await client.query({
        query: GET_USERS,
        variables: {
          id,
          pageSize: 1,
          ...variables
        },
        fetchPolicy: 'no-cache'
      })
    }

    const getAdmins = async () => {
      return await client.query({
        query: GET_ADMINS,
        variables: {
          id,
          pageSize: 1000
        },
        fetchPolicy: 'no-cache'
      })
    }

    const resultGetUsers = await getUsers()
    const accountId = await checkAccount(getUsers, address, resultGetUsers.data.node.users)
    if (accountId) {
      walletStore.accountId = accountId;
      const resultGetAdmins = await getAdmins()
      const resultCheckAdmin = checkAddressInAdmins(address, resultGetAdmins.data.node.admins.edges)
      if (resultCheckAdmin.exist) {
        walletStore.isAdmin = true
        walletStore.adminId = resultCheckAdmin.id
        walletStore.adminIsSuper = resultCheckAdmin.super
      }
    } else {
      const resultCreateEthAccount = await client.mutate({
        mutation: CREATE_ETH_ACCOUNT,
        variables: {
          input: {
            content: {
              address,
              websiteID: id,
              metadata: {
                updatedAt: Date.now().toString(),
                createdAt: Date.now().toString()
              }
            }
          },
        }
      });
      walletStore.accountId = resultCreateEthAccount.data.createEthAccount.document.id;
    }

  } else {
    throw new Error("User not  authenticated");
  }
})
</script>
