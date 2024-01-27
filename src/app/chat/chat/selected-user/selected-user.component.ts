import { NgOptimizedImage } from '@angular/common'
import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DateAgoPipe } from '../../../pipes/date-ago.pipe'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionEllipsisVerticalSharp } from '@ng-icons/ionicons'
import { userInitialState, type IUser } from 'app/user/login/IUser'

@Component({
  selector: 'app-selected-user',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, DateAgoPipe, NgIconComponent],
  providers: [provideIcons({ ionEllipsisVerticalSharp })],
  template: `
    <div class="chat-header">
      <div class="user-wrapper">
        <img
          ngSrc="{{ selectedUser.profilePicture }}"
          alt="{{ selectedUser.userName }}"
          width="60"
          height="60"
        />
        <h1>
          <a [routerLink]="['/user', selectedUser.userName]">
            {{ '@' }}{{ selectedUser.userName }}
          </a>
        </h1>
        <p>{{ selectedUser.lastLogin | dateAgo }}</p>
      </div>
      <ng-icon class="vertical-ellipsis" name="ionEllipsisVerticalSharp" />
    </div>
  `,
  styles: `
  img {
    border-radius: 50%;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, .1);

    .vertical-ellipsis {
      font-size: 1.75rem;
      cursor: pointer;
    }

    .user-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;

      h1 {
        font-size: 32px;
        text-transform: capitalize;
        margin: 0;
        cursor: pointer;
      }
    }
  }
  `
})
export class SelectedUserComponent {
  @Input() selectedUser: IUser = userInitialState
}
