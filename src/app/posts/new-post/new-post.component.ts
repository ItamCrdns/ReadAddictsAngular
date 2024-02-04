import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { heroPhoto } from '@ng-icons/heroicons/outline'
import { ionRemoveCircle } from '@ng-icons/ionicons'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { FormsModule, type NgForm } from '@angular/forms'
import { type Observable, take } from 'rxjs'
import { Router } from '@angular/router'
import { InputComponent } from 'app/input/input.component'
import { type IUser } from 'app/user/login/IUser'
import { AuthService } from 'services/Authentication/auth.service'
import { NewEntityService } from 'services/New entity/new-entity.service'
import { AlertService } from 'services/Alert/alert.service'
import { ImageBlob } from 'app/shared/base/ImageBlob'

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIconComponent,
    InputComponent,
    AsyncPipe,
    FormsModule
  ],
  providers: [provideIcons({ heroPhoto, ionRemoveCircle })],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent extends ImageBlob {
  newPostText: string = ''
  user$: Observable<Partial<IUser>> = this.authService.currentUser$
  content: string = ''

  @Input() groupId?: string

  @ViewChild('imagesInput') imagesInput: ElementRef = new ElementRef('')
  @ViewChild(InputComponent) inputComponent!: InputComponent

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {
    super()
  }

  getNewPostText (newPostText: string): void {
    this.newPostText = newPostText
  }

  triggerImagesInput (): void {
    this.imagesInput.nativeElement.click()
  }

  createNewPost (newPostForm: NgForm): void {
    const content: string = newPostForm.value.content

    if (content.length === 0) {
      this.alertService.popAlert('Your post cannot be empty')
      return
    }

    if (content.length > 0 && content.length < 8) {
      this.alertService.popAlert(
        'Your post must be at least 8 characters long'
      )
      return
    }

    // TODO: Add images to post
    if (newPostForm.valid === true) {
      this.alertService.popAlert('Creating new post...')
      // * Currently: if post content is provided
      const fd = new FormData()

      fd.append('content', content)

      if (this.groupId !== undefined) {
        fd.append('groupId', this.groupId)
      }

      this.images.forEach((_, key) => {
        fd.append('images', key)
      })

      this.newEntityService
        .newPost(fd)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
              newPostForm.resetForm()
              this.inputComponent.clear()
              this.alertService.popAlert('Your post has been created')
              this.router.navigate(['/post', res.body]).catch((err) => {
                console.error('Error while redirecting to post', err)
              })
            }
          },
          error: (err) => {
            if (
              err.status === 400 ||
              err.status === 500 ||
              err.status === 401
            ) {
              this.alertService.popAlert('Your post could not be created')
            }
          }
        })
    }
  }
}
