import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT,
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
      ).toString("base64")}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
