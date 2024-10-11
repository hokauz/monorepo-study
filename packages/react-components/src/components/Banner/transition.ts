class TransitionController<T extends { order?: number }> {
  public images: T[]
  private currentPosition: number
  private setPositionCallback: (position: number) => void

  constructor(images: T[], initPosition: number, setPositionCallback: (position: number) => void) {
    this.images = images.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    this.currentPosition = initPosition
    this.setPositionCallback = setPositionCallback
    this.setPositionCallback(this.currentPosition)
  }

  next(): void {
    if (this.currentPosition < this.images.length - 1) {
      this.currentPosition++
    } else {
      this.currentPosition = 0
    }
    this.setPositionCallback(this.currentPosition)
  }

  prev(): void {
    if (this.currentPosition > 0) {
      this.currentPosition--
    } else {
      this.currentPosition = this.images.length - 1
    }
    this.setPositionCallback(this.currentPosition)
  }

  goTo(position: number): void {
    if (position >= 0 && position < this.images.length) {
      this.currentPosition = position
      this.setPositionCallback(this.currentPosition)
    }
  }
}

export { TransitionController }
