<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{
  /**
   * A URL to navigate to. If provided this will override the `to` prop. Use this for external URLs outside of your application.
   */
  href?: string
  /**
   * A Vue-Router object or string specifying the URL to navigate to
   */
  to?: RouteLocationRaw
  /**
   * The name of the separator icon, set to `undefined` when not showing separator
   */
  separatorIcon?: string
}>(), {
  href: '',
  to: undefined,
  separatorIcon: undefined,
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
  <li>
    <a
      v-if="href"
      class="sm-breadcrumbs-item sm-breadcrumbs-item__link sm-text--small"
      :href="href"
    ><span
      class="sm-breadcrumbs-item__content"
      tabindex="-1"
    ><slot /></span></a>
    <router-link
      v-else-if="to"
      class="sm-breadcrumbs-item sm-breadcrumbs-item__link sm-text--small"
      :to="to"
    >
      <span
        class="sm-breadcrumbs-item__content"
        tabindex="-1"
      >
        <slot />
      </span>
    </router-link>
    <span
      v-else
      class="sm-breadcrumbs-item sm-breadcrumbs-item__text sm-text--small"
      aria-current="page"
    ><slot /></span>
    <sm-icon
      v-if="separatorIcon"
      :name="separatorIcon"
      class="sm-breadcrumbs-item__separator"
      aria-hidden="true"
    />
  </li>
</template>

<style lang="scss">
@import "../../common/variables";
@import "../../common/mixins";

$sm-breadcrumbs-item-color: $grey-neu-black;
$sm-breadcrumbs-item-color-hover: $primary-blue;

.sm-breadcrumbs-item {
  &__link {
    text-decoration: underline;
    color: $sm-breadcrumbs-item-color;
    position: relative;
  }

  &__content:focus,
  &__link:focus {
    color: $sm-breadcrumbs-item-color;
    outline: none;
    box-shadow: none;
  }

  &__link:focus::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    @include shadow-outline;
  }

  &__link:hover {
    color: $sm-breadcrumbs-item-color-hover;
  }

  &__text.sm-breadcrumbs-item {
    font-weight: 600;
  }

  &__separator.sm-icon {
    margin: 0 $sm-8 0 $sm-4;
    font-size: 14px;
  }
}
</style>
