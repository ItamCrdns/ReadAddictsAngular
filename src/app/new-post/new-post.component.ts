import { Component, inject } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { CharacterCountService } from '../../utility/character-count.service'
import { heroPhoto } from '@ng-icons/heroicons/outline'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent],
  providers: [
    provideIcons({ heroPhoto }),
    provideNgIconsConfig({ size: '2.25rem', color: 'rgba(175, 175, 175)' })
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  characterCount: number = 0
  characterCountService = inject(CharacterCountService)

  constructor () {
    this.characterCount = this.characterCountService.characterCount
  }

  incrementCharacterCount (inputLength: number): void {
    this.characterCount = inputLength
  }
}
