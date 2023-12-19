import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { catchError, tap, throwError } from 'rxjs'
import { type IUser } from './IUser'
import { NgOptimizedImage } from '@angular/common'
import { LoginUserService } from './login-user.service'

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

  getUsernameText (username: string): void {
    this.username = username
  }

  getPasswordText (password: string): void {
    this.password = password
  }

  constructor (
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
          return throwError(
            () => new Error('Something went wrong! ' + err.status)
          )
        })
      )
      .subscribe()
  }

  authenticateUser (): void {
    this.loginUsernameService
      .authenticateUser(this.username, this.password)
      .pipe(
        tap((res) => {
          console.log(res)
        })
      )
      .subscribe()
  }
}
