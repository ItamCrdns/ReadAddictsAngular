import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { type IComment } from '../../comments/IComment'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-comment-ui',
  standalone: true,
  imports: [DateAgoPipe, RouterLink, NgOptimizedImage],
  template: `
    <article class="comment">
      <header>
        <img
          ngSrc="{{ comment.profile_Picture }}"
          alt="{{ comment.author }}"
          width="30"
          height="30"
        />
        <h1>
          <a [routerLink]="['/user', comment.author]">{{ comment.author }}</a>
        </h1>
        <h2>{{ '@' }}{{ comment.author }}</h2>
        <p>{{ comment.created || '' | dateAgo }}</p>
      </header>
      <p>{{ comment.content }}</p>
    </article>
    <div class="replies">
      @if (comment.replies ?? 0 > 0) {
      <a
        [routerLink]="['/post', comment.post_Id, 'comment', comment.comment_Id]"
        >Replies</a
      >
      <span>·</span>
      }
      <p>Leave a reply</p>
    </div>
  `,
  styleUrl: '../../comments/comments.component.scss'
})
export class CommentUiComponent {
  @Input() comment: Partial<IComment> = {}
}
