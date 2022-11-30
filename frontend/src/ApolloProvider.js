import { split, HttpLink, ApolloProvider as Provider } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const helperFunc = () => {
  
  let token = localStorage?.getItem('chat-token')
  if(token) {
    token = JSON.parse(token)
    return `Bearer ${token}`
  }
  return ''
}

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});
const authLink = setContext((_, { headers }) => {
  
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: helperFunc()
    }
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    authToken: helperFunc(localStorage.getItem('chat-token'))
  },
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);
const client = new ApolloClient({
  link: splitLink,
  cache : new InMemoryCache()
});
export default function ApoloProvider(props) {
  return <Provider client={client} {...props} />
}
