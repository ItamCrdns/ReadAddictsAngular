import { userInitialState, type IUser } from 'app/user/login/IUser'
import { type IPost } from '../posts/IPost'

export interface IGroup {
  id: string
  name: string
  description?: string
  creatorId: string
  picture: string
  created: string
  users: IUser[]
  creator: IUser
  posts: IPost[]
  membersCount: number
  isMember?: boolean
}

export const groupInitialState: IGroup = {
  id: '',
  name: '',
  description: '',
  creatorId: '',
  picture: '',
  created: '',
  users: [],
  creator: userInitialState,
  posts: [],
  membersCount: 0,
  isMember: false
}
