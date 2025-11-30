<script setup lang="ts">
import { ref, reactive, onMounted, Ref, computed } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonType } from '../sm-button/sm-button.types'
import iconArrowDown from './icons/arrow-down'

const props = withDefaults(defineProps<{
  /**
   * Set the number of lines to display ellipsis at the end
   */
  clampLine?: number | string
  /**
   * The text of the read less button
   */
  showLessText?: string
  /**
   * The text of the read more button
   */
  showMoreText?: string
}>(), {
  clampLine: 2,
  showLessText: '',
  showMoreText: '',
})

const emit = defineEmits<{
  /**
   * Emitted when the read less button is clicked
   */
  hide: []
  /**
   * Emitted when the read more button is clicked
   */
  show: []
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

const computedShowLessText = computed(() => {
  return props.showLessText || i18n.t('sui-core.components.sm-text-truncator.sm-text-truncator.read-less-button')
})

const computedShowMoreText = computed(() => {
  return props.showMoreText || i18n.t('sui-core.components.sm-text-truncator.sm-text-truncator.read-more-button')
})

const toggleText = ref<string>(computedShowMoreText.value)
const textContainer: Ref<HTMLElement | null> = ref(null)
const rootContainerStyles = reactive<Record<string, number | undefined>>({ '-webkit-line-clamp': undefined })
const isButtonVisible = ref<boolean>(false)
const isShowMore = ref<boolean>(true)

const toggle = (): void => {
  if (toggleText.value === computedShowMoreText.value) {
    toggleText.value = computedShowLessText.value
    rootContainerStyles['-webkit-line-clamp'] = undefined
    isShowMore.value = false
    emit('show')
  } else {
    toggleText.value = computedShowMoreText.value
    rootContainerStyles['-webkit-line-clamp'] = Number(props.clampLine)
    isShowMore.value = true
    emit('hide')
  }
}

onMounted(() => {
  const defaultLineHeight = 22
  const defaultOffset = 1
  const totalHeight = defaultLineHeight * Number(props.clampLine)
  const currentHeight = textContainer.value?.clientHeight ?? 0
  isButtonVisible.value = currentHeight > (totalHeight + defaultOffset) // Add margin of error for flash of un-styled text
  rootContainerStyles['-webkit-line-clamp'] = Number(props.clampLine)
})

defineExpose({
  toggle,
  toggleText,
  rootContainerStyles,
  textContainer,
  isButtonVisible,
  isShowMore,
})
</script>

<template>
  <div class="sm-text-truncator">
    <p
      ref="textContainer"
      class="sm-text-truncator__text"
      :style="rootContainerStyles"
    >
      <!-- @slot The paragraph content -->
      <slot />
    </p>
    <sm-button
      v-if="isButtonVisible"
      :type="SmButtonType.TEXT"
      class="sm-text-truncator__button"
      @click.stop="toggle()"
    >
      {{ toggleText }}
      <span
        :class="{
          'sm-icon sm-icon--arrow-down sm-text-truncator__icon': true,
          'sm-text-truncator__icon--show-less': !isShowMore
        }"
      >
        <svg
          version="1.1"
          :viewBox="iconArrowDown.viewBox"
          focusable="false"
          :aria-hidden="true"
          role="img"
          :style="{ width: '1em', height: '1em' }"
          v-html="iconArrowDown.path"
        ></svg>
      </span>
    </sm-button>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-text-truncator {
  &__text {
    display: block;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
    transition: all 0.3s ease;
  }

  .sm-button.sm-button--type-text {
    .sm-button__content {
      // Override button styles to align with the truncated text
      border: 0;
      background: transparent;
      padding: 11px 0;
    }

    &:focus {
      box-shadow: 0 0 0 2px $grey-neu-black;
    }
  }

  /* Bump specificity so it doesn't get overridden by global icon styles */
  .sm-text-truncator__icon {
    font-size: 14px;
    margin-left: 5px;

    &--show-less {
      transform: rotate(-180deg);
    }
  }

  .sm-icon {
    display: inline-block;
    position: relative;
    top: -2px;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    line-height: 1;

    > svg {
      line-height: 1;
      fill: currentColor;
      display: inline-block;
    }
  }
}
</style>
