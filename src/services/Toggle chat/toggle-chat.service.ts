import { Injectable } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'

export interface ISendMessage {
  toggle: boolean
  userId?: string
}

@Injectable({
  providedIn: 'root'
})
export class ToggleChatService {
  private readonly toggleSubject = new BehaviorSubject<ISendMessage>({
    toggle: false
  })

  public toggle$: Observable<ISendMessage> = this.toggleSubject.asObservable()

  updateToggle (newState: ISendMessage): void {
    this.toggleSubject.next(newState)
  }
}
