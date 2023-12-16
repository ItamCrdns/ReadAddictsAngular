import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class CharacterCountService {
  characterCount: number

  constructor () {
    this.characterCount = 0
  }

  incrementCharacterCount (): void {
    this.characterCount++
  }
}
