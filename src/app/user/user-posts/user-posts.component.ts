import {
  type AfterViewInit,
  Component,
  type OnDestroy,
  type OnInit,
  Inject,
  ViewChild,
  type ElementRef
} from '@angular/core'
import { PaginatedEntityFetcher } from '../../shared/base/PaginatedEntityFetcher'
import { type IPost } from '../../posts/IPost'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { type Observable, takeUntil } from 'rxjs'
import { type DataCountPagesDto } from '../../../services/Get entity/DataCountPagesDto'
import { GetEntityService } from '../../../services/Get entity/get-entity.service'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { DateAgoPipe } from '../../pipes/date-ago.pipe'

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [AsyncPipe, DateAgoPipe, NgOptimizedImage, RouterLink],
  templateUrl: '../../posts/posts.component.html', // ? Reuse the same template and styles. The only difference is the data source (getEntityService.getPosts vs getEntityService.getPostsByUser)
  styleUrl: '../../posts/posts.component.scss'
})
export class UserPostsComponent
  extends PaginatedEntityFetcher<IPost>
  implements OnInit, OnDestroy, AfterViewInit {
  username: string = ''

  constructor (
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(ActivatedRoute) override readonly route: ActivatedRoute,
    @Inject(Router) override readonly router: Router
  ) {
    super(router, route)
  }

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  protected override getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<IPost>> {
    return this.getEntityService.getPostsByUser(this.username, page, limit)
  }

  ngOnInit (): void {
    this.route.parent?.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        const username = params.get('username')
        if (username !== null) {
          this.username = username
        }
      }
    })

    super.getPageFromQueryParams()
    super.loadItems(1, this.page)
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
    super.unobserve(this.loadMore.nativeElement)
  }

  ngAfterViewInit (): void {
    super.observe(this.loadMore.nativeElement)
  }
}
