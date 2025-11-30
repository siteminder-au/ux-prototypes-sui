<script setup lang="ts">
import { useI18n } from '../../../libs/vue-i18n'

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

const { i18n } = useI18n()
</script>

<template>
  <div class="sm-loading-image">
    <div class="sm-loading-image__loading">
      <svg
        width="183px"
        height="112px"
        viewBox="0 0 183 112"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <title>{{ i18n.t('sui-core.components.loading.sm-loading-image.sm-loading-image.loading-image-alt-text') }}</title>
        <g
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          opacity="0.8"
        >
          <g
            transform="translate(-1206.000000, -2881.000000)"
            fill="#F5F9FF"
          >
            <g transform="translate(120.000000, 2466.000000)">
              <g transform="translate(0.000000, 86.000000)">
                <g transform="translate(265.000000, 265.000000)">
                  <g transform="translate(779.000000, 32.000000)">
                    <!-- eslint-disable-next-line max-len -->
                    <path d="M115.112951,88.3149613 L132.127106,143.967661 L52.654106,143.967661 L42.4337897,110.535211 C41.1420102,106.309991 43.5200338,101.837579 47.7452541,100.545799 L105.123539,83.0034969 C109.34876,81.7117174 113.821172,84.089741 115.112951,88.3149613 Z M191.617251,37.6308092 L224.128106,143.967661 L144.654106,143.967661 L118.938089,59.8510588 C117.64631,55.6258385 120.024333,51.1534265 124.249554,49.8616471 L181.627839,32.3193448 C185.853059,31.0275653 190.325471,33.4055889 191.617251,37.6308092 Z M82.5,38 C92.1649831,38 100,45.8350169 100,55.5 C100,65.1649831 92.1649831,73 82.5,73 C72.8350169,73 65,65.1649831 65,55.5 C65,45.8350169 72.8350169,38 82.5,38 Z" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../common/variables';
@import '../../../common/mixins';

@keyframes SmLoadingBarKeyframes {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.sm-loading-image {
  border-radius: 4px;
  position: relative;

  &__loading {
    z-index: $sm-loading-bar-z-index;
    animation: SmLoadingBarKeyframes ease 3s infinite;
    border-radius: inherit;
    background-color: #dce3ec;
    background-size: 200% 200%;
    background-image: linear-gradient(to right, #dce3ec, #eff3f8 49%, #dce3ec);
    height: 100%;
    width: 100%;
  }

  svg {
    height: 100%;
    width: 100%;
    object-fit: cover;
    max-width: 186px;
    max-height: 112px;
    position: absolute;
    bottom: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
