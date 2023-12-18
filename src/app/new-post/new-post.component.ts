import { Component } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { InputComponent } from '../input/input.component'
import { heroPhoto } from '@ng-icons/heroicons/outline'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent, InputComponent],
  providers: [
    provideIcons({ heroPhoto }),
    provideNgIconsConfig({ size: '2.25rem', color: 'rgba(175, 175, 175)' })
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  newPostText: string = ''

  getNewPostText (newPostText: string): void {
    this.newPostText = newPostText
  }
}
