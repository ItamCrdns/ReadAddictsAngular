import { Component } from '@angular/core'
import { ChatComponent } from '../chat/chat.component'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionChatbubble, ionCloseCircleSharp } from '@ng-icons/ionicons'
import { slideInOut } from '../../animations/slide'

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
export class OpenChatButtonComponent {
  toggle: boolean = true

  toggleChat (): void {
    this.toggle = !this.toggle
  }
}
