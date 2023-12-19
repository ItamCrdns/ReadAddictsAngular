import { Component } from '@angular/core'
import { InputComponent } from '../input/input.component'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usernameFound: boolean = false
  username: string = ''

  getUsernameText (username: string): void {
    this.username = username
  }
}
