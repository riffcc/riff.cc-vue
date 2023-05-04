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
  HiDotsVertical
 } from "oh-vue-icons/icons";

const cache = new InMemoryCache({
  typePolicies: {
    // EthAccount: {
    //   keyFields: ['address'],
    // },
    Category: {
      keyFields: ['name'],
    },
    Admin: {
      keyFields: ['admin', ['address']],
    },
    // Query: {
    //   queryType: true,
    //   fields: {
    //     node: {
    //       merge: true,
    //     },
    //   },
    // },
    Subscription: {
      keyFields: ['subscribedID'],
    },
    // PinLike: {
    //   keyFields: ['owner', ['address'], 'pin', ['id']],
    // },
    // PinDislike: {
    //   keyFields: ['owner', ['address'], 'pin', ['id']],
    // }
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
  HiDotsVertical
);

app.component("v-icon", OhVueIcon);
app.use(createPinia())
app.use(router)

app.mount('#app')