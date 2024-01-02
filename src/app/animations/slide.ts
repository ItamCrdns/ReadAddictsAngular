import { animate, style, transition, trigger } from '@angular/animations'

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ bottom: '-25px', opacity: 0 }),
    animate('0.25s ease-out')
  ]),
  transition(':leave', [
    animate('0.25s ease-out', style({ bottom: '-25px', opacity: 0 }))
  ])
])
