import { computed, reactive, ref } from 'vue'
import SmCardActions from '../sm-card-actions.vue'
import SmCardContent from '../sm-card-content.vue'
import SmCardGraphic from '../sm-card-graphic.vue'
import SmCardFooter from '../sm-card-footer.vue'
import SmCard from '../sm-card.vue'
import SmCardBrandGraphic from '../sm-card-brand-graphic.vue'

import smSSmallCropped from './images/sm-s-small-cropped.svg'
import smSLargeCropped from './images/sm-s-large-cropped.svg'
import smSCropped from './images/sm-s-cropped.svg'
import smBlocksCropped from './images/sm-blocks-cropped.svg'
import defaultExample from './images/card-default.png'
import themedExample from './images/card-themed.png'

export default {
  title: 'Components/Card',
  component: SmCard,
  subcomponents: {
    'sm-card-actions': SmCardActions,
    'sm-card-brand-graphic': SmCardBrandGraphic,
    'sm-card-content': SmCardContent,
    'sm-card-footer': SmCardFooter,
    'sm-card-graphic': SmCardGraphic,
  },
  parameters: {
    docs: {
      description: {
        component: 'The card component is made up of a collection of children components: <code>sm-card-actions</code>, <code>sm-card-content</code>, and <code>sm-card-graphic</code>. <br/> The children components can be used in any order and there can be any number of them in play. <br/> Use the <code>tag</code> prop to turn the card into an anchor element or <code>router-link</code> component. Attributes such as <code>to</code> and <code>href</code> will work as expected. <br/> When the card\'s in a non-interactive mode, the background, top border and box shadow of the card won\'t change in order to highlight the card. Use style attribute to add styles for example: <code>style="width: 336px; border-top-color: #000"</code> <br/> Best practice: whenever there are multiple slots, use the full <code>template</code> based syntax for all slots including <code>default</code>.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=17%3A230418&t=hCpfPUmCPPZSF5zx-0',
    },
  },
}

export const BasicAndGraphicCard = () => ({
  components: { SmCard, SmCardActions, SmCardContent, SmCardGraphic },
  template: `
    <div>

      <div class="flex flex-wrap gap-32 items-start mb-32">
        <div>
          <span class="sui-storybook-header">Basic</span>
          <sm-card tag="a" href="#" style="max-width: 336px" root-class="hello-hello">
            <sm-card-actions>
              <sm-button aria-label="Edit property" shape="square" size="medium">
                <sm-icon aria-hidden="true" name="action-edit"></sm-icon>
              </sm-button>
            </sm-card-actions>

            <sm-card-content>
              <h4>Superior King</h4>
              <p>Et excepteur ad ea consectetur magna commodo sunt voluptate.</p>
              <p>Laboris excepteur enim pariatur voluptate irure excepteur amet eiusmod proident. Ex voluptate exercitation minim.</p>
              <p><a target='_blank' href="#">Read more</a></p>
            </sm-card-content>
          </sm-card>
        </div>

        <div>
          <span class="sui-storybook-header">Basic: Non-interactive</span>
          <sm-card tag="a" href="#" style="max-width: 336px" :disabled="false" :interactive="false">
            <sm-card-actions>
              <sm-button aria-label="Edit property" shape="square" size="medium">
                <sm-icon aria-hidden="true" name="action-edit"></sm-icon>
              </sm-button>
            </sm-card-actions>

            <sm-card-content>
              <h4>Superior King</h4>
              <p>Et excepteur ad ea consectetur magna commodo sunt voluptate.</p>
              <p>Laboris excepteur enim pariatur voluptate irure excepteur amet eiusmod proident. Ex voluptate exercitation minim.</p>
              <p><a target='_blank' href="#">Read more</a></p>
            </sm-card-content>
          </sm-card>
        </div>
      </div>

      <div>
        <span class="sui-storybook-header">Graphic</span>
        <sm-card style="max-width: 336px">
          <sm-card-graphic
            src="https://pix10.agoda.net/hotelImages/104/104972/104972_16072716330044991252.jpg?s=1024x768"
            alt="A picture of a hotel"
          />

          <sm-card-actions>
            <sm-button aria-label="Edit property" shape="square">
              <sm-icon name="action-edit" aria-hidden="true" />
            </sm-button>
          </sm-card-actions>

          <sm-card-content>
            <h4>Superior King</h4>
            <p>Et excepteur ad ea consectetur magna commodo sunt voluptate.</p>
            <p>Laboris excepteur enim pariatur voluptate irure excepteur amet eiusmod proident. Ex voluptate exercitation minim.</p>
          </sm-card-content>
        </sm-card>
      </div>

    </div>
  `,
})

BasicAndGraphicCard.storyName = 'Basic and Graphic Card'

BasicAndGraphicCard.parameters = {
  percy: {
    // Needed to reduce flakiness on the anchor tags
    enableJavascript: true,
  },
}

export const EditableCard = () => ({
  components: {
    SmCard,
    SmCardActions,
    SmCardContent,
    SmCardGraphic,
  },
  setup: () => {
    const currencyOptions = ref([
      { label: 'Argentine Peso', code: 'ars' },
      { label: 'Australian Dollar', code: 'aud' },
      { label: 'Canadian Dollar', code: 'cad' },
      { label: 'Euro', code: 'eur' },
      { label: 'Hong Kong Dollar', code: 'hkd' },
      { label: 'Indian Rupee', code: 'inr' },
      { label: 'Mexican Peso', code: 'mxn' },
      { label: 'Pound Sterling', code: 'gbp' },
      { label: 'US Dollar', code: 'usd' },
      { label: 'Yen', code: 'jpy' },
    ])

    const form = reactive({ name: 'Superior King', published: true, currency: 'aud' })

    const selectedCurrencyLabel = computed(() => {
      const currency = currencyOptions.value.find(c => c.code === form.currency)

      return currency?.label
    })
    const isEditMode = ref(true)

    return {
      currencyOptions,
      form,
      isEditMode,
      selectedCurrencyLabel,
    }
  },
  template: `
    <div class="flex flex-wrap gap-48 items-start">

      <sm-card :editing="isEditMode" class="flex-auto" style="flex-basis: 336px; max-width: 336px">

        <sm-card-actions>
          <sm-button :type="isEditMode ? 'default' : 'text'" aria-label="Close edit room" shape="square" @click="isEditMode = !isEditMode">
            <sm-icon v-if="isEditMode" name="action-cross" aria-hidden="true" />
            <sm-icon v-else name="action-edit" aria-hidden="true" />
          </sm-button>
        </sm-card-actions>

        <sm-card-content>
          <h4>{{ isEditMode ? 'Edit' : 'Default' }}</h4>

          <sm-form v-if="isEditMode">
            <template #default="{ invalid }">
              <sm-input type="text" v-model="form.name" id="name" label="Room type" name="room-type" rules="required" />

              <sm-select class="block mb-32" label="Currency" v-model="form.currency" :allow-empty="false" :options="currencyOptions" name="currency" />

              <sm-switch v-model="form.published" label="Published" name="published"></sm-switch>

              <div class="text-right mt-24">
                <sm-button native-type="reset" type="text">
                  Cancel
                </sm-button>
                <sm-button native-type="submit" type="primary" :disabled="invalid">
                  Save
                </sm-button>
              </div>
            </template>
          </sm-form>

          <template v-else>
            <span class="block sm-text--small pt-8 mb-4">Room type</span>
            <span class="block mb-24">{{ form.name }}</span>

            <span class="block sm-text--small mb-4">Currency</span>
            <span class="block mb-24">{{ selectedCurrencyLabel }}</span>

            <span class="block sm-text--small">Is published?</span>
            <span class="block">{{ form.published ? 'Yes' : 'No' }}</span>
          </template>

        </sm-card-content>

      </sm-card>


      <sm-card class="flex-auto" style="flex-basis: 336px; max-width: 336px" :disabled="true" :interactive="false">

        <sm-card-actions>
          <sm-button aria-label="Edit property" :disabled="true" shape="square" size="medium">
            <sm-icon aria-hidden="true" name="action-edit"></sm-icon>
          </sm-button>
        </sm-card-actions>

        <sm-card-content>
          <h4>Disabled</h4>
          <span class="block sm-text--small pt-8 mb-4">Room type</span>
          <span class="block mb-24">Superior King</span>
          <span class="block sm-text--small mb-4">Currency</span>
          <span class="block">Euro</span>
        </sm-card-content>

      </sm-card>
    </div>
  `,
})

EditableCard.parameters = {
  docs: {
    description: {
      story: 'An editable card is designed to support a form within it. When the card\'s in an editing mode, the background, top border and box shadow of the card will change to highlight it against other cards.',
    },
  },
}

export const UpsellCard = () => ({
  components: {
    SmCard,
    SmCardActions,
    SmCardContent,
    SmCardGraphic,
    SmCardFooter,
    SmCardBrandGraphic,
  },
  setup: () => {
    const sSmallCropped = ref(smSSmallCropped)
    const sCropped = ref(smSCropped)
    const blocksCropped = ref(smBlocksCropped)
    const sLargeCropped = ref(smSLargeCropped)

    return {
      sSmallCropped,
      sCropped,
      sLargeCropped,
      blocksCropped,
    }
  },
  template: `
    <div class="flex flex-wrap gap-32">

      <div>
        <span class="sui-storybook-header">Bright</span>
        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="bright" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sSmallCropped" background-position="right -4px bottom 60px"/>

          <sm-card-content width="90%">
          <h4>Save time with Auto-replenish</h4>
          <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Save</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Learn more</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="bright" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sCropped" background-position="right bottom 63px"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Save</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Learn more</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="bright" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="blocksCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>
      </div>

      <div>
        <span class="sui-storybook-header">Light</span>
        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="sCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sLargeCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="blocksCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

      </div>

      <div>
        <span class="sui-storybook-header">Dark</span>
        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="sCropped" :dark="true"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sLargeCropped" :dark="true"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="max-width: 514px; margin-bottom: 32px" theme="light" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="blocksCropped" :dark="true"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="primary">Button</sm-button>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>
      </div>

    </div>
  `,
})

UpsellCard.parameters = {
  docs: {
    description: {
      story: 'Use the <code>theme</code> prop to turn the card into a upsell card element, Accepts: bright, light. <br/> Use the <code>sm-card-brand-graphic</code> component to display a brand image on upsell cards with <code>height</code> and <code>width</code> props to set custom height and width to the component. <br/>Use the <code>root-class</code> prop in <code>sm-card</code> if further customization is needed, e.g overriding background color for specific brand assets. <br/> To use the upsell card with dark background, set <code>dark</code> prop in <code>sm-card-brand-graphic</code>.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=17%3A232268&t=hCpfPUmCPPZSF5zx-0',
  },
}

export const UpsellCardResponsive = () => ({
  components: {
    SmCard,
    SmCardActions,
    SmCardContent,
    SmCardGraphic,
    SmCardFooter,
    SmCardBrandGraphic,
  },
  setup: () => {
    const sSmallCropped = ref(smSSmallCropped)
    const sCropped = ref(smSCropped)
    const sLargeCropped = ref(smSLargeCropped)
    const blocksCropped = ref(smBlocksCropped)

    const configForm = ref({
      maxWidth: 514,
    })

    return {
      configForm,
      sSmallCropped,
      sCropped,
      sLargeCropped,
      blocksCropped,
    }
  },
  template: `
    <div>
      <div style="margin-bottom: 32px; max-width: 420px">
        <sm-slider v-model.number="configForm.maxWidth" label="Max width" :min="168" :max="1440">
          <template v-slot:suffix>
            <sm-input v-model.number="configForm.maxWidth" name="maxWidth" width="60px" type="number" label="Max width" errorDisabled labelHidden>
              <template v-slot:suffix>
                <sm-input-suffix-content>px</sm-input-suffix-content>
              </template>
            </sm-input>
          </template>
        </sm-slider>
      </div>

      <div :style="{
        'max-width': configForm.maxWidth + 'px'
      }">
        <sm-card style="margin-bottom:50px" theme="bright" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="sSmallCropped" background-position="right -4px bottom 60px"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="margin-bottom:50px" theme="bright" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sCropped" background-position="right bottom 63px"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="margin-bottom:50px" theme="bright" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="blocksCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 6px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="margin-bottom:50px" theme="light" :show-border-on-top="false" >
          <sm-card-brand-graphic :image-src="sCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="margin-bottom:50px" theme="light" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="sLargeCropped"/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>

        <sm-card style="margin-bottom:50px" theme="light" :show-border-on-top="false">
          <sm-card-brand-graphic :image-src="blocksCropped" dark/>

          <sm-card-content width="90%">
            <h4>Save time with Auto-replenish</h4>
            <p style="margin-bottom: 18px">Automatically update room availability after guest cancellations</p>
          </sm-card-content>

          <sm-card-footer>
            <sm-button type="secondary" style="float:right" suffix-icon="arrow-go-forward">Button</sm-button>
          </sm-card-footer>
        </sm-card>
      </div>
    </div>
  `,
})

UpsellCardResponsive.storyName = 'Upsell Card - Responsive'
UpsellCardResponsive.parameters = {
  docs: {
    description: {
      story: '<h4>Brand graphic</h4> By default, the graphic image is aligned to the right hand side and bottom of the card. The position can be adjusted using <code>background-position</code> prop in <code>sm-card-brand-graphic</code>. <br/> See <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-position">https://developer.mozilla.org/en-US/docs/Web/CSS/background-position</a> for available values. <h4>Content</h4> The width of the content can be adjusted using <code>width</code> prop in <code>sm-card-content</code>. If more flexibility is required, set the width to 100% and add the styles on the content within the slot.',
    },
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/Au1waCRAR4SpFvIgEMASgf/sui-documentation?node-id=17%3A232268&t=hCpfPUmCPPZSF5zx-0',
  },
}

export const NotificationCard = () => ({
  components: {
    SmCard,
    SmCardActions,
    SmCardContent,
    SmCardGraphic,
    // SmUserList,
    // SmUserListItem,
  },
  setup: () => {
    const selected = ref(false)
    const selected1 = ref(false)
    const selected2 = ref(false)

    return {
      selected,
      selected1,
      selected2,
    }
  },
  template: `
    <div>

      <span class="sui-storybook-header">Opened</span>
      <sm-card>
        <sm-card-content class="flex">
          <sm-checkbox :error-disabled="true" :selected-value="selected" v-model="selected" name="opened" />
          <sm-user-list class="min-w-0">
            <sm-user-list-item>
              <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
              <p style="font-size:13px;margin: 0">Then a further explanation will go here, so that</p>
              <template v-slot:date>
                8 Nov 2020
              </template>
            </sm-user-list-item>
          </sm-user-list>
        </sm-card-content>
      </sm-card>

      <br/><br/>

      <span class="sui-storybook-header">Unopened</span>
      <sm-card :selected="true">
        <sm-card-content class="flex">
          <sm-checkbox :error-disabled="true" :selected-value="selected" v-model="selected1" name="unopened" />
          <sm-user-list class="min-w-0">
            <sm-user-list-item :selected="true">
              <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
              <p style="font-size:13px;margin: 0">Then a further explanation will go here, so that</p>
              <template v-slot:date>
                8 Nov 2020
              </template>
            </sm-user-list-item>
          </sm-user-list>
        </sm-card-content>
      </sm-card>

      <br/><br/>

      <span class="sui-storybook-header">Utility state</span>
      <sm-card type="warning">
        <sm-card-content>
          <span style="display: inline-block; width:97%">
            <sm-user-list>
              <sm-user-list-item @click="selected2 = !selected2" :selected="selected2" type="warning">
                <h6 style="padding-bottom:4px; margin:0;">Notification title</h6>
                <p style="font-size:13px;margin: 0">Then a further explanation will go here, so that</p>
                <template v-slot:date>
                  8 Nov 2020
                </template>
              </sm-user-list-item>
            </sm-user-list>
          </span>
        </sm-card-content>
      </sm-card>
    </div>
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

      <p>Below is an example of the SUI card and the brand card using Styling hooks</p>
      <div class="flex items-start gap-24">
        <img
          style="width: 100%; max-width: 350px; height: auto; min-width: 0"
          alt="Card default example"
          class="block mb-16 flex-1"
          :src="defaultImage"
        />
        <img
          style="width: 100%; max-width: 350px; height: auto; min-width: 0"
          alt="Card themed example"
          class="block mb-16 flex-1"
          :src="themedImage"
        />
      </div>

      <p>Below are the card customization variables, followed by <a href="/?path=/docs/guides-theming--styling-hooks#theme-categories">theme categories</a> and <a href="/?path=/docs/guides-theming--styling-hooks#naming-conventions">naming convention</a></p>
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
            <sm-table-th colspan="3">Card (main container)</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              border-radius
              <br/>
              border-width
              <br/>
              border-style
              <br/>
              color-background
              <br/>
              color-border
              <br/>
              color-text
              <br/>
              box-shadow <span class="text-grey-neu-dark text-section-header">(on hover)</span>
              <br/>
              opacity <span class="text-grey-neu-dark text-section-header">(disabled only)</span>
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-card-border-radius<br/>
                --sm-c-card-border-width<br/>
                --sm-c-card-border-style<br/>
                --sm-c-card-color-background<br/>
                --sm-c-card-color-border<br/>
                --sm-c-card-color-text<br/><br/>

                --sm-c-card-color-background-theme-bright<br/>
                --sm-c-card-color-border-theme-bright<br/>
                --sm-c-card-color-text-theme-bright<br/><br/>

                --sm-c-card-color-background-theme-light<br/>
                --sm-c-card-color-border-theme-light<br/>
                --sm-c-card-color-text-theme-light<br/><br/>

                --sm-c-card-color-background-editing<br/>
                --sm-c-card-color-border-editing<br/>
                --sm-c-card-color-text-editing<br/><br/>

                --sm-c-card-color-background-selected<br/>
                --sm-c-card-color-border-selected<br/>
                --sm-c-card-color-text-selected<br/><br/>

                --sm-c-card-color-background-warning<br/>
                --sm-c-card-color-border-warning<br/>
                --sm-c-card-color-text-warning<br/><br/>

                --sm-c-card-color-background-disabled<br/>
                --sm-c-card-color-border-disabled<br/>
                --sm-c-card-color-text-disabled<br/><br/>

                --sm-c-card-color-text-dark<br/><br/>

                --sm-c-card-box-shadow-hover<br/>
                --sm-c-card-opacity-disabled<br/>
              </code>
            </sm-table-td>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Border top</sm-table-td>
            <sm-table-td>
              border-top-width
              <br/>
              border-top-style
              <br/>
              color-border-top
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-card-border-top-width<br/>
                --sm-c-card-border-top-style<br/><br/>

                --sm-c-card-color-border-top<br/>
                --sm-c-card-color-border-top-hover<br/><br/>

                --sm-c-card-color-border-top-theme-bright<br/>
                --sm-c-card-color-border-top-theme-bright-hover<br/><br/>

                --sm-c-card-color-border-top-theme-light<br/>
                --sm-c-card-color-border-top-theme-light-hover<br/><br/>

                --sm-c-card-color-border-top-theme-editing<br/>
                --sm-c-card-color-border-top-theme-editing-hover<br/><br/>

                --sm-c-card-color-border-top-theme-selected<br/>
                --sm-c-card-color-border-top-theme-selected-hover<br/><br/>

                --sm-c-card-color-border-top-theme-warning<br/>
                --sm-c-card-color-border-top-theme-warning-hover<br/><br/>

                --sm-c-card-color-border-top-theme-disabled<br/>
                --sm-c-card-color-border-top-theme-disabled-hover<br/><br/>
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Brand graphic</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-card-brand-graphic-color-background-dark
              </code>
            </sm-table-td>
          </sm-table-tr>

          <sm-table-tr>
            <sm-table-th colspan="3">Footer</sm-table-th>
          </sm-table-tr>
          <sm-table-tr>
            <sm-table-td>Common</sm-table-td>
            <sm-table-td>
              color-background
            </sm-table-td>
            <sm-table-td>
              <code
                class="sui-storybook-code sui-storybook-code--block"
              >--sm-c-card-footer-color-background-theme-bright
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
