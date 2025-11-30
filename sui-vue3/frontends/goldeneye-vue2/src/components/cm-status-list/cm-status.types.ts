export enum CmStatusTypes {
  ALERT = 'alert',
  WARNING = 'warning',
}

export interface CmStatus {
  id: number
  name: string
  description: string
  status: CmStatusTypes
}
