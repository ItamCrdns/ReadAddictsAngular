import {
  type AfterViewInit,
  Component,
  Inject,
  type OnDestroy,
  type OnInit,
  ViewChild,
  type ElementRef
} from '@angular/core'
import { GetPostsService } from './get-posts.service'
import { type Post } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { NgOptimizedImage } from '@angular/common'
import { tap, Subscription, catchError, throwError } from 'rxjs'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit, OnDestroy, AfterViewInit {
  posts: Post[] = []
  postsSubscription: Subscription = new Subscription()
  statusCode: number = 0
  page: number = 1
  pageSize: number = 1

  constructor (
    @Inject(GetPostsService) private readonly getPostsService: GetPostsService
  ) {}

  ngOnInit (): void {
    this.loadPosts(1, 5)
  }

  ngOnDestroy (): void {
    this.postsSubscription.unsubscribe()
    this.observer.unobserve(this.loadMore.nativeElement)
  }

  private loadPosts (page: number, pageSize: number): void {
    this.postsSubscription = this.getPostsService
      .getPosts(page, pageSize)
      .pipe(
        tap((res) => {
          this.posts = [...this.posts, ...res]
        }),
        catchError((err) => {
          this.statusCode = err.status

          return throwError(() => new Error('Not logged in ' + err.status))
        })
      )
      .subscribe()
  }

  private readonly observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        this.page++
        this.loadPosts(this.page, this.pageSize)
      }
    }
  )

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  ngAfterViewInit (): void {
    this.observer.observe(this.loadMore.nativeElement)
  }
}
