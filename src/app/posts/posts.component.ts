import { Component, Inject, type OnInit } from '@angular/core'
import { GetPostsService } from './get-posts.service'
import { type Post } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { NgOptimizedImage } from '@angular/common'
import { catchError, tap, throwError } from 'rxjs'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: Post[] = []
  badResponse: number = 0

  constructor (
    @Inject(GetPostsService) private readonly getPostsService: GetPostsService
  ) {}

  ngOnInit (): void {
    this.getPostsService
      .getPosts()
      .pipe(
        tap((res) => {
          this.posts = res
        }),
        catchError((err) => {
          this.badResponse = err.status
          return throwError(
            () => new Error('Not logged in ' + err.status)
          )
        })
      )
      .subscribe()
  }
}
