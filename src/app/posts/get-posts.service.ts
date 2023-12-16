import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Post } from './IPost';

@Injectable({
  providedIn: 'root',
})
export class GetPostsService {
  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<Post[]>(environment.apiUrl + 'Post/allposts', {
      params: {
        page: '1',
        pageSize: '10',
      },
    });
  }
}
