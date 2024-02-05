export abstract class ImageBlob {
  images = new Map<File, string>()
  image = new Map<File, string>()

  protected setImages (event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    if (event.target.files === null) {
      return
    }

    Array.from(event.target.files).forEach((file) => {
      this.images.set(file, URL.createObjectURL(file))
    })
  }

  protected setImage (event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) {
      return
    }

    if (event.target.files === null) {
      return
    }

    if (this.image.size > 0) {
      this.clearSingleImage()
    }

    const file = event.target.files[0]
    this.image.set(file, URL.createObjectURL(file))
  }

  protected getImgUrl (img: File): string {
    return this.images.get(img) ?? ''
  }

  protected getSingleImgUrl (): string {
    return this.image.values().next().value ?? ''
  }

  protected clearSingleImage (): void {
    this.image.clear()
  }

  protected removeImage (image: File): void {
    const imageUrl = this.images.get(image) ?? ''
    URL.revokeObjectURL(imageUrl)
    this.images.delete(image)
  }
}
