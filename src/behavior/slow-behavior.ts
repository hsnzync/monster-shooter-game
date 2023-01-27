import { MoveBehavior } from './move-behavior'
import { GameObject } from '../game-object'

export class slowBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number

  constructor(enemy: GameObject) {
    this.enemy = enemy
    this.speedX = 3
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
  }
}
