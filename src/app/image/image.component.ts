import { NgOptimizedImage } from '@angular/common'
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core'
import { imageInitialState, type IImage } from 'app/posts/IPost'

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  @Input() currentImage: IImage = imageInitialState
  @Input() imageCollection: IImage[] = []

  @Output() close = new EventEmitter<void>()

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent (event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeImage()
    }
  }

  closeImage (): void {
    this.currentImage = imageInitialState
    this.close.emit()
  }

  changeImage (img: IImage): void {
    this.currentImage = img
  }
}
