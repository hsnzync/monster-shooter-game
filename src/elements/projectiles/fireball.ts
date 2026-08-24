import { GameObject } from '../../game-object'

export class Fireball extends GameObject {
  constructor(x: number, y: number) {
    super('fireball')

    this.posX = x
    this.posY = y
  }

  public update(): void {
    this.posX += 10
  }
}
