import { Component, Inject, type OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  username: string = ''

  constructor (@Inject(ActivatedRoute) private readonly route: ActivatedRoute) {}

  ngOnInit (): void {
    this.username = this.route.snapshot.params['username']
  }
}
