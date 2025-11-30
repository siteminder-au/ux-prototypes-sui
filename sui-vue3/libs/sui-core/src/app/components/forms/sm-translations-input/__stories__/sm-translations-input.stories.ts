import { ref } from 'vue'
import SmTranslationsInput from '../sm-translations-input.vue'
import defaultExample from './images/translations-input-default.png'
import themedExample from './images/translations-input-themed.png'
import { SmForm } from '../..'

export default {
  title: 'Components/Form/Translations Input',
  component: SmTranslationsInput,
  decorators: [],
}

export const TextInput = () => ({
  components: { SmTranslationsInput, SmForm },
  setup: () => {
    const form = ref({ 'room-type': [
      { code: 'en', value: '' },
      { code: 'de', value: '' },
    ] })

    const supportedTranslations = ref([
      {
        code: 'en',
        translationLabel: 'English translation',
        dropdownLabel: 'English',
      },
      {
        code: 'es',
        translationLabel: 'Spanish translation',
        dropdownLabel: 'Spanish',
        disableDeletion: true,
      },
      {
        code: 'de',
        translationLabel: 'German translation',
        dropdownLabel: 'German',
      },
      {
        code: 'fr',
        translationLabel: 'French translation',
        dropdownLabel: 'French',
      },
      {
        code: 'pt',
        translationLabel: 'Portuguese translation',
        dropdownLabel: 'Portuguese',
      },
      {
        code: 'it',
        translationLabel: 'Italian translation',
        dropdownLabel: 'Italian',
      },
      {
        code: 'zh',
        translationLabel: 'Chinese translation',
        dropdownLabel: 'Chinese',
      },
    ])

    return { form, supportedTranslations }
  },
  template: `
  <sm-form style="max-width: 480px"
    :initial-values="form">
    <sm-translations-input
      v-model="form['room-type']"
      type="textarea"
      label="Room type name"
      name="room-type"
      placeholder="Enter your room type name"
      default-language="en"
      :supported-translations="supportedTranslations"/>
  </sm-form>
  `,
})

export const StylingHooks = () => ({
  setup: () => {
    const defaultImage = defaultExample
    const themedImage = themedExample

    return {
      defaultImage,
      themedImage,
    }
  },
  template: `
    <div>
      <h3>Styling hooks</h3>
      <p>Styling hooks will enable customization for your components. Styling hooks are constructed using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties">CSS custom properties</a>.</p>

      <p>Below is an example of the SUI translations input and the brand translations input using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 360px; height: auto; min-width: 0"
          alt="Translations input default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 360px; height: auto; min-width: 0"
          alt="Translations input themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the translations input customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared input, label and error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

      <sm-table>
        <sm-table-thead>
          <sm-table-tr>
            <sm-table-th> Element </sm-table-th>
            <sm-table-th> Category + Property </sm-table-th>
            <sm-table-th class="w-1/2 small-desktop:w-3/5"> Styling Hooks</sm-table-th>
          </sm-table-tr>
        </sm-table-thead>

        <sm-table-tbody>
          <sm-table-tr>
            <sm-table-th colspan="3">Created fields</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              border-style
              <br/>
              border-width
              <br/>
              border-image
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-translations-input-created-list-border-style-left
                --sm-c-translations-input-created-list-border-width-left
                --sm-c-translations-input-created-list-image-border
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Field item</sm-table-td>
            <sm-table-td>
              padding
              <br/>
              color-background
              <br/>
              border-radius
              <br/>
              width
              <br/>
              height
              <br/>
              top
              <br/>
              left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-translations-input-created-item-padding-left

                --sm-c-translations-input-created-item-indicator-color-background
                --sm-c-translations-input-created-item-indicator-border-radius
                --sm-c-translations-input-created-item-indicator-width
                --sm-c-translations-input-created-item-indicator-height
                --sm-c-translations-input-created-item-indicator-top
                --sm-c-translations-input-created-item-indicator-left

                --sm-c-translations-input-created-item-indicator-color-background-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Dropdown</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Container</sm-table-td>
            <sm-table-td>
              color-background
              <br/>
              color-text
              <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-translations-input-dropdown-item-color-background
                --sm-c-translations-input-dropdown-item-color-text
                --sm-c-translations-input-dropdown-item-padding

                --sm-c-translations-input-dropdown-item-color-background-hover
                --sm-c-translations-input-dropdown-item-color-text-hover
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
