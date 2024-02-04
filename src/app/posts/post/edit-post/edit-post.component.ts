import { NgOptimizedImage } from '@angular/common'
import {
  Component,
  Inject,
  Input,
  ViewChild,
  type ElementRef,
  type OnInit,
  EventEmitter,
  Output
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { type IImage } from 'app/posts/IPost'
import { PatchEntityService } from 'services/Update entity/patch-entity.service'
import { ionRemoveCircle, ionAddCircle } from '@ng-icons/ionicons'
import { ImageBlob } from 'app/shared/base/ImageBlob'
import { AlertService } from 'services/Alert/alert.service'
import { type IEditPostResponse } from './IEditPostResponse'
import { concat, of, toArray } from 'rxjs'

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgIconComponent],
  providers: [provideIcons({ ionRemoveCircle, ionAddCircle })],
  template: `
    <section class="edit-area-wrapper">
      <form (ngSubmit)="submit()" class="form">
        <textarea name="content" [(ngModel)]="content"></textarea>
        <input
          #imgInput
          type="file"
          name="files"
          multiple
          accept="image/*"
          (change)="setImages($event)"
        />
        <div class="image-wrapper">
          @for (image of imageCollection; track image.id) {
          <div>
            <img
              [ngSrc]="image.url"
              [alt]="image.cloudinaryPublicId"
              width="100"
              height="100"
            />
            <ng-icon
              class="remove-image"
              name="ionRemoveCircle"
              (click)="removeFromImageCollection(image)"
            />
          </div>
          } @if (images.size > 0) { @for (image of images.keys(); track
          image.name) {
          <div>
            <img
              [src]="getImgUrl(image)"
              [alt]="image.name"
              width="100"
              height="100"
              class="new-image"
            />
            <ng-icon
              class="remove-image"
              name="ionRemoveCircle"
              (click)="removeImage(image)"
            />
          </div>
          } }
          <ng-icon
            name="ionAddCircle"
            class="plus"
            size="100px"
            (click)="triggerImgInput()"
          />
        </div>
        <button>Update</button>
      </form>
    </section>
  `,
  styleUrls: ['../../post/post.component.scss', './edit-post.component.scss']
})
export class EditPostComponent extends ImageBlob implements OnInit {
  @Input() content!: string
  @Input() postId!: string
  @Input() imageCollection!: IImage[]

  removedImages: string[] = []
  oldContent: string = ''

  // * Emit changes to parent component
  @Output() updatedPost = new EventEmitter<IEditPostResponse>()

  @ViewChild('imgInput') imgInput!: ElementRef

  constructor (
    @Inject(PatchEntityService) private readonly update: PatchEntityService,
    @Inject(AlertService) private readonly alert: AlertService
  ) {
    super()
  }

  ngOnInit (): void {
    this.oldContent = this.content
  }

  private updating (): void {
    this.alert.popAlert('Applying changes...')
  }

  private postUpdated (): void {
    this.alert.popAlert('Your post has been updated')
  }

  private postNotUpdated (): void {
    this.alert.popAlert('Your post could not be updated')
  }

  submit (): void {
    this.updating()

    const updateContent$ =
      this.oldContent !== this.content
        ? this.update.updatePostContent(this.postId, this.content)
        : of(null)

    const imagesFd = new FormData()
    if (this.images.size > 0) {
      this.images.forEach((_, key) => {
        imagesFd.append('files', key)
      })
    }
    const addImages$ =
      this.images.size > 0
        ? this.update.addImagesToPost(this.postId, imagesFd)
        : of(null)

    const removeImages$ =
      this.removedImages.length > 0
        ? this.update.removeImagesFromPost(this.postId, this.removedImages)
        : of(null)

    concat(updateContent$, addImages$, removeImages$)
      .pipe(toArray())
      .subscribe({
        next: (res: Array<string | string[] | IImage[] | null>) => {
          this.updatedPost.emit({
            newContent: res[0] as string,
            newImages: res[1] as IImage[],
            removedImages: res[2] as string[]
          })
          this.postUpdated()
        },
        error: () => {
          this.postNotUpdated()
        }
      })
  }

  triggerImgInput (): void {
    this.imgInput.nativeElement.click()
  }

  removeFromImageCollection (image: IImage): void {
    this.removedImages.push(image.id)
    this.imageCollection = this.imageCollection.filter((img) => img !== image)
  }

  // Not necessary to do add images function just use the images state from the base class and add it to fd
}
