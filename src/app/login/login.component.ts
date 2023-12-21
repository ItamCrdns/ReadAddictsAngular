import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { catchError, tap } from 'rxjs'
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

  getUserData (): void {
    this.loginUsernameService
      .getUsername(this.username)
      .pipe(
        tap((res) => {
          this.usernameFound = true
          this.user = res
        }),
        catchError((err) => {
          this.alertService.setAlertValues(
            true,
            `User ${this.username} not found`
          )
          return err // Wrong
        })
      )
      .subscribe()
  }

  authenticateUser (): void {
    this.loginUsernameService
      .authenticateUser(this.username, this.password)
      .pipe(
        tap((res) => {
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
        }),
        catchError((res) => {
          if (res.status === 401) {
            this.alertService.setAlertValues(true, 'Incorrect password')
          }
          // handle other errors later
          return res // Wrong
        })
      )
      .subscribe()
  }
}
