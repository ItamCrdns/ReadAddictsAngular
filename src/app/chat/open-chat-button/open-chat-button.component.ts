import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { ChatComponent } from '../chat/chat.component'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionChatbubble, ionCloseCircleSharp } from '@ng-icons/ionicons'
import { slideInOut } from '../../animations/slide'
import { Subject, BehaviorSubject, takeUntil } from 'rxjs'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { AsyncPipe } from '@angular/common'
import { environment } from '../../../environment/environment'
import { type HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { AlertService } from '../../../services/Alert/alert.service'
import { type IMessage } from '../IMessage'
import { ToggleChatService } from 'services/Toggle chat/toggle-chat.service'

@Component({
  selector: 'app-open-chat-button',
  standalone: true,
  imports: [NgIconComponent, ChatComponent, AsyncPipe],
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
  messagesCount$ = new BehaviorSubject<number>(0)

  newMessageSubject = new Subject<IMessage>()

  private readonly destroy$ = new Subject<void>()

  private readonly hub: HubConnection

  constructor (
    @Inject(ToggleChatService)
    private readonly toggleChatService: ToggleChatService,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {
    // * SignalR connection
    this.hub = new HubConnectionBuilder()
      .withUrl(environment.url + 'chatHub')
      .build()

    this.hub.start().catch(() => {
      this.alertService.popAlert(
        'Something went wrong while connecting to the server. Try again.'
      )
    })

    // * I could also create another connection for the messages count
    this.hub.on('ReceiveMessage', (message: IMessage) => {
      this.receiveMessage(message)
      this.messagesCount$.next(this.messagesCount$.value + 1)
    })
  }

  ngOnInit (): void {
    this.getEntityService
      .getUnreadMsgCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((initialCount) => {
        this.messagesCount$.next(initialCount)
      })

    this.toggleChatService.toggle$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.toggle = res.toggle
        if (res.userId !== undefined) {
          this.user = res.userId
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  receiveMessage (message: IMessage): void {
    this.newMessageSubject.next(message)
  }

  removeMessageCount (readMessages: number): void {
    this.messagesCount$.next(this.messagesCount$.value - readMessages)
  }

  toggleChat (event: Event): void {
    event.stopPropagation() // * Prevent the click event from bubbling up to the dom
    // * Other words prevents the click event from triggering the onClickOutside function
    this.toggleChatService.updateToggle({ toggle: !this.toggle })
  }
}
