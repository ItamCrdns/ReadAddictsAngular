import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IComment } from './IComment'
import { environment } from '../../environment/environment'
import { type DataCountPagesDto } from './DataCountPagesDto'

@Injectable({
  providedIn: 'root'
})
export class GetCommentsService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getComments (
    id: string,
    page: number = 1,
    limit: number = 5
  ): Observable<DataCountPagesDto<IComment>> {
    return this.http.get<DataCountPagesDto<IComment>>(
      environment.apiUrl + 'posts/' + id + '/comments',
      {
        params: {
          page,
          limit
        },
        withCredentials: true
      }
    )
  }
}
