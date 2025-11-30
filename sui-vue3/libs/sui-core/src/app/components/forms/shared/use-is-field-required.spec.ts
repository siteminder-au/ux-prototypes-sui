import { ref } from 'vue'
import { useIsFieldRequired } from './use-is-field-required'

describe('useIsFieldRequired', () => {

  it('should return true if required is in the rules string', () => {
    // ARRANGE
    const rules = ref('required')

    // ACT
    const { required } = useIsFieldRequired(rules)

    // ASSERT
    expect(required.value).toEqual(true)
  })

  it('should return false if required is not in the rules string', () => {
    // ARRANGE
    const rules = ref('min:8')

    // ACT
    const { required } = useIsFieldRequired(rules)

    // ASSERT
    expect(required.value).toEqual(false)
  })

  it('should return true if required is in the rules object', () => {
    // ARRANGE
    const rules = ref({ required: true })

    // ACT
    const { required } = useIsFieldRequired(rules)

    // ASSERT
    expect(required.value).toEqual(true)
  })

  it('should return false if required is not in the rules object', () => {
    // ARRANGE
    const rules = ref({ min: 8 })

    // ACT
    const { required } = useIsFieldRequired(rules)

    // ASSERT
    expect(required.value).toEqual(false)
  })

  it('should return false if rules is missing', () => {
    const rulesUndefined = ref(undefined)
    const { required: requiredUndefined } = useIsFieldRequired(rulesUndefined)
    expect(requiredUndefined.value).toEqual(false)

    const rulesNull = ref(undefined)
    const { required: requiredNull } = useIsFieldRequired(rulesNull)
    expect(requiredNull.value).toEqual(false)

    const rulesEmptyString = ref(undefined)
    const { required: requiredEmptyString } = useIsFieldRequired(rulesEmptyString)
    expect(requiredEmptyString.value).toEqual(false)

    const rulesEmptyObj = ref(undefined)
    const { required: requiredEmptyObj } = useIsFieldRequired(rulesEmptyObj)
    expect(requiredEmptyObj.value).toEqual(false)
  })

  it('should be reactive', () => {
    // ARRANGE
    const rules = ref('required')

    // ACT
    const { required } = useIsFieldRequired(rules)

    // ASSERT
    expect(required.value).toEqual(true)

    rules.value = ''
    expect(required.value).toEqual(false)

    rules.value = 'required'
    expect(required.value).toEqual(true)
  })
})
