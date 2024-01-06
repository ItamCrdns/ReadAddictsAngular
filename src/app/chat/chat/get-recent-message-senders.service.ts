import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type IUser } from '../../login/IUser'
import { environment } from '../../../environment/environment'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GetRecentMessageSendersService {
  // ? Gets ordered list of users that have sent a message to the current user
  constructor (@Inject(HttpClient) private readonly http: HttpClient) { }

  getRecentMessageSenders (): Observable<Partial<IUser[]>> {
    return this.http.get<Partial<IUser[]>>(environment.apiUrl + 'Message/users', {
      withCredentials: true
    })
  }
}
