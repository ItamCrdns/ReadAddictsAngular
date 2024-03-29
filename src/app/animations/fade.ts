import { animate, style, transition, trigger } from '@angular/animations'

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('0.15s ease-out')]),
  transition(':leave', [animate('0.15s ease-out', style({ opacity: 0 }))])
])
