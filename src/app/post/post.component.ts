import { Component, Inject, type OnInit } from '@angular/core'
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet
} from '@angular/router'
import { GetPostService } from './get-post.service'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { type IPost } from '../posts/IPost'
import { Observable, filter } from 'rxjs'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { CommentsComponent } from '../comments/comments.component'
import { NewCommentComponent } from '../new-comment/new-comment.component'

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    RouterOutlet,
    DateAgoPipe,
    NgOptimizedImage,
    AsyncPipe,
    RouterLink,
    CommentsComponent,
    NewCommentComponent,
    RouterModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post$: Observable<IPost> = new Observable<IPost>()
  showComments: boolean = false

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router,
    @Inject(GetPostService) private readonly getPostService: GetPostService
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe({
        next: (event: NavigationEnd) => {
          this.showComments = !event.url.includes('comment')
        }
      })
  }

  ngOnInit (): void {
    this.post$ = this.getPostService.getPost(
      this.route.snapshot.params['postId'] as number
    )
  }
}
