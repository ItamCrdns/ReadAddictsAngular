import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgOptimizedImage } from '@angular/common'
import { DateAgoPipe } from 'app/pipes/date-ago.pipe'
import { type IComment } from 'app/comments/IComment'

@Component({
  selector: 'app-comment-ui',
  standalone: true,
  imports: [DateAgoPipe, RouterLink, NgOptimizedImage],
  template: `
    <article class="comment">
      <header>
        <img
          ngSrc="{{ comment.user?.profilePicture }}"
          alt="{{ comment.user?.userName }}"
          width="30"
          height="30"
        />
        <h1>
          <a [routerLink]="['/user', comment.user?.userName]">{{
            comment.user?.userName
          }}</a>
        </h1>
        <h2>{{ '@' }}{{ comment.user?.userName }}</h2>
        <p>{{ comment.created || '' | dateAgo }}</p>
      </header>
      <p>{{ comment.content }}</p>
    </article>
    <div class="replies">
      @if (comment.replyCount !== undefined && comment.replyCount > 0) {
      <a [routerLink]="['/post', comment.postId, 'comment', comment.id]">{{
        comment.replyCount > 1
          ? comment.replyCount + ' users replied'
          : comment.replyCount + ' user replied'
      }}</a>
      <span>·</span>
      }
      <a
        [routerLink]="['/post', comment.postId, 'comment', comment.id, 'reply']"
        >Reply</a
      >
    </div>
  `,
  styleUrl: '../../../comments/comments.component.scss'
})
export class CommentUiComponent {
  @Input() comment: Partial<IComment> = {}
}
