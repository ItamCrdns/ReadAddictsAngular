import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PatchEntityService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  markMessagesAsRead (userId: string): Observable<number> {
    const url = environment.apiUrl + 'messages/read-messages/' + userId

    return this.http.patch<number>(url, null, {
      withCredentials: true
    })
  }
}
