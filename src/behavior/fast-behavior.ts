import { MoveBehavior } from './move-behavior'
import { GameObject } from '../game-object'

export class fastBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number

  constructor(enemy: GameObject) {
    this.enemy = enemy
    this.speedX = 5
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
  }
}
