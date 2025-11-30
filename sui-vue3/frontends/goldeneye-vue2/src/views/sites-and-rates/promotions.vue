<script setup lang="ts">
import image1 from '@/assets/images/image1.png'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.promotions')
</script>

<template>
  <sm-section>
    <sm-container :full-width="true">
      <sm-page-title
        :title="t('page-title')"
      />

      <div class="cm-flex cm-flex-row--gap-8 cm-flex-wrap">
        <sm-card root-class="cm-max-w-xs">
          <sm-card-graphic
            alt=""
            :src="image1"
          />

          <sm-card-actions>
            <sm-button
              :aria-label="t('edit-promotion-button')"
              shape="square"
            >
              <sm-icon
                name="action-edit"
                aria-hidden="true"
              />
            </sm-button>
          </sm-card-actions>

          <sm-card-content>
            <h4>{{ t('promo-one.title') }}</h4>
            <p>{{ t('promo-one.description') }}</p>
          </sm-card-content>

          <sm-card-footer content-class="cm-flex cm-flex-row-end">
            <sm-button
              type="primary"
            >
              {{ t('promo-one.action') }}
            </sm-button>
          </sm-card-footer>
        </sm-card>
      </div>
    </sm-container>
  </sm-section>
</template>
