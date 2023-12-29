import {
  type AfterViewInit,
  Component,
  Inject,
  type OnDestroy,
  ViewChild,
  type ElementRef,
  type OnInit
} from '@angular/core'
import { GetPostsService } from './get-posts.service'
import { type IPost } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type Observable, BehaviorSubject, tap, take } from 'rxjs'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, AsyncPipe, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly postsSubject = new BehaviorSubject<IPost[]>([])
  posts$: Observable<IPost[]> = this.postsSubject.asObservable()
  page: number = 5

  constructor (
    @Inject(GetPostsService) private readonly getPostsService: GetPostsService
  ) {}

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

  ngOnInit (): void {
    this.loadPosts(1, 5)
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
