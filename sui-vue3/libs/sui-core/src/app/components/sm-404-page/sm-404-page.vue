<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Whether the main container will span the full page
   */
  fullPage?: boolean
  /**
   * Whether to automatically layout, space and scale the component on different breakpoints.
   * Turn the feature off if responsive support needs to be customized.
   */
  responsive?: boolean
  /**
   * Custom CSS class that will be added to the image container
   */
  imageClass?: string
  /**
   * Custom CSS class that will be added to the content container
   */
  contentClass?: string
}>(), {
  fullPage: true,
  responsive: true,
  imageClass: '',
  contentClass: '',
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
</script>

<template>
  <div
    class="sm-404-page"
    :class="{
      'sm-404-page--full-page': fullPage,
      'sm-404-page--responsive': responsive
    }"
  >
    <div
      v-if="$slots.image"
      class="sm-404-page__image"
      :class="imageClass"
    >
      <!-- @slot The illustration for the error state. Appears on top of the group -->
      <slot name="image" />
    </div>

    <div
      class="sm-404-page__content"
      :class="contentClass"
    >
      <!-- @slot The header content -->
      <slot name="header" />

      <p
        v-if="$slots.description"
        class="sm-404-page__description"
      >
        <!-- @slot The description content to add useful or relevant information -->
        <slot name="description" />
      </p>

      <div
        v-if="$slots.actions"
        class="sm-404-page__actions"
      >
        <!-- @slot The actions to provide assistance in resolving the issue -->
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/variables";

.sm-404-page {
  margin: 0 auto;
  max-width: 408px;
  text-align: center;

  &__image {
    margin-bottom: $sm-8;

    :slotted(img) {
      display: block;
      width: 100%;
    }
  }

  &__content {
    margin: 0 auto;
    max-width: 472px;
  }

  &__actions {
    margin: 0 auto;
  }

  &__description {
    margin-bottom: $sm-24;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  &--full-page {
    max-width: 1336px;

    .sm-404-page__content {
      padding: 0 $sm-32;
    }
  }

  &--responsive {
    .sm-404-page__image {
      margin-bottom: $sm-24;

      :slotted(img) {
        height: 232px;
        object-fit: cover;
      }

      /* Tablet and up */
      @media #{$mobile} {
        margin-bottom: $sm-32;

        :slotted(img) {
          height: 328px;
        }
      }

      /* Large desktop and up */
      @media #{$large-desktop} {
        :slotted(img) {
          height: 396px;
        }
      }
    }

    .sm-404-page__actions {
      flex-direction: column-reverse;

      :slotted(.sm-button) {
        .sm-button__inner-content {
          width: 100%;
        }

        + .sm-button {
          margin-left: 0;
          margin-bottom: $sm-16;
        }
      }

      /* Mobile only */
      @media only screen and (max-width: $viewport--mobile) {
        :slotted(.sm-button) .sm-button__content {
          padding-top: 12px;
          padding-bottom: 12px;
        }
      }

      /* Tablet and up */
      @media #{$mobile} {
        flex-direction: row;
        justify-content: center;

        .sm-button + :slotted(.sm-button) {
          margin-left: $sm-16;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
