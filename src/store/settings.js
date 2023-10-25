import { useFavicon, useTitle } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { IPFS_GATEWAY } from '@/config/constants'
export const useSettingsStore = defineStore('settingsStore', () => {
  const show = ref(false)
  const autoplay = ref(false)
  const siteName = ref(null)
  const siteDescription = ref(null)
  const siteImage = ref(null)
  const colors = ref(null)

  const open = () => show.value = true
  const hide = () => show.value = false
  const siteTile = computed(() => siteName ? siteName.value : 'My Site')
  const siteNavicon = computed(() => siteImage ? `https://${IPFS_GATEWAY}/ipfs/${siteImage.value}` : null)
  useTitle(siteTile)
  useFavicon(siteNavicon)
  return {
    show,
    open,
    hide,
    autoplay,
    siteName,
    siteDescription,
    siteImage,
    colors
  }
})
