import { MoveBehavior } from './move-behavior'
import { GameObject } from '../game-object'

export class slowBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number

  constructor(enemy: GameObject) {
    this.enemy = enemy
    let r = Math.floor(Math.random() * 3) + 1
    this.speedX = r
  }

  public performUpdate() {
    this.enemy.posX = this.enemy.posX -= this.speedX
  }
}
