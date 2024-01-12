import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { type Observable } from 'rxjs'
import { type IUser } from '../../app/login/IUser'
import { environment } from '../../environment/environment'
import { type IMessage } from '../../app/chat/IMessage'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor (@Inject(HttpClient) private readonly http: HttpClient) {}

  // ? Gets ordered list of users that have sent a message to the current user
  getRecentChats (): Observable<Partial<IUser[]>> {
    return this.http.get<Partial<IUser[]>>(
      environment.apiUrl + 'messages/recent-chats',
      {
        withCredentials: true
      }
    )
  }

  getConversation (
    page: number,
    limit: number,
    userId: string
  ): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(
      environment.apiUrl + 'messages/conversation/' + userId,
      {
        withCredentials: true,
        params: {
          page,
          limit
        }
      }
    )
  }
}
