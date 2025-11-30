import { ref, reactive, watch } from 'vue'
import SmSwitch from '../sm-switch.vue'
import SmSwitchGroup from '../sm-switch-group.vue'
import { SmTooltip } from '../../../sm-tooltip'
import SmForm from '../../sm-form/sm-form.vue'
import defaultExample from './images/switch-default.png'
import themedExample from './images/switch-themed.png'

/**
 * NOTE:
 *
 * We are expecting whitespace differences here against Vue2 which doesn't exist
 * in Goldeneyes with the whitespace preserve config in Vue3. Specifically for the
 * required asterisk (*) switch.
 *
 * Temporary hacks like adding spaces in props doesn't work here.
 *
 * Try to check back again once this is supported in Vue3 Storybook:
 * https://github.com/storybookjs/storybook/issues/18288
 * https://siteminder-jira.atlassian.net/browse/SUI-2176
 */

export default {
  title: 'Components/Form/Switch',
  component: SmSwitch,
  subcomponents: {
    'sm-switch-group': SmSwitchGroup,
  },
}

export const Standard = () => ({
  components: { SmSwitch, SmForm },
  setup: () => {
    const active = ref(false)

    const form = reactive({
      breakfast: false,
      dinner: false,
      cleaning: false,
    })
    watch(active, () => {
      console.info('active', active.value)
    }, { immediate: true })

    return { active, form }
  },
  template: `
    <div>
      <sm-switch
        label="Default"
        name="default"
        rules="required"
        v-model="active"
      />
      <sm-switch
        label="Disabled"
        name="disabled"
        :disabled="true"
      />
      <sm-switch
        label="Disabled active"
        name="disabled-active"
        disabled
        :model-value="true"
      />
    </div>

    <br/>
    <br/>
    
    <div>
      <span class="sui-storybook-header">Label Hidden</span>
      <sm-switch name="cleaning" label="Cleaning" 
        :label-hidden="true" v-model="form.cleaning" rules="required"
      />
    </div>
    
    
    <br/>
    <br/>

    <div>
      <span class="sui-storybook-header">Vertical layout</span>
      <sm-switch name="breakfast" label="Breakfast" layout="vertical" v-model="form.breakfast" />
    </div>
    <div>
      <span class="sui-storybook-header">Horizontal layout</span>
      <sm-switch name="lunch" label="Lunch" layout="horizontal" v-model="form.lunch" rules="required"/>
    </div>
    <div>
      <span class="sui-storybook-header">Horizontal reverse layout</span>
      <sm-switch name="dinner" label="Dinner" layout="horizontal-reverse" v-model="form.dinner" rules="required"/>
    </div>    
  `,
})

export const Groups = () => ({
  components: { SmSwitch, SmSwitchGroup, SmTooltip },
  setup: () => {
    const form = reactive({
      breakfast: false,
      dinner: false,
      cleaning: false,
      red: false,
      yellow: false,
    })

    return { form }
  },
  template: `
    <sm-switch-group label="INCLUSIONS">
      <sm-switch name="inclusions" label="Breakfast" v-model="form.breakfast"/>
      <sm-switch name="inclusions" label="Dinner" v-model="form.dinner"/>
      <sm-switch name="inclusions" v-model="form.cleaning">
        <template #label>
          Cleaning
          <sm-tooltip placement="right" title="Tooltip with long content" trigger="hover" style="font-weight: normal">
            <sm-icon name="utility-information-alt" style="margin-left: 4px; margin-top: 2px" />
          </sm-tooltip>
        </template>
      </sm-switch>
    </sm-switch-group>

    <sm-switch-group has-border>
      <sm-switch name="red" label="Red" v-model="form.red"/>
      <sm-switch name="yellow" v-model="form.yellow">
        <template #label>
          Yellow
          <sm-tooltip placement="right" title="Tooltip with long content" trigger="hover" style="font-weight: normal">
            <sm-icon name="utility-information-alt" style="margin-left: 4px; margin-top: 2px" />
          </sm-tooltip>
        </template>
      </sm-switch>
    </sm-switch-group>
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

      <p>Below is an example of the SUI switch and the brand switch using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 316px; height: auto; min-width: 0"
          alt="Switch default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 316px; height: auto; min-width: 0"
          alt="Switch themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the switch customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

      <p>For the <span style="font-weight: 600;">shared error field variables</span>, please refer to the table in <a href="/?path=/story/components-form-input--styling-hooks">input styling hooks</a></p>

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
            <sm-table-th colspan="3">Label</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Label</sm-table-td>
            <sm-table-td>
              color-text <br/>
              margin-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-label-color-text
                --sm-c-switch-label-color-text-required-asterisk
                --sm-c-switch-label-margin-bottom

                --sm-c-switch-label-color-text-focus
                --sm-c-switch-label-color-text-invalid
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Control</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background <br/>
              border-radius <br/>
              width <br/>
              height
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-control-color-background
                --sm-c-switch-control-border-radius
                --sm-c-switch-control-width
                --sm-c-switch-control-height

                --sm-c-switch-control-color-background-hover
                --sm-c-switch-control-color-background-active
                --sm-c-switch-control-color-background-active-hover

                --sm-c-switch-control-color-background-disabled
                --sm-c-switch-control-color-background-active-disabled
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Handle (knob)</sm-table-td>
            <sm-table-td>
              color-background <br/>
              border-radius <br/>
              width <br/>
              height <br/>
              top <br/>
              left
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-control-handle-color-background
                --sm-c-switch-control-handle-border-radius
                --sm-c-switch-control-handle-width
                --sm-c-switch-control-handle-height
                --sm-c-switch-control-handle-top
                --sm-c-switch-control-handle-left

                <em>// Handle position when switched on</em>
                --sm-c-switch-control-handle-left-active
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Group</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-bottom
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-group-border-bottom
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Legend</sm-table-td>
            <sm-table-td>
              color-text <br/>
              font-weight <br/>
              margin-bottom <br/>
              padding <br/>
              text-transform
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-group-legend-color-text
                --sm-c-switch-group-legend-font-weight
                --sm-c-switch-group-legend-margin-bottom
                --sm-c-switch-group-legend-padding
                --sm-c-switch-group-legend-text-transform
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Item</sm-table-td>
            <sm-table-td>
              color-background <br/>
              font-weight <br/>
              padding
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-switch-group-item-padding
                --sm-c-switch-group-item-color-background-focus
                --sm-c-switch-group-item-label-font-weight
              </code>
            </sm-table-td>
          </sm-table-tr>
        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
