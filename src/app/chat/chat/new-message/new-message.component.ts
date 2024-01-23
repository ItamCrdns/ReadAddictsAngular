import { NgOptimizedImage } from '@angular/common'
import {
  Component,
  type ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  Inject,
  type OnDestroy
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { userInitialState, type IUser } from '../../../login/IUser'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionSendOutline, ionSend } from '@ng-icons/ionicons'
import { NewEntityService } from '../../../../services/New entity/new-entity.service'
import { Subject, takeUntil } from 'rxjs'
import { type IMessage } from '../../IMessage'

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgIconComponent],
  providers: [provideIcons({ ionSendOutline, ionSend })],
  template: `
    <div class="write-msg">
      <img
        ngSrc="{{ user.profilePicture }}"
        alt="{{ user.userName }}"
        width="50"
        height="50"
      />
      <div class="textarea-container">
        <textarea
          [(ngModel)]="message"
          #textarea
          (input)="textareaChange()"
          maxlength="255"
          placeholder="Write a message..."
          (click)="markAsRead(selectedUser.id)"
          (keydown.enter)="sendMessageAndSendResToParent($event)"
        ></textarea>
        @if (message.length > 0) {
        <ng-icon
          class="send-icon-blue"
          name="ionSend"
          (click)="sendMessageAndSendResToParent($event)"
        />
        } @else {
        <ng-icon class="send-icon" name="ionSendOutline" />
        }
      </div>
    </div>
  `,
  styles: `
  img {
    border-radius: 50%;
  }

  .write-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 1rem;

    .textarea-container {
      display: flex;
      align-items: center;
      position: relative;
    }

    textarea {
      background-color: whitesmoke;
      border: none;
      border-radius: 15px;
      padding: 1rem;
      border-right: 2.75rem solid transparent; // ? Avoid writing over the send icon
      margin: 1rem;
      resize: none;
      outline: none;
      font-family: inherit;
      overflow: hidden;
      box-sizing: border-box;
      height: 48px;
      }

      .send-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 25px;
      font-size: 1.5rem;
      cursor: pointer;
      }

      .send-icon-blue {
        @extend .send-icon;
        color: #007bff;
      }
    }
    `
})
export class NewMessageComponent implements OnDestroy {
  message: string = ''

  @Output() messageEmit = new EventEmitter<IMessage>() // Message to send to parent component
  @Output() markAsReadFromChild = new EventEmitter<string>() // Mark as read to send to parent component

  @Input() user: Partial<IUser> = {} // Take current user data from parent component
  @Input() selectedUser: IUser = userInitialState // Take selected user data from parent component

  @ViewChild('textarea') textarea!: ElementRef<HTMLElement>

  private readonly destroy$ = new Subject<void>()

  constructor (
    @Inject(NewEntityService) private readonly newEntity: NewEntityService
  ) {}

  textareaChange (): void {
    this.textarea.nativeElement.style.height = '48px'

    const newHeight = Math.max(
      Number(this.textarea.nativeElement.scrollHeight),
      20
    )
    this.textarea.nativeElement.style.height = `${newHeight}px`
  }

  sendMessageAndSendResToParent (event: Event): void {
    event.preventDefault()

    if (this.selectedUser !== undefined && this.message.length > 0) {
      this.newEntity
        .newMessage(this.selectedUser.id, this.message)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.message = ''
            this.messageEmit.emit(res)
          }
        })
    }
  }

  markAsRead (userId: string): void {
    this.markAsReadFromChild.emit(userId)
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
