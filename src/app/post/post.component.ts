import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { GetPostService } from './get-post.service'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { type IPost } from '../posts/IPost'
import { Observable } from 'rxjs'
import { DateAgoPipe } from '../pipes/date-ago.pipe'
import { CommentsComponent } from '../comments/comments.component'

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    DateAgoPipe,
    NgOptimizedImage,
    CommonModule,
    RouterLink,
    CommentsComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post$: Observable<IPost> = new Observable<IPost>()

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetPostService) private readonly getPostService: GetPostService
  ) {}

  ngOnInit (): void {
    this.post$ = this.getPostService.getPost(
      this.route.snapshot.params['id'] as number
    )
  }
}
