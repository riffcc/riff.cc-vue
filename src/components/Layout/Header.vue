<template>
  <header class="bg-slate-800 h-14 flex items-center px-6 justify-between text-slate-50 relative">
    <p class="w-1/6 text-2xl font-bold text-white">Riff.CC</p>
    <div class="flex justify-center gap-6">
      <div>
        <RouterLink to="/" exact class="router-link" :class="{ 'text-cyan-200': $route.path === '/' }">Home</RouterLink>
      </div>
      <div>
        <RouterLink to="/upload" class="router-link" :class="{ 'text-cyan-200': $route.path === '/pinner' }">Upload
        </RouterLink>
      </div>
      <div v-if="isUser">
        <RouterLink to="/profile" class="router-link" :class="{ 'text-cyan-200': $route.path === '/profile' }">My Pins
        </RouterLink>
      </div>
      <div v-if="isAdminUser">
        <RouterLink to="/admin" class="router-link" :class="{ 'text-cyan-200': $route.path === '/admin' }">Admin Website
        </RouterLink>
      </div>
    </div>
    <div class="w-1/6 grow-0 shrink-0 flex justify-end">
      <p 
        v-if="walletStore.formattedAddress"
        class="text-slate-50 font-medium hover:cursor-pointer"
        @click="walletStore.showAccount"
      >
        {{ walletStore.formattedAddress }}
      </p>
      <button v-else @click="walletStore.connectWallet">
        Connect
      </button>  
    </div>
  </header>
</template>

<script>
import { computed, watch } from "vue"
import { useWalletStore } from "../../stores/wallet"
import { GET_USERS, websiteDataQueryParams } from "../../utils/constants"
import { useQuery } from "@vue/apollo-composable"

const websiteId = import.meta.env.VITE_WEBSITE_ID

export default {
  name: 'LayoutHeader',
  setup() {
    const walletStore = useWalletStore() // Obtiene la instancia del store
    const isUser = computed(() => false) // Ejemplo de uso de una propiedad computada del store
    const isAdminUser = computed(() => false) // Ejemplo de uso de una propiedad computada del store

    const {
      result: userEdgesResult,
      loading: userEdgesLoading,
      error: userEdgesError,
      fetchMore: fetchMoreUsers,

    } = useQuery(GET_USERS, {
      id: websiteId,
      pageSizeMedium: 1
    });

    // Utiliza watch para observar cambios en el valor de endCursor
    // watch(() => userEdgesResult.value.node.users.pageInfo.endCursor, (newEndCursor) => {
    //   console.log(newEndCursor)
    //   // if (newEndCursor !== null) {
    //   //   fetchMoreUsers({
    //   //     variables: {
    //   //       cursor: newEndCursor,
    //   //     },
    //   //     updateQuery: (previousResult, { fetchMoreResult }) => {
    //   //       const newEdges = fetchMoreResult.node.users.edges;
    //   //       const pageInfo = fetchMoreResult.node.users.pageInfo;
    //   //       return newEdges.length ? {
    //   //         ...previousResult,
    //   //         node: {
    //   //           ...previousResult.node,
    //   //           users: {
    //   //             ...previousResult.node.users,
    //   //             edges: [
    //   //               ...previousResult.node.users.edges,
    //   //               ...newEdges,
    //   //             ],
    //   //             pageInfo,
    //   //           }
    //   //         }
    //   //       } : previousResult;
    //   //     },
    //   //   });
    //   // }
    // });

    return {
      walletStore, // Asigna la instancia del store
      isUser,
      isAdminUser,
      userEdgesResult,
      userEdgesLoading,
      userEdgesError
    }
  }
}
</script>
