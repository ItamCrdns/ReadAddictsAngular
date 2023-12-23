import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../environment/environment'
import { Subject, type Observable, take } from 'rxjs'
import { type IUser } from '../app/login/IUser'
import { AlertService } from '../app/alert/alert.service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserService {
  private readonly currenUserSubject = new Subject<Partial<IUser>>()

  currentUser$: Observable<Partial<IUser>> =
    this.currenUserSubject.asObservable()

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router
  ) {}

  getCurrentUser (): Observable<Partial<IUser>> {
    const user$ = this.http.get<Partial<IUser>>(
      environment.apiUrl + 'User/current',
      {
        withCredentials: true
      }
    )

    user$.pipe(take(1)).subscribe({
      next: (res) => {
        this.currenUserSubject.next(res)
      },
      error: (_) => {
        this.alertService.setAlertValues(true, 'Please log in to continue')
        this.router.navigateByUrl('/login').catch((err) => {
          console.error('Error while redirecting to login', err)
        })
      }
    })

    return user$
  }
}
