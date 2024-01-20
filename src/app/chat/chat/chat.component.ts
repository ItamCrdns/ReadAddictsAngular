import {
  Component,
  ElementRef,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy,
  Input,
  ChangeDetectorRef,
  Output
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
import { takeUntil, Subject } from 'rxjs'
import { type IMessage } from '../IMessage'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { ChatService } from '../../../services/Chat/chat.service'
import { RouterLink } from '@angular/router'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { NewEntityService } from '../../../services/New entity/new-entity.service'
import { HubConnectionBuilder, type HubConnection } from '@microsoft/signalr'
import { environment } from '../../../environment/environment'
import { AlertService } from '../../../services/Alert/alert.service'
import { type INotification } from './INotification'

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
  @Output() notificationCount: number = 0

  message: string = '' // Store the message to be sent
  recentChats: Partial<IUser[]> = [] // Store user profile pictures for recent chats (tho it stores more than the picture) // TODO: Maybe add user username on profile picture hover
  currentUser$ = this.authService.currentUser$ // Current logged in user
  selectedUser: IUser = userInitialState

  selectedConversation: IMessage[] = []
  notifications: INotification[] = []

  private readonly destroy$ = new Subject<void>()
  private readonly hubConnection: HubConnection

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
    private readonly cdr: ChangeDetectorRef,
    @Inject(AlertService)
    private readonly alertService: AlertService
  ) {
    // * SignalR connection
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.url + 'chatHub')
      .build()

    this.hubConnection.start().catch(() => {
      this.alertService.setAlertValues(
        true,
        'Something went wrong while connecting to the server. Try again.'
      )
    })

    this.hubConnection.on('ReceiveMessage', (message: IMessage) => {
      this.handleReceivedMessage(message)
    })
  }

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
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  handleReceivedMessage (message: IMessage): void {
    const newNotification: INotification = {
      userId: message.senderId,
      message: message.content
    }

    // * Add a new notification
    this.notifications = [...this.notifications, newNotification] // ? Id remove the notifications state, but later I might at an actual notification
    this.recentChats.forEach((user) => {
      if (user?.id === newNotification.userId) {
        user.unreadMessages++
      }
    })

    if (this.selectedUser.id === message.senderId) {
      this.selectedConversation = [...this.selectedConversation, message]
      this.goBottom()
    }

    // * Find user in recent chats and push it to the top
    const user = this.recentChats.find((user) => user?.id === message.senderId)

    this.recentChats = this.recentChats.filter(
      (user) => user?.id !== message.senderId
    )

    this.recentChats?.unshift(user)
  }

  selectConversation (user: IUser): void {
    // * Clear notifications if any
    this.notifications = this.notifications.filter(
      (notification) => notification.userId !== user.id
    )

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

  userHasNotifications (userId: string): boolean {
    return this.notifications.some((n) => n.userId === userId)
  }

  clearNotificationForUser (userId?: string): void {
    if (userId !== undefined && this.userHasNotifications(userId)) {
      // TODO: Mark as read in the server
      this.notifications = this.notifications.filter(
        (n) => n.userId !== userId
      )
    }
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
