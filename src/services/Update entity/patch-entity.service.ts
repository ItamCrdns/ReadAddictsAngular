import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { environment } from '../../environment/environment'
import { HttpClient, HttpParams } from '@angular/common/http'
import { type IImage } from 'app/posts/IPost'
import { type IEditPostResponse } from 'app/posts/post/edit-post/IEditPostResponse'

@Injectable({
  providedIn: 'root'
})
export class PatchEntityService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  markMessagesAsRead (userId: string): Observable<number> {
    const url = environment.apiUrl + 'messages/read-messages/' + userId

    return this.http.patch<number>(url, null, {
      withCredentials: true
    })
  }

  updatePostContent (id: string, content: string): Observable<string> {
    const url = environment.apiUrl + 'posts/' + id

    const params = new HttpParams().set('content', content)

    return this.http.patch<string>(url, null, {
      params,
      withCredentials: true
    })
  }

  removeImagesFromPost (id: string, imageIds: string[]): Observable<string[]> {
    const url = environment.apiUrl + 'posts/' + id + '/images/delete'

    return this.http.patch<string[]>(url, imageIds, {
      withCredentials: true
    })
  }

  addImagesToPost (id: string, fd: FormData): Observable<IImage[]> {
    const url = environment.apiUrl + 'posts/' + id + '/images/add'

    return this.http.patch<IImage[]>(url, fd, {
      withCredentials: true
    })
  }

  updatePost (id: string, fd: FormData): Observable<IEditPostResponse> {
    const url = environment.apiUrl + 'posts/' + id + '/update'

    return this.http.patch<IEditPostResponse>(url, fd, {
      withCredentials: true
    })
  }
}
