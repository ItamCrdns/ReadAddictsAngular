import { Component } from '@angular/core'
import { NewPostComponent } from '../new-post/new-post.component'
import { PostsComponent } from '../posts/posts.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewPostComponent, PostsComponent],
  template: `
    <app-new-post />
    <app-posts />
  `,
  styles: ''
})
export class HomeComponent {}
