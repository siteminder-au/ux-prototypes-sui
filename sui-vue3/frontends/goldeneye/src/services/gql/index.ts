import { ApolloClient, type NormalizedCacheObject } from '@apollo/client/core'
import { apolloClient as goldeneye } from './clients/goldeneye'

export const createVueApolloProvider = (): {
  default: ApolloClient<NormalizedCacheObject>
  goldeneye: ApolloClient<NormalizedCacheObject>
} => {

  return {
    default: goldeneye,
    goldeneye,
  }
}
