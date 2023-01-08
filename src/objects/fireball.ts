import { GameObject } from '../game-object'

export class Fireball extends GameObject {
  constructor(x: number, y: number) {
    super('fireball')

    this.posX = x
    this.posY = y
  }

  public update(): void {
    this.posX = this.posX += 2

    this.draw()
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px)`
  }

  public removeElement() {
    this.element.remove()
  }
}
