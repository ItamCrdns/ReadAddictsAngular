import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { NewPostComponent } from './new-post/new-post.component'
import { PostsComponent } from './posts/posts.component'
import { NavbarComponent } from './navbar/navbar.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    NewPostComponent,
    PostsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
