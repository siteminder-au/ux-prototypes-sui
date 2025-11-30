<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, watchEffect, Ref, provide } from 'vue'
import { useI18n } from '../../libs/vue-i18n'
import { useUniqueId } from '../use/unique-id'
import { useScrollLock } from '../use/scroll-lock'
import { useCycleFocus } from '../use/cycle-focus'
import { useOnEscape } from '../use/on-escape'
import { useReturnToFocus } from '../use/return-to-focus'
import { SmButtonShape, SmButtonSize, SmButtonType } from '../sm-button/sm-button.types'
import SmButton from '../sm-button/sm-button.vue'
import { SmWizardStepState, WizardProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * The active step of the wizard. Use the `v-model:active-step` modifier to receive and set the step number.
   */
  activeStep?: number
  /**
   * Arbitrary attributes which will be attached to the back button element. Use this to aid testing.
   */
  backButtonAttrs?: Record<string, unknown>
  /**
   * The text for the back button
   */
  backButtonText?: string
  /**
   * Callback before wizard closes, and it will prevent wizard from closing
   * @default function(close) close is used to close the wizard
   */
  beforeClose?: (close: () => void) => void
  /**
   * Callback before wizard step changes, and can prevent step from changing
   * @default function (to: number, from: number, next: (index: number = to) => void)
   */
  beforeStepChange?: (to: number, from: number, next: (index: number) => void) => void
  /**
   * Arbitrary attributes which will be attached to the close button element. Use this to aid testing.
   */
  closeButtonAttrs?: Record<string, unknown>
  /**
   * Whether the wizard can be closed by pressing ESC
   */
  closeOnPressEscape?: boolean
  /**
   * Arbitrary attributes which will be attached to the confirm button element. Use this to aid testing.
   */
  confirmButtonAttrs?: Record<string, unknown>
  /**
   * The arrow icon for the confirm button on the last step.
   */
  confirmButtonIcon?: boolean
  /**
   * The text for the confirm button on the last step.
   */
  confirmButtonText?: string
  /**
   * Disable the "confirm" or "submit" button
   */
  disableConfirm?: boolean
  /**
   * Disable the step buttons
   */
  disableNav?: boolean
  /**
   * Disable the "previous" or "back" button
   */
  disablePrev?: boolean
  /**
   * Disable the "next" or "forward" button
   */
  disableNext?: boolean
  /**
   * Whether to hide the back button at the first step
   */
  hideBack?: boolean
  /**
   * Arbitrary attributes which will be attached to the next button element. Use this to aid testing.
   */
  nextButtonAttrs?: Record<string, unknown>
  /**
   * The text for the next button before last step.
   */
  nextButtonText?: string
  /**
   * Whether to show a close button
   */
  showClose?: boolean
  /**
   * Whether to show component on top of all components by setting the highest z-index
   */
  showOnTop?: boolean
  /**
   * The title of the wizard. Can also be passed as a named slot.
   */
  title?: string
  /**
   * Whether the wizard is visible. Use the `v-model:visible` syntax to receive updates
   */
  visible?: boolean
}>(), {
  activeStep: undefined,
  backButtonAttrs: undefined,
  backButtonText: '',
  beforeClose: (close: () => void) => close(),
  beforeStepChange: (to: number, from: number, next: (index: number) => void) => next(to),
  closeButtonAttrs: undefined,
  closeOnPressEscape: true,
  confirmButtonAttrs: undefined,
  confirmButtonIcon: false,
  confirmButtonText: '',
  disableConfirm: false,
  disableNav: false,
  disableNext: false,
  disablePrev: false,
  hideBack: true,
  nextButtonAttrs: undefined,
  nextButtonText: '',
  showClose: true,
  showOnTop: false,
  title: '',
  visible: false,
})

const emit = defineEmits<{
  'update:visible': [state: boolean]
  'update:activeStep': [step: number]
  stepChange: [steps: SmWizardStepState[], to: number]
  open: []
  close: []
  confirmed: []
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

const wizardElement: Ref<HTMLElement | null> = ref(null)
const contentElement: Ref<HTMLElement | null> = ref(null)

const progressBarContainer: Ref<HTMLElement | null> = ref(null)

const circleRadius = 34
const circleHeightWidth = ref<number>(72)

const isVisible = computed({
  get: () => props.visible,
  set: state => emit('update:visible', state),
})

const open = (): void => {
  isVisible.value = true
}

const close = (): void => {
  if (typeof props.beforeClose === 'function') {
    props.beforeClose(() => {
      isVisible.value = false
    })
  } else {
    isVisible.value = false
  }

}

// Emit open / close events
watch(
  () => props.visible,
  () => {

    if (isVisible.value) {
      emit('open')
    } else {
      emit('close')
    }

  },
)

// Close when the user hits Escape
useOnEscape(() => {

  if (isVisible.value && props.closeOnPressEscape) {
    close()
  }

})

// Lock the body scroll
const scrollLock = useScrollLock('sm-wizard-')
watchEffect(() => {

  if (isVisible.value) {
    scrollLock.lock()
  } else {
    scrollLock.unlock()
  }

})

onBeforeUnmount(() => scrollLock.unlock())

// Shift focus on open & close
const returnToFocus = useReturnToFocus()
watchEffect(() => {

  if (isVisible.value) {
    returnToFocus.capture()
    if (wizardElement.value) {
      wizardElement.value.focus()
    }
  } else {
    returnToFocus.returnTo()
  }

})

// Cycle the focus within the wizard
onMounted(() => {
  if (wizardElement.value) {
    useCycleFocus(wizardElement.value)
  }
})

const { id: titleElementId } = useUniqueId('sm-wizard__title_')
const { id: tabElementBaseId } = useUniqueId('sm-wizard__')

/**
 * Previously the wizard component is doing vnode traversal to find the sm-wizard-step component(s)
 * which we can't do in Vue3 anymore. So we are using a provider pattern to allow sm-wizard-step
 * to register itself to the wizard component.
 *
 * In addition, we use an id (default is the label) and order to identify and sort the steps.
 */
const updateSteps = (step: SmWizardStepState): void => {
  if (!step.stepId) {
    return
  }

  let newSteps = steps.value.slice(0)

  const existingStepIndex = newSteps.findIndex(currStep => step.stepId === currStep.stepId)

  if (newSteps[existingStepIndex]) {
    newSteps[existingStepIndex] = step
  } else {
    newSteps.push(step)
  }

  newSteps = newSteps.sort((a, b) => a.order - b.order)

  steps.value = newSteps
}

onMounted(() => {
  if (steps.value.length) {
    goToStep(0)
  }
})

const stepIndex = computed<number>({
  get: () => props.activeStep ?? 0, // Incase step is null
  set: state => emit('update:activeStep', state),
})

// #region step states
const steps = ref<SmWizardStepState[]>([])
const activeStepId = computed(() => steps.value[stepIndex.value]?.stepId)

provide(WizardProviderKey, {
  activeStep: stepIndex,
  activeStepId,
  steps,
  addStep: (step: SmWizardStepState) => updateSteps(step),
  toggleOverlay: (stepId: string, showOverlay: boolean) => {
    // add ability to toggle overlay on sm-wizard-step
    if (steps.value[stepIndex.value].stepId === stepId) {
      activeStepOverlayVisible.value = showOverlay
    }
  },
})
// #endregion

const goToStep = (to: number): void => {
  const from = stepIndex.value

  props.beforeStepChange(to, from, (nextIndex: number = to) => {

    if (steps.value.length === 0) {
      return
    }

    if (nextIndex > steps.value.length - 1 || nextIndex < 0) {
      throw new Error(`Step #${nextIndex} does not exist. Provide a step index that exists`)
    }

    stepIndex.value = nextIndex

  })

  emit('stepChange', steps.value, to)
  showRingProgressBar(steps.value.length, to)
}

const showRingProgressBar = (length: number, step: number): void => {
  const getSteps = step + 1
  const circumference = circleRadius * 2 * Math.PI
  const circleRefs: any = progressBarContainer.value
  const getPercent = (getSteps / length) * 100
  circleRefs.style.strokeDasharray = `${circumference} ${circumference}`
  const offset = circumference - getPercent / 100 * circumference // eslint-disable-line no-mixed-operators
  circleRefs.style.strokeDashoffset = offset
}

const goFirstStep = (): void => goToStep(0)
const goLastStep = (): void => goToStep(steps.value.length - 1)
const goNextStep = (): void => goToStep(stepIndex.value + 1)
const goPrevStep = (): void => goToStep(stepIndex.value - 1)

const hasNextStep = computed(() => stepIndex.value < steps.value.length - 1)
const hasPrevStep = computed(() => stepIndex.value > 0)

const activeStepOverlayVisible = ref<boolean | undefined>()
// TODO: Implement animations back after GA in https://siteminder-jira.atlassian.net/browse/SUI-1593
const activeStepOverlayAnimating = ref()

watch(() => stepIndex.value, (newVal, oldVal) => {
  if (oldVal >= 0) {
    goToStep(stepIndex.value)
  }
})

watch(
  () => activeStepOverlayVisible.value,
  () => {
    if (wizardElement.value) {
      wizardElement.value.scrollTop = 0
    }

    if (contentElement.value) {
      contentElement.value.scrollTop = 0
    }
  },
)

defineExpose({
  activeStepOverlayAnimating,
  activeStepOverlayVisible,
  contentElement,
  isVisible,
  open,
  close,
  titleElementId,
  tabElementBaseId,
  steps,
  stepIndex,
  goToStep,
  goFirstStep,
  goLastStep,
  goNextStep,
  goPrevStep,
  hasNextStep,
  hasPrevStep,
  wizardElement,
  progressBarContainer,
  circleHeightWidth,
})
</script>

<template>
  <transition name="sm-wizard-transition">
    <div
      v-show="isVisible"
      class="sm-wizard"
      :class="{ 'sm-visible-on-top': showOnTop }"
    >
      <div
        class="sm-wizard__underlay"
        aria-hidden="true"
        @click.stop="() => close()"
      />
      <div
        v-show="isVisible"
        ref="wizardElement"
        tabindex="-1"
        class="sm-wizard__wrapper"
        :class="{ 'sm-visible-on-top': showOnTop }"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        :aria-labelledby="titleElementId || undefined"
      >
        <div class="sm-wizard__header">
          <div class="sm-wizard__close">
            <sm-button
              v-if="showClose"
              :size="SmButtonSize.LARGE"
              :shape="SmButtonShape.SQUARE"
              :title="i18n.t('sui-core.components.sm-wizard.sm-wizard.a11y__click-to-close')"
              :aria-label="i18n.t('sui-core.components.sm-wizard.sm-wizard.a11y__click-to-close')"
              v-bind="closeButtonAttrs"
              @click="close"
            >
              <sm-icon
                name="action-cross"
                aria-hidden="true"
              />
            </sm-button>
          </div>

          <div
            :id="titleElementId || undefined"
            class="sm-wizard__title"
          >
            <!-- @slot The title of the wizard -->
            <slot name="title">
              <h5>{{ title }}</h5>
            </slot>
          </div>
        </div>

        <div class="sm-wizard__body">
          <div
            class="sm-wizard__tab-list"
          >
            <div
              class="sm-wizard__large-screen"
              role="tablist"
            >
              <button
                v-for="(step, i) in steps"
                :id="step.controlId"
                :key="i"
                class="sm-wizard__tab-control"
                :aria-selected="stepIndex === i ? 'true' : 'false'"
                :disabled="disableNav"
                :aria-controls="step.panelId"
                :class="{
                  'sm-wizard__tab-control--active': i === stepIndex,
                  'sm-wizard__tab-control--complete': i < stepIndex,
                  'sm-wizard__tab-control--disabled': disableNav,
                }"
                role="tab"
                v-bind="step.stepperButtonAttrs"
                @click="goToStep(i)"
              >
                <span
                  class="sm-wizard__tab-control__container"
                  tabindex="-1"
                >
                  <span class="sm-wizard__tab-control__index">
                    <i>{{ i + 1 }}</i>
                    <svg
                      class="sm-wizard__tab-control__svg"
                      xmlns="http://www.w3.org/2000/svg"
                      width="42"
                      height="42"
                      viewBox="0 0 70 70"
                    >
                      <polyline
                        stroke="#fff"
                        stroke-width="2"
                        points="23 34 34 43 47 27"
                        fill="transparent"
                      />
                    </svg>

                  </span>

                  <span class="sm-text--x-small sm-wizard__tab-control__label">
                    {{ step.label }}
                  </span>
                </span>
                <template v-if="i < steps.length - 1">
                  <span
                    class="sm-wizard__tab-control__connector"
                    aria-hidden="true"
                  />
                  <span
                    class="sm-wizard__tab-control__progress"
                    aria-hidden="true"
                  />
                </template>
              </button>
            </div>
            <div class="sm-wizard__small-screen">
              <svg
                class="sm-wizard__small-screen__progress-ring"
                :height="circleHeightWidth"
                :width="circleHeightWidth"
              >
                <circle
                  class="sm-wizard__small-screen__progress-ring-circle"
                  stroke="#c6ceda"
                  stroke-width="4"
                  fill="transparent"
                  r="34"
                  cx="36"
                  cy="36"
                />
                <circle
                  ref="progressBarContainer"
                  class="sm-wizard__small-screen__progress-ring-circle"
                  stroke="#006add"
                  stroke-width="4"
                  fill="transparent"
                  r="34"
                  cx="36"
                  cy="36"
                />
              </svg>
              <div
                v-for="(step, i) in steps"
                :key="i"
                :class="{
                  'sm-wizard__small-screen__label--active': i === stepIndex,
                  'sm-wizard__small-screen__label--complete': i < stepIndex,
                }"
              >
                <span
                  v-if="i<=steps.length"
                  class="sm-text--x-small sm-wizard__small-screen__label-count sm-wizard__small-screen__label-text"
                >{{ i18n.t('sui-core.components.sm-wizard.sm-wizard.current-steps-text', { currentStep: i+1, totalSteps: steps.length }) }}</span>
                <h2 class="sm-wizard__small-screen__label-heading">
                  {{ step.label }}
                </h2>
                <span
                  v-if="steps[i+1]"
                  class="sm-text--x-small sm-wizard__small-screen__label-text"
                >{{ i18n.t('sui-core.components.sm-wizard.sm-wizard.next-step-text', { nextStep: steps[i+1].label }) }}</span>
              </div>
            </div>
          </div>

          <div
            ref="contentElement"
            class="sm-wizard__content"
            :class="{
              'sm-wizard__content--animating': activeStepOverlayAnimating
            }"
          >
            <!-- @slot Place sm-wizard-step components here -->
            <slot />
          </div>

          <div
            class="sm-wizard__footer"
            :class="{ 'sm-wizard__footer--overlay-visible': activeStepOverlayVisible }"
          >
            <sm-button
              v-if="hasPrevStep || !hideBack"
              class="sm-wizard__footer-action"
              :disabled="!hasPrevStep || disablePrev"
              prefix-icon="arrow-go-back"
              :aria-label="backButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.back-button-text')"
              :type="SmButtonType.TEXT"
              v-bind="backButtonAttrs"
              @click="goPrevStep"
            >
              {{ backButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.back-button-text') }}
            </sm-button>
            <sm-button
              v-if="hasNextStep"
              class="sm-wizard__footer-action"
              :disabled="disableNext"
              :aria-disabled="disableNext"
              suffix-icon="arrow-go-forward"
              :aria-label="nextButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.next-button-text')"
              :type="SmButtonType.PRIMARY"
              v-bind="nextButtonAttrs"
              @click="goNextStep"
            >
              {{ nextButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.next-button-text') }}
            </sm-button>

            <sm-button
              v-else
              class="sm-wizard__footer-action"
              :disabled="disableConfirm"
              :suffix-icon="confirmButtonIcon ? 'arrow-go-forward' : undefined"
              :aria-label="confirmButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.confirm-button-text')"
              :type="SmButtonType.PRIMARY"
              v-bind="confirmButtonAttrs"
              @click="$emit('confirmed')"
            >
              {{ confirmButtonText || i18n.t('sui-core.components.sm-wizard.sm-wizard.confirm-button-text') }}
            </sm-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
@import "../../common/variables";

$sm-wizard--background-color: $true-white;
$sm-wizard--text-color: $grey-neu-dark;
$sm-wizard--footer--background-color: $blue-neu-light;
$sm-wizard--footer--text-color: $grey-neu-dark;
$sm-wizard--header--border-color: $blue-neu-light;
$sm-wizard--header--text-color: $grey-neu-black;
$sm-wizard--header--background-color: inherit;
$sm-wizard--tab-list--border-color: $light-blue-grey;
$sm-wizard--tab-control-index--text-color: $grey-neu-dark;
$sm-wizard--tab-control-index--background-color: $grey-neu-light;
$sm-wizard--tab-control-index--active--border-color: $app-success;
$sm-wizard--tab-connector--background-color: $sm-wizard--tab-control-index--background-color;
$sm-wizard--tab-progress--background-color: $app-success;
$sm-wizard--tab-control-label--text-color: $grey-neu-mid;
$sm-wizard--tab-footer--border-color: $light-blue-grey;
$sm-wizard--tab-header-ring--background-color: $true-white;
$sm-wizard--underlay--background-color: rgba(53, 63, 78, 0.6);
$sm-wizard--button--focus: $grey-neu-dark;
$tab-list-width: 248px;
$tab-control-gap: 52px;
$tab-footer-height: 88px;
$tab-header-height: 56px;

.sm-wizard {
  width: 100%;
  height: 100%;
  overflow: hidden;

  @media #{$extra-large-desktop} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: $sm-wizard-z-index;
    overflow: hidden;
  }

  &__underlay {
    display: none;

    @media #{$extra-large-desktop} {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: $sm-wizard--underlay--background-color;
    }
  }

  &__close {
    .sm-button {
      height: 30px;
      width: 30px;

      .sm-button__content {
        height: 100%;
        width: 100%;
      }
    }
  }

  &__wrapper {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: $sm-wizard-wrapper-z-index;
    background: $sm-wizard--background-color;
    color: $sm-wizard--text-color;
    overflow-x: scroll;
    box-shadow: none; // Override global focus styling

    @media #{$large-desktop} {
      overflow: hidden;
    }

    @media #{$extra-large-desktop} {
      max-height: 968px;
      max-width: 1367px;
      position: absolute;
      border-radius: 8px;
      box-shadow: 0 3px 17px -8px rgba(24, 58, 108, 0.43), 0 22px 7px -21px rgba(24, 58, 108, 0.14), 0 15px 38px -11px rgba(24, 58, 108, 0.15);
      border: 1px solid $sm-wizard--tab-list--border-color;
    }
  }

  &__header {
    position: fixed;
    width: 100%;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid $sm-wizard--tab-list--border-color;
    color: $sm-wizard--header--text-color;
    background: $sm-wizard--header--background-color;
    padding: 15px 14px;
    align-self: flex-start;
    height: $tab-header-height;
    z-index: $sm-wizard-z-index;
    top: -1px;

    @media #{$large-desktop} {
      margin-bottom: $tab-header-height;
      box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14),
        0 3px 4px -2px rgba(24, 58, 108, 0.1),
        0 3px 9px -2px rgba(24, 58, 108, 0.1);
      border-bottom: 1px solid $sm-wizard--header--border-color;
      padding: 13px 13px 13px 23px;
    }

    @media #{$extra-large-desktop} {
      position: absolute;
    }
  }

  &__body {
    display: block;
    width: 100%;
    height: 100%;
    padding-top: $tab-header-height;
    background: $sm-wizard--footer--background-color;

    @media #{$large-desktop} {
      display: flex;
      flex: 2;
      height: 100%;
      background: unset;
    }
  }

  &__footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: $sm-wizard--footer--background-color;
    color: $sm-wizard--footer--text-color;
    padding: 20px;
    padding-left: 24px;
    height: $tab-footer-height;
    z-index: $sm-wizard-z-index;
    box-shadow: 0 -1px 1px -1px rgba(24, 58, 108, 0.14),
      0 -3px 4px -2px rgba(24, 58, 108, 0.1),
      0 -3px 9px -2px rgba(24, 58, 108, 0.1);
    left: 0;
    border-top: solid 1px $sm-wizard--tab-footer--border-color;

    @media #{$large-desktop} {
      width: calc(100% - 248px);
      left: 248px;
    }

    @media #{$small-desktop} {
      padding: 20px 56px;
    }

    @media #{$extra-large-desktop} {
      position: absolute;
    }

    &-action {
      visibility: visible;
      opacity: 1;
      transition: visibility 0s linear 0s, opacity 0.21s ease-out;
    }

    &--overlay-visible {
      box-shadow: none;

      .sm-wizard__footer-action {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s linear 0.3s, opacity 0.09s ease-out;
      }
    }
  }

  &__small-screen {
    background: $sm-wizard--tab-header-ring--background-color;
    padding: $sm-16 $sm-24 $sm-20;
    box-shadow: 0 1px 1px -1px rgba(24, 58, 108, 0.14),
      0 3px 4px -2px rgba(24, 58, 108, 0.1),
      0 3px 9px -2px rgba(24, 58, 108, 0.1);
    border-bottom: 1px solid $sm-wizard--header--border-color;
    display: flex;
    position: relative;

    .sm-wizard__small-screen__progress-ring {
      flex-shrink: 0;
    }

    @media #{$large-desktop} {
      display: none;
    }

    @media #{$small-desktop} {
      padding: $sm-16 $sm-64 $sm-20;
    }

    &__label--active {
      align-items: stretch;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: $sm-16;
      min-width: 0;
      position: relative;

      h2,
      span {
        display: block;
      }
    }

    &__label-text {
      display: none;
      text-transform: uppercase;
    }

    &__label-heading {
      display: none;
      margin-bottom: 0;
      color: $sm-wizard--header--text-color;
      line-height: 38px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__label-heading + &__label-text {
      margin-top: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__label-count {
      position: absolute;
      left: -70px;
      top: 50%;
      transform: translate(0, -50%);
    }

    &__progress-ring-circle {
      transition: 0.35s stroke-dashoffset;

      // axis compensation
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  }

  &__large-screen {
    display: none;

    @media #{$large-desktop} {
      display: block;
    }
  }

  &__title {
    padding: 0 10px;
  }

  &__title h5 {
    margin: 0;
  }

  &__tab-list {
    min-width: 100%;
    max-width: 100%;
    height: 112px;

    @media #{$large-desktop} {
      min-width: $tab-list-width;
      max-width: $tab-list-width;
      border-right: 1px solid $sm-wizard--tab-list--border-color;
      padding: 52px 36px;
      height: 100%;
      padding-right: 15px;
    }
  }

  &__tab-control {
    background: transparent;
    border: none;
    width: 100%;
    display: flex;
    cursor: pointer;
    position: relative;
    padding: 0;
    margin: 0;

    + .sm-wizard__tab-control {
      margin-top: 52px;
    }

    &:focus {
      box-shadow: none;
      outline: none;

      > .sm-wizard__tab-control__container {
        box-shadow: 0 0 0 2px $sm-wizard--button--focus;
      }
    }

    &__index {
      display: inline-block;
      min-width: $sm-32;
      height: $sm-32;
      color: $sm-wizard--tab-control-index--text-color;
      background: $sm-wizard--tab-control-index--background-color;
      border-radius: 50%;
      position: relative;

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-style: normal;
        font-size: 17px;
        opacity: 1;
      }

      svg {
        opacity: 0;
        position: absolute;
        top: -4px;
        left: -5px;
      }

      &::before { // The outer border
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        border-radius: 50%;
        border: 2px solid $sm-wizard--tab-control-index--active--border-color;
        opacity: 0;
        transition: all 0.5s ease;
        background: white;
        z-index: -1;
        will-change: opacity;
      }
    }

    &__container {
      display: flex;
      max-height: 36px;

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }

    /* Bump specificity so it doesn't get overridden by global text styles */
    .sm-wizard__tab-control__label {
      text-align: left;
      text-transform: uppercase;
      align-self: center;
      padding-left: 10px;
      font-weight: 600;
      color: $sm-wizard--tab-control-label--text-color;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-word;
    }

    &__connector,
    &__progress {
      content: '';
      position: absolute;
      top: 100%;
      left: 16px;
      width: 2px;
      height: $tab-control-gap;
      z-index: -2;
    }

    &__connector {
      background: $sm-wizard--tab-connector--background-color;
    }

    &__progress {
      transition: height 0.5s ease;
      height: 0;
    }
  }

  &__content {
    width: 100%;
    padding: $sm-24;
    padding-bottom: $tab-footer-height + 10;
    background: $sm-wizard--footer--background-color;

    @media #{$large-desktop} {
      padding: $sm-56 $sm-64 88px $sm-64;
      height: calc(100% - #{$tab-footer-height});
      overflow: auto;
    }

    @media #{$small-desktop} {
      padding: $sm-56 $sm-64 98px $sm-64;
    }

    &--animating {
      /** Hide overflow while sliding animation is on-going */
      overflow: hidden;
      position: relative;
    }
  }

  /**
   * Tab Control Complete / Active / Disabled States
   */
  &__tab-control--active,
  &__tab-control--complete {
    .sm-wizard__tab-control__index::before { // The outer border
      opacity: 1;
    }

  }

  &__tab-control--complete {
    .sm-wizard__tab-control__index::before { // The outer border
      opacity: 1;
      background: $sm-wizard--tab-control-index--active--border-color;
      color: white;
    }

    .sm-wizard__tab-control__index {
      background: $sm-wizard--tab-control-index--active--border-color;
      color: white;
    }

    .sm-wizard__tab-control__label {
      color: $sm-wizard--tab-control-index--active--border-color;
    }

    svg {
      opacity: 1;
    }

    i {
      opacity: 0;
    }
  }

  &__tab-control--active {
    .sm-wizard__tab-control__label { // The outer border
      color:  $grey-neu-black;
    }
  }

  &__tab-control--disabled {
    pointer-events: none;
  }

  &__tab-control--active &__tab-control__progress {
    height: 70%;
    background: linear-gradient(180deg, $sm-wizard--tab-progress--background-color, transparent);
  }

  &__tab-control--complete &__tab-control__progress {
    height: 52px;
    background: $sm-wizard--tab-progress--background-color
  }
}
</style>
