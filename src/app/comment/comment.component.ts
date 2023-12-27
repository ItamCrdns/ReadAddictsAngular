import { Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetCommentService } from './get-comment.service'
import { Observable, Subscription } from 'rxjs'
import { type IComment } from '../comments/IComment'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { RecursiveCommentComponent } from './recursive-comment/recursive-comment.component'

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RecursiveCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: '../comments/comments.component.scss'
})
export class CommentComponent implements OnInit, OnDestroy {
  comment$: Observable<IComment[]> = new Observable<IComment[]>()
  commentId: number = 0
  sub: Subscription = new Subscription()

  constructor (
    @Inject(GetCommentService)
    private readonly getCommentService: GetCommentService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute
  ) {}

  ngOnInit (): void {
    // ? sub to listen to changes of the comment id from the url
    this.sub = this.route.params.subscribe((params) => {
      this.commentId = params['id'] as number
      this.comment$ = this.getCommentService.getComment(this.commentId)
    })
  }

  ngOnDestroy (): void {
    this.commentId = 0
    this.sub.unsubscribe()
  }
}
