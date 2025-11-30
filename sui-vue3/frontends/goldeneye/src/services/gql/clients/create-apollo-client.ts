import {
  ApolloClient,
  createHttpLink,
  from,
  type IdGetterObj,
  InMemoryCache,
  HttpOptions,
  NormalizedCacheObject,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { get } from 'lodash'
import fetch from 'unfetch'
import { v4 as uuid } from 'uuid'

const REFRESH_AUTH_TOKEN = Symbol('refreshAuthToken')

interface Options {
  apiUrl: string
  wsUrl: string
  connectToDevTools?: boolean
}

interface ContextOptions {
  userAgent: boolean
}

interface CustomIdGetterObj extends IdGetterObj {
  __typename?: string
  _id?: string
  spid?: string
  uuid?: string
}

const fetchRef = fetch
export const dataIdFromObject = (obj: CustomIdGetterObj): string | undefined => {
  const uniqueID = obj.spid ?? obj.uuid ?? obj.id ?? obj._id
  if (typeof obj.__typename === 'string' && uniqueID) {
    return `${obj.__typename}:${uniqueID}`
  }
}
export const createApolloClient = ({ apiUrl, connectToDevTools = false }: Options, { userAgent }: ContextOptions = { userAgent: false }): ApolloClient<NormalizedCacheObject> => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations?.toString()}, Path: ${path?.toString()}`,
      ))
    }
    if (networkError) console.error(`[Network error]: ${networkError.toString()}`)
  })

  const httpLink = createHttpLink({
    uri: apiUrl,
    fetch: fetchRef as unknown as HttpOptions['fetch'],
  })

  const traceTokenLink = setContext((_, previousContext) => ({
    headers: {
      ...(previousContext.headers as Record<string, unknown>),
      'x-sm-trace-token': uuid(),
    },
  }))

  const userAgentLink = setContext((_, previousContext) => ({
    headers: {
      ...(previousContext.headers as Record<string, unknown>),
      'x-sm-context-ua': navigator.userAgent,
    },
  }))

  const retryLink = new RetryLink({
    delay: {
      initial: 100,
      max: 5000,
      jitter: true,
    },
    attempts: (count, operation, error: { statusCode: unknown, type: string }): boolean => {

      if (count > 2) {
        return false
      }

      if (typeof error.statusCode === 'number' && error.statusCode >= 500) {
        // Handle 50x error response
        return true
      }

      if (error.type === 'error' && error.statusCode === undefined) {
        // Handle progress event failure. Happens on ERR_CONNECTION_REFUSED
        return true
      }

      return get(operation.getContext(), REFRESH_AUTH_TOKEN, false) as boolean
    },
  })

  return new ApolloClient({
    connectToDevTools,
    link: from([
      errorLink,
      traceTokenLink, // attaches x-sm-trace-token
      ...(userAgent ? [userAgentLink] : []),
      retryLink, // adds retry feature
      httpLink, // the actual fetch network request to the gql server
    ]),
    cache: new InMemoryCache({
      dataIdFromObject,
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache',
      },
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'no-cache',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })
}
