import { HttpClient, type HttpResponse } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable, BehaviorSubject } from 'rxjs'
import { environment } from '../../environment/environment'
import { Router } from '@angular/router'
import { AlertService } from '../Alert/alert.service'
import { type IUser } from 'app/user/login/IUser'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<Partial<IUser>>({})
  currentUser$: Observable<Partial<IUser>> =
    this.currentUserSubject.asObservable()

  constructor (
    @Inject(AlertService) private readonly alertService: AlertService,
    @Inject(HttpClient) private readonly http: HttpClient,
    @Inject(Router) private readonly router: Router
  ) {}

  // Get the username in the /login component
  getUsername (username: string): Observable<IUser> {
    return this.http.get<IUser>(environment.apiUrl + 'users/' + username)
  }

  // Set the current user value after we login
  setCurrentUser (user: Partial<IUser>): void {
    this.currentUserSubject.next(user)
  }

  // Will be called on /login component after providing username and password
  login (username: string, password: string): Observable<Partial<IUser>> {
    const url = environment.apiUrl + 'users/login'

    const options = {
      params: {
        username,
        password
      },
      withCredentials: true
    }

    return this.http.post<Partial<IUser>>(url, null, options)
  }

  logout (): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(
      environment.apiUrl + 'users/logout',
      null,
      {
        observe: 'response',
        withCredentials: true
      }
    )
  }

  // Gets the current user from the cookies, if any
  getCurrentUser (): Observable<Partial<IUser>> {
    const user$ = this.http.get<Partial<IUser>>(
      environment.apiUrl + 'users/current',
      {
        withCredentials: true
      }
    )

    user$.subscribe({
      next: (res) => {
        this.currentUserSubject.next(res)
      },
      error: (_) => {
        this.alertService.popAlert('Please log in to continue')
        this.router.navigateByUrl('/login').catch((err) => {
          console.error('Error while redirecting to login', err)
        })
      }
    })

    return user$
  }

  // Updates users last seen
  updateLastSeen (): void {
    const refresh$ = this.http.post(
      environment.apiUrl + 'users/refresh',
      null,
      {
        withCredentials: true
      }
    )

    // Discard the response we don't need it
    refresh$.subscribe({
      next: () => {}
    })
  }

  // Clear current user as we are logging out
  removeCurrentUser (): void {
    this.currentUserSubject.next({})
  }
}
