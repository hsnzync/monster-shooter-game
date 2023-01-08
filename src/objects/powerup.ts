import { GameObject } from '../game-object'

export class Powerup extends GameObject {
  constructor() {
    super('powerup')
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
