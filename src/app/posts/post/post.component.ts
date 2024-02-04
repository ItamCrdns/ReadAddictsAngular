import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet
} from '@angular/router'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { BehaviorSubject, Subject, filter, takeUntil } from 'rxjs'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'
import { CommentsComponent } from '../../comments/comments.component'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { NewCommentComponent } from 'app/comments/new-comment/new-comment.component'
import { ImageComponent } from 'app/image/image.component'
import { imageInitialState, type IImage, type IPost } from '../IPost'
import { fadeInOut } from 'app/animations/fade'
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig
} from '@ng-icons/core'
import { ionPencil } from '@ng-icons/ionicons'
import { EditPostComponent } from './edit-post/edit-post.component'

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
    ImageComponent,
    NgIconComponent,
    EditPostComponent
  ],
  providers: [
    provideIcons({ ionPencil }),
    provideNgIconsConfig({
      size: '30px'
    })
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  animations: [fadeInOut]
})
export class PostComponent implements OnInit, OnDestroy {
  private readonly postSubject = new BehaviorSubject<IPost | null>(null)
  post$ = this.postSubject.asObservable()

  showComments: boolean = false
  selectedImage: IImage = imageInitialState
  editMode: boolean = true

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

  ngOnInit (): void {
    this.getEntityService
      .getPost(this.route.snapshot.params['postId'] as string)
      .subscribe({
        next: (post) => {
          this.postSubject.next(post)
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

  toggleEditMode (): void {
    this.editMode = !this.editMode
  }

  updatePostContent (newContent: string): void {
    this.editMode = false
    console.log(newContent)
  }
}
