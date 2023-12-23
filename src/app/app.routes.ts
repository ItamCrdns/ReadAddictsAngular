import { type Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'
import { PostComponent } from './post/post.component'
import { UserComponent } from './user/user.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'user/:username', component: UserComponent },
  { path: '**', redirectTo: '' }
]
