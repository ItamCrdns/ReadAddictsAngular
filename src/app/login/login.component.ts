import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { take } from 'rxjs'
import { type IUser } from './IUser'
import { NgOptimizedImage } from '@angular/common'
import { LoginUserService } from './login-user.service'
import { Router } from '@angular/router'
import { AlertService } from '../alert/alert.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usernameFound: boolean = false
  username: string = ''
  password: string = ''
  user: Partial<IUser> = {}
  authenticationStatus: boolean = false

  getUsernameText (username: string): void {
    this.username = username
  }

  getPasswordText (password: string): void {
    this.password = password
  }

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(LoginUserService)
    private readonly loginUsernameService: LoginUserService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  getUser (): void {
    this.loginUsernameService
      .getUsername(this.username)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.usernameFound = true
          this.user = res
        },
        error: (err) => {
          if (err.status === 404) {
            this.alertService.setAlertValues(
              true,
              `User ${this.username} not found`
            )
          }
        }
      })
  }

  loginUser (): void {
    this.loginUsernameService
      .authenticateUser(this.username, this.password)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res !== null) {
            this.alertService.setAlertValues(
              true,
              `Welcome back, ${this.username
                .slice(0, 1)
                .toUpperCase()}${this.username.slice(1).toLowerCase()}`
            )
            this.router.navigateByUrl('/').catch((err) => {
              console.error('Error while redirecting to home page: ', err)
            })
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.alertService.setAlertValues(true, 'Incorrect password')
          }
        }
      })
  }
}
