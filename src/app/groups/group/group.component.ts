import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import {
  type AfterViewInit,
  Component,
  Inject,
  type OnDestroy,
  type OnInit,
  ViewChild,
  type ElementRef
} from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { DateAgoPipe } from 'app/pipes/date-ago.pipe'
import { PostShowcaseComponent } from 'app/post-showcase/post-showcase.component'
import { type IPost } from 'app/posts/IPost'
import { NewPostComponent } from 'app/posts/new-post/new-post.component'
import { PaginatedEntityFetcher } from 'app/shared/base/PaginatedEntityFetcher'
import { type Observable } from 'rxjs'
import { type DataCountPagesDto } from 'services/Get entity/DataCountPagesDto'
import { GetEntityService } from 'services/Get entity/get-entity.service'

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    DateAgoPipe,
    PostShowcaseComponent,
    NewPostComponent
  ],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss', '../../posts/posts.component.scss']
})
export class GroupComponent
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

  groupId: string = this.route.snapshot.params['groupId'] as string

  group$ = this.getEntityService.getGroup(this.groupId)

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  protected getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<IPost>> {
    return this.getEntityService.getPostsByGroup(this.groupId, page, limit)
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
