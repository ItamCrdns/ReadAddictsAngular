import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Inject, type OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetUserService } from './get-user.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AsyncPipe, NgOptimizedImage],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnDestroy {
  user$ = this.getUserService.getUser(
    this.route.snapshot.params['username'] as string
  )

  sub: Subscription = new Subscription()

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetUserService) private readonly getUserService: GetUserService
  ) {
    this.sub = this.user$.subscribe({
      error: (err) => {
        console.log(err.status)
      }
    })
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe()
  }
}
