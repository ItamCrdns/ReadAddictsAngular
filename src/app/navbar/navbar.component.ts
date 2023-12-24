import { Component, Inject, type OnInit } from '@angular/core'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { navItems } from './navItems'
import { heroChatBubbleLeftRight } from '@ng-icons/heroicons/outline'
import { ionLogOutOutline } from '@ng-icons/ionicons'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'
import { LogOutService } from '../../services/log-out.service'
import { Router, RouterLink } from '@angular/router'
import { AlertService } from '../alert/alert.service'
import { AuthService } from '../../services/auth.service'
import { take } from 'rxjs'
import { type IUser } from '../login/IUser'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent, CommonModule, RouterLink],
  providers: [
    provideIcons({ heroChatBubbleLeftRight, ionLogOutOutline }),
    provideNgIconsConfig({ size: '1.75rem' }),
    LogOutService
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  items = navItems
  toggle: boolean = false
  currentUser: Partial<IUser> = {}

  constructor (
    private readonly logOutService: LogOutService,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(Router) private readonly router: Router
  ) {
    this.authService.currentUser$.subscribe((res) => {
      this.currentUser = res
    })
  }

  toggleUserMenu (): void {
    this.toggle = !this.toggle
  }

  ngOnInit (): void {
    this.authService.getCurrentUser()
  }

  userLogOut (): void {
    this.logOutService
      .userLogOut()
      .pipe(take(1))
      .subscribe((res) => {
        if (res === 'Logged out') {
          this.toggle = false
          this.authService.removeCurrentUser()
          this.alertService.setAlertValues(true, 'Successfully logged out')
          this.router.navigateByUrl('/login').catch((err) => {
            console.error('Error while redirecting to login', err)
          })
        }
      })
  }
}
