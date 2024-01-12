import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Inject, type OnInit, ViewChild } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { FormsModule, type NgForm } from '@angular/forms'
import { AuthService } from '../../services/Authentication/auth.service'
import { type IUser } from '../login/IUser'
import { AlertService } from '../../services/Alert/alert.service'
import { take } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { NewEntityService } from '../../services/New entity/new-entity.service'

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [NgOptimizedImage, InputComponent, AsyncPipe, FormsModule],
  templateUrl: './new-comment.component.html',
  styleUrl: '../new-post/new-post.component.scss' // pretty much the same styles as new-post
})
export class NewCommentComponent implements OnInit {
  user: Partial<IUser> = {}
  content: string = ''
  postId: string = ''

  @ViewChild(InputComponent) inputComponent!: InputComponent

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService,
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router
  ) {}

  ngOnInit (): void {
    this.authService.currentUser$.subscribe((res) => {
      this.user = res
    })

    this.postId = this.route.snapshot.params['postId']
  }

  createNewComment (newCommentForm: NgForm): void {
    const comment: string = newCommentForm.value.content

    if (comment.length === 0) {
      this.alertService.setAlertValues(true, 'Your comment cannot be empty')
    }

    if (comment.length > 0 && comment.length < 8) {
      this.alertService.setAlertValues(
        true,
        'Your comment must be at least 8 characters long'
      )
    }

    if (newCommentForm.valid === true) {
      this.alertService.setAlertValues(true, 'Creating your comment...')

      this.newEntityService
        .newComment(comment, this.postId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
              newCommentForm.resetForm()
              this.inputComponent.clear()
              this.alertService.setAlertValues(
                true,
                'Your comment was created'
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
              'Your comment could not be created'
            )
          }
        })
    }
  }
}
