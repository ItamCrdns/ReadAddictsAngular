import { HttpClient, type HttpResponse } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class NewCommentService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  create (
    postId: number,
    comment: string,
    parentId?: number
  ): Observable<HttpResponse<number>> {
    return this.http.post<number>(
      environment.apiUrl + 'Comment/post/' + postId,
      { content: comment },
      {
        observe: 'response',
        withCredentials: true
      }
    )
  }
}
