<script lang="ts">
export default {
  name: 'layout-aside',
  props: {
    isStickySidebar: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div>
    <sm-app-header
      logo="https://assets.siteminder.com/product/siteminder/sm-logo-app-colour.svg"
      logo-link="https://www.siteminder.com"
      partner-name="SiteMinder"
    >
      <template #property-menu>
        <sm-property-menu
          property-name="Extra Large Desktop"
          class="sample-header__property-menu--extra-large-desktop"
        />
        <sm-property-menu
          property-name="Large Desktop"
          class="sample-header__property-menu--large-desktop"
        />
        <sm-property-menu
          property-name="Small Desktop"
          class="sample-header__property-menu--small-desktop"
        />
        <sm-property-menu
          property-name="Tablet"
          class="sample-header__property-menu--tablet"
        />
        <sm-property-menu
          property-name="Mobile"
          class="sample-header__property-menu--mobile"
        />
      </template>

      <template #user-menu>
        <sm-user-menu />
      </template>

      <template #nav>
        <sm-horizontal-nav>
          <sm-horizontal-nav-item
            to="/item-1"
            label="Item 1"
          />
        </sm-horizontal-nav>
      </template>
    </sm-app-header>

    <article class="flex">
      <div>
        <sm-aside :sticky="isStickySidebar" />
      </div>

      <main class="flex-grow min-w-0">
        <sm-container class="h-full">
          <slot />
        </sm-container>
      </main>
    </article>
  </div>
</template>

<style lang="scss">
.sample-header {
  &__property-menu {
    &--extra-large-desktop {
      display: none;

      @media (min-width: 1367px) {
        display: inline-block;
      }
    }

    &--large-desktop {
      display: none;

      @media (min-width: 1025px) and (max-width: 1366px) {
        display: inline-block;
      }
    }

    &--small-desktop {
      display: none;

      @media (min-width: 769px) and (max-width: 1024px) {
        display: inline-block;
      }
    }

    &--tablet {
      display: none;

      @media (min-width: 641px) and (max-width: 768px) {
        display: inline-block;
      }
    }

    &--mobile {
      display: none;

      @media (max-width: 640px) {
        display: inline-block;
      }
    }
  }
}
</style>
