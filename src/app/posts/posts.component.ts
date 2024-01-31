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
import { type Observable } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'
import { PaginatedEntityFetcher } from '../shared/base/PaginatedEntityFetcher'
import { PostShowcaseComponent } from 'app/post-showcase/post-showcase.component'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [AsyncPipe, PostShowcaseComponent],
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
    super.clear()
  }

  ngAfterViewInit (): void {
    super.observe(this.loadMore.nativeElement)
  }
}
