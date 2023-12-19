import { Component, Inject, type OnInit } from '@angular/core'
import { GetPostsService } from './get-posts.service'
import { type Post } from './IPost'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: Post[] = []

  constructor (
    @Inject(GetPostsService) private readonly getPostsService: GetPostsService
  ) {}

  ngOnInit (): void {
    this.getPostsService.getPosts().subscribe((data) => {
      this.posts = data
    })
  }
}
