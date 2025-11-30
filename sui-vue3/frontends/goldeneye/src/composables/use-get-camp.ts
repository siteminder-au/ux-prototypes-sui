import { computed, ref, ComputedRef, Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { ApolloQueryResult } from '@apollo/client'
import { accommodationsData, campsitesData } from '@/mocks/campsites'
import { GetCampQuery, GetCampQueryVariables } from '@/services/gql/clients/goldeneye'
import { getCampQuery } from './use-get-camp.goldeneye.gql'

export const useGetCamp = (id: string): {
  loading: Ref<boolean>
  onResult: (fn: (param: ApolloQueryResult<GetCampQuery>) => void) => ({ off: () => void })
  accommodations: ComputedRef<GetCampQuery['camp']['accommodations']>
} => {

  // goldeneye-beef is not yet deployed to dev
  if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
    const {
      result,
      loading,
      onResult,
    } = useQuery<GetCampQuery, GetCampQueryVariables>(
      getCampQuery,
      () => ({ id }),
      { clientId: 'goldeneye' },
    )

    const accommodations = computed(() => result.value?.camp.accommodations ?? [])

    return {
      loading,
      onResult,
      accommodations,
    }
  }

  return {
    loading: ref(false),
    accommodations: computed(() => accommodationsData),
    onResult: (fn) => {
      fn({ data: { camp: { campsites: campsitesData } } } as unknown as ApolloQueryResult<GetCampQuery>)

      return {
        off: () => {},
      }
    },
  }

}
