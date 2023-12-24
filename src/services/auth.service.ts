import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable, take, BehaviorSubject } from 'rxjs'
import { type IUser } from '../app/login/IUser'
import { environment } from '../environment/environment'
import { Router } from '@angular/router'
import { AlertService } from '../app/alert/alert.service'

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
    return this.http.get<IUser>(
      environment.apiUrl + 'User/username/' + username
    )
  }

  // Set the current user value after we login
  setCurrentUser (user: Partial<IUser>): void {
    this.currentUserSubject.next(user)
  }

  // Will be called on /login component after providing username and password
  login (username: string, password: string): Observable<Partial<IUser>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.post<Partial<IUser>>(
      environment.apiUrl + 'User/login',
      { username, password },
      { headers, withCredentials: true }
    )
  }

  // Gets the current user from the cookies, if any
  getCurrentUser (): Observable<Partial<IUser>> {
    const user$ = this.http.get<Partial<IUser>>(
      environment.apiUrl + 'User/current',
      {
        withCredentials: true
      }
    )

    user$.pipe(take(1)).subscribe({
      next: (res) => {
        this.currentUserSubject.next(res)
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

  // Clear current user as we are logging out
  removeCurrentUser (): void {
    this.currentUserSubject.next({})
  }
}
