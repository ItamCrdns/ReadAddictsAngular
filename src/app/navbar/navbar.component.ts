import { Component, Inject } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { navItems } from './navItems'
import { heroChatBubbleLeftRight } from '@ng-icons/heroicons/outline'
import { ionLogOutOutline } from '@ng-icons/ionicons'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'
import { LogOutService } from '../../services/log-out.service'
import { Router } from '@angular/router'
import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent],
  providers: [
    provideIcons({ heroChatBubbleLeftRight, ionLogOutOutline }),
    provideNgIconsConfig({ size: '1.75rem' }),
    LogOutService
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items = navItems
  toggle: boolean = false

  constructor (
    private readonly logOutService: LogOutService,
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(Router) private readonly router: Router
  ) {}

  toggleUserMenu (): void {
    this.toggle = !this.toggle
  }

  userLogOut (): void {
    this.logOutService.userLogOut().subscribe((res) => {
      if (res === 'Logged out') {
        this.alertService.setAlertValues(true, 'Successfully logged out')
        this.router.navigateByUrl('/login').catch((err) => {
          console.error('Error while redirecting to login', err)
        })
      }
    })
  }
}
