import { type Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { PostComponent } from './post/post.component'
import { UserComponent } from './user/user.component'
import { CommentComponent } from './comment/comment.component'
import { ReplyComponent } from './comment/reply/reply.component'
import { ReadersComponent } from './readers/readers.component'
import { UserPostsComponent } from './user/user-posts/user-posts.component'
import { UserCommentsComponent } from './user/user-comments/user-comments.component'

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
  { path: '**', redirectTo: '' }
]
