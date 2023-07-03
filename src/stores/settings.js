import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settingsStore', () => {
    const show = ref(false)
    const autoplay = ref(false)

  
  const open = () => show.value = true
  const hide = () => show.value = false

  return {
    show,
    open,
    hide,
    autoplay
  }
})
