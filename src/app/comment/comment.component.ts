import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GetCommentService } from './get-comment.service'
import { Observable, Subscription } from 'rxjs'
import { type IComment } from '../comments/IComment'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { RecursiveCommentComponent } from './recursive-comment/recursive-comment.component'
import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, RecursiveCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: '../comments/comments.component.scss'
})
export class CommentComponent implements OnInit, OnDestroy {
  comment$: Observable<IComment[]> = new Observable<IComment[]>()
  commentIdSub: Subscription = new Subscription()
  commentSub: Subscription = new Subscription()

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(GetCommentService)
    private readonly getCommentService: GetCommentService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  ngOnInit (): void {
    this.commentIdSub = this.route.params.subscribe((params) => {
      const id = +params['commentId']

      if (!isNaN(id) && id > 0) {
        this.comment$ = this.getCommentService.getComment(id)
      } else {
        // * if user tries to access a comment with an invalid id
        this.alertService.setAlertValues(
          true,
          'Something went wrong. Please try again later.'
        )
        this.router
          .navigate(['/post', this.route.snapshot.parent?.params['postId']])
          .catch((err) => {
            console.error('Error while redirecting', err)
          })
      }
    })

    this.commentSub = this.comment$.subscribe({
      error: (err) => {
        this.alertService.setAlertValues(
          true,
          'Sorry, we could not find the comment you were looking for.'
        )
        this.router
          .navigate(['/post', this.route.snapshot.parent?.params['postId']])
          .catch((err) => {
            console.error('Error while redirecting', err)
          })
        if (err.status === 404) {
          this.router
            .navigate(['/post', this.route.snapshot.parent?.params['postId']])
            .catch((err) => {
              console.error('Error while redirecting', err)
            })
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.commentIdSub.unsubscribe()
    this.commentSub.unsubscribe()
  }
}
