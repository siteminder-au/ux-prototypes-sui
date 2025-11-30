export interface SmNotificationListItem {
  id: string
  title: string
  status: SmNotificationListItemStatus // This will indicate the dot behavior
  statusDisabled?: boolean
  description?: string
  timestamp?: Date | string
  messageLabel?: string
  propertyLabel?: string
  titleTag?: string
  isActionable?: boolean
}

export enum SmNotificationListItemStatus {
  READ = 'read',
  UNREAD = 'unread',
}

export interface SmNotificationListHeaderConfig {
  edgeToEdge?: boolean
}

export interface ShowUnreadOnlyConfig {
  key?: string
  label?: string
  disabled?: boolean
  defaultToggleValue?: boolean
}
