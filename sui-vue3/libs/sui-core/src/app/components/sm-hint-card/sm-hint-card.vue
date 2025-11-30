<script setup lang="ts">
import { VNode } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonShape, SmButtonSize, SmButtonType } from '../sm-button/sm-button.types'
import { SmHintCardAction } from './sm-hint-card.types'

withDefaults(defineProps<{
  /**
   * Action required to complete the task. Accepts a configuration object to
   * define the `label` and `onClick` handler (optional). This can also accept
   * most of the available `sm-button` props except for some style specific ones
   * like `size` and `type` to ensure consistency.
   */
  actionButton?: SmHintCardAction
  /**
   * This text is optional. If you don't require it, then
   * the content of the message will appear in the title text.
   */
  body?: string
  /**
   * Whether to show the close button on the hint card
   */
  showClose?: boolean
  /**
   * This can either serve as the title of the card or the entire contents of
   * the card, depending on what message is being conveyed.
   */
  title?: string
  /**
   * HTML Element to use for the hint card title. Use this if you need to
   * use headings (h1-h6) and optimize the levels on your page.
   */
  titleTag?: string
}>(), {
  actionButton: undefined,
  body: '',
  showClose: false,
  title: '',
  titleTag: 'div',
})

const emit = defineEmits<{
  /**
   * Emitted when the hint-card's close button is clicked
   */
  close: []
}>()

/**
 * defineSlots macro used to declare expected slots and their respective expected slot
 */
defineSlots<{
  title?: () => VNode[]
  body?: () => VNode[]
  action?: () => VNode[]
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
</script>

<template>
  <div
    :class="{
      'sm-hint-card': true,
      'sm-hint-card--has-close': showClose
    }"
  >
    <div class="sm-hint-card__wrapper">
      <div class="sm-hint-card__icon">
        <sm-icon name="other-hint" />
      </div>

      <div class="sm-hint-card__content">
        <component
          :is="titleTag"
          v-if="title || $slots.title"
          class="sm-hint-card__title"
        >
          <!-- @slot The title slot will override the prop if it is provided -->
          <slot name="title">
            {{ title }}
          </slot>
        </component>

        <p
          v-if="body || $slots.body"
          class="sm-hint-card__body"
        >
          <!-- @slot The body slot will override the prop if it is provided -->
          <slot name="body">
            {{ body }}
          </slot>
        </p>
      </div>
    </div>

    <div
      v-if="actionButton || $slots.action"
      class="sm-hint-card__action"
    >
      <!-- @slot The action slot will override the button-action prop if it is provided, but in most cases, you should only need to use the button-action config -->
      <slot name="action">
        <sm-button
          v-bind="{
            ...actionButton,
            size: SmButtonSize.MEDIUM,
            suffixIcon: undefined,
            type: SmButtonType.TEXT,
          }"
          @click="actionButton?.onClick"
        >
          {{ actionButton?.label }}
          <sm-icon
            v-if="actionButton?.suffixIcon"
            class="sm-hint-card__action-button-icon"
            :name="actionButton?.suffixIcon"
          />
        </sm-button>
      </slot>
    </div>

    <div
      v-if="showClose"
      class="sm-hint-card__close"
    >
      <sm-button
        :type="SmButtonType.TEXT"
        :shape="SmButtonShape.SQUARE"
        :size="SmButtonSize.MEDIUM"
        :title="i18n.t('sui-core.components.sm-hint-card.sm-hint-card.a11y__click-to-close')"
        :aria-label="i18n.t('sui-core.components.sm-hint-card.sm-hint-card.a11y__click-to-close')"
        @click="emit('close')"
      >
        <sm-icon
          class="sm-hint-card__close-icon"
          name="action-cross"
        />
      </sm-button>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

.sm-hint-card {
  align-items: center;
  background: linear-gradient(90deg, #F6ECFB 0%, #E3EFFE 100%);
  border-left: 3px solid #A400DD;
  background-clip: padding-box; /* Safari fix */
  border-radius: 0 $sm-8 $sm-8 0;
  color: $grey-neu-black;
  display: flex;
  flex-wrap: wrap;
  gap: $sm-8;
  justify-content: space-between;
  padding: $sm-12;
  position: relative;
  word-break: break-word;

  .sm-hint-card__wrapper {
    display: flex;
    column-gap: $sm-8;
  }

  .sm-hint-card__icon {
    color: #A400DD;
  }

  .sm-hint-card__body {
    font-size: 13px;
    font-weight: 400;
    letter-spacing: -0.1px;
    line-height: 20px;
    margin: 0;
  }

  .sm-hint-card__title {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.2px;
    line-height: 22px;
    margin: 0;
  }

  .sm-hint-card__close {
    position: absolute;
    top: $sm-8;
    right: $sm-8;
  }

  .sm-hint-card__close-icon {
    color: $grey-neu-black;
  }

  .sm-hint-card__action {
    margin-left: $sm-12;
  }

  .sm-hint-card__action-button-icon {
    font-size: 13px;
    margin-left: $sm-4;
  }

  &--has-close {
    padding-right: $sm-40;

    .sm-hint-card__action {
      flex-basis: 100%;
    }
  }
}
</style>
