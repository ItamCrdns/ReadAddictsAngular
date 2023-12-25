export interface IComment {
  comment_Id: number
  user_Id: number
  post_Id: number
  parent_Comment_Id: number | null
  content: string
  created: string
  modified: string
  anonymous: boolean
  author: string
  profile_Picture: string
  replies: number
  childComments: IComment[] | null
}
