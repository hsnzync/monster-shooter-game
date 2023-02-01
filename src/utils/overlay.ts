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
    const intervalId = setInterval(() => {
      this.counter += 0.2

      if (this.counter >= 1) {
        clearInterval(intervalId)
      }
      this.overlay.style.opacity = `${this.counter}`
    }, 300)
  }
}
