import {
  Component,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy
} from '@angular/core'
import { InputComponent } from '../../input/input.component'
import { AuthService } from '../../../services/Authentication/auth.service'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Subscription, type Observable, take } from 'rxjs'
import { type IUser } from '../../login/IUser'
import { FormsModule, type NgForm } from '@angular/forms'
import { AlertService } from '../../../services/Alert/alert.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NewEntityService } from '../../../services/New entity/new-entity.service'

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
  postId: string = ''
  commentId: string = ''
  postIdSub: Subscription | undefined = new Subscription()
  commentIdSub: Subscription | undefined = new Subscription()

  @ViewChild(InputComponent) inputComponent!: InputComponent

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    // Can also use paramMap
    this.postIdSub = this.route.parent?.parent?.params.subscribe((params) => {
      this.postId = params['postId']
      console.log(this.postId)
    })

    this.commentIdSub = this.route.parent?.params.subscribe((params) => {
      this.commentId = params['commentId']
      console.log(this.commentId)
    })
  }

  ngOnDestroy (): void {
    this.postIdSub?.unsubscribe()
    this.commentIdSub?.unsubscribe()
  }

  reply (reply: NgForm): void {
    const comment: string = reply.value.content

    if (comment.length === 0) {
      this.alertService.setAlertValues(true, 'Your reply cannot be empty')
    }

    if (comment.length > 0 && comment.length < 8) {
      this.alertService.setAlertValues(
        true,
        'Your reply must be at least 8 characters long'
      )
    }

    if (reply.valid === true) {
      this.alertService.setAlertValues(true, 'Creating your reply...')

      this.newEntityService
        .newComment(comment, this.postId, this.commentId)
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
                .navigate(['/post', this.postId, 'comment', res.body?.id])
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
