import { type IUser } from 'app/user/login/IUser'
import { type IComment } from '../comments/IComment'

interface IImage {
  id: string
  postId: string
  userId: string
  url: string
  cloudinaryPublicId: string
  created: string
}

export interface IPost {
  id: string
  userId: string
  created: string
  content: string
  modified: string
  groupId: string
  creator: IUser
  images: IImage[]
  comments: IComment[]
  commentCount: number
  imageCount: number
}
