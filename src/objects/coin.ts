import { GameObject } from '../game-object'

export class Coin extends GameObject {
  constructor() {
    super('coin')
  }

  public update(): void {
    this.posX = this.posX -= 1
    this.enemyWindowCol()
    this.draw()
  }
  public removeElement() {
    this.element.remove()
  }
}
