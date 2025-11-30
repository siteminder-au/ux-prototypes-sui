<script setup lang="ts">
import { computed, ref, inject, watch, onMounted } from 'vue'
import { useUniqueId } from '../use/unique-id'
import { WizardProviderKey } from './symbols'

const props = withDefaults(defineProps<{
  /**
   * Whether to add the push/slide animation when switching between the main and overlay contents
   * IMPORTANT: Not implemented yet in Vue3
   */
  animateOverlay?: boolean
  /**
   * Unique identifier of the step. By default, the label is used to identify the steps, but
   * if there are complex cases where labels can't be uniquely determined, use id
   */
  id?: string
  /**
   * Whether to load wizard step conditionally
   */
  isConditionalLoading?: boolean
  /**
   * The label and title of the step in the wizard nav panel and content
   */
  label?: string
  /**
   * Order of the step in the wizard. By default, the order is determined by the order of the mount event of the steps.
   * If there are complex cases where the steps are added dynamically, use order
   */
  order?: number
  /**
   * Whether to show the overlay content added via overlay slot
   */
  showOverlay?: boolean
  /**
   * Arbitrary attributes which will be attached to the stepper button element when on large screens. Use this to aid testing
   */
  stepperButtonAttrs?: Record<string, unknown> & { id: string | number }
  /**
   * The subtitle of the wizard step shown at the very top of the step content.
   */
  subtitle?: string
}>(), {
  animateOverlay: true,
  id: undefined,
  isConditionalLoading: true,
  label: '',
  order: undefined,
  showOverlay: false,
  stepperButtonAttrs: undefined,
  subtitle: '',
})

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
  },
})

// Data provided by sm-wizard
const wizardProvider = inject(WizardProviderKey)

const stepId = computed(() => props.id ?? props.label)
const active = computed(() => wizardProvider?.activeStepId.value === stepId.value) // use stepId rather than index since steps can be added/removed dynamically
const isOverlayAnimating = ref<boolean>(false)

const { id: baseElementId } = useUniqueId('sm-wizard-step_')
const panelId = computed(() => `${baseElementId.value}__tab-panel`)
const controlId = computed(() => {
  if (props.stepperButtonAttrs?.id) {
    return `${props.stepperButtonAttrs.id}`
  }

  return `${baseElementId.value}__tab-control`
})

// TODO: Implement animations back after GA
// https://siteminder-jira.atlassian.net/browse/SUI-1593
const onBeforeLeave = (): void => {
  isOverlayAnimating.value = true
}

// TODO: Implement animations back after GA
// https://siteminder-jira.atlassian.net/browse/SUI-1593
const onAfterLeave = (): void => {
  isOverlayAnimating.value = false
}

onMounted(() => {
  if (stepId.value) {
    wizardProvider?.addStep({
      controlId: controlId.value,
      label: props.label,
      order: props.order ?? 0,
      panelId: panelId.value,
      stepId: stepId.value,
      stepperButtonAttrs: props.stepperButtonAttrs,
    })
  }
})

watch(
  () => props.showOverlay,
  () => {
    if (stepId.value) {
      wizardProvider?.toggleOverlay(stepId.value, props.showOverlay)
    }
  },
)

defineExpose({
  active,
  isOverlayAnimating,
  panelId,
  controlId,
  onBeforeLeave,
  onAfterLeave,
})
</script>

<template>
  <div>
    <div v-if="isConditionalLoading">
      <div
        v-if="active"
        :id="panelId"
        class="sm-wizard-step"
        role="tabpanel"
        :z-index="active ? 0 : -1"
        :aria-labelledby="controlId"
        :class="{ 'sm-wizard-step--animating': $slots.overlay && isOverlayAnimating }"
      >
        <!--
          <transition
          name="sm-wizard-push-transition"
          :css="animateOverlay"
          @before-leave="onBeforeLeave"
          @after-leave="onAfterLeave"
          >
        -->
        <div>
          <div
            v-if="!showOverlay"
            key="default"
            class="transition-step-1"
          >
            <p
              v-if="subtitle"
              class="sm-text--small sm-wizard-step--step-number"
            >
              {{ subtitle }}
            </p>
            <h2
              v-if="label"
              class="sm-wizard-step--title"
            >
              {{ label }}
            </h2>
            <slot />
          </div>
          <div
            v-if="showOverlay"
            key="overlay"
            class="transition-step-2"
          >
            <!-- @slot Overlay content -->
            <slot name="overlay" />
          </div>
        </div>
        <!-- </transition> -->
      </div>
    </div>
    <div v-else>
      <div
        v-show="active"
        :id="panelId"
        class="sm-wizard-step"
        role="tabpanel"
        :z-index="active ? 0 : -1"
        :aria-labelledby="controlId"
        :class="{ 'sm-wizard-step--animating': $slots.overlay && isOverlayAnimating }"
      >
        <!--
          <transition
          name="sm-wizard-push-transition"
          :css="animateOverlay"
          @before-leave="onBeforeLeave"
          @after-leave="onAfterLeave"
          >
        -->
        <div>
          <div
            v-if="!showOverlay"
            key="default"
            class="transition-step-1"
          >
            <p
              v-if="subtitle"
              class="sm-text--small sm-wizard-step--step-number"
            >
              {{ subtitle }}
            </p>
            <h2
              v-if="label"
              class="sm-wizard-step--title"
            >
              {{ label }}
            </h2>
            <slot />
          </div>
          <div
            v-if="showOverlay"
            key="overlay"
            class="transition-step-2"
          >
            <slot name="overlay" />
          </div>
        </div>
        <!-- </transition> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

$sm-wizard-step--title--text-color: $grey-neu-black;
$sm-wizard-step--step-number--text-color: $grey-neu-dark;

.sm-wizard-step {
  &--animating {
    position: relative;
  }

  &--title {
    color: $sm-wizard-step--title--text-color;
    word-break: break-word;
  }

  &--step-number {
    color: $sm-wizard-step--step-number--text-color;
    text-transform: uppercase;
  }
}
</style>
