import {
  Component,
  type ElementRef,
  HostListener,
  Inject,
  ViewChild,
  type OnDestroy
} from '@angular/core'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionCloseCircleSharp, ionPencil } from '@ng-icons/ionicons'
import { ImageBlob } from 'app/shared/base/ImageBlob'
import { Subject, takeUntil } from 'rxjs'
import { AlertService } from 'services/Alert/alert.service'
import { NewEntityService } from 'services/New entity/new-entity.service'

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent, RouterLink],
  providers: [provideIcons({ ionCloseCircleSharp, ionPencil })],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.scss'
})
export class NewGroupComponent extends ImageBlob implements OnDestroy {
  constructor (
    @Inject(Router) private readonly router: Router,
    @Inject(AlertService) private readonly alert: AlertService,
    @Inject(NewEntityService) private readonly newEntity: NewEntityService
  ) {
    super()
  }

  private readonly destroy$ = new Subject<void>()

  ngOnDestroy (): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  @ViewChild('imgInput') imgInput!: ElementRef

  triggerImgInput (): void {
    this.imgInput.nativeElement.click()
  }

  @HostListener('document:keydown', ['$event'])
  handleEscape (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.router.navigateByUrl('/groups').catch((err) => {
        console.error(err)
      })
    }
  }

  groupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    picture: new FormControl('', Validators.required)
  })

  submit (): void {
    const fd = new FormData()

    fd.append('name', this.groupForm.get('name')?.value ?? '')
    fd.append('description', this.groupForm.get('description')?.value ?? '')

    if (this.image.size > 0) {
      const [key] = this.image.keys()
      fd.append('picture', key)
    }

    if (this.groupForm.valid) {
      this.alert.popAlert('Creating group...')

      this.newEntity
        .newGroup(fd)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (groupId: string) => {
            this.alert.closeAlert()
            this.router.navigateByUrl(`/group/${groupId}`).catch((err) => {
              console.error(err)
            })
          },
          error: (err) => {
            this.alert.closeAlert()
            this.alert.popAlert('Error creating group')
            console.error(err)
          }
        })
    }
  }
}
