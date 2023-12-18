import { Component } from '@angular/core'
import { NgOptimizedImage } from '@angular/common'
import { navItems } from './navItems'
import { heroChatBubbleLeftRight } from '@ng-icons/heroicons/outline'
import { ionLogOutOutline } from '@ng-icons/ionicons'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgOptimizedImage, NgIconComponent],
  providers: [
    provideIcons({ heroChatBubbleLeftRight, ionLogOutOutline }),
    provideNgIconsConfig({ size: '1.75rem' })
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  items = navItems
  toggle: boolean = true

  toggleUserMenu (): void {
    this.toggle = !this.toggle
  }
}
