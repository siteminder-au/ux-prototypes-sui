import { InjectionKey, Ref, WritableComputedRef } from 'vue'

export interface SmWizardStepState {
  controlId: string
  label?: string
  order: number
  panelId: string
  stepId: string
  stepperButtonAttrs?: Record<string, any>
}

export const WizardProviderKey: InjectionKey<{
  activeStep: WritableComputedRef<number>
  activeStepId: WritableComputedRef<string | undefined>
  steps: Ref<SmWizardStepState[]>
  addStep: (step: SmWizardStepState) => void
  toggleOverlay: (stepId: string, showOverlay: boolean) => void
}> = Symbol('wizardProvider')
