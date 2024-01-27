import {
  Component,
  Inject,
  Input,
  type OnDestroy,
  type OnInit
} from '@angular/core'
import {
  BehaviorSubject,
  type Observable,
  take,
  tap,
  Subscription
} from 'rxjs'
import { type IComment } from './IComment'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { CommentUiComponent } from './comment/comment-ui/comment-ui.component'

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    DateAgoPipe,
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    CommentUiComponent
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() postId: string = ''
  private readonly commentsSubject = new BehaviorSubject<
  DataCountPagesDto<IComment>
  >({
    data: [],
    count: 0,
    pages: 0
  })

  comments$: Observable<DataCountPagesDto<IComment>> =
    this.commentsSubject.asObservable()

  page: number = 1
  sub: Subscription = new Subscription()

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService
  ) {
    this.sub = this.route.queryParams.subscribe((params) => {
      const pageParam: number = params['page']

      if (!isNaN(pageParam) && pageParam > 0) {
        this.page = pageParam
      } else {
        this.page = 1
      }
    })
  }

  ngOnInit (): void {
    const commentsToShow = Math.ceil(this.page * 5)
    this.loadComments(1, commentsToShow)
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }

  private loadComments (page: number, limit: number = 5): void {
    this.getEntityService
      .getComments(this.postId, page, limit)
      .pipe(
        take(1),
        tap((newComments) => {
          const oldComments = this.commentsSubject.getValue()

          const newCommentsSubject = {
            data: [...oldComments.data, ...newComments.data],
            count: newComments.count,
            pages: Math.ceil(
              (oldComments.data.length + newComments.data.length) / 5
            )
          }

          this.commentsSubject.next(newCommentsSubject)
        })
      )
      .subscribe()
  }

  loadMoreComments (): void {
    this.page++
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.page }
      })
      .catch((err) => {
        console.error('Error while navigating to page', err)
      })
    this.loadComments(this.page)
  }
}
