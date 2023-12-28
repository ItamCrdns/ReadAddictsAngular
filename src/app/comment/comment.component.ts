import { Component, Inject, type OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
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
export class CommentComponent implements OnDestroy {
  comment$: Observable<IComment[]> = new Observable<IComment[]>()
  sub: Subscription = new Subscription()
  commentId: number = 0

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(GetCommentService)
    private readonly getCommentService: GetCommentService,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute
  ) {
    this.sub = this.route.params.subscribe((params) => {
      const id = +params['id']

      if (!isNaN(id) && id > 0) {
        this.comment$ = this.getCommentService.getComment(id)
      } else {
        this.router.navigate(['/']).catch((err) => {
          console.error('Error while redirecting', err)
        })
      }
      this.commentId = id
    })

    this.sub = this.comment$.subscribe({
      error: (err) => {
        if (err.status === 404) {
          this.router.navigate(['/']).catch((err) => {
            console.error('Error while redirecting', err)
          })
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }
}
