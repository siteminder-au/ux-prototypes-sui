<script setup lang="ts">
import { ref } from 'vue'
import { useTranslate } from '@/composables/use-translate'
import backpackingType from '@/assets/images/backpacking-type.jpg'
import cabinType from '@/assets/images/cabin-type.jpg'
import carCampingType from '@/assets/images/car-camping-type.jpg'
import glampingType from '@/assets/images/glamping-type.jpg'
import teepeeType from '@/assets/images/teepee-type.jpg'
import tentType from '@/assets/images/tent-type.jpg'
import trailerType from '@/assets/images/trailer-type.jpg'
import yurtType from '@/assets/images/yurt-type.jpg'

const { t } = useTranslate('components.campsite-type-slider.campsite-type-slider')

// #region sm-content-slider
const images = [
  { src: backpackingType },
  { src: cabinType },
  { src: carCampingType },
  { src: glampingType },
  { src: teepeeType },
  { src: tentType },
  { src: trailerType },
  { src: yurtType },
]

const dynamicImages = ref(images.slice(0))
const staticImages = ref(Array.from({ length: 32 }, (_, i) => images[i % images.length]))
// #endregion sm-content-slider
</script>

<template>
  <div>
    <div class="cm-mb-24">
      <h3 class="sm-section-heading">{{ t('with-delete-label') }}</h3>
      <!--
        NOTE on sm-content-slider:

        The visible items will remain the same even on smaller viewports and
        will simply shrink the images to fit the container. We'll keep that here
        to test the default behaviour of the component. However, if a product
        requires a more responsive solution, they can listen to media query
        changes (via Web API, @vueuse/core or the like) and update the desired
        props(s) accordingly.
      -->

      <!-- Use prop defaults -->
      <sm-content-slider :items.sync="dynamicImages">
        <sm-content-slider-item
          v-for="(image, i) in dynamicImages"
          :key="i"
          :index="i"
        >
          <sm-content-slider-graphic :src="image.src" />
        </sm-content-slider-item>
      </sm-content-slider>
    </div>

    <div>
      <h3 class="sm-section-heading">{{ t('without-delete-label') }}</h3>
      <!-- Provide props not matching defaults -->
      <sm-content-slider
        height="162px"
        :item-visible="9"
        :items.sync="staticImages"
      >
        <sm-content-slider-item
          v-for="(image, i) in staticImages"
          :key="i"
          :index="i"
          :show-delete="false"
        >
          <sm-content-slider-graphic :src="image.src" />
        </sm-content-slider-item>
      </sm-content-slider>
    </div>
  </div>
</template>
