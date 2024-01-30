import { NgOptimizedImage } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DateAgoPipe } from 'app/pipes/date-ago.pipe'
import { type IPost } from 'app/posts/IPost'

@Component({
  selector: 'app-post-showcase',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, RouterLink],
  template: `
    <section class="posts-wrapper">
      <article class="post">
        <header class="title-wrapper">
          <img
            [ngSrc]="post.creator.profilePicture"
            alt="{{ post.creator.userName }}"
            width="50"
            height="50"
          />
          <h1>
            <a [routerLink]="['/user', post.creator.userName]">
              {{ post.creator.userName }}
            </a>
          </h1>
          <p>{{ post.created | dateAgo }}</p>
        </header>
        <a [routerLink]="['/post', post.id]">{{ post.content }}</a>
        <div class="image-wrapper">
          @if (post.images.length > 0) { @for (image of post.images; track
          image.id) {
          <img
            [ngSrc]="image.url"
            [alt]="image.id"
            width="100"
            height="100"
            priority="true"
          />
          } } @if (post.imageCount > 5) {
          <div class="moreimages">
            <a [routerLink]="['/post', post.id]">+{{ post.imageCount - 5 }}</a>
          </div>
          }
        </div>
        <div class="button-wrapper">
          @if (post.commentCount > 0) {
          <button>{{ post.commentCount }} comments</button>
          } @else {
          <button>Leave a comment</button>
          }
        </div>
      </article>
    </section>
  `,
  styleUrl: '../posts/posts.component.scss'
})
export class PostShowcaseComponent {
  @Input() post!: IPost
}
