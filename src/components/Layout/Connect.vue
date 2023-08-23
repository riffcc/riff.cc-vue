<template>
  <button 
    class="bg-primary px-4 md:px-6 py-1 md:py-2"
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