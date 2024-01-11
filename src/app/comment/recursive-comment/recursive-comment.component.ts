import {
  Component,
  Inject,
  Input,
  type OnDestroy,
  type OnInit
} from '@angular/core'
import { type IComment } from '../../comments/IComment'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentUiComponent } from '../comment-ui/comment-ui.component'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-recursive-comment',
  standalone: true,
  imports: [
    DateAgoPipe,
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    CommentUiComponent,
    RouterOutlet
  ],
  templateUrl: './recursive-comment.component.html',
  styles: `
      .child-comment {
        padding-top: 1rem;
        margin-left: 1rem;
        border-left: 3px solid whitesmoke;
        padding-left: 1rem;
      }
    `
})
export class RecursiveCommentComponent implements OnInit, OnDestroy {
  @Input() comment: IComment = {
    id: '',
    userId: '',
    postId: '',
    parentId: '',
    content: '',
    created: '',
    modified: '',
    user: {
      id: '',
      userName: '',
      profilePicture: ''
    },
    replyCount: 0,
    children: []
  }

  paramsCommentId: string = ''
  sub: Subscription = new Subscription()

  constructor (@Inject(ActivatedRoute) private readonly route: ActivatedRoute) {}

  ngOnInit (): void {
    // i tried passing it as props but didnt work. so i had to use the route
    this.sub = this.route.params.subscribe((params) => {
      this.paramsCommentId = params['commentId']
    })
  }

  ngOnDestroy (): void {
    this.paramsCommentId = ''
    this.sub.unsubscribe()
  }
}
