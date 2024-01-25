import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Inject, type OnInit, type OnDestroy } from '@angular/core'
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router'
import { type Observable, Subject, takeUntil } from 'rxjs'
import { AlertService } from '../../services/Alert/alert.service'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { type IUser } from '../login/IUser'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { type HttpErrorResponse } from '@angular/common/http'
import { AuthService } from '../../services/Authentication/auth.service'
import {
  type ISendMessage,
  OpenChatService
} from '../../services/Open chat/open-chat.service'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    DateAgoPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  user: Partial<IUser> = {}
  currentUser$: Observable<Partial<IUser>> = this.authService.currentUser$

  currentToggleValue: boolean = false

  private readonly destroy$ = new Subject<void>()

  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetEntityService)
    private readonly getEntityService: GetEntityService,
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(OpenChatService) private readonly openChatService: OpenChatService
  ) {}

  ngOnInit (): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getEntityService
        .getUser(params['username'] as string)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: Partial<IUser>) => {
            this.user = user
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 404) {
              this.alertService.setAlertValues(
                true,
                'Sorry, we could not find the user you were looking for.'
              )
            }
            this.router.navigate(['/']).catch((err) => {
              console.error('Error while redirecting', err)
            })
          }
        })
    })

    this.openChatService.toggle$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.currentToggleValue = res.toggle
      })
  }

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  openChat (userId: string | undefined): void {
    if (userId !== undefined) {
      const newState: ISendMessage = {
        toggle: !this.currentToggleValue,
        userId
      }

      this.openChatService.updateToggle(newState)
    }
  }
}
