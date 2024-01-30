import { Component } from '@angular/core'
import { PostsComponent } from '../posts/posts.component'
import { NewPostComponent } from 'app/posts/new-post/new-post.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NewPostComponent, PostsComponent],
  template: `
    <div class="new-post-posts-wrapper">
      <app-new-post />
      <app-posts />
    </div>
  `,
  styles: `
  .new-post-posts-wrapper {
    margin-top: 2rem
  }
  `
})
export class HomeComponent {}
