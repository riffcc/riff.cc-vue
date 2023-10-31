import { defineStore } from 'pinia'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createClient } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { computed, ref } from 'vue'

const chains = [mainnet]
const projectId = "d3ef2ee08419cd12b2036f7a77c21da8"

export const useWalletStore = defineStore('walletStore', () => {

  const { provider } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiClient = createClient({
    autoConnect: false,
    connectors: w3mConnectors({
      projectId,
      version: 1,
      chains
    }),
    provider
  })
  const ethereumClient = new EthereumClient(wagmiClient, chains)
  const web3modal = new Web3Modal({ 
     projectId,
    themeVariables: {
      '--w3m-z-index': 3200,
      '--w3m-font-family': 'Josefin Sans',
    }
  }, ethereumClient)

  const address = ref(null)
  const accountId = ref(null)
  const isAdmin = ref(false)
  const isSuperAdmin = ref(false)
  const error = ref(null)
  const cidAvatar = ref(null)

  ethereumClient.watchAccount((account) => {
    if (!account.address && !address.value) {
      return
    }
    if (!account.address && address.value) {
      address.value = null
      return
    }
    address.value = account.address
  })

  const connectWallet = () => web3modal.openModal({ route: 'ConnectWallet' })
  const showAccount = () => web3modal.openModal({ route: 'Account' })

  const formattedAddress = computed(() => {
    if (!address.value) {
      return null
    }
    return `${address.value.substring(0, 4)}...${address.value.substring(address.value.length - 4)}`
  })
  return {
    address,
    formattedAddress,
    connectWallet,
    showAccount,
    accountId,
    isAdmin,
    isSuperAdmin,
    error,
    wagmiClient,
    cidAvatar
  }
})
