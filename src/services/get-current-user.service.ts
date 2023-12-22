import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../environment/environment'
import { type Observable } from 'rxjs'
import { type IUser } from '../app/login/IUser'

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getCurrentUser (): Observable<Partial<IUser>> {
    return this.http.get<Partial<IUser>>(environment.apiUrl + 'User/current', {
      withCredentials: true
    })
  }
}
