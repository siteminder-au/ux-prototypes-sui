import { ref } from 'vue'
import SmCarousel from '../sm-carousel.vue'

import image1 from './images/image1.jpg'
import image2 from './images/image2.jpg'
import image3 from './images/image3.jpg'
import defaultExample from './images/carousel-default.png'
import themedExample from './images/carousel-themed.png'

export default {
  title: 'Components/Carousel',
  decorators: [],
  component: SmCarousel,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?type=design&node-id=17-229502&mode=design&t=hFIFQjfQkFCkIsCo-0',
    },
  },
}

export const Standard = () => ({
  components: { SmCarousel },
  setup: () => {
    const data = ref([
      { src: image1, alt: 'A picture of a hotel' },
      { src: image2, alt: 'A picture of a hotel' },
      { src: image3, alt: 'A picture of a hotel' },
      { src: image1, alt: 'A picture of a hotel' },
      { src: image2, alt: 'A picture of a hotel' },
      { src: image3, alt: 'A picture of a hotel' },
    ])

    return { data }
  },
  template: `
    <div>
      <div style="width:300px">
        <span class="sui-storybook-header">Standard:</span>
        <sm-carousel :data="data" height="200px" :number-counter="true">
        </sm-carousel>
      </div>
      <br/><br/>
      <span class="sui-storybook-header">Without Number counter:</span>
      <div style="width:300px;">
        <sm-carousel :data="data" height="200px">
        </sm-carousel>
      </div>
    </div>

  `,
})

const standardDescription = `
  In order to display number counters and dots, the carousel should have more than five (5) images.

  Please note: The carousel is designed in such a way that it tends to use the parent element width. Please make sure the parent has a defined width as mentioned in the storybook.
`

Standard.parameters = {
  docs: {
    description: {
      // Uses `component` here since it's the primary story
      component: standardDescription,
    },
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

      <p>Below is an example of the SUI carousel and the brand carousel using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 310px; height: auto; min-width: 0"
          alt="Carousel default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 310px; height: auto; min-width: 0"
          alt="Carousel themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the carousel customization variables, followed by <a href="/?path=/story/theme-guides-styling-hooks--theme-categories">theme categories</a> and <a href="/?path=/story/theme-guides-styling-hooks--naming-conventions">naming convention</a></p>
      <p>This is the rewrite of the existing <code>sm-carousel</code> component in version(sui-core@7.0.0) and to specify the theming scope this includes <strong>color customization variables </strong></p>
      <p>Also, Please find the list of new theming variables and deprecated variables listed below in version updates(sui-themes@7.0.0)</p>
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
            <sm-table-td>Slide</sm-table-td>
            <sm-table-td>
              image-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-slide-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Pagination: At bottom</sm-table-td>
            <sm-table-td>
              image-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-pagination-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Navigation prev</sm-table-td>
            <sm-table-td>
              image-background <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-navigation-prev-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Navigation next</sm-table-td>
            <sm-table-td>
              image-background <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-navigation-next-image-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Count</sm-table-td>
            <sm-table-td>
              color-background <br/>
              color-text <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-count-color-background
                --sm-c-carousel-count-color-text
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td>Navigation arrows</sm-table-td>
            <sm-table-td>
              color
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              > --sm-c-carousel-navigation-arrow-color
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td style="background:#e2f4eb"><strong>New:</strong> Navigation arrows</sm-table-td>
            <sm-table-td style="background:#e2f4eb">
              color background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              > --sm-c-carousel-navigation-arrow-color-background
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td style="background:#e2f4eb"><strong>New:</strong> Circle buttons at bottom</sm-table-td>
            <sm-table-td style="background:#e2f4eb">
              color-background <br/>
              focus <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-circle-color-background
                --sm-c-carousel-circle-color-outline-focus
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-td style="background:#fff6c0"><strong>Deprecated:</strong> sui-themes@7.0.0</sm-table-td>
            <sm-table-td style="background:#fff6c0">
              navigation width <br/>
              navigation box shadow<br/>
              radius <br/>
              width <br/>
              border <br/>
              height <br/>
              width <br/>
              arrow left <br/>
              arrow right <br/>
              radius <br/>
              bottom <br/>
              left <br/>
              min-width <br/>
              font-weight <br/>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-carousel-navigation-width
                --sm-c-carousel-navigation-box-shadow-focus
                --sm-c-carousel-navigation-arrow-border-radius
                --sm-c-carousel-navigation-arrow-border-width
                --sm-c-carousel-navigation-arrow-color-border
                --sm-c-carousel-navigation-arrow-height
                --sm-c-carousel-navigation-arrow-width
                --sm-c-carousel-navigation-prev-arrow-left
                --sm-c-carousel-navigation-next-arrow-right
                --sm-c-carousel-count-border-radius
                --sm-c-carousel-count-bottom
                --sm-c-carousel-count-left
                --sm-c-carousel-count-min-width
                --sm-c-carousel-count-font-weight
              </code>
            </sm-table-td>
          </sm-table-tr>

        </sm-table-tbody>
      </sm-table>

    </div>
  `,
})

StylingHooks.storyName = 'Styling hooks'
StylingHooks.parameters = {
  design: null,
}
