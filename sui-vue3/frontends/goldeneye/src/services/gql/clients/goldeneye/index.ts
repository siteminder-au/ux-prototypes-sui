import { createApolloClient } from '../create-apollo-client'

export * from './types'

const url = '/api/goldeneye-beef/graphql'

export const apolloClient = createApolloClient({
  apiUrl: url,
  wsUrl: url,
})
