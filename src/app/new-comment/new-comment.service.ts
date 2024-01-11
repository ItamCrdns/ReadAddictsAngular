import {
  HttpClient,
  HttpParams,
  type HttpResponse
} from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { type IComment } from '../comments/IComment'

@Injectable({
  providedIn: 'root'
})
export class NewCommentService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  create (
    comment: string,
    postId: string,
    parentId?: string
  ): Observable<HttpResponse<IComment>> {
    const url = environment.apiUrl + 'comments'

    let params = new HttpParams()
      .set('comment', comment)
      .set('postId', postId)

    if (parentId !== undefined) {
      params = params.set('parentId', parentId)
    }

    return this.http.post<IComment>(url, null, {
      params,
      observe: 'response',
      withCredentials: true
    })
  }
}
