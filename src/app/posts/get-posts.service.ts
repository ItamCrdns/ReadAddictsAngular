import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../../environment/environment'
import { type Post } from './IPost'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GetPostsService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getPosts (): Observable<Post[]> {
    return this.http.get<Post[]>(environment.apiUrl + 'Post/allposts', {
      params: {
        page: '1',
        pageSize: '10'
      },
      withCredentials: true
    })
  }
}
