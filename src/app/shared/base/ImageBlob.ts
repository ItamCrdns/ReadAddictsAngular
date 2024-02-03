export abstract class ImageBlob {
  images: File[] = []

  protected setImages (event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    if (event.target.files === null) {
      return
    }

    this.images = Array.from(event.target.files)
  }

  protected trackByFn (index: number, item: File): string {
    return item.name + index
  }

  protected getImgUrl (img: File): string {
    return URL.createObjectURL(img)
  }

  protected removeImage (image: File): void {
    this.images = this.images.filter((img) => img !== image)
  }
}
