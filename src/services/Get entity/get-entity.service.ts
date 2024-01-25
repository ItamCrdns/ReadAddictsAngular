import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type IUser } from '../../app/login/IUser'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { type IPost } from '../../app/posts/IPost'
import { type DataCountPagesDto } from './DataCountPagesDto'
import { type IComment } from '../../app/comments/IComment'

@Injectable({
  providedIn: 'root'
})
export class GetEntityService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getUser (username: string): Observable<IUser> {
    return this.http.get<IUser>(environment.apiUrl + 'users/' + username, {
      withCredentials: true
    })
  }

  getUserById (id: string): Observable<IUser> {
    return this.http.get<IUser>(environment.apiUrl + 'users/id/' + id, {
      withCredentials: true
    })
  }

  getPosts (
    page: number = 1,
    limit: number = 1
  ): Observable<DataCountPagesDto<IPost>> {
    return this.http.get<DataCountPagesDto<IPost>>(
      environment.apiUrl + 'posts/all',
      {
        params: {
          page,
          limit
        },
        withCredentials: true
      }
    )
  }

  getPost (id: string): Observable<IPost> {
    return this.http.get<IPost>(environment.apiUrl + 'posts/' + id, {
      withCredentials: true
    })
  }

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

  getComment (id: string): Observable<IComment> {
    return this.http.get<IComment>(environment.apiUrl + 'comments/' + id, {
      withCredentials: true
    })
  }

  getUnreadMsgCount (): Observable<number> {
    return this.http.get<number>(
      environment.apiUrl + 'messages/notification-count',
      {
        withCredentials: true
      }
    )
  }

  getUsers (
    page: number = 1,
    limit: number = 5
  ): Observable<DataCountPagesDto<IUser>> {
    return this.http.get<DataCountPagesDto<IUser>>(
      environment.apiUrl + 'users/all',
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
