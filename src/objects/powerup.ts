import { GameObject } from '../gameObject'

export class Powerup extends GameObject {
  constructor() {
    super('powerup')
  }

  public update(): void {
    this.posx = this.posx -= 2
    this.enemyWindowCol()
    this.draw()
  }

  public removeMe() {
    this.element.remove()
  }
}
