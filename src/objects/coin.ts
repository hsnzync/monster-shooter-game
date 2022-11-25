import { GameObject } from '../game-object'

export class Coin extends GameObject {
  constructor() {
    super('coin')
  }

  public update(): void {
    this.posx = this.posx -= 1
    this.enemyWindowCol()
    this.draw()
  }

  public removeMe() {
    this.element.remove()
  }
}
