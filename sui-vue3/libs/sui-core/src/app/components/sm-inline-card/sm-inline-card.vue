<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { SmInlineCardType, SmInlineCardSize } from './sm-inline-card.types'
import { SmButtonShape, SmButtonType } from '../sm-button/sm-button.types'
import { useI18n } from '../../libs/vue-i18n'

import SmButton from '../sm-button/sm-button.vue'

const props = withDefaults(defineProps<{
  /**
   * Whether the card's close button should be displayed
   */
  visible?: boolean
  /**
   * Whether the card's close button should be displayed
   */
  showClose?: boolean
  /**
   * The title of the card. Can be overridden by the title slot
   */
  title?: string
  /**
   * The content of the card. Can be overridden by the default slot
   */
  message?: string
  /**
   * The style of the card. Accepts: 'success', 'info', 'alert', 'warning'
   */
  type?: SmInlineCardType
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * Whether to show mini info card
   */
  size?: SmInlineCardSize
}>(), {
  visible: false,
  showClose: false,
  title: '',
  message: '',
  type: SmInlineCardType.DEFAULT,
  showOnTop: false,
  size: SmInlineCardSize.LARGE,
})

const emit = defineEmits<{
  click: [value: MouseEvent]
  close: [value: Event]
  mouseenter: [value: MouseEvent]
  mouseleave: [value: MouseEvent]
  'update:visible': [state: boolean]
}>()

const iconName = computed(() => {
  const icons = {
    [SmInlineCardType.ALERT]: 'utility-alert',
    [SmInlineCardType.INFO]: 'utility-information',
    [SmInlineCardType.SUCCESS]: 'utility-success-alt',
    [SmInlineCardType.WARNING]: 'utility-warning',
    [SmInlineCardType.DEFAULT]: undefined,
  }

  return icons[props.type]
})

const { i18n } = useI18n()

const { id: contentElementId } = useUniqueId('sm-inline-card__content_')

const isVisible = computed<boolean>({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const mouseenter: GlobalEventHandlers['onmouseenter'] = (e) => {
  emit('mouseenter', e)
}
const mouseleave: GlobalEventHandlers['onmouseleave'] = (e) => {
  emit('mouseleave', e)
}
const click: GlobalEventHandlers['onclick'] = (e) => {
  emit('click', e)
}

const eventBindings = ref()

const mouseEvents = {
  mouseenter,
  mouseleave,
  click,
}
eventBindings.value = mouseEvents

defineExpose({
  iconName,
  isVisible,
  eventBindings,
})
</script>

<template>
  <div
    class="sm-inline-card"
    role="alert"
    :aria-describedby="contentElementId || undefined"
    :class="{
      [`sm-inline-card--type-${type}`]: !!type,
      'sm-inline-card--has-title': title || $slots.title,
      'sm-visible-on-top': showOnTop,
      [`sm-inline-card--size-${size}`]: !!size,
    }"
    v-on="eventBindings"
  >
    <!-- @event click Same as native click -->
    <div
      class="sm-inline-card__header"
      :class="{ 'sm-inline-card__header--has-body': !!$slots.body }"
    >
      <div
        v-if="iconName"
        class="sm-inline-card__icon"
      >
        <sm-icon
          :name="iconName"
          aria-hidden="true"
        />
      </div>

      <div class="sm-inline-card__body-header">
        <div class="sm-inline-card__content">
          <!-- @slot The main content of the card. Overrides the title and message props. -->
          <slot v-if="$slots.default" />

          <template v-else>
            <h4
              v-if="title"
              class="sm-inline-card__title"
            >
              {{ title }}
            </h4>
            <p
              v-if="message"
              class="sm-inline-card__message"
            >
              {{ message }}
            </p>
          </template>

          <div
            v-if="$slots.action"
            class="sm-inline-card__action"
          >
            <!-- @slot A primary action for the card. -->
            <slot name="action" />
          </div>
        </div>
      </div>

      <div
        v-if="showClose"
        class="sm-inline-card__close"
      >
        <!-- @event close Emits when the card is closed -->
        <sm-button
          :shape="SmButtonShape.SQUARE"
          :type="SmButtonType.TEXT"
          :aria-label="i18n.t('sui-core.components.sm-inline-card.sm-inline-card.a11y__click-to-close')"
          @click="e => $emit('close', e)"
        >
          <sm-icon
            name="action-cross"
            aria-hidden="true"
          />
        </sm-button>
      </div>
    </div>

    <div
      v-if="$slots.body"
      class="sm-inline-card__body"
    >
      <!-- @slot The card body -->
      <slot name="body" />
    </div>
    <div
      v-if="$slots.footer"
      class="sm-inline-card__footer"
    >
      <!-- @slot The card footer -->
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss">
@import "../../common/variables";

$sm-inline-card--text-color: (
  info: $grey-neu-black,
  success: $grey-neu-black,
  alert: $grey-neu-black,
  warning: $grey-neu-black,
);
$sm-inline-card--icon-color: (
  info: $app-info,
  success: $app-success,
  alert: $grey-neu-black,
  warning: $app-warning,
);
$sm-inline-card--icon-background-color: (
  info: $app-info-mid,
  success: $app-success-mid,
  alert: $app-alert-mid,
  warning: $app-warning-mid,
);
$sm-inline-card--background-color: (
  info: $app-info-light,
  success: $app-success-light,
  alert: $app-alert-light,
  warning: $app-warning-light,
);
$sm-inline-card--border-color: (
  info: $app-info-mid,
  success: $app-success-mid,
  alert: $app-alert-mid,
  warning: $app-warning-mid,
);
$sm-inline-card--border-top-color: (
  info: $app-info,
  success: $app-success,
  alert: $app-alert,
  warning: $app-warning,
);
$sm-inline-card--close-color: $grey-neu-dark;
$sm-inline-card--dark-border-color: $light-blue-grey;
$sm-inline-card--top-border-color: $primary-blue;

.sm-inline-card {
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-top-width: 2px;
  max-width: calc(100vw - 24px);
  width: 720px;
  margin-bottom: $sm-12;
  transition: all 0.3s ease;

  &--type-default {
    border-color: $sm-inline-card--dark-border-color;
    border-top-color: $sm-inline-card--top-border-color;

    .sm-inline-card__body-header {
      padding-left: 0;
    }

    .sm-inline-card__body {
      padding: $sm-12 $sm-24;
    }

    .sm-inline-card__footer {
      padding: $sm-24;
    }
  }

  &--size-small {
    width: 504px;

    .sm-inline-card__body {
      padding: $sm-24 $sm-24 $sm-8 $sm-24;
    }

    .sm-inline-card__footer {
      padding: $sm-24;
    }
  }

  &__header {
    display: flex;
    padding: $sm-24;

    &--has-body {
      border-bottom: 1px solid $sm-inline-card--dark-border-color;
    }
  }

  &__body {
    padding: $sm-24 $sm-24 $sm-8 73px;
  }

  &__footer {
    padding: $sm-24;
    border-top: 1px solid $sm-inline-card--dark-border-color;
    display: flex;
    justify-content: flex-end;
  }

  &__icon {
    flex-shrink: 0;
    font-size: $sm-24;
    line-height: 1;
    margin-top: 0;
  }

  &__body-header {
    flex-grow: 1;
    display: flex;
    padding-left: $sm-16;
  }

  &__title {
    margin-bottom: $sm-8;
  }

  &__message:last-child {
    margin-bottom: 0;
  }

  &__close .sm-button {
    .sm-button__content {
      color: $sm-inline-card--close-color;
      margin-top: -9px;
      margin-bottom: -9px;
      margin-right: -9px;
    }
  }

  &__icon,
  &__close {
    align-self: flex-start;
  }

  &--has-title &__close {
    margin-top: 0;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: relative;

    .sm-icon {
      font-size: 20px;
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  /* Type */
  @each $type in "info", "success", "alert", "warning" {
    &--type-#{$type} {
      color: map-get($sm-inline-card--text-color, $type);
      background: map-get($sm-inline-card--background-color, $type);
      border-color: map-get($sm-inline-card--border-color, $type);
      border-top-color: map-get($sm-inline-card--border-top-color, $type);
    }

    &--type-#{$type} &__icon {
      color: map-get($sm-inline-card--icon-color, $type);
      background: map-get($sm-inline-card--icon-background-color, $type);
    }
  }
}
</style>
