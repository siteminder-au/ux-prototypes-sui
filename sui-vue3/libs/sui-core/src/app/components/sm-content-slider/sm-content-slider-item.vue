<script setup lang="ts">
import { inject, ref, computed, VNode } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape, SmButtonSize, SmButtonType } from '../sm-button/sm-button.types'
import { ContentSliderProviderKey } from './symbols'

withDefaults(defineProps<{
  /**
   * Set index value of slider item
   */
  index: number
  /**
   * Whether to show delete button on slider item
   */
  showDelete?: boolean
}>(), {
  showDelete: true,
})

const emit = defineEmits<{
  /**
   * Emits when the delete button is clicked
   */
  deleteItem: [item: unknown]
}>()

defineSlots<{
  default?: () => VNode[]
}>()

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

// data provided by sm-content-slider
const contentSliderProvider = inject(ContentSliderProviderKey)

const itemContainer = ref<HTMLElement | null>(null)

const itemsData = contentSliderProvider?.itemsData
const totalItemsLength = computed(() => itemsData?.value.length ?? 0)

// Parent sm-content-slider's clientWidth / visibleItem
const getItemWidth = computed(() => {
  if (contentSliderProvider?.itemWidth.value) {
    return `${contentSliderProvider.itemWidth.value}px`
  }

  return null
})

// Emit when the click button is clicked on slide item
const deleteItem = (index: number): void => {
  if (totalItemsLength.value > 0) {
    emit('deleteItem', itemsData?.value[index])
    itemsData?.value.splice(index, 1)
  }
}

defineExpose({
  itemContainer,
  getItemWidth,
  deleteItem,
  itemsData,
})
</script>

<template>
  <li
    ref="itemContainer"
    class="sm-content-slider-item"
    :style="`width: ${getItemWidth}`"
  >
    <span
      v-if="showDelete"
      class="sm-content-slider-item__delete"
    >
      <sm-button
        :aria-label="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-delete-button')"
        :title="i18n.t('sui-core.components.sm-content-slider.sm-content-slider.a11y__click-to-delete-button')"
        :shape="SmButtonShape.SQUARE"
        :type="SmButtonType.TERTIARY"
        class="sm-content-slider-delete"
        :size="SmButtonSize.MEDIUM"
        @click="deleteItem(index)"
      ><sm-icon
        name="action-cross"
      /></sm-button>
    </span>

    <div class="sm-content-slider-item__item-content">
      <!-- @slot A space for slider item component to be placed -->
      <slot />
    </div>
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-content-slider--button--gradient-color: $blue-neu-light;
$sm-content-slider--button--border-color: $light-blue-grey;

.sm-content-slider-item {
  list-style: none;
  line-height: 100;
  height: 100%;
  padding: 0 $sm-8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover,
  &:focus {
    .sm-content-slider-item__delete {
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    .sm-content-slider-item__item-content {
      border-color: $sm-content-slider--button--border-color;
      box-shadow: 0 -1px 1px -1px rgba(24, 58, 108, 0.14), 0 -3px 4px -2px rgba(24, 58, 108, 0.1), 0 -3px 9px -2px rgba(24, 58, 108, 0.1);
    }
  }

  &__delete {
    position: absolute;
    right: 0;
    height: 100%;
    top: $sm-4;
    right: $sm-12;
    opacity: 0;

    .sm-button .sm-button__content {
      border: 0;
    }
  }

  &__item-content {
    height: 100%;
    width: 100%;
    border-radius: 4px;
    border: 1px solid white;
    background-color: $sm-content-slider--button--gradient-color;
    transition: all 0.2s ease-in;
  }
}
</style>
