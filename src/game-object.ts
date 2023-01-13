export abstract class GameObject {
  public posY: number
  public posX: number
  private startPosX: number
  private startPosY: number
  private windowMinPosY: number
  private windowMaxPosY: number

  protected element: HTMLElement
  protected speedX: number
  protected speedY: number
  protected game: any = document.getElementsByTagName('game')[0]

  constructor(element: string) {
    const wallOffset: number = this.game.clientHeight / 9
    const gameTopOffset: number =
      this.game.offsetHeight - this.game.clientHeight

    this.windowMinPosY = wallOffset + gameTopOffset
    this.windowMaxPosY = this.game.offsetTop - 40

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

  public playerWindowCol(): void {
    if (this.posX + this.element.clientWidth > this.game.clientWidth) {
      this.posX && this.posY == 300
      this.speedX *= 0
    }

    const wallOffset: number = this.game.clientHeight / 9
    const gameTopOffset: number =
      this.game.offsetHeight - this.game.clientHeight
    const gameWallPosY: number = wallOffset + gameTopOffset

    if (this.posY < gameWallPosY) {
      this.speedY *= 0
      this.posY = gameWallPosY
    }

    if (this.posY >= this.game.offsetTop - 40) {
      this.speedY *= 0
      this.posY = this.game.offsetTop - 40
    }
  }

  public elementWindowCol(): void {
    if (this.posX <= 0) {
      this.posX = this.startPosX - this.element.clientWidth
      this.posY = Math.floor(Math.random() * this.game.clientHeight) + 1
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
    this.posY = Math.floor(Math.random() * this.game.clientHeight) + 1
  }
}
