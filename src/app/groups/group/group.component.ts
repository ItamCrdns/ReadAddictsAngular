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
import { takeUntil, type Observable, BehaviorSubject } from 'rxjs'
import { AlertService } from 'services/Alert/alert.service'
import { type DataCountPagesDto } from 'services/Get entity/DataCountPagesDto'
import { GetEntityService } from 'services/Get entity/get-entity.service'
import { type OperationResult } from 'services/New entity/OperationResult'
import { NewEntityService } from 'services/New entity/new-entity.service'
import { groupInitialState, type IGroup } from '../IGroup'

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
  groupId: string = this.route.snapshot.params['groupId'] as string
  isMember: boolean = false
  membersCount: number = 0
  group$ = new BehaviorSubject<IGroup>(groupInitialState)

  constructor (
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(NewEntityService)
    private readonly newEntityService: NewEntityService,
    @Inject(ActivatedRoute) override readonly route: ActivatedRoute,
    @Inject(Router) override readonly router: Router,
    @Inject(AlertService)
    private readonly alertService: AlertService
  ) {
    super(router, route)
  }

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>

  protected getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<IPost>> {
    return this.getEntityService.getPostsByGroup(this.groupId, page, limit)
  }

  ngOnInit (): void {
    this.getEntityService
      .getGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((group: IGroup) => {
        this.isMember = group.isMember ?? false
        this.membersCount = group.membersCount
        this.group$.next(group)
      })

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

  joinGroup (): void {
    this.newEntityService
      .joinGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.alertService.popAlert(res.message ?? '')

          const currentGroup = this.group$.value

          if (res.data !== undefined) {
            this.isMember = true
            this.membersCount += 1
            this.group$.next({
              ...currentGroup,
              users: [...currentGroup.users, res.data]
            })
          }
        },
        error: (err) => {
          const error: OperationResult = err.error
          this.alertService.popAlert(error.message ?? '')
        }
      })
  }

  leaveGroup (): void {
    this.newEntityService
      .leaveGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.alertService.popAlert(res.message ?? '')

          const currentGroup = this.group$.value

          if (res.data !== undefined) {
            this.isMember = false
            this.membersCount -= 1
            this.group$.next({
              ...currentGroup,
              users: currentGroup.users.filter(
                (user) => user.id !== res.data?.id
              )
            })
          }
        },
        error: (err) => {
          const error: OperationResult = err.error
          this.alertService.popAlert(error.message ?? '')
        }
      })
  }
}
