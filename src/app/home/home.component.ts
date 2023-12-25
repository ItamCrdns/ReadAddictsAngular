import { Component } from '@angular/core'
import { NewPostComponent } from '../new-post/new-post.component'
import { PostsComponent } from '../posts/posts.component'

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
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem
  }
  `
})
export class HomeComponent {}
