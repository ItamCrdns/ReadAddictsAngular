import { Component, EventEmitter, Output, inject } from '@angular/core'
import { CharacterCountService } from '../../utility/character-count.service'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Output() setTextEvent = new EventEmitter<string>()

  characterCount: number = 0
  characterCountService = inject(CharacterCountService)

  constructor () {
    this.characterCount = this.characterCountService.characterCount
  }

  incrementCharacterCount (inputText: string): void {
    this.characterCount = inputText.length
    this.setTextEvent.emit(inputText)
  }
}
