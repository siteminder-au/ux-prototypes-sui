<script setup lang="ts">
import { filter, remove } from 'lodash-es'
import { Ref, ref } from 'vue'
import SmButton from '../sm-button/sm-button.vue'
import { SmButtonType } from '../sm-button/sm-button.types'
import { useI18n } from '../../libs/vue-i18n'

const emit = defineEmits<{
  /** Emitted when add footer action is clicked */
  addCard: [cards: { id: number }[]]
  /** Emitted when a card's delete button is clicked */
  deleteCard: [cards: { id: number }[]]
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

const expanded = ref(false)
const expandableTabs: Ref<{ id: number }[]> = ref([])

/**
 * Add a new expandable card
 */
let count = 0
const addCard = (): void => {
  expanded.value = true
  expandableTabs.value.push({
    id: count += 1,
  })

  // Switching to kebab-case here would break existing @addCard event hooks
  emit('addCard', expandableTabs.value)
}

/**
 * Delete the card
 */
const deleteCard = (id: number): void => {
  const deletedItem = filter(expandableTabs.value, (currentObject) => {
    return currentObject.id === id
  })

  expandableTabs.value = remove(expandableTabs.value, (currentObject) => {
    return currentObject.id !== id
  })

  // Switching to kebab-case here would break existing @deleteCard event hooks
  emit('deleteCard', deletedItem)
}

defineExpose({
  expanded,
  expandableTabs,
  addCard,
  deleteCard,
})
</script>

<template>
  <div class="sm-expandable-card">
    <div
      v-if="$slots.header"
      class="sm-expandable-card__header"
    >
      <!-- @slot Appears on top of card to display static header -->
      <slot name="header" />
    </div>
    <div
      v-if="expanded && $slots.body"
      class="sm-expandable"
    >
      <div
        v-for="field in expandableTabs"
        :id="`${field.id}`"
        :key="field.id"
        class="sm-expandable-card__body"
      >
        <sm-button
          class="sm-expandable-card__delete-button"
          :type="SmButtonType.TEXT_WARNING"
          @click="deleteCard(field.id)"
        >
          {{ i18n.t('sui-core.components.sm-expandable-card.sm-expandable-card.a11y__delete-button') }}
        </sm-button>
        <!-- @slot Expandable card body content here. -->
        <slot name="body" />
      </div>
    </div>

    <div
      v-if="$slots.footer"
      class="sm-expandable-card__footer"
      @click="addCard"
    >
      <!-- @slot Footer button to add expandable card -->
      <slot name="footer" />
    </div>
    <!-- @slot The content of the card -->
    <slot />
  </div>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-expandable-card--border-color: $light-blue-grey;

.sm-expandable-card {
  border: 1px solid $sm-expandable-card--border-color;
  border-radius: 8px;
  background-color: white;

  .sm-expandable-card__header {
    padding: 23px;
    border-bottom: 1px solid $sm-expandable-card--border-color;
  }

  .sm-expandable-card__footer {
    padding: 11px;
  }

  .sm-expandable-card__body {
    position: relative;
    border-bottom: 1px solid $sm-expandable-card--border-color;
  }

  .sm-expandable-card__delete-button {
    position: absolute;
    right: 21px;
    top: 10px;
  }
}
</style>
