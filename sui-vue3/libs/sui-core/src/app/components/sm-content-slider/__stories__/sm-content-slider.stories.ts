import { ref } from 'vue'
import SmContentSlider from '../sm-content-slider.vue'
import SmContentSliderItem from '../sm-content-slider-item.vue'
import SmContentSliderGraphic from '../sm-content-slider-graphic.vue'
import image1 from './images/image1.jpg'
import image2 from './images/image2.jpg'
import image3 from './images/image3.jpg'
import defaultExample from './images/content-slider-default.png'
import themedExample from './images/content-slider-themed.png'

export default {
  title: 'Components/Content Slider',
  component: SmContentSlider,
  subcomponents: {
    'sm-content-slider-item': SmContentSliderItem,
    'sm-content-slider-graphic': SmContentSliderGraphic,
  },
}

export const Standard = () => ({
  components: { SmContentSlider, SmContentSliderItem, SmContentSliderGraphic },
  setup: () => {
    const images = [
      { src: image1 },
      { src: image2 },
      { src: image3 },
      { src: image1 },
      { src: image2 },
      { src: image3 },
      { src: image3 },
      { src: image1 },
      { src: image2 },
      { src: image3 },
      { src: image3 },
      { src: image3 },
      { src: image1 },
      { src: image2 },
      { src: image3 },
    ]

    const sliderOneImages = ref(images.slice(0))
    const sliderTwoImages = ref(images.slice(0))

    const logEvent = (eventName: string, payload?: unknown) => {
      if (payload) {
        console.info(eventName, payload)

        return
      }

      console.info(eventName)
    }

    return {
      sliderOneImages,
      sliderTwoImages,
      logEvent,
    }
  },
  template: `
    <div style="width:100%">
      <sm-content-slider
        v-model:items="sliderOneImages"
        :item-visible="8"
        @slideNext="logEvent('slideNext')"
        @slidePrev="logEvent('slidePrev')"
      >
        <sm-content-slider-item
          v-for="(image, i) in sliderOneImages"
          :key="i"
          :index="i"
          @deleteItem="logEvent('deleteItem', $event)"
        >
          <sm-content-slider-graphic :src="image.src"></sm-content-slider-graphic>
        </sm-content-slider-item>
      </sm-content-slider>

      <br/><br/>

      <sm-content-slider
        v-model:items="sliderTwoImages"
        height="140px"
        :item-visible="5"
        @slideNext="logEvent('slideNext')"
        @slidePrev="logEvent('slidePrev')"
      >
        <sm-content-slider-item
          v-for="(image, i) in sliderTwoImages"
          :key="i"
          :index="i"
          :show-delete="false"
          @deleteItem="logEvent('deleteItem', $event)"
        >
          <sm-content-slider-graphic :src="image.src" />
        </sm-content-slider-item>
      </sm-content-slider>
    </div>
  `,
})

const standardDescription = `
  An <code>sm-content-slider</code> component is designed to build a image slider.

  The <code>images</code> props accept below json structure to display image slider component,

  <code>

  [{ "src": "" }, { "src": ""}]

  </code>

  Note: In order to display <code>sm-content-slider</code> component it should have width applied to the parent element. For example, style="width:100%"
`

Standard.parameters = {
  docs: {
    description: {
      component: standardDescription,
    },
  },
  percy: {
    // Cover different viewports to check responsiveness
    widths: [1025, 769],
    // Calculates width given visible items via JS
    enableJavaScript: true,
  },
}

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

      <p>Below is an example of the SUI content slider and the brand content slider using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 592px; height: auto; min-width: 0"
          alt="Content slider default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 592px; height: auto; min-width: 0"
          alt="Content slider themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the content slider customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>

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
            <sm-table-th colspan="3">Container</sm-table-th>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Button container</sm-table-td>
            <sm-table-td>
              width <br/>
              image-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-content-slider-button-container-width
                --sm-c-content-slider-button-container-prev-image-background
                --sm-c-content-slider-button-container-next-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Next & prev buttons</sm-table-td>
            <sm-table-td>
              border
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-content-slider-button-border
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>List</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-content-slider-list-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Item</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border <br/>
              border-radius <br/>
              color-background <br/>
              box-shadow
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-content-slider-item-border
                --sm-c-content-slider-item-border-radius
                --sm-c-content-slider-item-color-background

                --sm-c-content-slider-item-color-border-hover
                --sm-c-content-slider-item-box-shadow-hover
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Graphic</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-content-slider-graphic-border-radius
              </code>
            </sm-table-td>
          </sm-table-tr>

        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
