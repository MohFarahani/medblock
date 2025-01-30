'use client';

import { ApolloClient, InMemoryCache, ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    },
  },
});

export function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}