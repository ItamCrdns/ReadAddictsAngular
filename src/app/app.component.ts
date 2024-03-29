import { Component, Inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavbarComponent } from './navbar/navbar.component'
import { AlertComponent } from './alert/alert.component'
import { AlertService } from '../services/Alert/alert.service'
import { OpenChatButtonComponent } from './chat/open-chat-button/open-chat-button.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AlertComponent, OpenChatButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showAlert: boolean = false
  alertMessage: string = ''

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService
  ) {
    this.alertService.getAlertValues().subscribe((res) => {
      this.showAlert = res.showAlert
      this.alertMessage = res.alertMessage
    })
  }
}
