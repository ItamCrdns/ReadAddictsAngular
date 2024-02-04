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
          } @if (images.size > 0) { @for (image of images.keys(); track image.name) {
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
  @Output() updatedPost = new EventEmitter<string>()

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

  submit (): void {
    // * Handle both content only updates and contet + image updates (or image only updates)

    if (this.oldContent !== this.content) {
      this.update.updatePostContent(this.postId, this.content).subscribe({
        next: (res) => {
          // Emit response to parent so it updates the UI with the new stuff
          this.updatedPost.emit(res.content)
          this.alert.popAlert('Your post has been updated')
        }
      })
    }
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
