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
import { type Observable } from 'rxjs'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'
import { PaginatedEntityFetcher } from '../shared/base/PaginatedEntityFetcher'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, AsyncPipe, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent
  extends PaginatedEntityFetcher<IPost>
  implements OnInit, OnDestroy, AfterViewInit {
  constructor (
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(ActivatedRoute) override readonly route: ActivatedRoute,
    @Inject(Router) override readonly router: Router
  ) {
    super(router, route)
  }

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  protected getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<IPost>> {
    return this.getEntityService.getPosts(page, limit)
  }

  ngOnInit (): void {
    super.getPageFromQueryParams()
    super.loadItems(1, this.page)
  }

  ngOnDestroy (): void {
    super.unobserve(this.loadMore.nativeElement)
  }

  ngAfterViewInit (): void {
    super.observe(this.loadMore.nativeElement)
  }
}
