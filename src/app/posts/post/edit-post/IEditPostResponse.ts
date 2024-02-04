import { type IImage } from 'app/posts/IPost'

export interface IEditPostResponse {
  newContent?: string | null
  newImages: IImage[] | null
  removedImages?: string[] | null
}
