import { Component, Inject, Input, type OnInit } from '@angular/core'
import { BehaviorSubject, type Observable, take, tap } from 'rxjs'
import { type IComment } from './IComment'
import { GetCommentsService } from './get-comments.service'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type DataCountAndLimit } from './DataCountAndLimit'

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DateAgoPipe, CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() postId: number = 0
  private readonly commentsSubject = new BehaviorSubject<
  DataCountAndLimit<IComment>
  >({
    data: [],
    count: 0,
    pages: 0
  })

  comments$: Observable<DataCountAndLimit<IComment>> =
    this.commentsSubject.asObservable()

  page: number = 1

  constructor (
    @Inject(GetCommentsService)
    private readonly getCommentsService: GetCommentsService
  ) {}

  ngOnInit (): void {
    this.loadComments(1)
  }

  private loadComments (page: number): void {
    this.getCommentsService
      .getComments(this.postId, page, 5)
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
    this.loadComments(this.page)
  }
}
