import {
  Component,
  ElementRef,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy,
  Input,
  ChangeDetectorRef
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
import { userInitialState, type IUser } from '../../login/IUser'
import { takeUntil, Subject, Observable } from 'rxjs'
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
  @Input() anyUserId: string = ''
  @Input() receivedMessage$ = new Observable<IMessage>() // SignalR connection its on the parent component (the open chat button) so we will pass the received message as props
  message: string = '' // Store the message to be sent

  recentChats: Partial<IUser[]> = [] // Store user profile pictures for recent chats (tho it stores more than the picture) // TODO: Maybe add user username on profile picture hover
  currentUser$ = this.authService.currentUser$ // Current logged in user
  selectedUser: IUser = userInitialState

  selectedConversation: IMessage[] = []

  private readonly destroy$ = new Subject<void>()

  @ViewChild('chatArea') chatArea: ElementRef = new ElementRef('')
  @ViewChild('textarea') textarea: ElementRef = new ElementRef('')

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(ChatService)
    private readonly chatService: ChatService,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService,
    @Inject(ChangeDetectorRef)
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit (): void {
    // * If the chat is opened from the user page, open the chat with that user
    if (this.anyUserId !== '') {
      this.getEntityService
        .getUserById(this.anyUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IUser) => {
            this.selectedUser = res

            this.chatService
              .getConversation(1, 999, this.selectedUser.id ?? '')
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (res: IMessage[]) => {
                  this.selectedConversation = res

                  this.goBottom()
                }
              })
          }
        })
    }

    // * Regardless of where the chat is opened from, get the recent chats
    this.chatService
      .getRecentChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: IUser[]) => {
          // * But don't select a user if the chat is opened from the user page. The user is already selected
          if (this.anyUserId === '') {
            this.selectedUser = res[0]
          }

          this.chatService
            .getConversation(1, 999, this.selectedUser.id ?? '')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: IMessage[]) => {
                this.selectedConversation = res

                this.goBottom()
              }
            })

          this.recentChats = res
        }
      })

    this.receivedMessage$.subscribe({
      next: (res: IMessage) => {
        this.recentChats.forEach((user) => {
          if (user !== undefined && user.id === res.senderId) {
            user.unreadMessages++
          }
        })

        if (this.selectedUser.id === res.senderId) {
          this.selectedConversation = [...this.selectedConversation, res]
          this.goBottom()
        }

        const user = this.recentChats.find((user) => user?.id === res.senderId)

        this.recentChats = this.recentChats.filter(
          (user) => user?.id !== res.senderId
        )

        this.recentChats?.unshift(user)
      }
    })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  selectConversation (user: IUser): void {
    // TODO: Selecting a conversation should clear messages
    if (this.selectedUser !== user) {
      this.selectedUser = user
      this.chatService
        .getConversation(1, 999, this.selectedUser.id ?? '')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IMessage[]) => {
            this.selectedConversation = res

            // * Scroll to bottom when a new conversation is selected
            this.goBottom()
          }
        })
    }
  }

  sendMessage (): void {
    if (this.selectedUser !== undefined) {
      this.newEntityService
        .newMessage(this.selectedUser.id ?? '', this.message)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.message = ''
            this.selectedConversation = [...this.selectedConversation, res]

            // * Scroll to bottom when a new message is sent
            this.goBottom()

            // * And push the user I have just sent a message to to the top of the recent chats
            this.recentChats = this.recentChats.filter(
              (user) => user?.id !== this.selectedUser.id
            )
            this.recentChats?.unshift(this.selectedUser)
          }
        })
    }
  }

  goBottom (): void {
    this.cdr.detectChanges()
    this.chatArea.nativeElement.scrollTop =
      this.chatArea.nativeElement.scrollHeight
  }

  clearNotificationForUser (userId?: string): void {
    // TODO: This should mark messages as read in the database
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
