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
import { takeUntil, Subject } from 'rxjs'
import { type IMessage } from '../IMessage'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { ChatService } from '../../../services/Chat/chat.service'
import { RouterLink } from '@angular/router'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { NewEntityService } from '../../../services/New entity/new-entity.service'

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
  recentChats: Partial<IUser[]> | undefined // Store user profile pictures for recent chats (tho it stores more than the picture) // TODO: Maybe add user username on profile picture hover

  currentUser$ = this.authService.currentUser$ // Current logged in user
  selectedUser: IUser | undefined // User selected to chat with
  selectedConversation: IMessage[] | [] = []

  private readonly destroy$ = new Subject<void>()

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(ChatService)
    private readonly chatService: ChatService,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService
  ) {}

  ngOnInit (): void {
    if (this.anyUserId !== undefined && this.anyUserId !== '') {
      this.getEntityService
        .getUserById(this.anyUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IUser) => {
            this.selectedUser = res
            this.chatService
              .getConversation(1, 10, this.selectedUser.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res: IMessage[]) => {
                  this.selectedConversation = res
                }
              })
          }
        })
    }

    this.chatService
      .getRecentChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Partial<IUser[]>) => {
          if (this.anyUserId === undefined || this.anyUserId === '') {
            this.selectedUser = res[0]
            if (this.selectedUser !== undefined) {
              this.chatService
                .getConversation(1, 10, this.selectedUser.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (res: IMessage[]) => {
                    this.selectedConversation = res
                  }
                })
            }
          }
          this.recentChats = res
        }
      })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  selectConversation (user: IUser): void {
    if (this.selectedUser !== user) {
      this.selectedUser = user
      this.chatService
        .getConversation(1, 10, this.selectedUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IMessage[]) => {
            this.selectedConversation = res
          }
        })
    }
  }

  sendMessage (): void {
    if (this.selectedUser !== undefined) {
      this.newEntityService
        .newMessage(this.selectedUser.id, this.message)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.message = ''
            if (this.selectedUser !== undefined) {
              this.selectedConversation = [...this.selectedConversation, res]
            }
          }
        })
    }
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
