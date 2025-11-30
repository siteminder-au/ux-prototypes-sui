<script setup lang="ts">
import { ref } from 'vue'
import image1 from '@/assets/images/image1.png'
import { useTranslate } from '@/composables/use-translate'

const { t } = useTranslate('views.sites-and-rates.promotions')

// #region sm-color-picker
const defaultColor = ref('#488ED9')
const displayPicker = ref<boolean | null>(null)

const defaultColorOne = ref('#FF1B1B')
const displayPickerOne = ref<boolean | null>(null)
// #endregion

// #region sm-list
const dayOne = ref([
  { id: '1', label: t('list.dayOne.activityOne') },
  { id: '2', label: t('list.dayOne.activityTwo') },
  { id: '3', label: t('list.dayOne.activityThree') },
])

const dayTwo = ref([
  { id: '4', label: t('list.dayTwo.activityOne') },
  { id: '5', label: t('list.dayTwo.activityTwo') },
  { id: '6', label: t('list.dayTwo.activityThree') },
])
// #endregion
</script>

<template>
  <sm-container :full-width="true">
    <sm-section>
      <sm-page-title :title="t('page-title')" />

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
            <sm-button type="primary">
              {{ t('promo-one.action') }}
            </sm-button>
          </sm-card-footer>
        </sm-card>
      </div>
    </sm-section>

    <sm-section>
      <h2>{{ t('list.title') }}</h2>
      <p>{{ t('list.description') }}</p>
      <div class="cm-flex cm-flex-row--gap-12 cm-flex-wrap cm-place-items-start">
        <div class="cm-flex-1 cm-min-w-248">
          <h3 class="sm-section-heading--large">{{ t('list.dayOne.title') }}</h3>
          <sm-list
            data-sm-test-id="day-one-activities"
            :draggable="true"
            :list="dayOne"
            group="colours"
          >
            <template #list="{ item }">
              <sm-list-item
                :key="item.id"
                :label="item.label"
              />
            </template>
          </sm-list>
        </div>

        <div class="cm-flex-1 cm-min-w-248">
          <h3 class="sm-section-heading--large">{{ t('list.dayTwo.title') }}</h3>
          <sm-list
            data-sm-test-id="day-two-activities"
            :draggable="true"
            :list="dayTwo"
            group="colours"
          >
            <template #list="{ item }">
              <sm-list-item
                :key="item.id"
                :label="item.label"
              />
            </template>
          </sm-list>
        </div>
      </div>

      <sm-card
        :editing="true"
        class="cm-w-1/2"
      >
        <sm-card-content>
          <h4>{{ t('color-picker-theme-title') }}</h4>
          <p>{{ t('color-picker-theme-description') }}</p>
          <div class="cm-flex cm-flex-wrap cm-grid-responsive--gap-12">
            <div>
              <sm-color-picker
                v-model="defaultColor"
                v-model:hex-color="defaultColor"
                v-model:visible-color-picker="displayPicker"
                data-sm-test-id="color-picker-one"
              >
                <template #input>
                  <span>
                    <sm-input
                      v-model="defaultColor"
                      name="color-one"
                      label="Color-picker one"
                      :error-disabled="true"
                      :label-hidden="true"
                      @focus="displayPicker = true"
                    >
                      <template #suffix>
                        <span
                          class="cm-color-picker-input-suffix"
                          :style="{ backgroundColor: defaultColor, width: '40px', height: '40px' }"
                        />
                      </template>
                    </sm-input>
                  </span>
                </template>
              </sm-color-picker>
            </div>
            <div>
              <sm-color-picker
                v-model="defaultColorOne"
                v-model:hex-color="defaultColorOne"
                v-model:visible-color-picker="displayPickerOne"
              >
                <template #input>
                  <span>
                    <sm-input
                      v-model="defaultColorOne"
                      name="color-two"
                      label="Color-picker two"
                      :error-disabled="true"
                      :label-hidden="true"
                      @focus="displayPickerOne = true"
                    >
                      <template #suffix>
                        <span
                          class="cm-color-picker-input-suffix"
                          :style="{ backgroundColor: defaultColorOne, width: '40px', height: '40px' }"
                        />
                      </template>
                    </sm-input>
                  </span>
                </template>
              </sm-color-picker>
            </div>
          </div>
        </sm-card-content>
      </sm-card>
    </sm-section>
  </sm-container>
</template>
