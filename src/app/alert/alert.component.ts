import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations'
import { Component, Input } from '@angular/core'

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
  transition('open => close', [animate('.5s 5s ease-out')]), // * Alert stays open for 5 seconds (currently handling this in the parent component with a setTimeout)
  transition('close => open', [animate('.5s 0s  ease-out')])
])

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  animations: [fadeInOut]
})
export class AlertComponent {
  @Input() message: string = 'Set a default message...'
  @Input() show: boolean = false
}
