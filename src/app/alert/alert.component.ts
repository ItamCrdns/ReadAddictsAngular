import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations'
import { Component, Inject, Input } from '@angular/core'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionCloseCircleSharp } from '@ng-icons/ionicons'
import { AlertService } from './alert.service'

const fadeInOut = trigger('fadeInOut', [
  state(
    'open',
    style({
      bottom: 25,
      opacity: 1
    })
  ),
  state(
    'close',
    style({
      bottom: 0,
      opacity: 0
    })
  ),
  transition('open => close', [animate('.5s 0s ease-out')]), // * Alert stays open for 5 seconds (currently handling this in the parent component with a setTimeout)
  transition('close => open', [animate('.5s 0s  ease-out')])
])

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ ionCloseCircleSharp })],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [fadeInOut]
})
export class AlertComponent {
  @Input() message: string = 'Set a default message...'
  @Input() show: boolean = false

  constructor (@Inject(AlertService) private readonly alertService: AlertService) {

  }

  closeAlert (): void {
    this.alertService.setAlertValues(false, this.message)
  }
}
