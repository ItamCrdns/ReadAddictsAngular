import {
  Component,
  ElementRef,
  Inject,
  type OnInit,
  ViewChild
} from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  ionChatbubble,
  ionCloseCircleSharp,
  ionEllipsisVerticalSharp,
  ionSendOutline,
  ionSend,
  ionAddCircleSharp
} from '@ng-icons/ionicons'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { GetRecentMessageSendersService } from './get-recent-message-senders.service'
import { AuthService } from '../../../services/auth.service'
import { type IUser } from '../../login/IUser'
import { GetConversationService } from './get-conversation.service'
import { combineLatest, type Observable } from 'rxjs'
import { type IMessage } from '../IMessage'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgIconComponent,
    NgOptimizedImage,
    FormsModule,
    AsyncPipe,
    DateAgoPipe
  ],
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
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  message: string = '' // Store the message to be sent
  recentMessageSenders$ =
    this.getRecentMessageSendersService.getRecentMessageSenders()

  currentUser$ = this.authService.currentUser$
  currentUsername: string | undefined = ''

  selectedUserChat: IUser | undefined

  selectedChatConversation$: Observable<IMessage[]> | undefined

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(GetRecentMessageSendersService)
    private readonly getRecentMessageSendersService: GetRecentMessageSendersService,
    @Inject(GetConversationService)
    private readonly getConversationService: GetConversationService
  ) {}

  ngOnInit (): void {
    const recentMessageSenders$ =
      this.getRecentMessageSendersService.getRecentMessageSenders()
    const currentUser$ = this.authService.currentUser$

    // * Wait until both observables emit a value and then subscribe to them
    combineLatest([recentMessageSenders$, currentUser$]).subscribe(
      ([recentMessageSenders, currentUser]) => {
        if (recentMessageSenders.length > 0) {
          this.selectedUserChat = recentMessageSenders[0]
          console.log(this.selectedUserChat?.last_Login)
        }

        this.currentUsername = currentUser.username

        this.selectedChatConversation$ =
          this.getConversationService.getConversation(
            1,
            10,
            this.selectedUserChat?.username ?? '',
            this.currentUsername ?? ''
          )
      }
    )
  }

  @ViewChild('textarea') textarea: ElementRef = new ElementRef('')

  textareaChange (): void {
    this.textarea.nativeElement.style.height = '48px'

    const newHeight = Math.max(
      Number(this.textarea.nativeElement.scrollHeight),
      20
    )
    this.textarea.nativeElement.style.height = `${newHeight}px`
  }
}
