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
import { Subject, filter, takeUntil } from 'rxjs'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentsComponent } from '../../comments/comments.component'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { NewCommentComponent } from 'app/comments/new-comment/new-comment.component'
import { ImageComponent } from 'app/image/image.component'
import { imageInitialState, type IImage } from '../IPost'
import { fadeInOut } from 'app/animations/fade'

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
    RouterModule,
    ImageComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  animations: [fadeInOut]
})
export class PostComponent implements OnDestroy {
  post$ = this.getEntityService.getPost(
    this.route.snapshot.params['postId'] as string
  )

  showComments: boolean = false
  selectedImage: IImage = imageInitialState

  private readonly destroy$ = new Subject<void>()

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(Router) private readonly router: Router,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService
  ) {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (event: NavigationEnd) => {
          this.showComments = !event.url.includes('comment')
        }
      })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  selectImage (img: IImage): void {
    this.selectedImage = img
  }

  closeImageModal (): void {
    this.selectedImage = imageInitialState
  }
}
