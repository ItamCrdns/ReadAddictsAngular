import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { ChatComponent } from '../chat/chat.component'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionChatbubble, ionCloseCircleSharp } from '@ng-icons/ionicons'
import { slideInOut } from '../../animations/slide'
import { OpenChatService } from '../../../services/Open chat/open-chat.service'
import { type Observable, Subject, Subscription } from 'rxjs'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { AsyncPipe } from '@angular/common'
import { environment } from '../../../environment/environment'
import { type HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { AlertService } from '../../../services/Alert/alert.service'
import { type IMessage } from '../IMessage'

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
  notificationCount$: Observable<number> =
    this.getEntityService.getMessageNotificationsCount()

  newMessageSubject = new Subject<IMessage>()
  newMessagesCount: number = 0

  sub: Subscription = new Subscription()
  private readonly hub: HubConnection

  constructor (
    @Inject(OpenChatService) private readonly openChatService: OpenChatService,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {
    // * SignalR connection
    this.hub = new HubConnectionBuilder()
      .withUrl(environment.url + 'chatHub')
      .build()

    this.hub.start().catch(() => {
      this.alertService.setAlertValues(
        true,
        'Something went wrong while connecting to the server. Try again.'
      )
    })

    this.hub.on('ReceiveMessage', (message: IMessage) => {
      this.receiveMessage(message)
      this.newMessagesCount++
    })
  }

  ngOnInit (): void {
    this.sub = this.openChatService.toggle$.subscribe({
      next: (res) => {
        this.toggle = res.toggle
        if (res.userId !== undefined) {
          this.user = res.userId
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }

  receiveMessage (message: IMessage): void {
    this.newMessageSubject.next(message)
  }

  toggleChat (): void {
    this.openChatService.updateToggle({ toggle: !this.toggle })
  }
}
