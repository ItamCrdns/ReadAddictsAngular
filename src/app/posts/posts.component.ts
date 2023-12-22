import {
  type AfterViewInit,
  Component,
  Inject,
  type OnDestroy,
  ViewChild,
  type ElementRef
} from '@angular/core'
import { GetPostsService } from './get-posts.service'
import { type Post } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type Observable, BehaviorSubject, tap, take } from 'rxjs'
import { CommonModule, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnDestroy, AfterViewInit {
  private readonly postsSubject = new BehaviorSubject<Post[]>([])
  posts$: Observable<Post[]> = this.postsSubject.asObservable()
  statusCode: number = 0
  page: number = 5

  constructor (
    @Inject(GetPostsService) private readonly getPostsService: GetPostsService
  ) {
    this.loadPosts(1, 5)
  }

  private loadPosts (page: number, limit: number): void {
    this.getPostsService
      .getPosts(page, limit)
      .pipe(
        take(1),
        tap((newPosts) => {
          const oldPosts = this.postsSubject.getValue()
          // ? Accumulate the posts in the posts BehaviorSubject
          this.postsSubject.next([...oldPosts, ...newPosts])
        })
      )
      .subscribe()
  }

  ngOnDestroy (): void {
    this.observer.unobserve(this.loadMore.nativeElement)
  }

  private readonly observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      // We check if the initial posts are loaded before loading more posts. This fixes an error where sometimes the first post we see its the 6th
      if (
        entries[0].isIntersecting &&
        this.postsSubject.getValue().length !== 0
      ) {
        this.page++
        this.loadPosts(this.page, 1)
      }
    }
  )

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  ngAfterViewInit (): void {
    this.observer.observe(this.loadMore.nativeElement)
  }
}
