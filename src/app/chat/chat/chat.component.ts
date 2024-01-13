import {
  Component,
  ElementRef,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy,
  Input
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
import { AuthService } from '../../../services/Authentication/auth.service'
import { type IUser } from '../../login/IUser'
import { type Subscription, type Observable } from 'rxjs'
import { type IMessage } from '../IMessage'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { ChatService } from '../../../services/Chat/chat.service'
import { RouterLink } from '@angular/router'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgIconComponent,
    NgOptimizedImage,
    FormsModule,
    AsyncPipe,
    DateAgoPipe,
    RouterLink
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
export class ChatComponent implements OnInit, OnDestroy {
  // * User if the chat is opened from the user page
  @Input() anyUserId: string | undefined

  message: string = '' // Store the message to be sent
  recentChats: Partial<IUser[]> | undefined
  recentChatSubscription: Subscription | undefined

  currentUser$ = this.authService.currentUser$

  selectedUserChat: IUser | undefined

  selectedChatConversation$: Observable<IMessage[]> | undefined

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(ChatService)
    private readonly chatService: ChatService,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService
  ) {}

  ngOnInit (): void {
    if (this.anyUserId !== undefined && this.anyUserId !== '') {
      this.getEntityService.getUserById(this.anyUserId).subscribe({
        next: (res: IUser) => {
          this.selectedUserChat = res
        }
      })
    } else {
      this.recentChatSubscription = this.chatService
        .getRecentChats()
        .subscribe({
          next: (res: Partial<IUser[]>) => {
            this.selectedUserChat = res[0]
          }
        })
    }

    if (this.selectedUserChat !== undefined) {
      this.selectedChatConversation$ = this.chatService.getConversation(
        1,
        10,
        this.selectedUserChat.id
      )
    }
  }

  ngOnDestroy (): void {
    this.recentChatSubscription?.unsubscribe()
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
