import { CommonModule, NgOptimizedImage } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { InputComponent } from '../input/input.component'
import { FormsModule, type NgForm } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { type IUser } from '../login/IUser'

@Component({
  selector: 'app-new-comment',
  standalone: true,
  imports: [NgOptimizedImage, InputComponent, CommonModule, FormsModule],
  templateUrl: './new-comment.component.html',
  styleUrl: '../new-post/new-post.component.scss' // pretty much the same styles as new-post
})
export class NewCommentComponent {
  user: Partial<IUser> = {}
  content: string = ''

  constructor (
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {
    this.authService.currentUser$.subscribe((res) => {
      this.user = res
    })
  }

  createNewComment (newComment: NgForm): void {}
}
