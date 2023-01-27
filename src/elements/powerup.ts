import { GameObject } from '../game-object'

type Powerups = 'special' | 'coin' | 'heart'
export class Powerup extends GameObject {
  public name: string
  constructor(name: Powerups) {
    super(name)
    this.name = name
  }

  public update(): void {
    this.posX = this.posX -= 3
    this.elementWindowCol()
    this.windowYCol()
    this.draw()
  }
}
