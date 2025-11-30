import SmLazyImage from '../sm-lazy-image.vue'

export default {
  title: 'Components/Lazy Image',
  component: SmLazyImage,
}

export const Default = () => ({
  components: { SmLazyImage },
  template: `
    <sm-lazy-image
      src="https://picsum.photos/4000/2660"
      alt="image description"
      style="width:400px;height:266px;"
    />
  `,
})

const defaultDescription = `
  The sm-lazy-image provide a loading placeholder while an image is being loaded and an error image when it fails.

  The component will only begin to load once its visible on the screen.

  The width and height of the image must be set in the implementation.
`
Default.parameters = {
  docs: {
    description: {
      component: defaultDescription,
    },
  },
}

export const Background = () => ({
  components: { SmLazyImage },
  template: `
    <sm-lazy-image
      type="background"
      src="https://picsum.photos/4000/2660"
      aria-label="image description"
      style="width:400px;height:266px;"
    />
  `,
})
