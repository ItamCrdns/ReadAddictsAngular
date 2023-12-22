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

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent, InputComponent, CommonModule],
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

  constructor (
    @Inject(GetCurrentUserService)
    private readonly getCurrentUserService: GetCurrentUserService
  ) {}

  getNewPostText (newPostText: string): void {
    this.newPostText = newPostText
  }
}
