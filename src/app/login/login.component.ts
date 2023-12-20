import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { catchError, tap } from 'rxjs'
import { type IUser } from './IUser'
import { NgOptimizedImage } from '@angular/common'
import { LoginUserService } from './login-user.service'
import { Router } from '@angular/router'
import { AlertComponent } from '../alert/alert.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, AlertComponent, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usernameFound: boolean = false
  username: string = ''
  password: string = ''
  user: Partial<IUser> = {}
  authenticationStatus: boolean = false
  showAlert: boolean = false
  alertMessage: string = ''

  getUsernameText (username: string): void {
    this.username = username
  }

  getPasswordText (password: string): void {
    this.password = password
  }

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(LoginUserService)
    private readonly loginUsernameService: LoginUserService
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
          this.showAlert = true
          this.alertMessage = `User ${this.username} not found`

          setTimeout(() => {
            this.showAlert = false
          }, 2000)

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
            this.router
              .navigateByUrl('/')
              .then((_) => {
                console.log('User authenticated')
              })
              .catch((err) => {
                console.error('Error while redirecting to home page: ', err)
              })
          }
        })
      )
      .subscribe()
  }
}
