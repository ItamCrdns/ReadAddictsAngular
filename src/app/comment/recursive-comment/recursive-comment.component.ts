import {
  Component,
  Inject,
  Input,
  type OnDestroy,
  type OnInit
} from '@angular/core'
import { type IComment } from '../../comments/IComment'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentUiComponent } from '../comment-ui/comment-ui.component'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-recursive-comment',
  standalone: true,
  imports: [
    DateAgoPipe,
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    CommentUiComponent,
    RouterOutlet
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
export class RecursiveCommentComponent implements OnInit, OnDestroy {
  @Input() comment: Partial<IComment> = {}
  paramsCommentId: number = 0
  sub: Subscription = new Subscription()

  constructor (@Inject(ActivatedRoute) private readonly route: ActivatedRoute) {}

  ngOnInit (): void {
    // i tried passing it as props but didnt work. so i had to use the route
    this.sub = this.route.params.subscribe((params) => {
      this.paramsCommentId = +params['id']
    })
  }

  ngOnDestroy (): void {
    this.paramsCommentId = 0
    this.sub.unsubscribe()
  }
}
