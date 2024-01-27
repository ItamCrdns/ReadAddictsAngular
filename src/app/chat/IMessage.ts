import { type IUser } from 'app/user/login/IUser'

export interface IMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  sender: IUser
  receiver: IUser
}
