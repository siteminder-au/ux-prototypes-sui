<script setup lang="ts">
import { useTranslate } from '@/composables/use-translate'

/**
 * From SUI:
 * For example, if the current URL path is /foo/bar:
 *   - and the to prop is set to /foo the item will be considered active.
 *   - and the to prop is set to /foo/bar the item will be considered exact-active.
 *   - and the to prop is set to /bar the item will be considered in-active.
 * Based on this, we want to force the active state to be `exact-active` as
 * it has the left-blue highlight on the menu item as long as the string
 * representing the parent menu section is in the path.
 * If we don't force 'exact-active', the sidebar won't give a UX visual feedback
 * which section they are on after they navigate between different tabs
 */
const getForceActiveState = (isActive: boolean): string => (isActive ? 'exact-active' : 'in-active')

const { t } = useTranslate('components.app-sidebar-vertical-nav')
</script>

<template>
  <sm-vertical-nav class="cm-overflow-y-scroll">
    <sm-vertical-nav-section :label="t('configuration-section-label')">
      <sm-vertical-nav-item
        :force-active-state="getForceActiveState"
        :label="t('rate-plans-label')"
        :to="{ name: 'sites-and-rates/rate-plans' }"
      />
      <sm-vertical-nav-item
        :force-active-state="getForceActiveState"
        :label="t('campsites-label')"
        prefix-icon="section-home"
        :to="{ name: 'sites-and-rates/campsites' }"
      />
      <sm-vertical-nav-item
        :force-active-state="getForceActiveState"
        :label="t('promotions-label')"
        :to="{ name: 'sites-and-rates/promotions' }"
      />
      <sm-vertical-nav-item :label="t('other-section-label')">
        <sm-vertical-nav-item
          :force-active-state="getForceActiveState"
          :label="t('enquiry-form-label')"
          :to="{ name: 'sites-and-rates/enquiry-form' }"
        />
      </sm-vertical-nav-item>
    </sm-vertical-nav-section>
    <sm-vertical-nav-section :label="t('admin-section-label')">
      <sm-vertical-nav-item
        :disabled="true"
        :force-active-state="getForceActiveState"
        :suffix-badge="{ text: t('new-badge-label'), config: { type: 'success' } }"
        :label="t('property-settings-label')"
      />
      <sm-vertical-nav-item
        :force-active-state="getForceActiveState"
        :label="t('translations-label')"
        :to="{ name: 'sites-and-rates/translations' }"
      />
    </sm-vertical-nav-section>
  </sm-vertical-nav>
</template>
