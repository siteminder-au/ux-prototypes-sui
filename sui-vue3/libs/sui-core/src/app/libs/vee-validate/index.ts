import { defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { decimal, precision } from './rules'
import * as suiRules from './rules'
import { useI18n } from '../vue-i18n'

export const setup = () => {

  // const rules = { ...AllRules, ...suiRules }

  // Make the validate aggressive to show case validators
  configure({
    validateOnInput: true,
  })

  Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule])
  })

  defineRule('decimal', decimal)
  defineRule('precision', precision)

  const { i18n } = useI18n()
  // This will return the mapping of the validation rule key and its value as a string
  const messages = [...Object.keys(AllRules), ...Object.keys(suiRules)]
    .reduce<Record<string, string>>((accumulator, rule) => {
      return {
        ...accumulator,
        [rule]: i18n.t(`sui-core.libs.vee-validate.vee-validate.${rule}`) as string,
      }

    }, {})

  configure({
    // create and set a localization handler
    generateMessage: localize('en', {
      messages: {
        ...messages,
      },
    }),
  })

}
