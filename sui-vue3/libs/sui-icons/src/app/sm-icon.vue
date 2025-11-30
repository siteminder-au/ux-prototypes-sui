<script setup lang="ts">
import { computed } from 'vue'
import * as icons from './icons-out'

interface IconDefinition {
  width: number
  height: number
  viewBox: string
  path: string
}

const props = withDefaults(defineProps<{
  /**
   * Optional alternative text for the icon image
   */
  alt?: string
  /**
   * Height of the icon, including a unit of measurement. E.g. `16px`
   */
  height?: string
  /**
   * The name of the icon
   */
  name: string
  /**
   * Width of the icon, including a unit of measurement. E.g. `16px`
   */
  width?: string
}>(), {
  alt: '',
  height: '1em',
  width: '1em',
})

defineEmits<{
  click: []
}>()

defineOptions({
  /**
   * We indicate this component is fully vue3 compatible
   * and there is no more incompatible vue2 code
   */
  compatConfig: {
    MODE: 3,
    // we suppress ATTR_FALSE_VALUE as we want to keep
    // `aria-hidden` attribute attached even if the value of it is false
    // in vue2, aria-hidden was removed if the value was false.
    ATTR_FALSE_VALUE: 'suppress-warning',
  },
})

const kebabToCamelCase = (str: string): string => str.replace(/-([a-z])/g, (_dash: string, firstLetter: string) => firstLetter.toUpperCase())

const icon = computed<IconDefinition | null>(() => {
  const transformedName = kebabToCamelCase(props.name)
  const iconMap = icons as Record<string, IconDefinition | undefined>

  if (iconMap[transformedName]) {
    return iconMap[transformedName] ?? null
  }

  console.warn(`Unknown icon name=${props.name}`)

  return null
})

const getPath = computed(() => icon.value?.path)
const getWidth = computed(() => props.width || `${icon.value?.width ?? 24}px`)
const getHeight = computed(() => props.height || `${icon.value?.height ?? 24}px`)
const viewBox = computed(() => icon.value?.viewBox)
const style = computed(() => ({
  width: icon.value ? getWidth.value : undefined,
  height: icon.value ? getHeight.value : undefined,
}))
</script>

<template>
  <span :class="`sm-icon sm-icon--${name}`">
    <svg
      version="1.1"
      :viewBox="viewBox"
      :style="style"
      focusable="false"
      :aria-hidden="!alt"
      role="img"
      :aria-label="alt"
      @click="$emit('click')"
      v-html="getPath"
    ></svg>

    <span
      v-if="$slots.badge"
      class="sm-icon__badge-slot"
    >
      <!-- @slot Add default badge style to icon -->
      <slot
        v-if="$slots.badge"
        name="badge"
      />
    </span>
  </span>
</template>

<style lang="scss">
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

  &__badge-slot {
    .sm-badge {
      position: absolute;
    }

    .sm-badge--size_medium {
      right: -8px;
      top: -10px;
    }

    .sm-badge--size_small {
      right: -5px;
      top: -4px;
    }
  }
}
</style>
