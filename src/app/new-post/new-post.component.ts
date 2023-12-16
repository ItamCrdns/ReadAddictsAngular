import { Component, inject } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { CharacterCountService } from '../../utility/character-count.service'

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [NgOptimizedImage],
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
