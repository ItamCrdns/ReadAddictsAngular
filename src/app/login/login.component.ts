import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { GetusernameService } from './get-username.service'
import { catchError, tap, throwError } from 'rxjs'
import { type IUser } from './IUser'
import { NgOptimizedImage } from '@angular/common'

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
    @Inject(GetusernameService)
    private readonly getUsernameService: GetusernameService
  ) {}

  getUserData (): void {
    this.getUsernameService
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
    // TODO: Authenticate user
  }
}
