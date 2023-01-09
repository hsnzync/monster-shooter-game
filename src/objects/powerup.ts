import { Game } from '..'
import { GameObject } from '../game-object'

type Powerups = 'powerup' | 'coin'
export class Powerup extends GameObject {
  private name: string
  constructor(name: Powerups) {
    super(name)
    this.name = name
  }

  public update(): void {
    this.posX = this.posX -= 2
    this.enemyWindowCol()
    this.draw()
  }
}
