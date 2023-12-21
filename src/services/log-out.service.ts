import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../environment/environment'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LogOutService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  userLogOut (): Observable<string> {
    return this.http.get(environment.apiUrl + 'User/logout', {
      responseType: 'text',
      withCredentials: true
    })
  }
}
