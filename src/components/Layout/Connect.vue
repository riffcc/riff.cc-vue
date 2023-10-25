<template>
  <v-btn @click="walletStore.connectWallet" text="Connect wallet" :block="block" class="text-none bg-primary"/>
</template>

<script setup>
import { useWalletStore } from "../../store/wallet"

defineProps({
  block: Boolean
})
const walletStore = useWalletStore()

</script>