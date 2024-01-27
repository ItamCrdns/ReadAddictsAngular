import {
  Component,
  type ElementRef,
  Inject,
  type OnInit,
  ViewChild,
  type OnDestroy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  type AfterViewInit
} from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import {
  ionChatbubble,
  ionCloseCircleSharp,
  ionEllipsisVerticalSharp,
  ionSendOutline,
  ionSend
} from '@ng-icons/ionicons'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { AuthService } from '../../../services/Authentication/auth.service'
import { takeUntil, Subject, Observable, BehaviorSubject } from 'rxjs'
import { type IMessage } from '../IMessage'
import { ChatService } from '../../../services/Chat/chat.service'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { PatchEntityService } from '../../../services/Update entity/patch-entity.service'
import { NewMessageComponent } from './new-message/new-message.component'
import { SelectedUserComponent } from './selected-user/selected-user.component'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { userInitialState, type IUser } from 'app/user/login/IUser'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgIconComponent,
    NgOptimizedImage,
    AsyncPipe,
    SelectedUserComponent,
    NewMessageComponent,
    DateAgoPipe
  ],
  providers: [
    provideIcons({
      ionChatbubble,
      ionCloseCircleSharp,
      ionEllipsisVerticalSharp,
      ionSendOutline,
      ionSend
    })
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  // * User if the chat is opened from the user page
  @Input() userIdFromUserPage: string = ''
  @Input() receivedMessage$ = new Observable<IMessage>() // SignalR connection its on the parent component (the open chat button) so we will pass the received message as props
  @Output() readMessages = new EventEmitter<number>() // Emit the number of messages read to the parent component (the open chat button) so it can update the messages count

  recentChats: IUser[] = [] // Store user profile pictures for recent chats (tho it stores more than the picture) // TODO: Maybe add user username on profile picture hover
  currentUser$ = this.auth.currentUser$ // Current logged in user
  selectedUser: IUser = userInitialState

  conversation$ = new BehaviorSubject<IMessage[]>([])
  page: number = 1

  private readonly destroy$ = new Subject<void>()

  @ViewChild('chatArea') chatArea!: ElementRef<HTMLElement>
  @ViewChild('loadMore') loadMore!: ElementRef<HTMLElement>

  constructor (
    @Inject(AuthService)
    private readonly auth: AuthService,
    @Inject(ChatService)
    private readonly chat: ChatService,
    @Inject(GetEntityService)
    private readonly get: GetEntityService,
    @Inject(ChangeDetectorRef)
    private readonly cdr: ChangeDetectorRef,
    @Inject(PatchEntityService)
    private readonly patch: PatchEntityService
  ) {}

  ngOnInit (): void {
    // * If the chat is opened from the user page, open the chat with that user
    if (this.userIdFromUserPage !== '') {
      this.get
        .getUserById(this.userIdFromUserPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: IUser) => {
            this.selectedUser = res
            this.loadConversation(1, 10)
            this.goBottom()
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
          if (this.userIdFromUserPage === '') {
            this.selectedUser = res[0]
          }
          this.loadConversation(1, 10)
          this.goBottom()
          this.recentChats = res
        }
      })

    this.receivedMessage$.subscribe({
      next: (res: IMessage) => {
        // * Chat its open and user has no messages. Set the sender user and add it to the recent chats. This will only be called when the user has no messages at all
        if (this.selectedUser === undefined) {
          this.selectedUser = res.sender
          this.recentChats.unshift(res.sender)
        }

        this.recentChats.forEach((user) => {
          if (user !== undefined && user.id === res.senderId) {
            user.unreadMessages++
          }
        })

        if (this.selectedUser.id === res.senderId) {
          this.conversation$.next([...this.conversation$.value, res])
          this.goBottom()
        }

        const user = this.recentChats.find((user) => user?.id === res.senderId)

        this.recentChats = this.recentChats.filter(
          (user) => user?.id !== res.senderId
        )

        if (user !== undefined) {
          this.recentChats.unshift(user)
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.observer.unobserve(this.loadMore.nativeElement)
  }

  ngAfterViewInit (): void {
    this.observer.observe(this.loadMore.nativeElement)
  }

  private readonly observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && this.conversation$.value.length !== 0) {
        this.page++
        this.loadConversation(this.page, 10) // Limit need to be equal to the amount of messages loaded on the first load
      }
    }
  )

  private loadConversation (page: number, limit: number): void {
    this.chat
      .getConversation(page, limit, this.selectedUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.length !== 0) {
            this.conversation$.next([...res, ...this.conversation$.value])
            if (page === 1) {
              this.goBottom()
            } else {
              this.goBottomSlighly()
            }
          }
        }
      })
  }

  selectConversation (user: IUser): void {
    this.markAsRead(user.id)

    if (this.selectedUser !== user) {
      this.selectedUser = user
      this.conversation$.next([]) // Avoid conversations merged together
      this.page = 1 // Reset the page
      this.loadConversation(1, 10)
      this.goBottom()
    }
  }

  getMessageFromChildren (message: IMessage): void {
    this.conversation$.next([...this.conversation$.value, message])
    this.goBottom()

    // * And push the user I have just sent a message to to the top of the recent chats
    this.recentChats = this.recentChats.filter(
      (user) => user?.id !== this.selectedUser.id
    )
    this.recentChats?.unshift(this.selectedUser)
  }

  goBottom (): void {
    this.cdr.detectChanges()
    this.chatArea.nativeElement.scrollTop =
      this.chatArea.nativeElement.scrollHeight
  }

  goBottomSlighly (): void {
    this.cdr.detectChanges()
    this.chatArea.nativeElement.scrollTop = 500 // Trying to simulate the 10 messages height
  }

  hoveredMessage: string = ''

  mouseEnterMsg (index: string): void {
    this.hoveredMessage = index
  }

  mouseLeaveMsg (): void {
    this.hoveredMessage = ''
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
}
