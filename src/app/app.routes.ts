import { type Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { PostComponent } from './post/post.component'
import { UserComponent } from './user/user.component'
import { CommentComponent } from './comment/comment.component'
import { ReplyComponent } from './comment/reply/reply.component'

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
  { path: 'user/:username', component: UserComponent },
  { path: '**', redirectTo: '' }
]
