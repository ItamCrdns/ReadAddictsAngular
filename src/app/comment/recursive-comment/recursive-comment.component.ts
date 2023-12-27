import { Component, Input } from '@angular/core'
import { type IComment } from '../../comments/IComment'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentUiComponent } from '../comment-ui/comment-ui.component'

@Component({
  selector: 'app-recursive-comment',
  standalone: true,
  imports: [
    DateAgoPipe,
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    CommentUiComponent
  ],
  templateUrl: './recursive-comment.component.html',
  styles: `
      .child-comment {
        padding-top: 1rem;
        margin-left: 2rem;
        border-left: 3px solid whitesmoke;
        padding-left: 1rem;
      }
    `
})
export class RecursiveCommentComponent {
  @Input() comment: Partial<IComment> = {}
}
