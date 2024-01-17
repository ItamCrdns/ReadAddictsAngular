import { type IComment } from '../comments/IComment'
import { type IUser } from '../login/IUser'

interface IImage {
  id: string
  postId: string
  userId: string
  url: string
  cloudinaryPublicId: string
  created: string
}

// interface IGroup {
//   id: string
//   name: string
//   description: string
//   creatorId: string
//   picture: string
//   created: string
// }

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
