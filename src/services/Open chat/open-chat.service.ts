import { Injectable } from '@angular/core'
import { BehaviorSubject, type Observable } from 'rxjs'

export interface ISendMessage {
  toggle: boolean
  userId?: string
}

@Injectable({
  providedIn: 'root'
})
export class OpenChatService {
  private readonly toggleSubject = new BehaviorSubject<ISendMessage>({
    toggle: true
  })

  public toggle$: Observable<ISendMessage> = this.toggleSubject.asObservable()

  updateToggle (newState: ISendMessage): void {
    this.toggleSubject.next(newState)
  }
}
