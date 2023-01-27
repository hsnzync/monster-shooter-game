export abstract class GameObject {
  public posY: number
  public posX: number

  protected windowMaxPosY: number
  protected windowMinPosY: number
  protected startPosY: number
  protected startPosX: number
  protected element: HTMLElement
  protected speedX: number
  protected speedY: number
  protected game: any = document.getElementsByTagName('game')[0]
  protected wall: any = document.getElementsByTagName('wall')[0]

  constructor(element: string) {
    // Minimum y position for the top wall
    this.windowMinPosY = this.wall.clientHeight - 70
    // Maximum y position for the bottom wall
    this.windowMaxPosY = this.game.clientHeight - 150

    this.startPosY =
      Math.floor(Math.random() * (this.windowMaxPosY - this.windowMinPosY)) +
      this.windowMinPosY

    this.element = document.createElement(element)
    this.game.appendChild(this.element)

    this.startPosX = this.game.clientWidth + this.game.offsetLeft

    this.posY = this.startPosY
    this.posX = this.startPosX - this.element.clientWidth
    this.speedX = 0
    this.speedY = 0
  }

  abstract update(): void

  public elementWindowCol(): void {
    if (this.posX <= 0) {
      this.reset()
    }
  }

  public windowYCol(): void {
    // Top wall collision detection
    if (this.posY < this.windowMinPosY) {
      this.speedY *= 0
      this.posY = this.windowMinPosY
    }

    // Bottom wall collision detection
    if (this.posY >= this.game.clientHeight - 100) {
      this.speedY *= 0
      this.posY = this.game.clientHeight - 100
    }
  }

  public draw(): void {
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px) scaleX(-1)`
  }

  public getBoundingClientRect() {
    return this.element.getBoundingClientRect()
  }

  public removeElement(): void {
    this.element.remove()
  }

  public reset(): void {
    this.posX = this.startPosX - this.element.clientWidth
    this.posY =
      Math.floor(Math.random() * (this.windowMaxPosY - this.windowMinPosY)) +
      this.windowMinPosY
  }
}
