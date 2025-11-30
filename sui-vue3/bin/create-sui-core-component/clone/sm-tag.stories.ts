import SmTag from "./sm-tag.vue"

export default {
  title: "Components/<story-title>",
  parameters: {
    docs: {
      description: {
        // Primary/first story's documentation
        component: '',
      },
    },
  },
}

export const Standard = () => ({
  components: { SmTag },
  template: `
    <div>
      <sm-tag>Default</sm-tag>
    </div>
  `,
})

Standard.parameters = {
  docs: {
    description: {
      // Story documentation
      story: '',
    },
  },
};
