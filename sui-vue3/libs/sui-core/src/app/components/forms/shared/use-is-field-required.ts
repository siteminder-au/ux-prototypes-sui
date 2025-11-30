import { Ref, computed } from 'vue'

export const useIsFieldRequired = (rules: Ref<string | Record<string, unknown> | undefined>): { required: Ref<boolean> } => {
  const required = computed(() => {
    return typeof rules.value === 'string' ? rules.value.includes('required') : !!rules.value?.required
  })

  return {
    required,
  }
}
