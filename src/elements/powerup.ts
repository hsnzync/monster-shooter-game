import { GameObject } from '../game-object'

export type Powerups = 'special' | 'coin' | 'heart'

export class Powerup extends GameObject {
  constructor(name: Powerups) {
    super(name)
  }

  public update(): void {
    this.posX -= 3
    this.elementWindowCol()
    this.windowYCol()
    this.draw()
  }
}
