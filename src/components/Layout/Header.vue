<template>
  <header class="bg-slate-800 h-14 flex items-center px-6 justify-between text-slate-50 relative">
    <p class="w-1/6 text-2xl font-bold text-white">Riff.CC</p>
    <div class="flex justify-center gap-6">
      <div>
        <RouterLink to="/" exact class="router-link" :class="{ 'text-cyan-200': $route.path === '/' }">Home</RouterLink>
      </div>
      <div>
        <RouterLink to="/upload" class="router-link" :class="{ 'text-cyan-200': $route.path === '/upload' }">Upload
        </RouterLink>
      </div>
      <div v-if="walletStore.accountId">
        <RouterLink to="/profile" class="router-link" :class="{ 'text-cyan-200': $route.path === '/profile' }">My Pins
        </RouterLink>
      </div>
      <div v-if="walletStore.isAdmin">
        <RouterLink to="/admin" class="router-link" :class="{ 'text-cyan-200': $route.path === '/admin' }">Admin Website
        </RouterLink>
      </div>
    </div>
    <div class="w-1/6 grow-0 shrink-0 flex justify-end">
      <p v-if="walletStore.formattedAddress" class="text-slate-50 font-medium hover:cursor-pointer"
        @click="walletStore.showAccount">
        {{ walletStore.formattedAddress }}
      </p>
      <button v-else @click="walletStore.connectWallet">
        Connect
      </button>
    </div>
  </header>
</template>

<script setup>
import { inject, watch } from "vue";
import gql from "graphql-tag"
import { useApolloClient } from '@vue/apollo-composable'
import { useWalletStore } from "../../stores/wallet"
import auth3IDConnect from '../../utils/auth3IDConnect'
import { checkAddressInAdmins, checkAccount} from '../../utils/checkAccount'

const id = import.meta.env.VITE_WEBSITE_ID

const GET_USERS = gql`
  query GetUsers($id: ID!, $pageSizeMedium: Int!, $cursor: String) {
    node(id: $id) {
      ... on Website {
        id
        users(first: $pageSizeMedium, after: $cursor) {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node {
              id
              address
              ensName
              pins(first: $pageSizeMedium) {
                edges {
                  node {
                    id
                  }
                }
              }
              pinsCount
              pinLikes(first: $pageSizeMedium) {
                edges {
                  node {
                    id
                    pin {
                      id
                    }
                    owner {
                      address
                    }
                  }
                }
              }
              pinLikesCount
              pinDislikes(first: $pageSizeMedium) {
                edges {
                  node {
                    id
                    pin {
                      id
                    }
                    owner {
                      address
                    }
                  }
                }
              }
              pinDislikesCount
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        usersCount
      }
    }
  }
`;

const GET_ADMINS = gql`
  query GetAdmins($id: ID!, $pageSize: Int!) {
    node(id: $id) {
      ... on Website {
        id
        admins(first: $pageSize) {
          edges {
            node {
              id
              adminID
              admin {
                address
                ensName
              }
              super
              inactive
              metadata {
                createdAt
                updatedAt
              }
            }
          }
        }
        adminsCount
      }
    }
  }
`;

const CREATE_ETH_ACCOUNT = gql(`
  mutation CreateEthAccount($input: CreateEthAccountInput!) {
    createEthAccount(input: $input) {
      document {
        id
      }
    }
  }
`)


const { resolveClient } = useApolloClient();
const walletStore = useWalletStore();
const initialCeramicClient = inject("ceramic");
const updateApolloClient = inject("updateApolloClient");

watch(() => walletStore.address, async (address) => {
  if (!address) {
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
        variables,
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


    const resultGetUsers = await getUsers({
      id,
      pageSizeMedium: 1
    })

    const accountId = await checkAccount(getUsers, address, resultGetUsers.data.node.users)

    if (accountId) {
      walletStore.accountId = accountId;
      const resultGetAdmins = await getAdmins()
      walletStore.isAdmin = checkAddressInAdmins(address, resultGetAdmins.data.node.admins.edges)
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
      console.log('result of createEthAccount', resultCreateEthAccount)
      // walletStore.accountId = data.node.id;
    }

  } else {
    throw new Error("User not  authenticated");
  }
})
</script>
