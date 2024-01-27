import { Component, Inject, type OnInit } from '@angular/core'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { navItems } from './navItems'
import { ionLogOutOutline } from '@ng-icons/ionicons'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'
import { Router, RouterLink } from '@angular/router'
import { AlertService } from '../../services/Alert/alert.service'
import { AuthService } from '../../services/Authentication/auth.service'
import { type Observable, take } from 'rxjs'
import { type IUser } from 'app/user/login/IUser'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent, AsyncPipe, RouterLink],
  providers: [
    provideIcons({ ionLogOutOutline }),
    provideNgIconsConfig({ size: '1.75rem' })
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  items = navItems
  toggle: boolean = false
  user$: Observable<Partial<IUser>> = this.authService.currentUser$

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(Router) private readonly router: Router
  ) {}

  toggleUserMenu (): void {
    this.toggle = !this.toggle
  }

  ngOnInit (): void {
    // we need to run the getCurrentUser somewhere and the navbar is the best place to do it (it's always there)
    this.authService.getCurrentUser()
    this.authService.updateLastSeen()
  }

  userLogOut (): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.status === 200) {
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
