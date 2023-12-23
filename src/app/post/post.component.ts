import { Component, Inject } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { GetPostService } from './get-post.service'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import { type IPost } from '../posts/IPost'
import { type Observable } from 'rxjs'
import { DateAgoPipe } from '../pipes/date-ago.pipe'

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DateAgoPipe, NgOptimizedImage, CommonModule, RouterLink],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  post$: Observable<IPost> = this.getPostService.getPost(
    this.route.snapshot.params['id'] as number
  )

  constructor (
    @Inject(ActivatedRoute) private readonly route: ActivatedRoute,
    @Inject(GetPostService) private readonly getPostService: GetPostService
  ) {}
}
