import {
  HttpClient,
  HttpParams,
  type HttpResponse
} from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { type IComment } from '../../app/comments/IComment'
import { type IMessage } from '../../app/chat/IMessage'

@Injectable({
  providedIn: 'root'
})
export class NewEntityService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  newPost (post: FormData): Observable<HttpResponse<number>> {
    const url = environment.apiUrl + 'posts/create'

    return this.http.post<number>(url, post, {
      observe: 'response',
      withCredentials: true
    })
  }

  newComment (
    comment: string,
    postId: string,
    parentId?: string
  ): Observable<HttpResponse<IComment>> {
    const url = environment.apiUrl + 'comments'

    let params = new HttpParams().set('comment', comment).set('postId', postId)

    if (parentId !== undefined) {
      params = params.set('parentId', parentId)
    }

    return this.http.post<IComment>(url, null, {
      params,
      observe: 'response',
      withCredentials: true
    })
  }

  newMessage (receiverId: string, message: string): Observable<IMessage> {
    const url = environment.apiUrl + 'messages/send/' + receiverId

    const params = new HttpParams().set('message', message)

    return this.http.post<IMessage>(url, null, {
      params,
      withCredentials: true
    })
  }
}
