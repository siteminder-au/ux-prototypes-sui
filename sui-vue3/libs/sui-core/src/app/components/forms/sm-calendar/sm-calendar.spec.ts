import { FieldValidationMetaInfo } from '@/app/libs/vee-validate/rules/types'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { required } from '@vee-validate/rules'
import { configure, defineRule } from 'vee-validate'
import { ref } from 'vue'
import SmCalendar from './sm-calendar.vue'
import * as calendarUtils from './utils/helpers'

describe('SmCalendar', () => {

  beforeAll(() => {
    defineRule('required', required)

    configure({
      generateMessage: (context: FieldValidationMetaInfo) => {
        const ruleName = context.rule?.name ?? ''

        return `This is a custom ${ruleName} field message`
      },
    })
  })

  beforeAll(() => {
    /**
     * Use en-US as locale to avoid test failures when running from different regions
     */
    jest.spyOn(calendarUtils, 'getMonthNames').mockImplementation((length, locale) => {
      const localeToUse = locale ?? 'en-US'
      const dtf = new Intl.DateTimeFormat(localeToUse, { month: length })

      // Create dummy date with all twelve months to format
      return Array
        .from({ length: 12 }, (_, index) => (new Date(2000, index, 15)))
        .map(d => dtf.format(d))
    })
  })

  // When jest.useFakeTimers() is used, we need to configure userEvent package
  // such that it is aware that fake timers are used.
  // this is after upgrading user-event package to v14+
  // see: https://github.com/testing-library/user-event/issues/833
  const userEventInstance = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Fake timers using Jest
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-05-15'))
  })

  // See: https://testing-library.com/docs/using-fake-timers/
  // Running all pending timers and switching to real timers using Jest
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('month-year mode', () => {

    describe('default', () => {
      it('should display the month picker when input is focused', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        expect(inputElement).toBeVisible()
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        await userEventInstance.click(inputElement)

        // Popover
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

        // Header
        expect(screen.getByRole('button', { name: 'Previous year' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Choose year' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year' })).toBeVisible()
        expect(screen.getByText('2020')).toBeVisible()

        // Content
        const options = screen.getAllByRole('button', { name: /.* 2020/ })
        expect(options).toHaveLength(12)
        const monthLabels = [
          'January 2020',
          'February 2020',
          'March 2020',
          'April 2020',
          'May 2020',
          'June 2020',
          'July 2020',
          'August 2020',
          'September 2020',
          'October 2020',
          'November 2020',
          'December 2020',
        ]
        monthLabels.forEach((month) => {
          expect(screen.getByRole('button', { name: month })).toBeVisible()
        })
      })

      it('should display next or previous year options if nav buttons are clicked', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)

        await userEventInstance.click(screen.getByRole('button', { name: 'Next year' }))
        await waitFor(() => expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12))
        await waitFor(() => expect(screen.queryAllByRole('button', { name: /.* 2020/ })).toHaveLength(0))

        await userEventInstance.click(screen.getByRole('button', { name: 'Previous year' }))
        await waitFor(() => expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12))
        await waitFor(() => expect(screen.queryAllByRole('button', { name: /.* 2021/ })).toHaveLength(0))

        await userEventInstance.click(screen.getByRole('button', { name: 'Previous year' }))
        await waitFor(() => expect(screen.getAllByRole('button', { name: /.* 2019/ })).toHaveLength(12))
        await waitFor(() => expect(screen.queryAllByRole('button', { name: /.* 2020/ })).toHaveLength(0))
      })

      it('should display the year picker when year button is clicked', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))

        // Header
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year range' })).toBeVisible()
        expect(screen.getByText('2020 - 2029')).toBeVisible()

        // Content
        const yearLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029']
        yearLabels.forEach((year) => {
          expect(screen.getByRole('button', { name: year })).toBeVisible()
        })
      })

      it('should display next range of years when header button is clicked', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))

        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        expect(screen.getByText('2020 - 2029')).toBeVisible()

        // 2030 - 2039
        await userEventInstance.click(screen.getByRole('button', { name: 'Next year range' }))
        await waitFor(() => expect(screen.getByText('2030 - 2039')).toBeVisible())
        expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year range' })).toBeVisible()

        let yearLabels = ['2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039']
        yearLabels.forEach((year) => {
          expect(screen.getByRole('button', { name: year })).toBeVisible()
        })

        // 2020 - 2029
        await userEventInstance.click(screen.getByRole('button', { name: 'Previous year range' }))
        await waitFor(() => expect(screen.getByText('2020 - 2029')).toBeVisible())
        expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year range' })).toBeVisible()

        yearLabels = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029']
        yearLabels.forEach((year) => {
          expect(screen.getByRole('button', { name: year })).toBeVisible()
        })

        // 2010 - 2019
        await userEventInstance.click(screen.getByRole('button', { name: 'Previous year range' }))
        await waitFor(() => expect(screen.getByText('2010 - 2019')).toBeVisible())
        expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year range' })).toBeVisible()

        yearLabels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
        yearLabels.forEach((year) => {
          expect(screen.getByRole('button', { name: year })).toBeVisible()
        })
      })

      it('should switch back to month view if year is clicked', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))

        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year range' })).toBeVisible()
        expect(screen.getByText('2020 - 2029')).toBeVisible()

        await userEventInstance.click(screen.getByRole('button', { name: '2024' }))

        // Header
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year' })).toBeVisible())
        expect(screen.getByRole('button', { name: 'Choose year' })).toBeVisible()
        expect(screen.getByRole('button', { name: 'Next year' })).toBeVisible()
        expect(screen.getByText('2024')).toBeVisible()

        // Content
        const options = screen.getAllByRole('button', { name: /.* 2024/ })
        expect(options).toHaveLength(12)
        const monthLabels = [
          'January 2024',
          'February 2024',
          'March 2024',
          'April 2024',
          'May 2024',
          'June 2024',
          'July 2024',
          'August 2024',
          'September 2024',
          'October 2024',
          'November 2024',
          'December 2024',
        ]
        monthLabels.forEach((month) => {
          expect(screen.getByRole('button', { name: month })).toBeVisible()
        })
      })

      it('should close the picker if month is clicked', async () => {
        // ARRANGE
        const mockChange = jest.fn()
        const mockMonthSelected = jest.fn()
        const mockEndMonthSelected = jest.fn()
        const mockStartMonthSelected = jest.fn()
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue, mockChange, mockMonthSelected, mockEndMonthSelected, mockStartMonthSelected }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
                @change="mockChange"
                @month-selected="mockMonthSelected"
                @end-month-selected="mockEndMonthSelected"
                @start-month-selected="mockStartMonthSelected"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        expect(mockChange).toHaveBeenCalledTimes(0)
        expect(mockMonthSelected).toHaveBeenCalledTimes(0)
        expect(mockEndMonthSelected).toHaveBeenCalledTimes(0)
        expect(mockStartMonthSelected).toHaveBeenCalledTimes(0)

        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)

        // a11y tests
        expect(inputElement).toHaveFocus()
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year' })).toHaveFocus())
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose year' })).toHaveFocus())
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: 'Next year' })).toHaveFocus())
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: 'May 2020' })).toHaveFocus())

        await userEventInstance.click(screen.getByRole('button', { name: 'August 2020' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(screen.getByText('Value: {"year":2020,"month":8}')).toBeVisible()
        expect(mockChange).toHaveBeenCalledTimes(1)
        expect(mockMonthSelected).toHaveBeenCalledTimes(1)
        expect(mockEndMonthSelected).toHaveBeenCalledTimes(0) // only for range mode
        expect(mockStartMonthSelected).toHaveBeenCalledTimes(0)

        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // August 2020
        await waitFor(() => expect(screen.getByRole('button', { name: 'August 2020' })).toHaveFocus())
      })

      it('should able to tab to the selected month and year', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)

        // a11y tests
        expect(inputElement).toHaveFocus()
        await userEventInstance.tab()
        await userEventInstance.tab()
        await userEventInstance.tab()
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: 'May 2020' })).toHaveFocus())

        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await userEventInstance.tab()
        await waitFor(() => expect(screen.getByRole('button', { name: '2020' })).toHaveFocus())

        // change month to August, year to 2024
        await userEventInstance.click(screen.getByRole('button', { name: '2024' }))
        await userEventInstance.click(screen.getByRole('button', { name: 'August 2024' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        expect(screen.getByText('Value: {"year":2024,"month":8}')).toBeVisible()

        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // August 2024
        await waitFor(() => expect(screen.getByRole('button', { name: 'August 2024' })).toHaveFocus())
      })

      it('should close the picker when document is clicked', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible())

        // Close from year view
        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        // Close from month view
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose month' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose year' })).toBeVisible())
        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      })

      it('should close the picker when esc key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)

        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible())

        // Close from year view
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        // Close from month view
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getByRole('button', { name: 'Choose month' })).toBeVisible()
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose month' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Choose year' })).toBeVisible())
        await userEventInstance.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      })
    })

    describe('props', () => {
      describe('minDate', () => {
        it('should disable dates before than provided min prop', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 5 })
              const minDate = { year: 2023, month: 3 }

              return { calendarValue, minDate }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :min-date="minDate"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
          await userEventInstance.click(inputElement)

          await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

          // #region month picker
          // check header states
          expect(screen.getByRole('button', { name: 'Previous year' })).toBeDisabled()
          expect(screen.getByRole('button', { name: 'Choose year' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Next year' })).toBeEnabled()

          // check content states
          // In current year, Jan and Feb should be disabled
          const disabledMonthLabels = [
            'January 2023',
            'February 2023',
          ]
          disabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'true')
          })

          // In current year, min and next months should be enabled
          const enabledMonthLabels = [
            'March 2023',
            'April 2023',
            'May 2023',
            'June 2023',
            'July 2023',
            'August 2023',
            'September 2023',
            'October 2023',
            'November 2023',
            'December 2023',
          ]
          enabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'false')
          })
          // #endregion

          // #region year picker
          await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
          await waitFor(() => expect(screen.getByText('2020 - 2029')).toBeVisible())

          // check header states
          expect(screen.getByRole('button', { name: 'Previous year range' })).toBeDisabled()
          expect(screen.getByRole('button', { name: 'Choose month' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Next year range' })).toBeEnabled()

          // check content states
          // In current range, 2020-2022 should be disabled
          const disabledYearLabels = ['2020', '2021', '2022']
          disabledYearLabels.forEach((year) => {
            expect(screen.getByRole('button', { name: year })).toHaveAttribute('aria-disabled', 'true')
          })

          // In current range, min and next years should be enabled
          const enabledYearLabels = ['2023', '2024', '2025', '2026', '2027', '2028', '2029']
          enabledYearLabels.forEach((year) => {
            expect(screen.getByRole('button', { name: year })).toHaveAttribute('aria-disabled', 'false')
          })
          // #endregion
        })
      })

      describe('maxDate', () => {
        it('should disable dates after than provided max prop', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 3 })
              const maxDate = { year: 2023, month: 3 }

              return { calendarValue, maxDate }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :max-date="maxDate"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
          await userEventInstance.click(inputElement)

          await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

          // #region month picker
          // check header states
          expect(screen.getByRole('button', { name: 'Previous year' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Choose year' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Next year' })).toBeDisabled()

          // check content states
          // In current year, January to March should be enabled
          const enabledMonthLabels = [
            'January 2023',
            'February 2023',
            'March 2023',
          ]
          enabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'false')
          })

          // In current year, max+1 months should be disabled
          const disabledMonthLabels = [
            'April 2023',
            'May 2023',
            'June 2023',
            'July 2023',
            'August 2023',
            'September 2023',
            'October 2023',
            'November 2023',
            'December 2023',
          ]
          disabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'true')
          })
          // #endregion

          // #region year picker
          await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
          await waitFor(() => expect(screen.getByText('2020 - 2029')).toBeVisible())

          // check header states
          expect(screen.getByRole('button', { name: 'Previous year range' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Choose month' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Next year range' })).toBeDisabled()

          // check content states
          // In current range, 2020-2023 should be enabled
          const enabledYearLabels = ['2020', '2021', '2022', '2023']
          enabledYearLabels.forEach((year) => {
            expect(screen.getByRole('button', { name: year })).toHaveAttribute('aria-disabled', 'false')
          })

          // In current range, max+1 years should be disabled
          const disabledYearLabels = ['2024', '2025', '2026', '2027', '2028', '2029']
          disabledYearLabels.forEach((year) => {
            expect(screen.getByRole('button', { name: year })).toHaveAttribute('aria-disabled', 'true')
          })
          // #endregion
        })
      })

      describe('disabledDates', () => {
        it('should disable specified dates', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 5 })
              const disabledDates = [
                { year: 2023, month: 1 },
                { year: 2023, month: 2 },
                { year: 2023, month: 6 },
              ]

              return { calendarValue, disabledDates }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :disabled-dates="disabledDates"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
          await userEventInstance.click(inputElement)

          await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

          // #region month picker
          // check header states
          expect(screen.getByRole('button', { name: 'Previous year' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Choose year' })).toBeEnabled()
          expect(screen.getByRole('button', { name: 'Next year' })).toBeEnabled()

          // check content states
          // Only specified months are disabled
          const disabledMonthLabels = [
            'January 2023',
            'February 2023',
            'June 2023',
          ]
          disabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'true')
          })

          // Others are enabled
          const enabledMonthLabels = [
            'March 2023',
            'April 2023',
            'May 2023',
            'July 2023',
            'August 2023',
            'September 2023',
            'October 2023',
            'November 2023',
            'December 2023',
          ]
          enabledMonthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toHaveAttribute('aria-disabled', 'false')
          })
          // #endregion
        })
      })

      describe('masks', () => {
        it('should display default format in input field if prop is not provided', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 5 })

              return { calendarValue }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('2023-05')
          expect(screen.getByText('Value: {"year":2023,"month":5}')).toBeVisible()
        })

        it('should format value in input field in MMM YYYY', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 5 })
              const masks = { input: 'MMM YYYY' }

              return { calendarValue, masks }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :masks="masks"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('May 2023')
          expect(screen.getByText('Value: {"year":2023,"month":5}')).toBeVisible()
        })

        it('should format value in input field in M YYYY', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 5 })
              const masks = { input: 'M YYYY' }

              return { calendarValue, masks }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :masks="masks"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('5 2023')
          expect(screen.getByText('Value: {"year":2023,"month":5}')).toBeVisible()
        })

        it('should format value in input field in MMMM YY format', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2023, month: 3 })
              const masks = { input: 'MMMM YY' }

              return { calendarValue, masks }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  name="calendarValue"
                  mode="month-year"
                  :masks="masks"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
          expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('March 23')
          expect(screen.getByText('Value: {"year":2023,"month":3}')).toBeVisible()
        })
      })

      describe('locale', () => {
        it('should format the visible labels using the provided locale prop', async () => {
          // ARRANGE
          const ParentComponent = {
            components: { SmCalendar },
            setup: () => {
              const calendarValue = ref({ year: 2025, month: 8 })

              return { calendarValue }
            },
            template: `
              <div>
                <sm-calendar
                  v-model="calendarValue"
                  label="calendar-label"
                  locale="es-ES"
                  name="calendarValue"
                  mode="month-year"
                  :masks="{ input: 'MMMM YYYY' }"
                />
                <span>Value: {{ JSON.stringify(calendarValue) }}</span>
              </div>
            `,
          }

          // ACT
          render(ParentComponent)

          // ASSERT
          const inputElement = await screen.findByRole('textbox', { name: 'calendar-label' })
          expect(inputElement).toHaveDisplayValue('agosto 2025')
          expect(screen.getByText('Value: {"year":2025,"month":8}')).toBeVisible()

          await userEventInstance.click(inputElement)

          // Dropdown content
          const options = await screen.findAllByRole('button', { name: /.* 2025/ })

          expect(options).toHaveLength(12)
          const monthLabels = [
            'enero 2025',
            'febrero 2025',
            'marzo 2025',
            'abril 2025',
            'mayo 2025',
            'junio 2025',
            'julio 2025',
            'agosto 2025',
            'septiembre 2025',
            'octubre 2025',
            'noviembre 2025',
            'diciembre 2025',
          ]

          monthLabels.forEach((month) => {
            expect(screen.getByRole('button', { name: month })).toBeVisible()
          })
        })
      })
    })

    describe('input', () => {
      it('should emit new month and year if the string input can be parsed (mmm yyyy)', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

        // Month names work in Chrome, but not in Safari and Firefox
        await userEventInstance.type(inputElement, 'feb 1999')
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('feb 1999'))
        await waitFor(() => expect(screen.getByText('Value: {"year":1999,"month":2}')).toBeVisible())

        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('1999-02'))
        expect(screen.getByText('Value: {"year":1999,"month":2}')).toBeVisible()
      })

      it('should emit new month and year if the string input can be parsed (yyyy-m)', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

        // Safari and Firefox cannot parse slash, dot and space separators,
        // but we are attempting to replace separators to make sense of it
        await userEventInstance.type(inputElement, '1735-8')
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('1735-8'))
        await waitFor(() => expect(screen.getByText('Value: {"year":1735,"month":8}')).toBeVisible())

        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('1735-08'))
        expect(screen.getByText('Value: {"year":1735,"month":8}')).toBeVisible()
      })

      it('should emit new month and year if the string input can be parsed (mm/yyyy)', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

        // Month first string can't be parsed by Date API, but we are
        // but we are attempting to replace separators and reorder to make sense of it
        await userEventInstance.type(inputElement, '11/2012')
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('11/2012'))
        await waitFor(() => expect(screen.getByText('Value: {"year":2012,"month":11}')).toBeVisible())

        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('2012-11'))
        expect(screen.getByText('Value: {"year":2012,"month":11}')).toBeVisible()
      })

      it('should emit null if the string input can be parsed', async () => {
        // ARRANGE
        const mockChange = jest.fn()

        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue, mockChange }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
                @change="mockChange"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())

        await userEventInstance.type(inputElement, 'invalid')
        jest.runOnlyPendingTimers() // wait for debounce

        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue('invalid'))
        await waitFor(() => expect(screen.getByText('Value:')).toBeVisible())

        await userEventInstance.click(document.body)
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toHaveDisplayValue(''))
        expect(screen.getByText('Value:')).toBeVisible()
        expect(mockChange).toHaveBeenCalledTimes(1)
        expect(mockChange).toHaveBeenCalledWith(null)
      })
    })

    describe('range', () => {
      it('should update start and end fields when a month and year is selected', async () => {
        // ARRANGE
        const mockChange = jest.fn()
        const mockMonthSelected = jest.fn()
        const mockEndMonthSelected = jest.fn()
        const mockStartMonthSelected = jest.fn()
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref()

            return { calendarValue, mockChange, mockMonthSelected, mockEndMonthSelected, mockStartMonthSelected }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
                :is-range="true"
                @change="mockChange"
                @month-selected="mockMonthSelected"
                @start-month-selected="mockStartMonthSelected"
                @end-month-selected="mockEndMonthSelected"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getAllByLabelText('calendar-label')[0]).toBeVisible())
        expect(mockChange).toHaveBeenCalledTimes(0)
        expect(mockMonthSelected).toHaveBeenCalledTimes(0)
        expect(mockEndMonthSelected).toHaveBeenCalledTimes(0)
        expect(mockStartMonthSelected).toHaveBeenCalledTimes(0)

        // Select start range
        const startInputElement = screen.getAllByRole('textbox', { name: 'calendar-label' })[0]
        await userEventInstance.click(startInputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)

        await userEventInstance.click(screen.getByRole('button', { name: 'March 2020' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getAllByLabelText('calendar-label')[0]).toHaveDisplayValue('2020-03'))
        expect(screen.getByText('Value: {"start":{"year":2020,"month":3},"end":null}')).toBeVisible()
        expect(mockChange).toHaveBeenCalledTimes(1)
        expect(mockMonthSelected).toHaveBeenCalledTimes(0) // only for single mode
        expect(mockEndMonthSelected).toHaveBeenCalledTimes(0)
        expect(mockStartMonthSelected).toHaveBeenCalledTimes(1)

        // Select end range
        const endInputElement = screen.getAllByRole('textbox', { name: 'calendar-label' })[1]
        await userEventInstance.click(endInputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)

        await userEventInstance.click(screen.getByRole('button', { name: 'June 2020' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getAllByLabelText('calendar-label')[1]).toHaveDisplayValue('2020-06'))
        expect(screen.getByText('Value: {"start":{"year":2020,"month":3},"end":{"year":2020,"month":6}}')).toBeVisible()
        expect(mockChange).toHaveBeenCalledTimes(2)
        expect(mockMonthSelected).toHaveBeenCalledTimes(0) // only for single mode
        expect(mockEndMonthSelected).toHaveBeenCalledTimes(1)
        expect(mockStartMonthSelected).toHaveBeenCalledTimes(1)
      })

      it('should reorder the start and end values if needed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({
              start: { month: 3, year: 2022 },
              end: { month: 6, year: 2022 },
            })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
                :is-range="true"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getAllByLabelText('calendar-label')[0]).toBeVisible())
        expect(screen.getAllByLabelText('calendar-label')[0]).toHaveDisplayValue('2022-03')
        expect(screen.getAllByLabelText('calendar-label')[1]).toHaveDisplayValue('2022-06')
        expect(screen.getByText('Value: {"start":{"month":3,"year":2022},"end":{"month":6,"year":2022}}')).toBeVisible()

        // Select start range
        const startInputElement = screen.getAllByRole('textbox', { name: 'calendar-label' })[0]
        await userEventInstance.click(startInputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        expect(screen.getAllByRole('button', { name: /.* 2022/ })).toHaveLength(12)

        await userEventInstance.click(screen.getByRole('button', { name: 'December 2022' }))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
        await waitFor(() => expect(screen.getAllByLabelText('calendar-label')[0]).toHaveDisplayValue('2022-06'))
        expect(screen.getAllByLabelText('calendar-label')[1]).toHaveDisplayValue('2022-12')
        expect(screen.getByText('Value: {"start":{"month":6,"year":2022},"end":{"year":2022,"month":12}}')).toBeVisible()
      })
    })

    it('should validate the value when rules prop is configured', async () => {
      // ARRANGE
      const ParentComponent = {
        components: { SmCalendar },
        setup: () => {
          const calendarValue = ref()

          return { calendarValue }
        },
        template: `
          <div>
            <sm-calendar
              v-model="calendarValue"
              label="calendar-label"
              name="calendarValue"
              mode="month-year"
              rules="required"
            />
            <span>Value: {{ JSON.stringify(calendarValue) }}</span>
          </div>
        `,
      }

      // ACT
      render(ParentComponent)

      // ASSERT
      await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
      const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
      expect(inputElement).toBeValid()
      expect(inputElement).not.toHaveAccessibleErrorMessage('This is a custom required field message')

      // Trigger validation error by focusing then blurring out of the field
      await userEventInstance.click(inputElement)
      await userEventInstance.click(document.body)

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(inputElement).toBeInvalid()
      expect(inputElement).toHaveAccessibleErrorMessage('This is a custom required field message')

      // Fill in the field to clear the error
      // Month names work in Chrome, but not in Safari and Firefox
      await userEventInstance.click(inputElement)
      await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
      await userEventInstance.click(screen.getByRole('button', { name: 'March 2020' }))

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(screen.getByText('Value: {"year":2020,"month":3}')).toBeVisible()
      expect(inputElement).toBeValid()
      expect(inputElement).not.toHaveAccessibleErrorMessage('This is a custom required field message')

      // Delete the value to trigger the error again
      await userEventInstance.clear(inputElement)
      await userEventInstance.click(document.body)

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
      expect(inputElement).toBeInvalid()
      expect(inputElement).toHaveAccessibleErrorMessage('This is a custom required field message')
    })
  })

  describe('keyboard controls', () => {
    describe('month view', () => {
      it('should add one month when right arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 11 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'November 2021' })).toHaveFocus())

        // Move one month
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowRight}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'December 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'November 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":11}')).toBeVisible()

        // Move one month to the next year
        await userEventInstance.keyboard('{ArrowRight}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2022' })).toHaveFocus())
        await waitFor(() => expect(screen.queryByRole('button', { name: 'December 2021' })).not.toBeInTheDocument())
        expect(screen.getAllByRole('button', { name: /.* 2022/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":11}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract one month when left arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 2 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'February 2021' })).toHaveFocus())

        // Move one month
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowLeft}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'February 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":2}')).toBeVisible()

        // Move one month to the previous year
        await userEventInstance.keyboard('{ArrowLeft}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'December 2020' })).toHaveFocus())
        await waitFor(() => expect(screen.queryByRole('button', { name: 'February 2021' })).not.toBeInTheDocument())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":2}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should add four months when down arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 6 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'June 2021' })).toHaveFocus())

        // Move four months
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'October 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'June 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":6}')).toBeVisible()

        // Move four months to next year
        await userEventInstance.keyboard('{ArrowDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'February 2022' })).toHaveFocus())
        await waitFor(() => expect(screen.queryByRole('button', { name: 'October 2021' })).not.toBeInTheDocument())
        expect(screen.getAllByRole('button', { name: /.* 2022/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":6}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract four months when up arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2021' })).toHaveFocus())

        // Move four months
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'March 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'July 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Move four months to previous year
        await userEventInstance.keyboard('{ArrowUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'November 2020' })).toHaveFocus())
        await waitFor(() => expect(screen.queryByRole('button', { name: 'March 2021' })).not.toBeInTheDocument())
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should add twelve months when page down key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2021' })).toHaveFocus())

        // Move a year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{PageDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2022' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'July 2021' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2022/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Move another year
        await userEventInstance.keyboard('{PageDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2023' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'July 2022' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2023/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract twelve months when page up key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2021' })).toHaveFocus())

        // Move a year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{PageUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2020' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'July 2021' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Move another year
        await userEventInstance.keyboard('{PageUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2019' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'July 2020' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2019/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should go to first month if home key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2021' })).toHaveFocus())

        // Move a year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{Home}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'July 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Move to previous year
        await userEventInstance.keyboard('{Home}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2020' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'January 2021' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2020/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should go to last month if end key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'July 2021' })).toHaveFocus())

        // Move a year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{End}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'December 2021' })).toHaveFocus())
        expect(screen.getByRole('button', { name: 'July 2021' })).not.toHaveFocus()
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Move to next year
        await userEventInstance.keyboard('{End}')
        await waitFor(() => expect(screen.getByRole('button', { name: 'December 2022' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: 'December 2021' })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /.* 2022/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should do nothing if unsupported key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 1 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        const inputElement = screen.getByRole('textbox', { name: 'calendar-label' })
        await userEventInstance.click(inputElement)
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.tab() // previous year
        await userEventInstance.tab() // choose year
        await userEventInstance.tab() // next year
        await userEventInstance.tab() // active month
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2021' })).toHaveFocus())

        await userEventInstance.keyboard('hello')
        await waitFor(() => expect(screen.getByRole('button', { name: 'January 2021' })).toHaveFocus())
        expect(screen.getAllByRole('button', { name: /.* 2021/ })).toHaveLength(12)
        expect(screen.getByText('Value: {"year":2021,"month":1}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })
    })

    describe('year view', () => {
      it('should add one year when right arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2028, month: 11 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2028' })).toHaveFocus())

        // Move one year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowRight}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2029' })).toHaveFocus())
        expect(screen.getByRole('button', { name: '2028' })).not.toHaveFocus()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2028,"month":11}')).toBeVisible()

        // Move one year to the next range
        await userEventInstance.keyboard('{ArrowRight}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2030' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2029' })).not.toBeInTheDocument()
        expect(screen.getByText('2030 - 2039')).toBeVisible()
        expect(screen.getByText('Value: {"year":2028,"month":11}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract one year when left arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 2 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2021' })).toHaveFocus())

        // Move one year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowLeft}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2020' })).toHaveFocus())
        expect(screen.getByRole('button', { name: '2021' })).not.toHaveFocus()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2021,"month":2}')).toBeVisible()

        // Move one year to previous range
        await userEventInstance.keyboard('{ArrowLeft}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2019' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2029' })).not.toBeInTheDocument()
        expect(screen.getByText('2010 - 2019')).toBeVisible()
        expect(screen.getByText('Value: {"year":2021,"month":2}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should add four years when down arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2025, month: 6 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2025' })).toHaveFocus())

        // Move four years
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2029' })).toHaveFocus())
        expect(screen.getByRole('button', { name: '2025' })).not.toHaveFocus()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2025,"month":6}')).toBeVisible()

        // Move four years to next range
        await userEventInstance.keyboard('{ArrowDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2033' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2029' })).not.toBeInTheDocument()
        expect(screen.getByText('2030 - 2039')).toBeVisible()
        expect(screen.getByText('Value: {"year":2025,"month":6}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract four years when up arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2035, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2035' })).toHaveFocus())

        // Move four years
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{ArrowUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2031' })).toHaveFocus())
        expect(screen.getByRole('button', { name: '2035' })).not.toHaveFocus()
        expect(screen.getByText('2030 - 2039')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Move four years to previous range
        await userEventInstance.keyboard('{ArrowUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2027' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2031' })).not.toBeInTheDocument()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should add ten years when page down key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2035, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2035' })).toHaveFocus())

        // Move ten years
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{PageDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2045' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2035' })).not.toBeInTheDocument()
        expect(screen.getByText('2040 - 2049')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Move ten years to next range
        await userEventInstance.keyboard('{PageDown}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2055' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2045' })).not.toBeInTheDocument()
        expect(screen.getByText('2050 - 2059')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should subtract ten years when page up arrow key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2035, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2035' })).toHaveFocus())

        // Move ten years
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{PageUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2025' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2035' })).not.toBeInTheDocument()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Move ten years to previous range
        await userEventInstance.keyboard('{PageUp}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2015' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2025' })).not.toBeInTheDocument()
        expect(screen.getByText('2010 - 2019')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should go to first year of range when home key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2035, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2035' })).toHaveFocus())

        // Move year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{Home}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2030' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2035' })).not.toHaveFocus()
        expect(screen.getByText('2030 - 2039')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Move previous range
        await userEventInstance.keyboard('{Home}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2020' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2030' })).not.toBeInTheDocument()
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should go to last year of range when end key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2035, month: 7 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2035' })).toHaveFocus())

        // Move year
        // see full keyboard map: https://github.com/testing-library/user-event/blob/main/src/keyboard/keyMap.ts
        await userEventInstance.keyboard('{End}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2039' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2035' })).not.toHaveFocus()
        expect(screen.getByText('2030 - 2039')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Move next range
        await userEventInstance.keyboard('{End}')
        await waitFor(() => expect(screen.getByRole('button', { name: '2049' })).toHaveFocus())
        expect(screen.queryByRole('button', { name: '2039' })).not.toBeInTheDocument()
        expect(screen.getByText('2040 - 2049')).toBeVisible()
        expect(screen.getByText('Value: {"year":2035,"month":7}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })

      it('should do nothing if unsupported key is pressed', async () => {
        // ARRANGE
        const ParentComponent = {
          components: { SmCalendar },
          setup: () => {
            const calendarValue = ref({ year: 2021, month: 1 })

            return { calendarValue }
          },
          template: `
            <div>
              <sm-calendar
                v-model="calendarValue"
                label="calendar-label"
                name="calendarValue"
                mode="month-year"
              />
              <span>Value: {{ JSON.stringify(calendarValue) }}</span>
            </div>
          `,
        }

        // ACT
        render(ParentComponent)

        // ASSERT
        await waitFor(() => expect(screen.getByLabelText('calendar-label')).toBeVisible())
        await userEventInstance.click(screen.getByRole('textbox', { name: 'calendar-label' }))
        await waitFor(() => expect(screen.getByRole('dialog')).toBeVisible())
        await userEventInstance.click(screen.getByRole('button', { name: 'Choose year' }))
        await waitFor(() => expect(screen.getByRole('button', { name: 'Previous year range' })).toBeVisible())
        await userEventInstance.tab() // active year
        await waitFor(() => expect(screen.getByRole('button', { name: '2021' })).toHaveFocus())

        await userEventInstance.keyboard('hello')
        await waitFor(() => expect(screen.getByRole('button', { name: '2021' })).toHaveFocus())
        expect(screen.getByText('2020 - 2029')).toBeVisible()
        expect(screen.getByText('Value: {"year":2021,"month":1}')).toBeVisible()

        // Keyboard nav should keep the popover open
        expect(screen.getByRole('dialog')).toBeVisible()
      })
    })
  })

})
