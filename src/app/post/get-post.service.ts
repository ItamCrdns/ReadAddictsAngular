import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IPost } from '../posts/IPost'
import { environment } from '../../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class GetPostService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getPost (id: number): Observable<IPost> {
    return this.http.get<IPost>(environment.apiUrl + 'Post/' + id, {
      withCredentials: true
    })
  }
}
