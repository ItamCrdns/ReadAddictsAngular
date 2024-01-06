export interface IMessage {
  sender_User_Id: number
  sender_Username: string
  sender_Profile_Picture: string
  receiver_User_Id: number
  receiver_Username: string
  receiver_Profile_Picture: string
  message_Id: number
  sender: number
  receiver: number
  content: string
  timestamp: Date
  is_Read: boolean
}
