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
import { type IUser } from '../login/IUser'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { type Observable } from 'rxjs'
import { type DataCountPagesDto } from '../../services/Get entity/DataCountPagesDto'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, AsyncPipe, RouterLink],
  templateUrl: './readers.component.html',
  styleUrl: './readers.component.scss'
})
export class ReadersComponent
  extends PaginatedEntityFetcher<IUser>
  implements OnInit, OnDestroy, AfterViewInit {
  constructor (
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(ActivatedRoute) override readonly route: ActivatedRoute,
    @Inject(Router) override readonly router: Router
  ) {
    super(router, route)
  }

  protected getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<IUser>> {
    return this.getEntityService.getUsers(page, limit)
  }

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

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
