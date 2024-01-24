import { Component, Inject } from '@angular/core'
import { GetEntityService } from '../../services/Get entity/get-entity.service'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './readers.component.html',
  styleUrl: './readers.component.scss'
})
export class ReadersComponent {
  users$ = this.getEntity.getUsers()

  constructor (
    @Inject(GetEntityService) private readonly getEntity: GetEntityService
  ) {}
}
