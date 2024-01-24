import {
  type AfterViewInit,
  Component,
  Inject,
  type OnDestroy,
  ViewChild,
  type ElementRef,
  type OnInit
} from '@angular/core'
import { type IPost } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { BehaviorSubject, Subject, takeUntil } from 'rxjs'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, AsyncPipe, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit, OnDestroy, AfterViewInit {
  posts$ = new BehaviorSubject<DataCountPagesDto<IPost>>({
    data: [],
    count: 0,
    pages: 0
  })

  page: number = 5

  private readonly destroy$ = new Subject<void>()

  constructor (
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute
  ) {}

  private loadPosts (page: number, limit: number): void {
    this.getEntityService
      .getPosts(page, limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const oldPosts = this.posts$.value
          this.posts$.next({
            data: [...oldPosts.data, ...res.data],
            count: res.count,
            pages: res.pages
          })
        }
      })
  }

  ngOnInit (): void {
    this.route.queryParamMap.subscribe({
      next: (params) => {
        const page = params.get('page')
        this.page = page !== null ? +page : 5
      }
    })
    this.loadPosts(1, this.page)
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.observer.unobserve(this.loadMore.nativeElement)
  }

  private navigateToPageQuery (page: number): void {
    this.router
      .navigate([], {
        queryParams: { page },
        queryParamsHandling: 'merge' // preserve the existing query params
      })
      .catch((err) => {
        console.log(err)
      })
  }

  private readonly observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      // We check if the initial posts are loaded before loading more posts. This fixes an error where sometimes the first post we see its the 6th
      if (entries[0].isIntersecting && this.posts$.value.count !== 0) {
        const allPostsCount = this.posts$.value.count

        // This guard clause prevents the user from loading more posts than there are
        if (
          this.page >= allPostsCount ||
          this.posts$.value.data.length >= allPostsCount
        ) {
          this.navigateToPageQuery(allPostsCount)
          return
        }

        this.page++
        this.loadPosts(this.page, 1)
        this.navigateToPageQuery(this.page)
      }
    }
  )

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  ngAfterViewInit (): void {
    this.observer.observe(this.loadMore.nativeElement)
  }
}
