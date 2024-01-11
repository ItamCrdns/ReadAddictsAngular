import { HttpClient, type HttpResponse } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../../environment/environment'
import { type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class NewPostService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  create (post: FormData): Observable<HttpResponse<number>> {
    return this.http.post<number>(environment.apiUrl + 'posts/create', post, {
      observe: 'response',
      withCredentials: true
    })
  }
}
