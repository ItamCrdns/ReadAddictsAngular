import { Component, Inject, Input, type OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { type IComment } from './IComment'
import { GetCommentsService } from './get-comments.service'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'
import { DateAgoPipe } from '../pipes/date-ago.pipe'

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DateAgoPipe, CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() postId: number = 0
  comments$: Observable<IComment[]> = new Observable<IComment[]>()

  constructor (
    @Inject(GetCommentsService)
    private readonly getCommentsService: GetCommentsService
  ) {}

  ngOnInit (): void {
    // Logic here because Input() is not available in the constructor
    this.comments$ = this.getCommentsService.getComments(this.postId)
  }
}
