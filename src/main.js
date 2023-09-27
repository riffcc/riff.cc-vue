import { createApp, provide, h, reactive } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, ApolloLink, InMemoryCache, Observable, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { createPinia } from 'pinia';
import './styles.css';
import App from './App.vue';
import router from './router';
import createCeramicClient from './utils/createCeramicClient';
import createComposeClient from './utils/createComposeClient';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { 
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiPencilAlt,
  HiClock,
  HiQuestionMarkCircle,
  HiEye,
  HiX,
  HiCreditCard,
  HiUser,
  HiThumbUp,
  HiThumbDown,
  PrImage,
  HiPlay,
  HiPause,
  HiMenu,
  HiDotsVertical,
  HiVolumeOff,
  HiVolumeUp,
  HiCog,
  HiFastForward,
  HiRewind,
  MdFullscreen,
  HiArrowCircleLeft,
  FaTwitter,
  FaInstagram,
  FaSkype,
  FaFacebook,
  MdNotificationsnoneOutlined,
  MdSearch,
  MdKeyboardarrowup,
  MdPlayarrowRound,
  MdLibraryadd,
  MdMorevert,
  MdPlaycirclefilled,
  RiSkipBackFill,
  RiSkipForwardFill,
  MdPausecirclefilled,
  PrReplay,
  IoVolumeMedium,
  IoVolumeOff,
  HiFolderAdd
 } from "oh-vue-icons/icons";

const cache = new InMemoryCache({
  typePolicies: {
    Category: {
      keyFields: ['name'],
    },
    Subscription: {
      keyFields: ['subscribedID'],
    }
  }
})

const app = createApp({
  setup() {
    const apolloClient = reactive({
      value: null,
    });

    const ceramic = createCeramicClient()

    const composeClient = createComposeClient(ceramic)

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    })
    const observable = (operation) => {
      return new Observable((observer) => {
        composeClient.execute(operation.query, operation.variables).then(
          (result) => {
            observer.next(result)
            observer.complete()
          },
          (error) => {
            observer.error(error)
          }
        )
      })
    }
    const apolloLink = new ApolloLink(observable)

    apolloClient.value = new ApolloClient({
      link: from([errorLink, apolloLink]),
      cache,
      uri: import.meta.env.VITE_NODE_URL,
    })
    
    const updateApolloClient = (newCeramic) => {
      
      const newComposeClient = createComposeClient(newCeramic)
      const newApolloClient = new ApolloClient({
        link: from([errorLink, new ApolloLink((operation) => {
          return new Observable((observer) => {
            newComposeClient.execute(operation.query, operation.variables).then(
              (result) => {
                observer.next(result)
                observer.complete()
              },
              (error) => {
                observer.error(error)
              }
            )
          })
        })]),
        cache,
        uri: import.meta.env.VITE_NODE_URL,
      })

      
      apolloClient.value = newApolloClient
    }
    provide(DefaultApolloClient, apolloClient.value)
    provide('ceramic', ceramic);

    provide('updateApolloClient', updateApolloClient);

  },
  render: () => h(App)
})

export const IoShuffle = { "name": "io-shuffle", "minX": 0, "minY": 0, "width": 512, "height": 512, "raw": "<path fill=\"none\" stroke=\"#fff\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M400 304l48 48-48 48M400 112l48 48-48 48M64 352h85.19a80 80 0 0066.56-35.62L256 256\"/><path fill=\"none\" stroke=\"#fff\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M64 160h85.19a80 80 0 0166.56 35.62l80.5 120.76A80 80 0 00362.81 352H416M416 160h-53.19a80 80 0 00-66.56 35.62L288 208\"/>" };
addIcons(
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiPencilAlt,
  HiClock,
  HiQuestionMarkCircle,
  HiEye,
  HiX,
  HiCreditCard,
  HiUser,
  HiThumbUp,
  HiThumbDown,
  PrImage,
  HiPlay,
  HiPause,
  HiMenu,
  HiDotsVertical,
  HiVolumeOff,
  HiVolumeUp,
  HiCog,
  HiRewind,
  HiFastForward,
  MdFullscreen,
  HiArrowCircleLeft,
  FaTwitter,
  FaInstagram,
  FaSkype,
  FaFacebook,
  MdSearch,
  MdNotificationsnoneOutlined,
  MdKeyboardarrowup,
  MdPlayarrowRound,
  MdLibraryadd,
  MdMorevert,
  MdPlaycirclefilled,
  RiSkipBackFill,
  RiSkipForwardFill,
  MdPausecirclefilled,
  IoShuffle,
  PrReplay,
  IoVolumeMedium,
  IoVolumeOff,
  HiFolderAdd
);

app.component("v-icon", OhVueIcon);
app.use(createPinia())
app.use(router)

app.mount('#app')