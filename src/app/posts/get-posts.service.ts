import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../../environment/environment'
import { type IPost } from './IPost'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GetPostsService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getPosts (page: number = 1, pageSize: number = 1): Observable<IPost[]> {
    return this.http.get<IPost[]>(environment.apiUrl + 'Post/allposts', {
      params: {
        page,
        pageSize
      },
      withCredentials: true
    })
  }
}
