export class Overlay {
  public counter: number = 0
  private container: HTMLElement
  private overlay: HTMLElement

  public constructor() {
    this.overlay = document.createElement('overlay')
    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.container.appendChild(this.overlay)
  }

  public show(): void {
    setInterval(() => {
      if (this.counter < 1) {
        this.counter = this.counter + 0.2
      }
      this.overlay.style.opacity = `${this.counter}`
    }, 300)
  }
}
