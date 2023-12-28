import { Component, Inject } from '@angular/core'
import { InputComponent } from '../../input/input.component'
import { AuthService } from '../../../services/auth.service'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { type Observable } from 'rxjs'
import { type IUser } from '../../login/IUser'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [InputComponent, NgOptimizedImage, CommonModule, FormsModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss'
})
export class ReplyComponent {
  user$: Observable<Partial<IUser>> = this.authService.currentUser$

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {}
}
