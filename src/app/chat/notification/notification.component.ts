import { Component, EventEmitter, Inject, Input, Output } from '@angular/core'
import { type IMessage } from '../IMessage'
import { NgOptimizedImage } from '@angular/common'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionCloseCircleSharp } from '@ng-icons/ionicons'
import {
  ToggleChatService,
  type ISendMessage
} from 'services/Toggle chat/toggle-chat.service'
import { DateAgoPipe } from 'app/pipes/date-ago.pipe'

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent, DateAgoPipe],
  providers: [
    provideIcons({
      ionCloseCircleSharp
    })
  ],
  template: `
    <div class="notification" (click)="goToChat(message.sender.id, $event)">
      <div class="user">
        <img
          [ngSrc]="message.sender.profilePicture"
          [alt]="message.sender.userName"
          width="50"
          height="50"
        />
        <div class="text">
          <header>
            <p>{{ message.sender.userName }}</p>
            <p>{{ message.timestamp | dateAgo }}</p>
          </header>
          <p>{{ message.content }}</p>
        </div>
      </div>
      <ng-icon
        name="ionCloseCircleSharp"
        class="close"
        (click)="closeNotification()"
      />
    </div>
  `,
  styles: `
  .notification {
    position: fixed;
    width: 300px;
    background-color: white;
    border-radius: 10px;
    padding: 1rem;
    border-left: 3px solid #00bfff;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, .1);
    bottom: 0;
    right: 0;
    margin: 1rem;
    cursor: pointer;

    .user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: .25rem;

      header {
        all: unset;
        display: flex;
        align-items: center;
        gap: .25rem;

        p:first-child {
          font-weight: 800;
          text-transform: capitalize;
        }

        p:last-child {
          font-size: .75rem;
          color: #666;
        }
      }

      p {
        margin: 0;
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    img {
      border-radius: 50%;
    }
  }

  .close {
    position: absolute;
    top: -.25rem;
    right: -.25rem;
    cursor: pointer;
  }
  `
})
export class NotificationComponent {
  @Input() message!: IMessage
  @Output() close = new EventEmitter<void>()

  constructor (
    @Inject(ToggleChatService)
    private readonly toggleChatService: ToggleChatService
  ) {}

  closeNotification (): void {
    this.close.emit()
  }

  goToChat (userId: string, event: Event): void {
    this.close.emit()
    event.stopPropagation()

    const newState: ISendMessage = {
      toggle: true,
      userId
    }

    this.toggleChatService.updateToggle(newState)
  }
}
