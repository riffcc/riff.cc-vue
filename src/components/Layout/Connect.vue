<template>
  <v-dialog :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" text="Login" :block="block" class="text-none bg-primary" />

    </template>
    <v-card max-width="480px" min-height="280px" color="background-darken-1" class="pa-6 mx-auto w-100">
      <v-card v-if="showCryptoOnBoard" color="background-lighten-1 mb-4">
        <v-card-text class="pb-0">
           You can login with an Ethereum wallet (including wallets without funds). We use Ethereum logins to keep Riff.CC decentralised and open
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn size="small" variant="flat" color="primary" @click="hideCryptoOnboard">dont show again</v-btn>
        </template>
      </v-card>
      <v-card-title>Connect Wallet</v-card-title>
      <v-card-text>
        <p class="mb-2">Wallets:</p>
        <div class="d-flex flex-wrap justify-center">
          <v-card height="48px" width="48px" class="pa-1" @click="walletStore.connectWallet()">
            <v-img src="/wc.svg" class="h-100"></v-img>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useWalletStore } from "../../store/wallet"
import { onMounted } from "vue";

defineProps({
  block: Boolean
})
const walletStore = useWalletStore()

const showCryptoOnBoard = ref(false)

onMounted(() => {
  if(!localStorage.getItem('crypto_onboard')) {
    showCryptoOnBoard.value = true
  }
})

const hideCryptoOnboard = () => {
  showCryptoOnBoard.value = false
  localStorage.setItem('crypto_onboard', true)
}
</script>