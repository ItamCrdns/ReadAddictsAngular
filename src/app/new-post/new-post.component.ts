import { Component, Inject } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { InputComponent } from '../input/input.component'
import { heroPhoto } from '@ng-icons/heroicons/outline'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'
import { GetCurrentUserService } from '../../services/get-current-user.service'
import { FormsModule, type NgForm } from '@angular/forms'
import { NewPostService } from './new-post.service'
import { take } from 'rxjs'
import { Router } from '@angular/router'
import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIconComponent,
    InputComponent,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideIcons({ heroPhoto }),
    provideNgIconsConfig({ size: '2.25rem', color: 'rgba(175, 175, 175)' })
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  newPostText: string = ''
  currentUser$ = this.getCurrentUserService.getCurrentUser()
  content: string = ''

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(GetCurrentUserService)
    private readonly getCurrentUserService: GetCurrentUserService,
    @Inject(NewPostService)
    private readonly newPostService: NewPostService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  getNewPostText (newPostText: string): void {
    this.newPostText = newPostText
  }

  createNewPost (newPostForm: NgForm): void {
    // TODO: Add images to post
    if (newPostForm.valid === true) {
      // * Currently: if post content is provided
      const fd = new FormData()
      const postContent: string = newPostForm.value.content
      fd.append('content', postContent)
      this.newPostService
        .create(fd)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.status === 200) {
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
