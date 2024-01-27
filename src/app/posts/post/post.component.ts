import { Component, Inject, type OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet
} from '@angular/router'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Subscription, filter } from 'rxjs'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentsComponent } from '../../comments/comments.component'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { NewCommentComponent } from 'app/comments/new-comment/new-comment.component'

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
export class PostComponent implements OnDestroy {
  post$ = this.getEntityService.getPost(
    this.route.snapshot.params['postId'] as string
  )

  showComments: boolean = false
  // sub: Subscription = new Subscription()
  routerSub: Subscription = new Subscription()

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService
  ) {
    this.routerSub = this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          this.showComments = !event.url.includes('comment')
        }
      })
  }

  // ngOnInit (): void {
  //   this.sub = this.post$.subscribe({
  //     error: (_) => {
  //       this.alertService.setAlertValues(
  //         true,
  //         'Sorry, we could not find the post you were looking for.'
  //       )
  //       this.router.navigateByUrl('/').catch((err) => {
  //         console.error('Error while redirecting', err)
  //       })
  //     }
  //   })
  // }

  ngOnDestroy (): void {
    // this.sub.unsubscribe()
    this.routerSub.unsubscribe()
  }
}
