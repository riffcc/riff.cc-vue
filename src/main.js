import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, ApolloLink, InMemoryCache, Observable, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'

import { createPinia } from 'pinia';
import './styles.css';
import App from './App.vue';
import router from './router';
import createCeramicClient from './utils/createCeramicClient';
import createComposeClient from './utils/createComposeClient';

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

const apolloLink = new ApolloLink((operation) => {
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
})

const cache = new InMemoryCache({
  typePolicies: {
    EthAccount: {
      keyFields: ['address'],
    },
    Category: {
      keyFields: ['name'],
    },
    Admin: {
      keyFields: ['admin', ['address']],
    },
    Query: {
      queryType: true,
      fields: {
        node: {
          merge: true,
        },
      },
    },
    Subscription: {
      keyFields: ['subscribedID'],
    },
    PinLike: {
      keyFields: ['owner', ['address'], 'pin', ['id']],
    },
    PinDislike: {
      keyFields: ['owner', ['address'], 'pin', ['id']],
    }
  }
})

const apolloClient = new ApolloClient({
  link: from([errorLink, apolloLink]),
  cache,
  uri: import.meta.env.VITE_NODE_URL,
  // headers: {
  //   // Configuración de las cabeceras para permitir CORS
  //   'Access-Control-Allow-Origin': 'http://localhost:5173',
  //   // Aquí puedes añadir más cabeceras si es necesario
  // }
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

// Usar otros plugins o librerías si es necesario
app.use(createPinia());
app.use(router);

app.mount('#app');
