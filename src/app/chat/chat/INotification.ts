export interface INotification {
  userId: string
  message: string
}

export const notificationInitialState: INotification[] = [{
  userId: '',
  message: ''
}]
