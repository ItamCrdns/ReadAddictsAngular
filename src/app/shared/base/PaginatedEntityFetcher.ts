import { type ActivatedRoute, type Router } from '@angular/router'
import { BehaviorSubject, type Observable, Subject, takeUntil } from 'rxjs'
import { type DataCountPagesDto } from '../../../services/Get entity/DataCountPagesDto'

export abstract class PaginatedEntityFetcher<T> {
  items$ = new BehaviorSubject<DataCountPagesDto<T>>({
    data: [],
    count: 0,
    pages: 0
  })

  page: number = 5

  private readonly destroy$ = new Subject<void>()

  constructor (
    protected readonly router: Router,
    protected readonly route: ActivatedRoute
  ) {}

  // return getEntitySerivce.getWhatever(page, limit)
  protected abstract getItems (
    page: number,
    limit: number
  ): Observable<DataCountPagesDto<T>>

  protected loadItems (page: number, limit: number): void {
    this.getItems(page, limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const oldItems = this.items$.value
          this.items$.next({
            data: [...oldItems.data, ...res.data],
            count: res.count,
            pages: res.pages
          })
        }
      })
  }

  protected getPageFromQueryParams (): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        const page = params.get('page')
        this.page = page !== null ? +page : 5
      }
    })
  }

  protected navigateToPage (page: number): void {
    this.router
      .navigate([], {
        queryParams: {
          page
        }
      })
      .catch(console.error)
  }

  protected readonly observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && this.items$.value.count !== 0) {
        const allItemsCount = this.items$.value.count

        if (
          this.page >= allItemsCount ||
          this.items$.value.data.length >= allItemsCount
        ) {
          this.navigateToPage(allItemsCount)
          return
        }

        this.page++
        this.loadItems(this.page, 1)
        this.navigateToPage(this.page)
      }
    }
  )

  protected unobserve (target: Element): void {
    this.observer.unobserve(target)
  }

  protected observe (target: Element): void {
    this.observer.observe(target)
  }
}
