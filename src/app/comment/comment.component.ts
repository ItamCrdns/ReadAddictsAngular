import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GetCommentService } from './get-comment.service'
import { Subscription } from 'rxjs'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { RecursiveCommentComponent } from './recursive-comment/recursive-comment.component'
import { AlertService } from '../alert/alert.service'
import { type IComment } from '../comments/IComment'

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, RecursiveCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: '../comments/comments.component.scss'
})
export class CommentComponent implements OnInit, OnDestroy {
  commentIdSub: Subscription = new Subscription()
  commentSub: Subscription = new Subscription()
  comment: IComment = {
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

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(GetCommentService)
    private readonly getCommentService: GetCommentService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  ngOnInit (): void {
    this.commentIdSub = this.route.params.subscribe((params) => {
      const id = params['commentId'] as string

      this.commentSub = this.getCommentService.getComment(id).subscribe({
        next: (res) => {
          console.log(res)
          this.comment = res
        },
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
    })
  }

  ngOnDestroy (): void {
    this.commentIdSub.unsubscribe()
    this.commentSub.unsubscribe()
  }
}
