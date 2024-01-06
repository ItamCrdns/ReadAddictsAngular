import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { environment } from '../../../environment/environment'
import { type Observable } from 'rxjs'
import { type IMessage } from '../IMessage'

@Injectable({
  providedIn: 'root'
})
export class GetConversationService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  getConversation (
    page: number,
    limit: number,
    receiver: string,
    sender: string
  ): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(
      environment.apiUrl + 'Message/messages/conversation',
      {
        withCredentials: true,
        params: {
          page: page.toString(),
          pageSize: limit.toString(),
          receiver,
          sender
        }
      }
    )
  }
}
