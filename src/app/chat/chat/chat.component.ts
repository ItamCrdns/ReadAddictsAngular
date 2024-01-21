import {
  Component,
  ElementRef,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter
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
import { PatchEntityService } from '../../../services/Update entity/patch-entity.service'

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
  @Output() readMessages = new EventEmitter<number>() // Emit the number of messages read to the parent component (the open chat button) so it can update the messages count

  message: string = '' // Store the message to be sent

  recentChats: Partial<IUser[]> = [] // Store user profile pictures for recent chats (tho it stores more than the picture) // TODO: Maybe add user username on profile picture hover
  currentUser$ = this.auth.currentUser$ // Current logged in user
  selectedUser: IUser = userInitialState

  selectedConversation: IMessage[] = []

  private readonly destroy$ = new Subject<void>()

  @ViewChild('chatArea') chatArea: ElementRef = new ElementRef('')
  @ViewChild('textarea') textarea: ElementRef = new ElementRef('')

  constructor (
    @Inject(AuthService)
    private readonly auth: AuthService,
    @Inject(ChatService)
    private readonly chat: ChatService,
    @Inject(GetEntityService)
    private readonly get: GetEntityService,
    @Inject(NewEntityService)
    private readonly add: NewEntityService,
    @Inject(ChangeDetectorRef)
    private readonly cdr: ChangeDetectorRef,
    @Inject(PatchEntityService)
    private readonly patch: PatchEntityService
  ) {}

  ngOnInit (): void {
    // * If the chat is opened from the user page, open the chat with that user
    if (this.anyUserId !== '') {
      this.get
        .getUserById(this.anyUserId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IUser) => {
            this.selectedUser = res

            this.chat
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
    this.chat
      .getRecentChats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: IUser[]) => {
          // * But don't select a user if the chat is opened from the user page. The user is already selected
          if (this.anyUserId === '') {
            this.selectedUser = res[0]
          }

          this.chat
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
    this.markAsRead(user.id)

    if (this.selectedUser !== user) {
      this.selectedUser = user
      this.chat
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
      this.add
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

  markAsRead (userId: string): void {
    this.patch.markMessagesAsRead(userId).subscribe({
      next: (readMessages) => {
        this.recentChats.forEach((user) => {
          if (user !== undefined && user.id === userId) {
            user.unreadMessages = 0
          }
        })
        this.readMessages.emit(readMessages)
      }
    })
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
