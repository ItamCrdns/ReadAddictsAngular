import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IUser } from '../login/IUser'
import { environment } from '../../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class GetUserService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getUser (username: string): Observable<IUser> {
    return this.http.get<IUser>(
      environment.apiUrl + 'User/username/' + username,
      {
        withCredentials: true
      }
    )
  }
}
