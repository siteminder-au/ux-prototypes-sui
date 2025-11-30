import { onMounted, ref, Ref } from 'vue'
import SmTimePicker from '../sm-time-picker.vue'
import SmSelectPrefixContent from '../../sm-select/sm-select-prefix-content.vue'
import SmSelectSuffixContent from '../../sm-select/sm-select-suffix-content.vue'
import SmTooltip from '../../../sm-tooltip/sm-tooltip.vue'

import { isPercyContext } from '../../../../../../test/percy/helpers'

export default {
  title: 'Components/Form/Time Picker',
  component: SmTimePicker,
}

export const Standard = () => ({
  components: { SmTimePicker, SmTooltip, SmSelectPrefixContent, SmSelectSuffixContent },
  setup: () => {
    const selectedTime = ref(null)
    const selectedTime2 = ref('12:00')
    const selectedTime3 = ref(null)
    const timePicker: Ref<HTMLInputElement | null> = ref(null)

    onMounted(() => {
      // Open the dropdown when running in Percy
      // This is manually done here because we don't have a prop
      // that we can just set to true to display the hidden content
      if (isPercyContext() && timePicker.value) {
        document.querySelectorAll('input')[2].focus()
      }
    })

    return {
      selectedTime,
      selectedTime2,
      selectedTime3,
      timePicker,
    }
  },
  template: `
    <div>
      <sm-time-picker
        name="time-picker"
        label="Check-in"
        v-model="selectedTime"
        from="00:00"
        to="23:00">
      </sm-time-picker>

      <sm-time-picker
        name="time-picker"
        disabled
        label="Check-in"
        select-none="Please Choose..."
        v-model="selectedTime3"
        rules="required"
        from="00:00"
        to="23:00">
      </sm-time-picker>

      <sm-time-picker
        name="time-picker"
        label="Check-in"
        select-none="Please Choose..."
        ref="timePicker"
        v-model="selectedTime2"
        rules="required"
        from="00:00"
        to="23:00">
      </sm-time-picker>

      <sm-time-picker
        name="time-picker"
        label="Check-in"
        select-none="Please Choose..."
        ref="timePicker"
        v-model="selectedTime2"
        rules="required"
        from="00:00"
        to="23:00"
      >
          <template #label>
            <span>Check-in custom label</span>
          </template>
          <template #action>
            <sm-tooltip
              trigger="hover"
              placement="top"
              title="This is a tooltip for the time picker"
            >
              <sm-icon name="utility-information-alt" />
            </sm-tooltip>
          </template>
          <template #prefix>
            <sm-select-prefix-content>AM</sm-select-prefix-content>
          </template>
          <template #suffix>
            <sm-select-suffix-content>PM</sm-select-suffix-content>
          </template>
      </sm-time-picker>
    </div>
  `,
})

Standard.storyName = 'Standard'

Standard.parameters = {
  docs: {
    description: {
      component: 'A time picker component that allows users to select a time from a dropdown list.',
    },
  },
  percy: {
    // Needed for the Percy setup steps in onMounted hook to run
    // Take note of the defaults when upgrading Storybook or Percy in the future
    // https://docs.percy.io/docs/storybook#unexpected-diffs
    enableJavascript: true,
  },
}
