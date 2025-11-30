<template>
  <ul class="sm-vertical-nav">
    <slot />
  </ul>
</template>

<style lang="scss">
.sm-vertical-nav {
  display: flex;
  flex-flow: row wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Use the sm-app-header-tablet tokens to theme the sm-vertical-nav under it */
.sm-nav .sm-vertical-nav {
  /* Item */
  --sm-c-vertical-nav-item-padding: var(--sm-c-app-header-tablet-vertical-nav-item-padding);

  /*
    Item - active
    Intentionally mapping exact-active indicator to the tablet header
    active color since that's the setup in sui-themes
  */
  --sm-c-vertical-nav-item-indicator-color-exact-active: var(--sm-c-app-header-tablet-vertical-nav-item-active-indicator-color);
  --sm-c-vertical-nav-item-color-background-active: var(--sm-c-app-header-tablet-vertical-nav-item-color-background-active);
  --sm-c-vertical-nav-item-color-text-active: var(--sm-c-app-header-tablet-vertical-nav-item-color-text-active);

  /* Item - hovered */
  --sm-c-vertical-nav-item-color-background-hover: var(--sm-c-app-header-tablet-vertical-nav-item-color-background-hover);
  --sm-c-vertical-nav-item-color-text-hover: var(--sm-c-app-header-tablet-vertical-nav-item-color-text-hover);

  /* Item toggle button */
  --sm-c-vertical-nav-item-toggle-button-right: var(--sm-c-app-header-tablet-vertical-nav-item-toggle-button-right);
  --sm-c-vertical-nav-item-toggle-button-top: var(--sm-c-app-header-tablet-vertical-nav-item-toggle-button-top);
  --sm-c-vertical-nav-item-toggle-button-color-background-active: var(--sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-background-active);
  --sm-c-vertical-nav-item-toggle-button-color-text: var(--sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-text);
  --sm-c-vertical-nav-item-toggle-button-color-background-hover: var(--sm-c-app-header-tablet-vertical-nav-item-toggle-button-color-background-hover);
}

/* Use the sm-app-header tokens to theme the sm-vertical-nav under it */
.sm-app-header .sm-horizontal-nav .sm-vertical-nav,
.sm-app-header .sm-property-menu .sm-vertical-nav,
.sm-app-header .sm-user-menu .sm-vertical-nav {
  /* Container */
  --sm-c-vertical-nav-color-border: var(--sm-c-app-header-vertical-nav-color-border);

  /* Item */
  --sm-c-vertical-nav-item-color-text: var(--sm-c-app-header-vertical-nav-item-color-text);
  --sm-c-vertical-nav-item-color-background: var(--sm-c-app-header-vertical-nav-item-color-background);
  --sm-c-vertical-nav-item-color-border: var(--sm-c-app-header-vertical-nav-item-color-border);
  --sm-c-vertical-nav-item-font-weight: var(--sm-c-app-header-vertical-nav-item-font-weight);
  --sm-c-vertical-nav-item-font-size: var(--sm-c-app-header-vertical-nav-item-font-size);

  /* Item - hovered */
  --sm-c-vertical-nav-item-color-text-hover: var(--sm-c-app-header-vertical-nav-item-color-text-hover);
  --sm-c-vertical-nav-item-color-background-hover: var(--sm-c-app-header-vertical-nav-item-color-background-hover);

  /* Item - focused */
  --sm-c-vertical-nav-item-color-text-focus: var(--sm-c-app-header-vertical-nav-item-color-text-focus);
  --sm-c-vertical-nav-item-color-background-focus: var(--sm-c-app-header-vertical-nav-item-color-background-focus);

  /* Item - disabled */
  --sm-c-vertical-nav-item-color-text-disabled: var(--sm-c-app-header-vertical-nav-item-color-text-disabled);
  --sm-c-vertical-nav-item-color-background-disabled: var(--sm-c-app-header-vertical-nav-item-color-background-disabled);

  /* Item - active */
  --sm-c-vertical-nav-item-color-text-active: var(--sm-c-app-header-vertical-nav-item-color-text-active);
  --sm-c-vertical-nav-item-color-background-active: var(--sm-c-app-header-vertical-nav-item-color-background-active);
  --sm-c-vertical-nav-item-font-weight-active: var(--sm-c-app-header-vertical-nav-item-font-weight-active);
  --sm-c-vertical-nav-item-indicator-color-active: var(--sm-c-app-header-vertical-nav-item-indicator-color-active);
  --sm-c-vertical-nav-item-indicator-color-exact-active: var(--sm-c-app-header-vertical-nav-item-indicator-color-exact-active);
}
</style>
