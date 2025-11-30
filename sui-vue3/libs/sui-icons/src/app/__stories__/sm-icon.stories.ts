import * as icons from '../icons-out'
import SmIcon from '../sm-icon.vue'

export default {
  title: 'Foundations/Icons',
  component: SmIcon,
  parameters: {
    docs: {
      description: {
        component: 'See the [installation guide](../?path=/docs/getting-started-installation--page) to use the icons library.',
      },
    },
  },
}

/**
 * Displays all icons in the library. If you need to make any layout/style changes
 * please follow the max page height supported by Percy visual testing across all
 * browsers in https://docs.percy.io/docs/browsers-specific-handling#browsers--max-web-page-height
 */
export const Directory = () => ({
  components: { SmIcon },
  setup: () => {
    // Convert camelCase to kebab-case
    const iconNames = Object.keys(icons).map((name: string) => {
      return name.replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
    })
    return { iconNames }
  },
  template: `
    <table style="border-collapse: collapse;">
      <thead>
        <tr>
          <th style="font-weight: 600; padding: 12px; border: 1px solid #c6d0e0;">Default</th>
          <th style="font-weight: 600; padding: 12px; border: 1px solid #c6d0e0;">Custom</th>
          <th style="font-weight: 600; padding: 12px; border: 1px solid #c6d0e0; text-align: left;">Name</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(iconName, i) in iconNames"
          :key="i"
        >
          <td style="padding: 12px; border: 1px solid #c6d0e0;">
            <sm-icon :name="iconName"></sm-icon>
          </td>
          <td style="padding: 12px; border: 1px solid #c6d0e0; color: #fff; background-color: #333; font-size: 24px">
            <sm-icon style="font-size: 20px" :name="iconName"></sm-icon>
          </td>
          <td style="padding: 12px; border: 1px solid #c6d0e0;">
            <code>{{ iconName }}</code>
          </td>
        </tr>
      </tbody>
    </table>
  `,
})

Directory.parameters = {
  percy: {
    // Specify a static screenshot name to match it with Vue2 Storybook
    // We moved things around in Vue3 Storybook since UI/UX docs are now in the same place
    // (used to be a separate website - ZeroHeight
    name: 'Components/Icon: Getting Started',
  },
}

export const Usage = () => ({
  components: { SmIcon },
  template: `
    <div>
      <span style="color: grey">
        <sm-icon name="amenity-bathroom"></sm-icon>
      </span>

      <div class="mt-32 flex gap-24">
        <sm-icon name="section-social" style="font-size: 24px" alt="Small Badge">
          <template v-slot:badge>
            <sm-badge type="success"></sm-badge>
          </template>
        </sm-icon>
        <sm-icon name="section-social" style="font-size: 24px" alt="Medium Badge">
          <template v-slot:badge>
            <sm-badge type="success" size="medium">5</sm-badge>
          </template>
        </sm-icon>
      </div>
    </div>
  `,
})

Usage.parameters = {
  docs: {
    description: {
      story: 'The colour of the icon is automatically inherited from the font colour of the parent element.',
    },
  },
  percy: {
    // Specify a static screenshot name to match it with Vue2 Storybook
    // We moved things around in Vue3 Storybook since UI/UX docs are now in the same place
    // (used to be a separate website - ZeroHeight)
    name: 'Components/Icon: Usage',
  },
}
