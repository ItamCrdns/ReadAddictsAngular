import { type Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { PostComponent } from './post/post.component'
import { UserComponent } from './user/user.component'
import { CommentComponent } from './comment/comment.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'post/:id',
    component: PostComponent,
    children: [{ path: 'comment/:id', component: CommentComponent }]
  },
  { path: 'user/:username', component: UserComponent },
  { path: '**', redirectTo: '' }
]
