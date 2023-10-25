import { defaultThemeColors, defaultThemeVariables } from "../config/constants";
import { aliases, fa } from 'vuetify/iconsets/fa'
import { createVuetify } from 'vuetify'
import '@fortawesome/fontawesome-free/css/all.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@/styles/main.scss'
import '@/styles/settings.scss'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  defaults: {
    global: {
      elevation: 0
    },
    VTextField: {
      variant: "solo-filled",
      'bg-color': "background"
    },
    VFileInput: {
      variant: "solo-filled"
    },
    VSelect: {
      variant: "solo-filled"
    },
    VAutocomplete: {
      variant: "solo-filled"
    },
    VTooltip: {
      location: "start"
    }
  },
  theme: {
    defaultTheme: "default",
    themes: {
      default: {
        dark: false,
        colors: defaultThemeColors,
        variables: defaultThemeVariables
      }
    }
  }
})
// const vuetify = createVuetify({
//   components,
//   directives,

// })
export default vuetify