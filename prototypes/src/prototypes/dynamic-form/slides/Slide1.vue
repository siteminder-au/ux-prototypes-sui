<template>
  <div class="slide-wrapper">
    <div class="slide-left">
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
      <div class="container-content">
        <!-- Drawer Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <div>
            <h2 style="margin-bottom: 0.25rem;">Edit rate plan</h2>
            <p style="margin: 0; color: #666;">Advance purchase</p>
          </div>
          <div style="display: flex; gap: 1rem;">
            <SmButton type="secondary" @click="handleCancel">
              Cancel
            </SmButton>
            <SmButton type="primary" native-type="submit" form="rate-plan-form" :disabled="!isFormModified">
              Save
            </SmButton>
          </div>
        </div>

        <!-- Form Content -->
        <SmForm id="rate-plan-form" @submit="handleFormSubmit" @invalid-submit="handleInvalidSubmit">
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
          <SmFormGroup id="general-information" legend="GENERAL INFORMATION">
            <SmInput id="ratePlanName" v-model="ratePlanName" label="Rate plan name" name="ratePlanName"
              placeholder="Enter rate plan name" />

            <SmInput type="textarea" label="Rate plan description" name="ratePlanDescription"
              v-model="ratePlanDescription" placeholder="Enter description" :rows="3" />
          </SmFormGroup>

          <!-- Restrictions and Inclusions -->
          <SmFormGroup id="restrictions-inclusions" legend="RESTRICTIONS AND INCLUSIONS">
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
          <SmFormGroup id="pricing-details" legend="PRICING DETAILS">
            <div class="form-row">
              <div class="form-col">
                <SmInput v-model="currency" label="Currency" name="currency" placeholder="Australian Dollar" disabled />
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
                      <SmIcon name="utility-information-alt" class="tooltip-icon" />
                    </SmTooltip>
                  </template>
                </SmInput>
              </div>
            </div>
          </SmFormGroup>

          <!-- Rate Setup -->
          <SmFormGroup id="rate-setup" legend="RATE SETUP">
            <SmRadioGroup label="Rate setup method" v-model="rateSetup" name="rateSetup">
              <SmRadio label="Manually input daily rates" selected-value="manual" v-model="rateSetup" name="rateSetup"
                :error-disabled="true" />
              <SmRadio label="Derive daily rates from an existing rate plan" selected-value="derive" v-model="rateSetup"
                name="rateSetup" :error-disabled="true" />
            </SmRadioGroup>

            <div v-show="rateSetup === 'derive'" class="derived-rate-fields">
              <SmSelect id="derivedFrom" v-model="derivedFrom" label="Derived from" name="derivedFrom"
                :options="derivedFromOptions" placeholder="Non-Refundable" />

              <SmSelect v-model="adjustDailyRatesBy" label="Adjust daily rates by" name="adjustDailyRatesBy"
                :options="adjustByOptions" placeholder="Percentage" />

              <div class="form-row">
                <div class="form-col col-span-3">
                  <SmSelect v-model="percentageAdjustmentType" label="Percentage adjustment"
                    name="percentageAdjustmentType" :options="percentageTypeOptions" placeholder="Decrease by (%)" />
                </div>
                <div class="form-col col-span-1">
                  <SmInput v-model="percentageAdjustmentValue" label="Value" name="percentageValue" placeholder="10" />
                </div>
              </div>
            </div>
          </SmFormGroup>

          <!-- Direct Booking Controls -->
          <SmFormGroup id="booking-controls" legend="DIRECT BOOKING CONTROLS">
            <h6 class="sm-h6" style="margin-top: 8px; margin-bottom: 3px;">Restrict
              bookable dates</h6>

            <SmCheckboxGroup name="includedStayDatesGroup" label="Included stay dates" class="form-checkbox-group">
              <template #action>
                <SmTooltip title="Restrict the dates your rates are bookable" trigger="hover" placement="right">
                  <SmIcon name="utility-information-alt" class="tooltip-icon" />
                </SmTooltip>
              </template>
              <SmCheckbox v-model="applicableDates" id="applicableDates" name="applicableDates"
                label="Enable included stay dates" />
            </SmCheckboxGroup>

            <!-- Included stay date ranges -->
            <div v-for="(range, index) in applicableDateRanges" :key="index" v-if="applicableDates"
              class="date-range-item">
              <div class="date-range-header">
                <span class="date-range-label">Date range</span>
                <div class="date-range-actions">
                  <button type="button" class="date-range-action-btn clear-btn"
                    @click="clearDateRange('applicable', index)">
                    Clear
                  </button>
                  <button type="button" class="date-range-action-btn delete-btn"
                    @click="deleteDateRange('applicable', index)">
                    Delete
                  </button>
                </div>
              </div>
              <SmDatePicker v-model="applicableDateRanges[index]" :name="`applicableDateRange${index}`" :is-range="true"
                start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY" :label-hidden="true"
                mode="date" />
            </div>

            <button v-if="applicableDates && applicableDateRanges.length < 5" type="button" class="add-date-range-btn"
              @click="addDateRange('applicable')">
              <span class="plus-icon">+</span> Add included dates
            </button>
            <div v-else-if="applicableDates && applicableDateRanges.length >= 5" class="date-range-limit-message">
              Maximum of 5 date ranges reached
            </div>

            <SmCheckboxGroup name="daysOfWeekGroup" label="Days of the week restriction" class="form-checkbox-group">
              <SmCheckbox v-model="includedStayDays" id="includedStayDays" name="includedStayDays"
                label="Enable days of the week restriction" />
            </SmCheckboxGroup>

            <SmSelect v-if="includedStayDays" v-model="stayDatesIncludedDays" label="Included days"
              name="stayDatesIncludedDays" :options="daysOfWeekOptions" :multiple="true" placeholder="All days" />

            <SmCheckboxGroup name="excludedStayDatesGroup" label="Excluded stay dates" class="form-checkbox-group">
              <SmCheckbox v-model="excludedStayDates" id="excludedStayDates" name="excludedStayDates"
                label="Enable excluded stay dates" />
            </SmCheckboxGroup>

            <!-- Excluded stay date ranges -->
            <div v-for="(range, index) in excludedStayDateRanges" :key="index" v-if="excludedStayDates"
              class="date-range-item">
              <div class="date-range-header">
                <span class="date-range-label">Date range</span>
                <div class="date-range-actions">
                  <button type="button" class="date-range-action-btn clear-btn"
                    @click="clearDateRange('excluded', index)">
                    Clear
                  </button>
                  <button type="button" class="date-range-action-btn delete-btn"
                    @click="deleteDateRange('excluded', index)">
                    Delete
                  </button>
                </div>
              </div>
              <SmDatePicker v-model="excludedStayDateRanges[index]" :name="`excludedStayDateRange${index}`"
                :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                :label-hidden="true" mode="date" />
            </div>

            <button v-if="excludedStayDates && excludedStayDateRanges.length < 5" type="button"
              class="add-date-range-btn" @click="addDateRange('excluded')">
              <span class="plus-icon">+</span> Add excluded dates
            </button>
            <div v-else-if="excludedStayDates && excludedStayDateRanges.length >= 5" class="date-range-limit-message">
              Maximum of 5 date ranges reached
            </div>

            <SmCheckboxGroup name="includedAdvertisedDatesGroup" label="Included advertised dates"
              class="form-checkbox-group">
              <SmCheckbox v-model="includedAdvertisedDates" id="includedAdvertisedDates" name="includedAdvertisedDates"
                label="Enable included advertised dates" />
            </SmCheckboxGroup>

            <!-- Included advertised date ranges -->
            <div v-for="(range, index) in includedAdvertisedDateRanges" :key="index" v-if="includedAdvertisedDates"
              class="date-range-item">
              <div class="date-range-header">
                <span class="date-range-label">Date range</span>
                <div class="date-range-actions">
                  <button type="button" class="date-range-action-btn clear-btn"
                    @click="clearDateRange('includedAdvertised', index)">
                    Clear
                  </button>
                  <button type="button" class="date-range-action-btn delete-btn"
                    @click="deleteDateRange('includedAdvertised', index)">
                    Delete
                  </button>
                </div>
              </div>
              <SmDatePicker v-model="includedAdvertisedDateRanges[index]" :name="`includedAdvertisedDateRange${index}`"
                :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                :label-hidden="true" mode="date" />
            </div>

            <button v-if="includedAdvertisedDates && includedAdvertisedDateRanges.length < 5" type="button"
              class="add-date-range-btn" @click="addDateRange('includedAdvertised')">
              <span class="plus-icon">+</span> Add included advertised dates
            </button>
            <div v-else-if="includedAdvertisedDates && includedAdvertisedDateRanges.length >= 5"
              class="date-range-limit-message">
              Maximum of 5 date ranges reached
            </div>

            <SmCheckboxGroup name="excludedAdvertisedDatesGroup" label="Excluded advertised dates"
              class="form-checkbox-group">
              <SmCheckbox v-model="excludedAdvertisedDates" id="excludedAdvertisedDates" name="excludedAdvertisedDates"
                label="Enable excluded advertised dates" />
            </SmCheckboxGroup>

            <!-- Excluded advertised date ranges -->
            <div v-for="(range, index) in excludedAdvertisedDateRanges" :key="index" v-if="excludedAdvertisedDates"
              class="date-range-item">
              <div class="date-range-header">
                <span class="date-range-label">Date range</span>
                <div class="date-range-actions">
                  <button type="button" class="date-range-action-btn clear-btn"
                    @click="clearDateRange('excludedAdvertised', index)">
                    Clear
                  </button>
                  <button type="button" class="date-range-action-btn delete-btn"
                    @click="deleteDateRange('excludedAdvertised', index)">
                    Delete
                  </button>
                </div>
              </div>
              <SmDatePicker v-model="excludedAdvertisedDateRanges[index]" :name="`excludedAdvertisedDateRange${index}`"
                :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                :label-hidden="true" mode="date" />
            </div>

            <button v-if="excludedAdvertisedDates && excludedAdvertisedDateRanges.length < 5" type="button"
              class="add-date-range-btn" @click="addDateRange('excludedAdvertised')">
              <span class="plus-icon">+</span> Add excluded advertised dates
            </button>
            <div v-else-if="excludedAdvertisedDates && excludedAdvertisedDateRanges.length >= 5"
              class="date-range-limit-message">
              Maximum of 5 date ranges reached
            </div>

            <SmCheckboxGroup name="advanceBookingGroup" label="Advance booking restriction" class="form-checkbox-group">
              <SmCheckbox v-model="maxAdvanceBookingDates" id="maxAdvanceBookingDates" name="maxAdvanceBookingDates"
                label="Enable advance booking restriction" />
            </SmCheckboxGroup>

            <div v-if="maxAdvanceBookingDates" class="form-row">
              <div class="form-col col-span-2">
                <SmInput v-model="maxAdvanceBookingDays" name="maxAdvanceBookingDays" label="Number of days"
                  type="number" placeholder="e.g., 30, 60, 90" />
              </div>
              <div class="form-col col-span-2">
                <SmSelect v-model="maxAdvanceBookingTimeframe" name="maxAdvanceBookingTimeframe" label="Timeframe"
                  :options="maxAdvanceBookingTimeframeOptions" />
              </div>
            </div>

            <h6 class="sm-h6" style="margin-top: 8px; margin-bottom: 3px;">
              Additional options</h6>

            <SmCheckboxGroup name="dynamicDiscountsGroup" label="Dynamic discounts" class="form-checkbox-group">
              <SmCheckbox v-model="dynamicDiscounts" id="dynamicDiscounts" name="dynamicDiscounts"
                label="Enable dynamic discounts" />
            </SmCheckboxGroup>

            <div v-if="dynamicDiscounts" class="form-row">
              <SmSelect v-model="discountType" name="discountType" label="Discount type"
                placeholder="Select a discount type" :options="discountTypeOptions" />
            </div>

            <!-- Dynamic Length of Stay Fields -->
            <div v-if="dynamicDiscounts && discountType === 'dynamic_los'">
              <div v-for="(rule, index) in losRules" :key="index" class="form-row">
                <div class="form-col">
                  <SmSelect v-model="rule.nights" :name="`losNights_${index}`" label="Nights"
                    placeholder="Select nights" :options="losNightsOptions" />
                </div>
                <div :class="index === losRules.length - 1 && losRules.length > 1 ? 'form-col col-span-1' : 'form-col'">
                  <SmInput v-model="rule.discountPercent" :name="`losDiscountPercent_${index}`" label="Discount %"
                    type="number" placeholder="0" />
                </div>
                <div v-if="index === losRules.length - 1 && losRules.length > 1" class="form-col col-span-1">
                  <label class="field-label" style="visibility: hidden;">Action</label>
                  <SmButton type="secondary" @click="removeLosRule(index)" style="width: 100%;">
                    Delete
                  </SmButton>
                </div>
              </div>
              <button v-if="losRules.length < 15" type="button" class="add-date-range-btn" @click="addLosRule"
                style="margin-top: 16px;">
                <span class="plus-icon">+</span> Add rule
              </button>
              <div v-if="losRules.length >= 15" class="date-range-limit-message">
                Maximum of 15 rules reached
              </div>
            </div>

            <!-- Stay Pay Deal Fields -->
            <div v-if="dynamicDiscounts && discountType === 'stay_pay'">
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
                <SmRadio v-model="discountFor" name="discountFor" selected-value="cheapest_night" label="Cheapest night"
                  :error-disabled="true" />
              </SmRadioGroup>
            </div>

            <!-- Package Deal Fields -->
            <div v-if="dynamicDiscounts && discountType === 'package'">
              <SmInput v-model="packageIncludedNights" name="packageIncludedNights" label="Number of included nights"
                type="number" placeholder="0" />

              <p class="sm-text--small" style="margin-top: 24px; margin-bottom: 16px; font-weight: 600;">
                Charges for
                additional nights</p>

              <div class="form-row">
                <div class="form-col">
                  <SmInput v-model="packageField1" name="packageField1" label="Rate for included occupants"
                    type="number" placeholder="0">
                    <template #prefix>
                      <span>AUD</span>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmInput v-model="packageField2" name="packageField2" label="Extra adult rate" type="number"
                    placeholder="0">
                    <template #prefix>
                      <span>AUD</span>
                    </template>
                  </SmInput>
                </div>
              </div>

              <div class="form-row">
                <div class="form-col">
                  <SmInput v-model="packageField3" name="packageField3" label="Extra child rate" type="number"
                    placeholder="0">
                    <template #prefix>
                      <span>AUD</span>
                    </template>
                  </SmInput>
                </div>
                <div class="form-col">
                  <SmInput v-model="packageField4" name="packageField4" label="Extra infant rate" type="number"
                    placeholder="0">
                    <template #prefix>
                      <span>AUD</span>
                    </template>
                  </SmInput>
                </div>
              </div>

              <!-- Seasonal Overrides -->
              <div v-for="(override, index) in packageSeasonalOverrides" :key="index" style="margin-top: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h6 class="sm-h6" style="margin: 0;">Seasonal
                    override</h6>
                  <button type="button" class="date-range-action-btn delete-btn" @click="removeSeasonalOverride(index)">
                    Delete
                  </button>
                </div>

                <div class="date-range-item">
                  <div class="date-range-header">
                    <span class="date-range-label">Date
                      range</span>
                    <div class="date-range-actions">
                      <button type="button" class="date-range-action-btn clear-btn"
                        @click="clearSeasonalOverrideDateRange(index)">
                        Clear
                      </button>
                    </div>
                  </div>
                  <SmDatePicker v-model="override.dateRange" :name="`seasonalOverrideDateRange${index}`"
                    :is-range="true" start-date-placeholder="DD/MM/YYYY" end-date-placeholder="DD/MM/YYYY"
                    :label-hidden="true" mode="date" />
                </div>

                <div class="form-row" style="margin-top: 16px;">
                  <div class="form-col">
                    <SmInput v-model="override.includedNights" :name="`seasonalOverrideIncludedNights${index}`"
                      label="Number of included nights" type="number" placeholder="0" />
                  </div>
                </div>

                <p class="sm-text--small" style="margin-top: 24px; margin-bottom: 16px; font-weight: 600;">
                  Charges for additional nights</p>

                <div class="form-row">
                  <div class="form-col">
                    <SmInput v-model="override.field1" :name="`seasonalOverrideField1_${index}`"
                      label="Rate for included occupants" type="number" placeholder="0">
                      <template #prefix>
                        <span>AUD</span>
                      </template>
                    </SmInput>
                  </div>
                  <div class="form-col">
                    <SmInput v-model="override.field2" :name="`seasonalOverrideField2_${index}`"
                      label="Extra adult rate" type="number" placeholder="0">
                      <template #prefix>
                        <span>AUD</span>
                      </template>
                    </SmInput>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-col">
                    <SmInput v-model="override.field3" :name="`seasonalOverrideField3_${index}`"
                      label="Extra child rate" type="number" placeholder="0">
                      <template #prefix>
                        <span>AUD</span>
                      </template>
                    </SmInput>
                  </div>
                  <div class="form-col">
                    <SmInput v-model="override.field4" :name="`seasonalOverrideField4_${index}`"
                      label="Extra infant rate" type="number" placeholder="0">
                      <template #prefix>
                        <span>AUD</span>
                      </template>
                    </SmInput>
                  </div>
                </div>
              </div>

              <button type="button" class="add-date-range-btn" @click="addSeasonalOverride" style="margin-top: 24px;">
                <span class="plus-icon">+</span> Add seasonal override
              </button>
            </div>

            <SmCheckboxGroup name="restrictToMobileGroup" label="Restrict to mobile devices"
              class="form-checkbox-group">
              <template #action>
                <SmTooltip title="When enabled rates will only be visible for booking on mobile devices" trigger="hover"
                  placement="right">
                  <SmIcon name="utility-information-alt" class="tooltip-icon" />
                </SmTooltip>
              </template>
              <SmCheckbox v-model="restrictRateToMobile" id="restrictRateToMobile" name="restrictRateToMobile"
                label="Enable restrict to mobile devices" />
            </SmCheckboxGroup>

            <SmCheckboxGroup name="highlightOnBookingEngineGroup" label="Highlight on booking engine"
              class="form-checkbox-group">
              <template #action>
                <SmTooltip title="Highlighted rate plans are displayed at the top of the page on your booking engine."
                  trigger="hover" placement="right">
                  <SmIcon name="utility-information-alt" class="tooltip-icon" />
                </SmTooltip>
              </template>
              <SmCheckbox v-model="highlightRatePlan" id="highlightRatePlan" name="highlightRatePlan"
                label="Enable highlight on booking engine" />
            </SmCheckboxGroup>

            <!-- Highlight on booking engine expanded fields -->
            <div v-if="highlightRatePlan" class="highlight-booking-engine-section">
              <div class="media-upload-section">
                <div class="media-upload-header">
                  <label class="media-upload-label">Hero
                    image</label>
                  <SmTooltip title="The recommended size is 1500x500 px. Supported formats: GIF, JPG, PNG."
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" />
                  </SmTooltip>
                </div>
                <div class="sm-media">
                  <div class="sm-media__drop-zone">
                    <div v-if="highlightImageUrl" class="sm-media--items">
                      <div class="sm-media-item" :style="{ backgroundImage: `url(${highlightImageUrl})` }">
                        <div class="sm-media-item__card">
                          <div class="sm-media-item__actions">
                            <SmButton type="button" shape="square" size="medium" @click="removeHighlightImage">
                              <SmIcon name="action-cross" />
                            </SmButton>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="sm-media__empty-state">
                      <input ref="highlightImageInput" type="file" accept="image/png,image/jpg,image/jpeg,image/gif"
                        class="sm-media__input-hidden" @change="handleHighlightImageUpload" />
                      <button type="button" @click="openMediaLibrary" class="add-media-btn">
                        <span class="plus-icon">+</span>
                        Assign from media
                        library
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <SmInput v-model="highlightTagline" name="highlightTagline" label="Tagline" placeholder="Enter tagline"
                :mandatory="true" class="form-input">
                <template #action>
                  <SmTooltip
                    title="A short and catchy description of your rate plan. Include whether the rate is discounted or is a limited time offer."
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" />
                  </SmTooltip>
                </template>
              </SmInput>

              <SmInput v-model="highlightHeadline" name="highlightHeadline" label="Headline"
                placeholder="Enter headline" :mandatory="true" class="form-input">
                <template #action>
                  <SmTooltip title="The main headline text that will be prominently displayed" trigger="hover"
                    placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" />
                  </SmTooltip>
                </template>
              </SmInput>

              <div class="key-selling-points-section">
                <div class="selling-points-header">
                  <label class="selling-points-label">Key selling
                    points</label>
                  <SmTooltip title="Add up to 10 key selling points to highlight the benefits of this rate plan"
                    trigger="hover" placement="right">
                    <SmIcon name="utility-information-alt" class="tooltip-icon" />
                  </SmTooltip>
                </div>
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
                        <SmIcon name="action-remove" class="text-app-warning" />
                      </SmButton>
                    </div>
                  </li>
                </ol>
                <button v-if="!isMaxSellingPoints" type="button" @click="addKeySellingPoint"
                  class="add-selling-point-btn">
                  <span class="plus-icon">+</span> Add
                </button>
                <p v-if="isMaxSellingPoints" class="max-selling-points-message sm-text--small">
                  Maximum of 10 key selling points reached
                </p>
              </div>
            </div>
          </SmFormGroup>
        </SmForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

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
const discountFor = ref('')
const losRules = ref([{ nights: null, discountPercent: '' }])
const packageIncludedNights = ref('')
const packageField1 = ref('')
const packageField2 = ref('')
const packageField3 = ref('')
const packageField4 = ref('')
const packageSeasonalOverrides = ref([])
const restrictRateToMobile = ref(false)
const highlightRatePlan = ref(false)

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
    stayNights: 'Stay nights',
    payNights: 'Pay nights',
    discountFor: 'Discount for',
  }

  const fieldIds = {
    ratePlanName: 'ratePlanName',
    derivedFrom: 'derivedFrom',
    stayNights: 'stayNights',
    payNights: 'payNights',
    discountFor: 'discountFor',
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
onMounted(() => {
  // Capture initial form state after a brief delay to ensure all defaults are set
  setTimeout(() => {
    initialFormState.value = captureInitialFormState()
  }, 100)
})
</script>

<style scoped lang="scss">
@import '../styles/index.scss';

.error-list {
  margin: 0;
  padding-left: 1.25rem;
}

.error-link {
  color: #c70101;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #a00000;
  }
}

// Component-specific styles (general layout utilities are in ../styles.scss)

.highlight-booking-engine-section {
  margin-top: 1.5rem;
}
</style>
