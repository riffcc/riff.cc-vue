import { defineStore } from 'pinia'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createClient } from '@wagmi/core'
import { mainnet } from '@wagmi/core/chains'
import { computed, ref } from 'vue'
import formatAddress from '../utils/formatAddress'

const chains = [mainnet]
const projectId = "e06631aa2696fd934c15258e8cfe82d7"

export const useWalletStore = defineStore('walletStore', () => {
  
  const { provider } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ 
      projectId, 
      version: 1, 
      chains 
    }),
    provider
  })
  const ethereumClient = new EthereumClient(wagmiClient, chains)
  const web3modal = new Web3Modal({ projectId }, ethereumClient)

  const address = ref(null)

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
    if(!address.value) {
      return null
    }
    return formatAddress(address.value)
  })
  return {
    address,
    formattedAddress,
    connectWallet,
    showAccount
  }
})
