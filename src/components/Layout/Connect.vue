<template>
  <button 
    class="bg-cyan-500 px-4 py-2 rounded font-medium"
    @click="walletStore.connectWallet"
  >
    Connect
  </button>
</template>

<script setup>
import { useWalletStore } from "../../stores/wallet"
const walletStore = useWalletStore()

</script>

<style scoped>
</style>