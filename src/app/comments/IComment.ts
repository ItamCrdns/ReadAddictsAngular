import { type IUser } from '../login/IUser'

export interface IComment {
  id: string
  userId: string
  postId: string
  parentId: string
  content: string
  created: string
  modified: string
  user: Partial<IUser>
  replyCount: number
  children: IComment[]
}
