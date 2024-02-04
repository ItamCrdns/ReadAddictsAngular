import { Component, Inject, Input } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionCloseCircleSharp } from '@ng-icons/ionicons'
import { AlertService } from '../../services/Alert/alert.service'
import { slideInOut } from '../animations/slide'

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ ionCloseCircleSharp })],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [slideInOut]
})
export class AlertComponent {
  @Input() message: string = 'Set a default message...'
  @Input() show: boolean = false

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  closeAlert (): void {
    this.alertService.closeAlert()
  }
}
