import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'
import { type HttpErrorResponse } from '@angular/common/http'
import { AlertService } from '../../services/Alert/alert.service'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type IUser } from '../login/IUser'
import { GetEntityService } from '../../services/Get entity/get-entity.service'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage, DateAgoPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  // username: string = ''
  user$: Observable<IUser> = new Observable<IUser>()
  // user$ = this.getUserService.getUser(
  //   this.route.snapshot.params['username'] as string
  // )

  sub: Subscription = new Subscription()
  userSub: Subscription = new Subscription()

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(AlertService) private readonly alertService: AlertService
  ) {}

  ngOnInit (): void {
    this.userSub = this.route.params.subscribe((params) => {
      this.user$ = this.getEntityService.getUser(params['username'] as string)
    })

    this.sub = this.user$.subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.alertService.setAlertValues(
            true,
            'Sorry, we could not find the user you were looking for.'
          )
          this.router.navigate(['/']).catch((err) => {
            console.error('Error while redirecting', err)
          })
        }
      }
    })
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }
}
