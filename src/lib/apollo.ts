import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// This client is now intended for client-side use, hitting our own API proxy.
const client = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql', 
  }),
  cache: new InMemoryCache(),
});

export default client;
