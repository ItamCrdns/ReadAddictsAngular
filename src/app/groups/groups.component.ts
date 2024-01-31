import {
  type AfterViewInit,
  Component,
  type OnDestroy,
  type OnInit,
  Inject,
  ViewChild,
  type ElementRef
} from '@angular/core'
import { PaginatedEntityFetcher } from '../shared/base/PaginatedEntityFetcher'
import { type IGroup } from './IGroup'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { type Observable } from 'rxjs'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, RouterLink],
  templateUrl: './groups.component.html',
  styleUrl: '../readers/readers.component.scss' // pretty similar styles
})
export class GroupsComponent
  extends PaginatedEntityFetcher<IGroup>
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
  ): Observable<DataCountPagesDto<IGroup>> {
    return this.getEntityService.getGroups(page, limit)
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
