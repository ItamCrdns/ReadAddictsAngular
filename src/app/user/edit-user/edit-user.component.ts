import {
  Component,
  type ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
  type OnChanges
} from '@angular/core'
import { type IUser } from '../login/IUser'
import { NgOptimizedImage } from '@angular/common'
import { PatchEntityService } from 'services/Update entity/patch-entity.service'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { ionPencil } from '@ng-icons/ionicons'
import { DateAgoPipe } from 'app/pipes/date-ago.pipe'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms'
import { ImageBlob } from 'app/shared/base/ImageBlob'
import { type HttpErrorResponse } from '@angular/common/http'
import { AlertService } from 'services/Alert/alert.service'

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIconComponent,
    DateAgoPipe,
    ReactiveFormsModule
  ],
  providers: [provideIcons({ ionPencil })],
  template: `
    <div class="user">
      <div class="image-container" (click)="triggerImgInput()">
        @if (newImageSelected) {
        <img
          [src]="getSingleImgUrl()"
          [alt]="user.userName"
          width="250"
          height="250"
          priority
        />
        <ng-icon name="ionPencil" class="picture-pencil" />
        } @else {
        <img
          [ngSrc]="user.profilePicture ?? ''"
          [alt]="user.userName"
          width="250"
          height="250"
          priority
        />
        <ng-icon name="ionPencil" class="picture-pencil" />
        }
      </div>
      <form
        [formGroup]="userForm"
        (ngSubmit)="submit()"
        class="user-info-wrapper"
      >
        <input
          #imgInput
          type="file"
          formControlName="profilePicture"
          accept="image/*"
          (change)="superSetImage($event)"
        />
        <div class="usernamame-button-wrapper">
          <header class="name-wrapper">
            <h1>{{ user.userName }}</h1>
          </header>
          <button (click)="closeEditMode()" style="background-color: #ff3e6c;">
            Cancel
          </button>
        </div>
        <div class="user-info">
          <div class="tier-last-seen-wrapper">
            <p>{{ user.tierName ?? 'No tier' }}</p>
            <span>·</span>
            <p>Last seen {{ user.lastLogin ?? '' | dateAgo }}</p>
          </div>
          @if (user.biography) {
          <div class="editable">
            @if (editBiography) {
            <textarea
              formControlName="biography"
              #textarea
              (input)="textareaChange()"
              maxlength="255"
            ></textarea>
            } @else {
            <p>{{ user.biography }}</p>
            }
            <ng-icon
              name="ionPencil"
              class="small-pencil"
              (click)="toggleBiographyEdit()"
            />
          </div>
          }
        </div>
        <input
          type="password"
          formControlName="password"
          placeholder="Confirm your password"
          [style.border]="
            '2px solid ' +
            ((userForm.touched && !userForm.valid) ||
            userForm.get('password')?.hasError('incorrect')
              ? 'red'
              : '')
          "
        />
        <button>Update</button>
      </form>
    </div>
  `,
  styleUrl: '../user.component.scss'
})
export class EditUserComponent extends ImageBlob implements OnChanges {
  @Input() user!: Partial<IUser>
  @Output() close = new EventEmitter<void>()
  @Output() newUser = new EventEmitter<Partial<IUser>>()

  editBiography: boolean = false
  newImageSelected: boolean = false

  @ViewChild('imgInput') imgInput!: ElementRef
  @ViewChild('textarea') textarea!: ElementRef<HTMLElement>

  constructor (
    @Inject(PatchEntityService) private readonly update: PatchEntityService,
    @Inject(AlertService) private readonly alert: AlertService
  ) {
    super()
  }

  userForm = new FormGroup({
    biography: new FormControl(''),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    password: new FormControl('', Validators.required),
    profilePicture: new FormControl('')
  })

  ngOnChanges (): void {
    this.userForm.get('biography')?.setValue(this.user.biography ?? '')
  }

  closeEditMode (): void {
    this.close.emit()
  }

  triggerImgInput (): void {
    this.imgInput.nativeElement.click()
  }

  superSetImage (event: Event): void {
    this.setImage(event)
    this.newImageSelected = true
  }

  toggleBiographyEdit (): void {
    this.editBiography = !this.editBiography
  }

  textareaChange (): void {
    // * Might extract this
    this.textarea.nativeElement.style.height = '48px'

    const newHeight = Math.max(
      Number(this.textarea.nativeElement.scrollHeight),
      20
    )
    this.textarea.nativeElement.style.height = `${newHeight}px`
  }

  submit (): void {
    const fd = new FormData()

    if (this.userForm.get('biography')?.value !== this.user.biography) {
      const biographyValue = this.userForm.get('biography')?.value ?? ''
      fd.append('biography', biographyValue)
    }

    if (this.image.size > 0 && this.newImageSelected) {
      const [key] = this.image.keys()
      fd.append('profilePicture', key)
    }

    fd.append('password', this.userForm.get('password')?.value ?? '')

    if (this.userForm.valid) {
      this.alert.popAlert('Updating your profile...')

      this.update.updateUser(fd).subscribe({
        next: (res: IUser) => {
          this.alert.popAlert('Your profile has been updated')
          this.newUser.emit(res)
          this.close.emit()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.userForm.markAsTouched()
            this.userForm.get('password')?.reset()
            this.alert.popAlert('Your password is incorrect')
            this.userForm.get('password')?.setErrors({ incorrect: true })
          } else {
            this.alert.popAlert('Something went wrong')
          }
        }
      })
    } else {
      this.userForm.markAsTouched()
      this.alert.popAlert('Please provide your password')
    }
  }
}
