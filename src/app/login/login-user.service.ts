import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IUser } from './IUser'
import { environment } from '../../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getUsername (username: string): Observable<IUser> {
    return this.http.get<IUser>(
      environment.apiUrl + 'User/username/' + username
    )
  }

  authenticateUser (username: string, password: string): Observable<unknown> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })

    return this.http.post<unknown>(
      environment.apiUrl + 'User/login',
      { username, password },
      { headers, withCredentials: true }
    )
  }
}
