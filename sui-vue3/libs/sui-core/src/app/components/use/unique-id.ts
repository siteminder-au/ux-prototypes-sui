import { uniqueId } from 'lodash-es'
import { onMounted, ref } from 'vue'

export const useUniqueId = (prefix: string) => {

  const id = ref<string | null>(null)

  onMounted(() => {
    id.value = uniqueId(prefix)
  })

  return {
    id,
  }

}
