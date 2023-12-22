import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../environment/environment'
import { Subject, type Observable, take } from 'rxjs'
import { type IUser } from '../app/login/IUser'

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserService {
  private readonly currenUserSubject = new Subject<Partial<IUser>>()

  currentUser$: Observable<Partial<IUser>> =
    this.currenUserSubject.asObservable()

  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

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
      }
    })

    return user$
  }
}
