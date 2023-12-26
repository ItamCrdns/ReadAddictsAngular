import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IComment } from './IComment'
import { environment } from '../../environment/environment'
import { type DataCountAndLimit } from './DataCountAndLimit'

@Injectable({
  providedIn: 'root'
})
export class GetCommentsService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getComments (
    id: number,
    page: number = 1,
    pageSize: number = 5
  ): Observable<DataCountAndLimit<IComment>> {
    return this.http.get<DataCountAndLimit<IComment>>(
      environment.apiUrl + 'Comment/' + id,
      {
        params: {
          page,
          pageSize
        },
        withCredentials: true
      }
    )
  }
}
