import {
  Component,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy
} from '@angular/core'
import { InputComponent } from '../../input/input.component'
import { AuthService } from '../../../services/auth.service'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Subscription, type Observable, take } from 'rxjs'
import { type IUser } from '../../login/IUser'
import { FormsModule, type NgForm } from '@angular/forms'
import { AlertService } from '../../alert/alert.service'
import { NewCommentService } from '../../new-comment/new-comment.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [InputComponent, NgOptimizedImage, AsyncPipe, FormsModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss'
})
export class ReplyComponent implements OnInit, OnDestroy {
  user$: Observable<Partial<IUser>> = this.authService.currentUser$
  content: string = ''
  postId: number = 0
  commentId: number = 0
  postIdSub: Subscription | undefined = new Subscription()
  commentIdSub: Subscription | undefined = new Subscription()

  @ViewChild(InputComponent) inputComponent!: InputComponent

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(NewCommentService)
    private readonly newCommentService: NewCommentService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    this.postIdSub = this.route.parent?.parent?.paramMap.subscribe({
      next: (params) => {
        const postIdParam = params.get('postId')
        this.postId =
          postIdParam !== null && postIdParam !== undefined ? +postIdParam : 0
      }
    })

    this.commentIdSub = this.route.parent?.paramMap.subscribe({
      next: (params) => {
        const commentIdParam = params.get('commentId')
        this.commentId =
          commentIdParam !== null && commentIdParam !== undefined
            ? +commentIdParam
            : 0
      }
    })
  }

  ngOnDestroy (): void {
    this.postIdSub?.unsubscribe()
    this.commentIdSub?.unsubscribe()
  }

  reply (reply: NgForm): void {
    const content: string = reply.value.content

    if (content.length === 0) {
      this.alertService.setAlertValues(true, 'Your reply cannot be empty')
    }

    if (content.length > 0 && content.length < 8) {
      this.alertService.setAlertValues(
        true,
        'Your reply must be at least 8 characters long'
      )
    }

    if (reply.valid === true) {
      this.alertService.setAlertValues(true, 'Creating your reply...')

      this.newCommentService
        .create(this.postId, content, this.commentId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
              reply.resetForm()
              this.inputComponent.clear()
              this.alertService.setAlertValues(
                true,
                'Your reply was successfully sent'
              )
              this.router
                .navigate(['/post', this.postId, 'comment', res.body])
                .catch((err) => {
                  console.error('Error while redirecting to new comment', err)
                })
            }
          },
          error: (_) => {
            this.alertService.setAlertValues(
              true,
              'Your reply could not be created'
            )
          }
        })
    }
  }
}
