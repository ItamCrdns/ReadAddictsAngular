import { Component, ElementRef, Inject, ViewChild } from '@angular/core'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { InputComponent } from '../input/input.component'
import { heroPhoto } from '@ng-icons/heroicons/outline'
import { ionRemoveCircle } from '@ng-icons/ionicons'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { FormsModule, type NgForm } from '@angular/forms'
import { NewPostService } from './new-post.service'
import { type Observable, take } from 'rxjs'
import { Router } from '@angular/router'
import { AlertService } from '../alert/alert.service'
import { type IUser } from '../login/IUser'
import { AuthService } from '../../services/auth.service'

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
export class NewPostComponent {
  newPostText: string = ''
  user$: Observable<Partial<IUser>> = this.authService.currentUser$
  content: string = ''
  images: File[] = []

  @ViewChild('imagesInput') imagesInput: ElementRef = new ElementRef('')
  @ViewChild(InputComponent) inputComponent!: InputComponent

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(NewPostService)
    private readonly newPostService: NewPostService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  getNewPostText (newPostText: string): void {
    this.newPostText = newPostText
  }

  triggerImagesInput (): void {
    this.imagesInput.nativeElement.click()
  }

  setImages (event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    if (event.target.files === null) {
      return
    }

    this.images = Array.from(event.target.files)
  }

  trackByFn (index: number, item: File): string {
    return item.name + index
  }

  getImgUrl (img: File): string {
    return URL.createObjectURL(img)
  }

  removeImage (image: File): void {
    this.images = this.images.filter((img) => img !== image)
  }

  createNewPost (newPostForm: NgForm): void {
    const content: string = newPostForm.value.content

    if (content.length === 0) {
      this.alertService.setAlertValues(true, 'Your post cannot be empty')
      return
    }

    if (content.length > 0 && content.length < 8) {
      this.alertService.setAlertValues(
        true,
        'Your post must be at least 8 characters long'
      )
      return
    }

    // TODO: Add images to post
    if (newPostForm.valid === true) {
      this.alertService.setAlertValues(true, 'Creating new post...')
      // * Currently: if post content is provided
      const fd = new FormData()

      fd.append('content', content)

      this.images.forEach((img) => {
        fd.append('images', img)
      })

      this.newPostService
        .create(fd)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
              newPostForm.resetForm()
              this.inputComponent.clear()
              this.alertService.setAlertValues(
                true,
                'Your post has been created'
              )
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
              this.alertService.setAlertValues(
                true,
                'Your post could not be created'
              )
            }
          }
        })
    }
  }
}
