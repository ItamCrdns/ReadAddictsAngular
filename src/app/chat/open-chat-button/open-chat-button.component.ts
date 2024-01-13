import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { ChatComponent } from '../chat/chat.component'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionChatbubble, ionCloseCircleSharp } from '@ng-icons/ionicons'
import { slideInOut } from '../../animations/slide'
import { OpenChatService } from '../../../services/Open chat/open-chat.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-open-chat-button',
  standalone: true,
  imports: [NgIconComponent, ChatComponent],
  providers: [
    provideIcons({
      ionChatbubble,
      ionCloseCircleSharp
    })
  ],
  templateUrl: './open-chat-button.component.html',
  styleUrl: '../chat/chat.component.scss',
  animations: [slideInOut]
})
export class OpenChatButtonComponent implements OnInit, OnDestroy {
  toggle: boolean = false
  user: string = ''
  sub: Subscription = new Subscription()

  constructor (
    @Inject(OpenChatService) private readonly openChatService: OpenChatService
  ) {}

  ngOnInit (): void {
    this.sub = this.openChatService.toggle$.subscribe((res) => {
      this.toggle = res.toggle
      if (res.userId !== undefined) {
        this.user = res.userId
      }
    })
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }

  toggleChat (): void {
    this.openChatService.updateToggle({ toggle: !this.toggle })
  }
}
