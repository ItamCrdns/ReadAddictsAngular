import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IComment } from '../comments/IComment'
import { environment } from '../../environment/environment'

@Injectable({
  providedIn: 'root'
})
export class GetCommentService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getComment (id: string): Observable<IComment> {
    return this.http.get<IComment>(environment.apiUrl + 'comments/' + id, {
      withCredentials: true
    })
  }
}
