import { Component, ElementRef, Inject, type OnInit, ViewChild } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  ionChatbubble,
  ionCloseCircleSharp,
  ionEllipsisVerticalSharp,
  ionSendOutline,
  ionSend,
  ionAddCircleSharp
} from '@ng-icons/ionicons'
import { slideInOut } from '../animations/slide'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { GetRecentMessageSendersService } from './get-recent-message-senders.service'
import { AuthService } from '../../services/auth.service'
import { type IUser } from '../login/IUser'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgIconComponent, NgOptimizedImage, FormsModule, AsyncPipe],
  providers: [
    provideIcons({
      ionChatbubble,
      ionCloseCircleSharp,
      ionEllipsisVerticalSharp,
      ionSendOutline,
      ionSend,
      ionAddCircleSharp
    })
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [slideInOut]
})
export class ChatComponent implements OnInit {
  toggle: boolean = false
  message: string = '' // Store the message to be sent
  recentMessageSenders$ =
    this.getRecentMessageSendersService.getRecentMessageSenders()

  currentUser$ = this.authService.currentUser$

  selectedChat: IUser | undefined

  constructor (
    @Inject(GetRecentMessageSendersService)
    private readonly getRecentMessageSendersService: GetRecentMessageSendersService,
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}

  ngOnInit (): void {
    this.getRecentMessageSendersService.getRecentMessageSenders().subscribe({
      next: (recentMessageSenders) => {
        this.selectedChat = recentMessageSenders[0]
      }
    })
  }

  @ViewChild('textarea') textarea: ElementRef = new ElementRef('')

  toggleChat (): void {
    this.toggle = !this.toggle
  }

  textareaChange (): void {
    this.textarea.nativeElement.style.height = '48px'

    const newHeight = Math.max(
      Number(this.textarea.nativeElement.scrollHeight),
      20
    )
    this.textarea.nativeElement.style.height = `${newHeight}px`
  }
}
