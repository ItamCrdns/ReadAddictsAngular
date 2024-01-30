import { type Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { PostComponent } from './posts/post/post.component'
import { UserComponent } from './user/user.component'
import { ReadersComponent } from './readers/readers.component'
import { UserPostsComponent } from './user/user-posts/user-posts.component'
import { UserCommentsComponent } from './user/user-comments/user-comments.component'
import { GroupsComponent } from './groups/groups.component'
import { LoginComponent } from './user/login/login.component'
import { CommentComponent } from './comments/comment/comment.component'
import { ReplyComponent } from './comments/comment/reply/reply.component'
import { GroupComponent } from './groups/group/group.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'post/:postId',
    component: PostComponent,
    children: [
      {
        path: 'comment/:commentId',
        component: CommentComponent,
        children: [
          {
            path: 'reply',
            component: ReplyComponent
          }
        ]
      }
    ]
  },
  {
    path: 'user/:username',
    component: UserComponent,
    children: [
      { path: 'posts', component: UserPostsComponent },
      { path: 'comments', component: UserCommentsComponent }
    ]
  },
  { path: 'users', component: ReadersComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'group/:groupId', component: GroupComponent },
  { path: '**', redirectTo: '' }
]
