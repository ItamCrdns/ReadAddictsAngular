import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { HttpClient, HttpParams } from '@angular/common/http'
import { type IPost } from 'app/posts/IPost'

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

  updatePostContent (id: string, content: string): Observable<IPost> {
    const url = environment.apiUrl + 'posts/' + id

    const params = new HttpParams().set('content', content)

    return this.http.patch<IPost>(url, null, {
      params,
      withCredentials: true
    })
  }
}
