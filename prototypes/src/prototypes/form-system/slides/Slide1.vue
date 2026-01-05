<template>
  <div class="slide-wrapper" :class="{ 'full-width': fullWidthForm }">
    <div class="slide-left" v-if="!fullWidthForm">
      <div class="container-header">Current state</div>
      <div class="container-content">
        <img src="/images/dynamic-form/rate-plan-1.png" alt="Rate Plan 1" />
        <img src="/images/dynamic-form/rate-plan-2.png" alt="Rate Plan 2" />
        <img src="/images/dynamic-form/rate-plan-3.png" alt="Rate Plan 3" />
        <img src="/images/dynamic-form/rate-plan-4.png" alt="Rate Plan 4" />
      </div>
    </div>

    <div class="slide-right">
      <div class="container-header">Proposed</div>

      <!-- Drawer Header -->
      <div class="sm-drawer__header">
        <div class="sm-drawer__header-section sm-drawer__header-section--title">
          <h2>Edit rate plan</h2>
          <p class="drawer-page-subtitle">Advance purchase</p>
        </div>
        <div class="sm-drawer__action-buttons">
          <div class="sm-drawer__header-section sm-drawer__header-section--actions">
            <SmButton type="tertiary" size="large" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" size="large" native-type="submit" form="rate-plan-form"
              :disabled="!isFormModified">
              Save
            </SmButton>
          </div>
        </div>
      </div>

      <div class="container-content">
        <!-- Form Content -->
        <SmForm id="rate-plan-form" @submit="handleFormSubmit" @invalid-submit="handleInvalidSubmit">
          <div class="form-content-wrapper" :class="{ 'show-backgrounds': showContainerBackgrounds, 'show-markup': showMarkup }">
            <!-- Grid Overlay -->
            <GridOverlay :show="showGridOverlay" />

            <!-- Error Summary Card -->
            <SmHelpCard v-if="hasErrors" type="warning">
              <template #header>
                Please check the following fields for errors.
              </template>
              <template #body>
                <ul class="error-list">
                  <li v-for="field in errorFieldsList" :key="field.name">
                    <a :href="`#${field.id}`" class="error-link">{{
                      field.label }}</a>
                  </li>
                </ul>
              </template>
            </SmHelpCard>

            <!-- General Information -->
            <SmFormGroup id="general-information">
              <h2 class="form-heading-1">General Information</h2>
              <SmInput id="ratePlanName" v-model="ratePlanName" label="Rate plan name" name="ratePlanName"
                placeholder="Enter rate plan name" rules="required" />

              <SmInput type="textarea" label="Rate plan description" name="ratePlanDescription"
                v-model="ratePlanDescription" placeholder="Enter description" :rows="3" />
            </SmFormGroup>

            <!-- Restrictions and Inclusions -->
            <SmFormGroup id="restrictions-inclusions">
              <h2 class="form-heading-1">Restrictions and Inclusions</h2>
              <div class="form-row">
                <div class="form-col">
                  <SmInput v-model="defaultMinStay" label="Default minimum stay" name="defaultMinStay" placeholder="" />
                </div>
                <div class="form-col">
                  <SmInput v-model="defaultMaxStay" label="Default maximum stay" name="defaultMaxStay" placeholder="" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput v-model="releasePeriod" label="Release period" name="releasePeriod" placeholder="14" />
                </div>
                <div class="form-col">
                  <SmSelect v-model="inclusions" label="Inclusions" name="inclusions" :options="inclusionsOptions"
                    placeholder="None" />
                </div>
              </div>
            </SmFormGroup>

            <!-- Pricing Details -->
            <SmFormGroup id="pricing-details">
              <h2 class="form-heading-1">Pricing Details</h2>
              <div class="form-row">
                <div class="form-col">
                  <SmInput v-model="currency" label="Currency" name="currency" placeholder="Australian Dollar"
                    disabled />
                </div>
                <div class="form-col">
                  <SmInput v-model="minimumRate" label="Minimum rate" name="minimumRate" placeholder="" disabled>
                    <template #prefix>
                      <SmInputPrefixContent>AUD
                      </SmInputPrefixContent>
                    </template>
                    <template v-slot:suffix>
                      <sm-button @click="enabled = !enabled" aria-controls="min-rate" type="tertiary" size="large"
                        :aria-label="enabled ? 'Lock field' : 'Unlock field'"
                        :title="enabled ? 'Lock field' : 'Unlock field'">
                        <sm-icon :name="enabled ? 'action-lock-open' : 'action-lock'" />
                      </sm-button>
                    </template>
                    <template #action>
                      <SmTooltip
                        title="If set, this value will override all lower rates in the inventory grid (including derived rates)."
                        trigger="hover" placement="right">
                        <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                      </SmTooltip>
                    </template>
                  </SmInput>
                </div>
              </div>
            </SmFormGroup>

            <!-- Rate Setup -->
            <SmFormGroup id="rate-setup">
              <h2 class="form-heading-1">Rate Setup</h2>
              <SmRadioGroup label="Rate setup method" v-model="rateSetup" name="rateSetup">
                <SmRadio label="Manually input daily rates" selected-value="manual" v-model="rateSetup" name="rateSetup"
                  :error-disabled="true" />
                <SmRadio label="Derive daily rates from an existing rate plan" selected-value="derive"
                  v-model="rateSetup" name="rateSetup" :error-disabled="true" />
              </SmRadioGroup>

              <div v-show="rateSetup === 'derive'" class="derived-rate-fields">
                <SmSelect id="derivedFrom" v-model="derivedFrom" label="Derived from" name="derivedFrom"
                  :options="derivedFromOptions" placeholder="Non-Refundable" :rules="rateSetup === 'derive' ? 'required' : ''" />

                <SmSelect v-model="adjustDailyRatesBy" label="Adjust daily rates by" name="adjustDailyRatesBy"
                  :options="adjustByOptions" placeholder="Percentage" :rules="rateSetup === 'derive' ? 'required' : ''" />

                <div class="form-row">
                  <div class="form-col col-span-3">
                    <SmSelect v-model="percentageAdjustmentType" label="Percentage adjustment"
                      name="percentageAdjustmentType" :options="percentageTypeOptions" placeholder="Decrease by (%)" :rules="rateSetup === 'derive' ? 'required' : ''" />
                  </div>
                  <div class="form-col col-span-1">
                    <SmInput v-model="percentageAdjustmentValue" label="Value" name="percentageValue"
                      placeholder="10" :rules="rateSetup === 'derive' ? 'required' : ''" />
                  </div>
                </div>
              </div>
            </SmFormGroup>

            <!-- Direct Booking Controls -->
            <SmFormGroup id="booking-controls">
              <h2 class="form-heading-1">Direct Booking Controls</h2>
              <h3 class="form-heading-2">Restrict bookable dates</h3>
              <SmCheckbox v-model="applicableDates" id="applicableDates" name="applicableDates"
                label="Enable included stay dates">
              </SmCheckbox>

                  <!-- Included stay date ranges container -->
                  <div v-if="applicableDates" class="date-ranges-container">
                    <div v-for="(_, index) in applicableDateRanges" :key="index" class="date-range-item">
                      <div class="form-item-header">
                        <label class="sm-field-label sm-text--small">Date range</label>
                        <div class="form-item-actions">
                          <SmButton type="text" size="small" @click="clearDateRange('applicable', index)">
                            Clear
                          </SmButton>
                          <SmButton type="text-warning" size="small" @click="deleteDateRange('applicable', index)">
                            Delete
                          </SmButton>
                        </div>
                      </div>
                      <SmDatePicker v-model="applicableDateRanges[index]" :name="`applicableDateRange${index}`"
                        :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                        :label-hidden="true" mode="date" />
                    </div>

                    <div v-if="applicableDateRanges.length < 5">
                      <SmButton type="text" size="large" @click="addDateRange('applicable')">
                        <SmIcon name="controls-add" />
                        Add included dates
                      </SmButton>
                    </div>
                    <div v-else class="date-range-limit-message">
                      Maximum of 5 date ranges reached
                    </div>
                  </div>

                  <SmCheckbox v-model="includedStayDays" id="includedStayDays" name="includedStayDays"
                    label="Enable days of the week restriction" />

                  <div v-if="includedStayDays" class="conditional-form-section">
                    <SmSelect v-model="stayDatesIncludedDays" label="Included days" name="stayDatesIncludedDays"
                      :options="daysOfWeekOptions" :multiple="true" placeholder="All days" />
                  </div>

                  <SmCheckbox v-model="excludedStayDates" id="excludedStayDates" name="excludedStayDates"
                    label="Enable excluded stay dates" />

                  <!-- Excluded stay date ranges container -->
                  <div v-if="excludedStayDates" class="date-ranges-container">
                    <div v-for="(_, index) in excludedStayDateRanges" :key="index" class="date-range-item">
                      <div class="form-item-header">
                        <label class="sm-field-label sm-text--small">Date range</label>
                        <div class="form-item-actions">
                          <SmButton type="text" size="small" @click="clearDateRange('excluded', index)">
                            Clear
                          </SmButton>
                          <SmButton type="text-warning" size="small" @click="deleteDateRange('excluded', index)">
                            Delete
                          </SmButton>
                        </div>
                      </div>
                      <SmDatePicker v-model="excludedStayDateRanges[index]" :name="`excludedStayDateRange${index}`"
                        :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                        :label-hidden="true" mode="date" />
                    </div>

                    <div v-if="excludedStayDateRanges.length < 5">
                      <SmButton type="text" size="large" @click="addDateRange('excluded')">
                        <SmIcon name="controls-add" />
                        Add excluded dates
                      </SmButton>
                    </div>
                    <div v-else class="date-range-limit-message">
                      Maximum of 5 date ranges reached
                    </div>
                  </div>

              <h3 class="form-heading-2">Restrict advertised dates</h3>
              <SmCheckbox v-model="includedAdvertisedDates" id="includedAdvertisedDates" name="includedAdvertisedDates"
                label="Enable included advertised dates">
              </SmCheckbox>

                  <!-- Included advertised date ranges container -->
                  <div v-if="includedAdvertisedDates" class="date-ranges-container">
                    <div v-for="(_, index) in includedAdvertisedDateRanges" :key="index" class="date-range-item">
                      <div class="form-item-header">
                        <label class="sm-field-label sm-text--small">Date range</label>
                        <div class="form-item-actions">
                          <SmButton type="text" size="small" @click="clearDateRange('includedAdvertised', index)">
                            Clear
                          </SmButton>
                          <SmButton type="text-warning" size="small" @click="deleteDateRange('includedAdvertised', index)">
                            Delete
                          </SmButton>
                        </div>
                      </div>
                      <SmDatePicker v-model="includedAdvertisedDateRanges[index]"
                        :name="`includedAdvertisedDateRange${index}`" :is-range="true" start-date-placeholder="DD/MM/YYYY"
                        end-date-placeholder="DD/MM/YYYY" :label-hidden="true" mode="date" />
                    </div>

                    <div v-if="includedAdvertisedDateRanges.length < 5">
                      <SmButton type="text" size="large" @click="addDateRange('includedAdvertised')">
                        <SmIcon name="controls-add" />
                        Add included advertised dates
                      </SmButton>
                    </div>
                    <div v-else class="date-range-limit-message">
                      Maximum of 5 date ranges reached
                    </div>
                  </div>

                  <SmCheckbox v-model="excludedAdvertisedDates" id="excludedAdvertisedDates" name="excludedAdvertisedDates"
                    label="Enable excluded advertised dates" />

                  <!-- Excluded advertised date ranges container -->
                  <div v-if="excludedAdvertisedDates" class="date-ranges-container">
                    <div v-for="(_, index) in excludedAdvertisedDateRanges" :key="index" class="date-range-item">
                      <div class="form-item-header">
                        <label class="sm-field-label sm-text--small">Date range</label>
                        <div class="form-item-actions">
                          <SmButton type="text" size="small" @click="clearDateRange('excludedAdvertised', index)">
                            Clear
                          </SmButton>
                          <SmButton type="text-warning" size="small" @click="deleteDateRange('excludedAdvertised', index)">
                            Delete
                          </SmButton>
                        </div>
                      </div>
                      <SmDatePicker v-model="excludedAdvertisedDateRanges[index]"
                        :name="`excludedAdvertisedDateRange${index}`" :is-range="true" start-date-placeholder="DD/MM/YYYY"
                        end-date-placeholder="DD/MM/YYYY" :label-hidden="true" mode="date" />
                    </div>

                    <div v-if="excludedAdvertisedDateRanges.length < 5">
                      <SmButton type="text" size="large" @click="addDateRange('excludedAdvertised')">
                        <SmIcon name="controls-add" />
                        Add excluded advertised dates
                      </SmButton>
                    </div>
                    <div v-else class="date-range-limit-message">
                      Maximum of 5 date ranges reached
                    </div>
                  </div>

                  <SmCheckbox v-model="maxAdvanceBookingDates" id="maxAdvanceBookingDates" name="maxAdvanceBookingDates"
                    label="Enable advance booking restriction" />

                  <div v-if="maxAdvanceBookingDates" class="conditional-form-section">
                    <div class="form-row">
                      <div class="form-col col-span-2">
                        <SmInput v-model="maxAdvanceBookingDays" name="maxAdvanceBookingDays" label="Number of days"
                          type="number" placeholder="e.g., 30, 60, 90" :rules="maxAdvanceBookingDates ? 'required' : ''" />
                      </div>
                      <div class="form-col col-span-2">
                        <SmSelect v-model="maxAdvanceBookingTimeframe" name="maxAdvanceBookingTimeframe" label="Timeframe"
                          :options="maxAdvanceBookingTimeframeOptions" />
                      </div>
                    </div>
                  </div>

              <h3 class="form-heading-2">Additional options</h3>
              <SmCheckbox v-model="dynamicDiscounts" id="dynamicDiscounts" name="dynamicDiscounts"
                label="Enable dynamic discounts" />

                  <div v-if="dynamicDiscounts" class="conditional-form-section">
                    <SmSelect v-model="discountType" name="discountType" label="Discount type"
                      placeholder="Select a discount type" :options="discountTypeOptions" />

                    <!-- Dynamic Length of Stay Fields -->
                    <div v-if="discountType === 'dynamic_los'" class="discount-type-section los-rules-section">
                      <div v-for="(rule, index) in losRules" :key="index" class="form-row">
                        <div class="form-col">
                          <SmSelect v-model="rule.nights" :name="`losNights_${index}`" label="Nights"
                            placeholder="Select nights" :options="losNightsOptions" />
                        </div>
                        <div
                          :class="index === losRules.length - 1 && losRules.length > 1 ? 'form-col col-span-1' : 'form-col'">
                          <SmInput v-model="rule.discountPercent" :name="`losDiscountPercent_${index}`" label="Discount %"
                            type="number" placeholder="0" />
                        </div>
                        <div v-if="index === losRules.length - 1 && losRules.length > 1"
                          class="form-col col-span-1 los-delete-col">
                          <SmButton type="text-warning" size="small" @click="removeLosRule(index)" style="width: 100%;">
                            Delete
                          </SmButton>
                        </div>
                      </div>
                      <div v-if="losRules.length < 15" class="los-add-button">
                        <SmButton type="text" size="large" @click="addLosRule">
                          <SmIcon name="controls-add" />
                          Add rule
                        </SmButton>
                      </div>
                      <div v-if="losRules.length >= 15" class="date-range-limit-message">
                        Maximum of 15 rules reached
                      </div>
                    </div>

                    <!-- Stay Pay Deal Fields -->
                    <div v-if="discountType === 'stay_pay'" class="discount-type-section">
                      <div class="form-row">
                        <div class="form-col">
                          <SmInput v-model="stayNights" name="stayNights" label="Stay nights" type="number"
                            placeholder="e.g., 3" />
                        </div>
                        <div class="form-col">
                          <SmInput v-model="payNights" name="payNights" label="Pay nights" type="number"
                            placeholder="e.g., 2" />
                        </div>
                      </div>

                      <SmRadioGroup name="discountFor" label="Discount for">
                        <SmRadio v-model="discountFor" name="discountFor" selected-value="all_nights" label="All nights"
                          :error-disabled="true" />
                        <SmRadio v-model="discountFor" name="discountFor" selected-value="last_night" label="Last night"
                          :error-disabled="true" />
                        <SmRadio v-model="discountFor" name="discountFor" selected-value="cheapest_night"
                          label="Cheapest night" :error-disabled="true" />
                      </SmRadioGroup>
                    </div>

                    <!-- Package Deal Fields -->
                    <div v-if="discountType === 'package'" class="discount-type-section">
                      <SmInput v-model="packageIncludedNights" name="packageIncludedNights"
                        label="Number of included nights" type="number" placeholder="0" />

                      <h4 class="form-heading-3">Charges for additional nights</h4>
                      <div class="form-row">
                          <div class="form-col">
                            <SmInput v-model="packageField1" name="packageField1" label="Included occupants rate"
                              type="number" placeholder="0">
                              <template #prefix>
                                <SmInputPrefixContent>AUD</SmInputPrefixContent>
                              </template>
                            </SmInput>
                          </div>
                          <div class="form-col">
                            <SmInput v-model="packageField2" name="packageField2" label="Extra adult rate" type="number"
                              placeholder="0">
                              <template #prefix>
                                <SmInputPrefixContent>AUD</SmInputPrefixContent>
                              </template>
                            </SmInput>
                          </div>
                        </div>

                        <div class="form-row">
                          <div class="form-col">
                            <SmInput v-model="packageField3" name="packageField3" label="Extra child rate" type="number"
                              placeholder="0">
                              <template #prefix>
                                <SmInputPrefixContent>AUD</SmInputPrefixContent>
                              </template>
                            </SmInput>
                          </div>
                          <div class="form-col">
                            <SmInput v-model="packageField4" name="packageField4" label="Extra infant rate" type="number"
                              placeholder="0">
                              <template #prefix>
                                <SmInputPrefixContent>AUD</SmInputPrefixContent>
                              </template>
                            </SmInput>
                          </div>
                        </div>

                      <!-- Seasonal Overrides -->
                      <div class="seasonal-overrides-container">
                        <SmCard v-for="(override, index) in packageSeasonalOverrides" :key="index"
                          class="seasonal-override-card">
                          <SmCardContent>
                            <div class="seasonal-override-content">
                              <div class="seasonal-override-header">
                                <h4 class="form-heading-3">Seasonal override</h4>
                                <SmButton type="button" shape="round" size="medium" @click="removeSeasonalOverride(index)"
                                  aria-label="Delete seasonal override">
                                  <SmIcon name="action-remove" style="color: var(--color-warning);" />
                                </SmButton>
                              </div>
                              <div class="date-range-item">
                                  <div class="form-item-header">
                                    <label class="sm-field-label sm-text--small">Date range</label>
                                    <div class="form-item-actions">
                                      <SmButton type="text" size="small" @click="clearSeasonalOverrideDateRange(index)">
                                        Clear
                                      </SmButton>
                                    </div>
                                  </div>
                                  <SmDatePicker v-model="override.dateRange" :name="`seasonalOverrideDateRange${index}`"
                                    :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                                    :label-hidden="true" mode="date" :mandatory="true" />
                                </div>

                                <div class="form-row">
                                  <div class="form-col">
                                    <SmInput v-model="override.includedNights" :name="`seasonalOverrideIncludedNights${index}`"
                                      label="Number of included nights" type="number" placeholder="0" :mandatory="true" />
                                  </div>
                                </div>

                                <h5 class="form-heading-4">Charges for additional nights</h5>
                                <div class="form-row">
                                    <div class="form-col">
                                      <SmInput v-model="override.field1" :name="`seasonalOverrideField1_${index}`"
                                        label="Included occupants rate" type="number" placeholder="0" :mandatory="true">
                                        <template #prefix>
                                          <SmInputPrefixContent>AUD</SmInputPrefixContent>
                                        </template>
                                      </SmInput>
                                    </div>
                                    <div class="form-col">
                                      <SmInput v-model="override.field2" :name="`seasonalOverrideField2_${index}`"
                                        label="Extra adult rate" type="number" placeholder="0" :mandatory="true">
                                        <template #prefix>
                                          <SmInputPrefixContent>AUD</SmInputPrefixContent>
                                        </template>
                                      </SmInput>
                                    </div>
                                  </div>

                                  <div class="form-row">
                                    <div class="form-col">
                                      <SmInput v-model="override.field3" :name="`seasonalOverrideField3_${index}`"
                                        label="Extra child rate" type="number" placeholder="0" :mandatory="true">
                                        <template #prefix>
                                          <SmInputPrefixContent>AUD</SmInputPrefixContent>
                                        </template>
                                      </SmInput>
                                    </div>
                                    <div class="form-col">
                                      <SmInput v-model="override.field4" :name="`seasonalOverrideField4_${index}`"
                                        label="Extra infant rate" type="number" placeholder="0" :mandatory="true">
                                        <template #prefix>
                                          <SmInputPrefixContent>AUD</SmInputPrefixContent>
                                        </template>
                                      </SmInput>
                                    </div>
                                  </div>
                            </div>
                          </SmCardContent>
                        </SmCard>

                        <div>
                          <SmButton type="text" size="large" @click="addSeasonalOverride">
                            <SmIcon name="controls-add" />
                            Add seasonal override
                          </SmButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SmCheckbox v-model="restrictRateToMobile" id="restrictRateToMobile" name="restrictRateToMobile"
                    label="Enable restrict to mobile devices">
                  </SmCheckbox>

                  <SmCheckbox v-model="highlightRatePlan" id="highlightRatePlan" name="highlightRatePlan"
                    label="Enable highlight on booking engine">
                  </SmCheckbox>

                  <!-- Highlight on booking engine expanded fields -->
                  <div v-if="highlightRatePlan" class="conditional-form-section">
                    <label class="sm-field-label">
                      Hero image
                      <SmTooltip title="The recommended size is 1500x500 px. Supported formats: GIF, JPG, PNG."
                        trigger="hover" placement="right">
                        <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                      </SmTooltip>
                    </label>
                    <div class="sm-media">
                      <div class="sm-media__drop-zone">
                        <div v-if="highlightImageUrl" class="sm-media--items">
                          <div class="sm-media-item highlight-image-preview" :style="{ backgroundImage: `url(${highlightImageUrl})` }">
                            <div class="sm-media-item__card">
                              <div class="sm-media-item__actions">
                                <SmButton type="button" shape="square" size="medium" @click="removeHighlightImage">
                                  <SmIcon name="action-cross" />
                                </SmButton>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="sm-media__empty-state highlight-image-empty">
                          <input ref="highlightImageInput" type="file" accept="image/png,image/jpg,image/jpeg,image/gif"
                            class="sm-media__input-hidden" @change="handleHighlightImageUpload" />
                          <div>
                            <SmButton type="text" size="large" @click="openMediaLibrary">
                              <SmIcon name="controls-add" />
                              Assign from media library
                            </SmButton>
                          </div>
                        </div>
                      </div>
                    </div>

                    <SmInput v-model="highlightTagline" name="highlightTagline" label="Tagline" placeholder="Enter tagline"
                      :rules="enableHighlight ? 'required' : ''">
                      <template #action>
                        <SmTooltip
                          title="A short and catchy description of your rate plan. Include whether the rate is discounted or is a limited time offer."
                          trigger="hover" placement="right">
                          <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                        </SmTooltip>
                      </template>
                    </SmInput>

                    <SmInput v-model="highlightHeadline" name="highlightHeadline" label="Headline"
                      placeholder="Enter headline" :rules="enableHighlight ? 'required' : ''">
                      <template #action>
                        <SmTooltip title="The main headline text that will be prominently displayed" trigger="hover"
                          placement="right">
                          <SmIcon name="utility-information-alt" class="tooltip-icon" width="14px" height="14px" />
                        </SmTooltip>
                      </template>
                    </SmInput>

                    <div>
                      <label class="sm-field-label">Key selling points</label>
                      <ol class="selling-points-list">
                          <li v-for="(point, index) in highlightKeySellingPoints" :key="index" class="selling-point-item"
                            draggable="true" @dragstart="handleSellingPointDragStart(index)"
                            @dragover="handleSellingPointDragOver" @drop="handleSellingPointDrop($event, index)"
                            @dragend="handleSellingPointDragEnd">
                            <div class="selling-point-container">
                              <span class="drag-handle" aria-hidden="true">
                                <SmIcon name="action-drag" />
                              </span>
                              <span class="selling-point-input-wrapper">
                                <SmInput v-model="highlightKeySellingPoints[index]" :name="`keySellingPoint${index}`"
                                  placeholder="Add a selling point" :label-hidden="true" class="selling-point-input" />
                              </span>
                              <SmButton v-if="highlightKeySellingPoints.length > 1" type="button" shape="round"
                                aria-label="Delete" @click="removeKeySellingPoint(index)" class="remove-point-btn">
                                <SmIcon name="action-remove" style="color: var(--color-warning);" />
                              </SmButton>
                            </div>
                          </li>
                        </ol>
                        <div v-if="!isMaxSellingPoints">
                          <SmButton type="text" size="large" @click="addKeySellingPoint">
                            <SmIcon name="controls-add" />
                            Add
                          </SmButton>
                        </div>
                        <p v-if="isMaxSellingPoints" class="form-helper-message">
                          Maximum of 10 key selling points reached
                        </p>
                    </div>
                  </div>
            </SmFormGroup>
          </div>
        </SmForm>
      </div>
    </div>

    <!-- Prototype Settings Panel -->
    <PrototypeSettings>
      <DisplaySettings />
    </PrototypeSettings>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PrototypeSettings from '@/shared/components/PrototypeSettings.vue'
import GridOverlay from '@/shared/components/GridOverlay.vue'
import DisplaySettings from '@/shared/components/DisplaySettings.vue'
import { useDisplaySettings } from '@/shared/composables/useDisplaySettings.js'

/* ============================================
   FORM DATA - RATE PLAN
   ============================================ */
// General Information
const ratePlanName = ref('Advanced Purchase')
const ratePlanDescription = ref('')

// Restrictions
const defaultMinStay = ref('')
const defaultMaxStay = ref('')
const releasePeriod = ref('14')
const inclusions = ref(null)
const currency = ref('Australian Dollar')
const minimumRate = ref('')

// Rate Setup
const rateSetup = ref('manual') // 'manual' or 'derive'
const derivedFrom = ref(null)
const adjustDailyRatesBy = ref(null)
const percentageAdjustmentType = ref(null)
const percentageAdjustmentValue = ref('10')

// Toggle Switches
const applicableDates = ref(false)
const includedStayDays = ref(false)
const excludedStayDates = ref(false)
const includedAdvertisedDates = ref(false)
const excludedAdvertisedDates = ref(false)
const maxAdvanceBookingDates = ref(false)
const dynamicDiscounts = ref(false)
const discountType = ref('')
const stayNights = ref('')
const payNights = ref('')
const discountFor = ref('all_nights')
const losRules = ref([{ nights: null, discountPercent: '' }])
const packageIncludedNights = ref('')
const packageField1 = ref('')
const packageField2 = ref('')
const packageField3 = ref('')
const packageField4 = ref('')
const packageSeasonalOverrides = ref([])
const restrictRateToMobile = ref(false)
const highlightRatePlan = ref(false)

// Display settings (shared across all slides)
const { showGridOverlay, showContainerBackgrounds, fullWidthForm, showMarkup } = useDisplaySettings()

// Highlight on booking engine fields
const highlightTagline = ref('')
const highlightHeadline = ref('')
const highlightKeySellingPoints = ref(['', '', ''])
const highlightImageUrl = ref('')
const draggedSellingPointIndex = ref(null)

// Date ranges for toggles
const applicableDateRanges = ref([])
const excludedStayDateRanges = ref([])
const includedAdvertisedDateRanges = ref([])
const excludedAdvertisedDateRanges = ref([])
const maxAdvanceBookingDateRanges = ref([])

// Included days for stay dates (empty means all days)
const stayDatesIncludedDays = ref([])

// Restrict advance booking
const maxAdvanceBookingDays = ref('')
const maxAdvanceBookingTimeframe = ref('before_checkin')

// Form validation error tracking
const formErrors = ref({})

// Store initial form state for comparison
const initialFormState = ref(null)

/* ============================================
   OPTIONS
   ============================================ */
const inclusionsOptions = [
  { label: 'None', code: 'none' },
  { label: 'Breakfast included', code: 'breakfast' },
  { label: 'Full board', code: 'full-board' }
]

const derivedFromOptions = [
  { label: 'Non-Refundable', code: 'non-refundable' },
  { label: 'Flexible', code: 'flexible' },
  { label: 'Standard', code: 'standard' }
]

const adjustByOptions = [
  { label: 'Percentage', code: 'percentage' },
  { label: 'Fixed amount', code: 'fixed' }
]

const percentageTypeOptions = [
  { label: 'Decrease by (%)', code: 'decrease' },
  { label: 'Increase by (%)', code: 'increase' }
]

const daysOfWeekOptions = [
  { label: 'Monday', code: 'monday' },
  { label: 'Tuesday', code: 'tuesday' },
  { label: 'Wednesday', code: 'wednesday' },
  { label: 'Thursday', code: 'thursday' },
  { label: 'Friday', code: 'friday' },
  { label: 'Saturday', code: 'saturday' },
  { label: 'Sunday', code: 'sunday' }
]

const maxAdvanceBookingTimeframeOptions = [
  { label: 'Before check-in date', code: 'before_checkin' },
  { label: 'Before booking date', code: 'before_booking' }
]

const discountTypeOptions = [
  { label: 'Dynamic length of stay discount', code: 'dynamic_los' },
  { label: 'Package deal', code: 'package' },
  { label: 'Stay pay deal', code: 'stay_pay' }
]

const losNightsOptions = [
  { label: 'Stay 1+ night', code: 1 },
  { label: 'Stay 2+ nights', code: 2 },
  { label: 'Stay 3+ nights', code: 3 },
  { label: 'Stay 4+ nights', code: 4 },
  { label: 'Stay 5+ nights', code: 5 },
  { label: 'Stay 6+ nights', code: 6 },
  { label: 'Stay 7+ nights', code: 7 },
  { label: 'Stay 8+ nights', code: 8 },
  { label: 'Stay 9+ nights', code: 9 },
  { label: 'Stay 10+ nights', code: 10 },
  { label: 'Stay 11+ nights', code: 11 },
  { label: 'Stay 12+ nights', code: 12 },
  { label: 'Stay 13+ nights', code: 13 },
  { label: 'Stay 14+ nights', code: 14 },
  { label: 'Stay 15+ nights', code: 15 },
  { label: 'Stay 16+ nights', code: 16 }
]

/* ============================================
   FORM HANDLERS
   ============================================ */
// Form submission handler
const handleFormSubmit = (values) => {
  console.log('Form submitted with values:', values)
  formErrors.value = {}
  alert('Form is valid! Saving rate plan...')
  // After successful save, update initial state to current state
  initialFormState.value = captureInitialFormState()
}

// Handle invalid form submission
const handleInvalidSubmit = (errors) => {
  console.log('Form validation errors:', errors)
  formErrors.value = errors?.errors || {}
}

// Cancel handler
const handleCancel = () => {
  console.log('Cancel clicked')
}

// Computed property to get list of error field names with labels
const errorFieldsList = computed(() => {
  const fieldLabels = {
    ratePlanName: 'Rate plan name',
    derivedFrom: 'Derived from',
    adjustDailyRatesBy: 'Adjust daily rates by',
    percentageAdjustmentType: 'Percentage adjustment',
    percentageValue: 'Value',
    maxAdvanceBookingDays: 'Number of days',
    highlightTagline: 'Tagline',
    highlightHeadline: 'Headline'
  }

  const fieldIds = {
    ratePlanName: 'ratePlanName',
    derivedFrom: 'derivedFrom',
    adjustDailyRatesBy: 'adjustDailyRatesBy',
    percentageAdjustmentType: 'percentageAdjustmentType',
    percentageValue: 'percentageValue',
    maxAdvanceBookingDays: 'maxAdvanceBookingDays',
    highlightTagline: 'highlightTagline',
    highlightHeadline: 'highlightHeadline'
  }

  return Object.keys(formErrors.value).map(fieldName => ({
    name: fieldName,
    id: fieldIds[fieldName] || fieldName,
    label: fieldLabels[fieldName] || fieldName,
    error: formErrors.value[fieldName]
  }))
})

// Check if there are any validation errors
const hasErrors = computed(() => Object.keys(formErrors.value).length > 0)

/* ============================================
   FORM CHANGE DETECTION
   ============================================ */
// Capture initial form state
const captureInitialFormState = () => {
  return {
    ratePlanName: ratePlanName.value,
    ratePlanDescription: ratePlanDescription.value,
    defaultMinStay: defaultMinStay.value,
    defaultMaxStay: defaultMaxStay.value,
    releasePeriod: releasePeriod.value,
    inclusions: inclusions.value,
    currency: currency.value,
    minimumRate: minimumRate.value,
    rateSetup: rateSetup.value,
    derivedFrom: derivedFrom.value,
    adjustDailyRatesBy: adjustDailyRatesBy.value,
    percentageAdjustmentType: percentageAdjustmentType.value,
    percentageAdjustmentValue: percentageAdjustmentValue.value,
    applicableDates: applicableDates.value,
    includedStayDays: includedStayDays.value,
    excludedStayDates: excludedStayDates.value,
    includedAdvertisedDates: includedAdvertisedDates.value,
    excludedAdvertisedDates: excludedAdvertisedDates.value,
    maxAdvanceBookingDates: maxAdvanceBookingDates.value,
    dynamicDiscounts: dynamicDiscounts.value,
    discountType: discountType.value,
    stayNights: stayNights.value,
    payNights: payNights.value,
    discountFor: discountFor.value,
    losRules: JSON.parse(JSON.stringify(losRules.value)),
    packageIncludedNights: packageIncludedNights.value,
    packageField1: packageField1.value,
    packageField2: packageField2.value,
    packageField3: packageField3.value,
    packageField4: packageField4.value,
    packageSeasonalOverrides: JSON.parse(JSON.stringify(packageSeasonalOverrides.value)),
    restrictRateToMobile: restrictRateToMobile.value,
    highlightRatePlan: highlightRatePlan.value,
    highlightTagline: highlightTagline.value,
    highlightHeadline: highlightHeadline.value,
    highlightKeySellingPoints: JSON.parse(JSON.stringify(highlightKeySellingPoints.value)),
    highlightImageUrl: highlightImageUrl.value,
    applicableDateRanges: JSON.parse(JSON.stringify(applicableDateRanges.value)),
    excludedStayDateRanges: JSON.parse(JSON.stringify(excludedStayDateRanges.value)),
    includedAdvertisedDateRanges: JSON.parse(JSON.stringify(includedAdvertisedDateRanges.value)),
    excludedAdvertisedDateRanges: JSON.parse(JSON.stringify(excludedAdvertisedDateRanges.value)),
    maxAdvanceBookingDateRanges: JSON.parse(JSON.stringify(maxAdvanceBookingDateRanges.value)),
    stayDatesIncludedDays: JSON.parse(JSON.stringify(stayDatesIncludedDays.value)),
    maxAdvanceBookingDays: maxAdvanceBookingDays.value,
    maxAdvanceBookingTimeframe: maxAdvanceBookingTimeframe.value,
  }
}

// Check if form has been modified
const isFormModified = computed(() => {
  if (!initialFormState.value) return false

  const initial = initialFormState.value

  // Compare all fields
  if (ratePlanName.value !== initial.ratePlanName) return true
  if (ratePlanDescription.value !== initial.ratePlanDescription) return true
  if (defaultMinStay.value !== initial.defaultMinStay) return true
  if (defaultMaxStay.value !== initial.defaultMaxStay) return true
  if (releasePeriod.value !== initial.releasePeriod) return true
  if (inclusions.value !== initial.inclusions) return true
  if (currency.value !== initial.currency) return true
  if (minimumRate.value !== initial.minimumRate) return true
  if (rateSetup.value !== initial.rateSetup) return true
  if (derivedFrom.value !== initial.derivedFrom) return true
  if (adjustDailyRatesBy.value !== initial.adjustDailyRatesBy) return true
  if (percentageAdjustmentType.value !== initial.percentageAdjustmentType) return true
  if (percentageAdjustmentValue.value !== initial.percentageAdjustmentValue) return true
  if (applicableDates.value !== initial.applicableDates) return true
  if (includedStayDays.value !== initial.includedStayDays) return true
  if (excludedStayDates.value !== initial.excludedStayDates) return true
  if (includedAdvertisedDates.value !== initial.includedAdvertisedDates) return true
  if (excludedAdvertisedDates.value !== initial.excludedAdvertisedDates) return true
  if (maxAdvanceBookingDates.value !== initial.maxAdvanceBookingDates) return true
  if (dynamicDiscounts.value !== initial.dynamicDiscounts) return true
  if (discountType.value !== initial.discountType) return true
  if (stayNights.value !== initial.stayNights) return true
  if (payNights.value !== initial.payNights) return true
  if (discountFor.value !== initial.discountFor) return true
  if (packageIncludedNights.value !== initial.packageIncludedNights) return true
  if (packageField1.value !== initial.packageField1) return true
  if (packageField2.value !== initial.packageField2) return true
  if (packageField3.value !== initial.packageField3) return true
  if (packageField4.value !== initial.packageField4) return true
  if (restrictRateToMobile.value !== initial.restrictRateToMobile) return true
  if (highlightRatePlan.value !== initial.highlightRatePlan) return true
  if (highlightTagline.value !== initial.highlightTagline) return true
  if (highlightHeadline.value !== initial.highlightHeadline) return true
  if (highlightImageUrl.value !== initial.highlightImageUrl) return true
  if (maxAdvanceBookingDays.value !== initial.maxAdvanceBookingDays) return true
  if (maxAdvanceBookingTimeframe.value !== initial.maxAdvanceBookingTimeframe) return true

  // Compare arrays by stringifying (simple comparison)
  if (JSON.stringify(losRules.value) !== JSON.stringify(initial.losRules)) return true
  if (JSON.stringify(packageSeasonalOverrides.value) !== JSON.stringify(initial.packageSeasonalOverrides)) return true
  if (JSON.stringify(highlightKeySellingPoints.value) !== JSON.stringify(initial.highlightKeySellingPoints)) return true
  if (JSON.stringify(applicableDateRanges.value) !== JSON.stringify(initial.applicableDateRanges)) return true
  if (JSON.stringify(excludedStayDateRanges.value) !== JSON.stringify(initial.excludedStayDateRanges)) return true
  if (JSON.stringify(includedAdvertisedDateRanges.value) !== JSON.stringify(initial.includedAdvertisedDateRanges)) return true
  if (JSON.stringify(excludedAdvertisedDateRanges.value) !== JSON.stringify(initial.excludedAdvertisedDateRanges)) return true
  if (JSON.stringify(maxAdvanceBookingDateRanges.value) !== JSON.stringify(initial.maxAdvanceBookingDateRanges)) return true
  if (JSON.stringify(stayDatesIncludedDays.value) !== JSON.stringify(initial.stayDatesIncludedDays)) return true

  return false
})

/* ============================================
   DATE RANGE MANAGEMENT
   ============================================ */
const addDateRange = (type) => {
  if (type === 'applicable') {
    applicableDateRanges.value.push({ start: null, end: null })
  } else if (type === 'excluded') {
    excludedStayDateRanges.value.push({ start: null, end: null })
  } else if (type === 'includedAdvertised') {
    includedAdvertisedDateRanges.value.push({ start: null, end: null })
  } else if (type === 'excludedAdvertised') {
    excludedAdvertisedDateRanges.value.push({ start: null, end: null })
  } else if (type === 'maxAdvance') {
    maxAdvanceBookingDateRanges.value.push({ start: null, end: null })
  }
}

const clearDateRange = (type, index) => {
  if (type === 'applicable') {
    applicableDateRanges.value[index] = { start: null, end: null }
  } else if (type === 'excluded') {
    excludedStayDateRanges.value[index] = { start: null, end: null }
  } else if (type === 'includedAdvertised') {
    includedAdvertisedDateRanges.value[index] = { start: null, end: null }
  } else if (type === 'excludedAdvertised') {
    excludedAdvertisedDateRanges.value[index] = { start: null, end: null }
  } else if (type === 'maxAdvance') {
    maxAdvanceBookingDateRanges.value[index] = { start: null, end: null }
  }
}

const deleteDateRange = (type, index) => {
  if (type === 'applicable') {
    applicableDateRanges.value.splice(index, 1)
  } else if (type === 'excluded') {
    excludedStayDateRanges.value.splice(index, 1)
  } else if (type === 'includedAdvertised') {
    includedAdvertisedDateRanges.value.splice(index, 1)
  } else if (type === 'excludedAdvertised') {
    excludedAdvertisedDateRanges.value.splice(index, 1)
  } else if (type === 'maxAdvance') {
    maxAdvanceBookingDateRanges.value.splice(index, 1)
  }
}

/* ============================================
   DYNAMIC DISCOUNT FUNCTIONS
   ============================================ */
// Watch checkbox toggles and reset data when unchecked
watch(applicableDates, (newValue) => {
  if (!newValue) {
    applicableDateRanges.value = []
  }
})

watch(excludedStayDates, (newValue) => {
  if (!newValue) {
    excludedStayDateRanges.value = []
  }
})

watch(includedAdvertisedDates, (newValue) => {
  if (!newValue) {
    includedAdvertisedDateRanges.value = []
  }
})

watch(excludedAdvertisedDates, (newValue) => {
  if (!newValue) {
    excludedAdvertisedDateRanges.value = []
  }
})

watch(includedStayDays, (newValue) => {
  if (!newValue) {
    stayDatesIncludedDays.value = []
  }
})

// Watch dynamic discounts toggle and reset all discount fields
watch(dynamicDiscounts, (newValue) => {
  if (!newValue) {
    discountType.value = ''
    losRules.value = [{ nights: null, discountPercent: '' }]
    stayNights.value = ''
    payNights.value = ''
    discountFor.value = ''
    packageIncludedNights.value = ''
    packageField1.value = ''
    packageField2.value = ''
    packageField3.value = ''
    packageField4.value = ''
    packageSeasonalOverrides.value = []
  }
})

// Watch discount type changes and reset fields
watch(discountType, (newValue) => {
  if (newValue !== 'stay_pay') {
    stayNights.value = ''
    payNights.value = ''
    discountFor.value = ''
  }
  if (newValue !== 'dynamic_los') {
    losRules.value = [{ nights: null, discountPercent: '' }]
  }
  if (newValue !== 'package') {
    packageIncludedNights.value = ''
    packageField1.value = ''
    packageField2.value = ''
    packageField3.value = ''
    packageField4.value = ''
    packageSeasonalOverrides.value = []
  }
})

// Add a new LOS rule
const addLosRule = () => {
  if (losRules.value.length < 15) {
    losRules.value.push({ nights: null, discountPercent: '' })
  }
}

// Remove a LOS rule
const removeLosRule = (index) => {
  if (losRules.value.length > 1) {
    losRules.value.splice(index, 1)
  }
}

// Add a seasonal override for package deal
const addSeasonalOverride = () => {
  packageSeasonalOverrides.value.push({
    dateRange: null,
    includedNights: '',
    field1: '',
    field2: '',
    field3: '',
    field4: ''
  })
}

// Remove a seasonal override
const removeSeasonalOverride = (index) => {
  packageSeasonalOverrides.value.splice(index, 1)
}

// Clear date range for seasonal override
const clearSeasonalOverrideDateRange = (index) => {
  packageSeasonalOverrides.value[index].dateRange = null
}

/* ============================================
   HIGHLIGHT BOOKING ENGINE FUNCTIONS
   ============================================ */
// Add a key selling point
const addKeySellingPoint = () => {
  if (highlightKeySellingPoints.value.length < 10) {
    highlightKeySellingPoints.value.push('')
  }
}

// Remove a key selling point
const removeKeySellingPoint = (index) => {
  if (highlightKeySellingPoints.value.length > 1) {
    highlightKeySellingPoints.value.splice(index, 1)
  }
}

// Drag and drop handlers for selling points
const handleSellingPointDragStart = (index) => {
  draggedSellingPointIndex.value = index
}

const handleSellingPointDragOver = (event) => {
  event.preventDefault()
}

const handleSellingPointDrop = (event, dropIndex) => {
  event.preventDefault()

  if (draggedSellingPointIndex.value === null) return

  const dragIndex = draggedSellingPointIndex.value
  if (dragIndex === dropIndex) return

  // Remove the dragged item and insert it at the new position
  const items = [...highlightKeySellingPoints.value]
  const [draggedItem] = items.splice(dragIndex, 1)
  items.splice(dropIndex, 0, draggedItem)

  highlightKeySellingPoints.value = items
  draggedSellingPointIndex.value = null
}

const handleSellingPointDragEnd = () => {
  draggedSellingPointIndex.value = null
}

// Computed property to check if at max selling points
const isMaxSellingPoints = computed(() => highlightKeySellingPoints.value.length >= 10)

// Handle highlight image upload
const handleHighlightImageUpload = (event) => {
  const file = event.target.files?.[0]

  if (file) {
    // Create a local URL for the uploaded image
    const reader = new FileReader()
    reader.onload = (e) => {
      highlightImageUrl.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

// Remove highlight image
const removeHighlightImage = () => {
  highlightImageUrl.value = ''
}

// Open media library (placeholder function)
const openMediaLibrary = () => {
  console.log('Open media library')
}

/* ============================================
   WATCHERS
   ============================================ */
// Reset derived rate fields when switching to manual input
watch(rateSetup, (newValue) => {
  if (newValue === 'manual') {
    derivedFrom.value = null
    adjustDailyRatesBy.value = null
    percentageAdjustmentType.value = null
    percentageAdjustmentValue.value = '10'
  }
})

// Reset highlight fields when toggled off
watch(highlightRatePlan, (newValue) => {
  if (!newValue) {
    highlightTagline.value = ''
    highlightHeadline.value = ''
    highlightKeySellingPoints.value = ['', '', '']
    highlightImageUrl.value = ''
  }
})

/* ============================================
   LIFECYCLE
   ============================================ */

// Keyboard event handler for hotkeys
const handleKeyPress = (event) => {
  // 'b' key to toggle container backgrounds
  if (event.key === 'b' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    // Only trigger if not typing in an input/textarea
    const activeElement = document.activeElement
    const isTyping = activeElement?.tagName === 'INPUT' ||
                     activeElement?.tagName === 'TEXTAREA' ||
                     activeElement?.isContentEditable

    if (!isTyping) {
      showContainerBackgrounds.value = !showContainerBackgrounds.value
      event.preventDefault()
    }
  }
}

onMounted(() => {
  // Capture initial form state after a brief delay to ensure all defaults are set
  setTimeout(() => {
    initialFormState.value = captureInitialFormState()
  }, 100)

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  // Clean up keyboard event listener
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

/* ============================================
   HYBRID GAP + MARGIN SPACING - EXPERIMENTAL

   This slide uses gap spacing system defined in:
   ../styles/gap-spacing.scss

   To toggle the gap spacing system on/off globally,
   comment/uncomment the import in ../styles/index.scss
   ============================================ */
</style>
