import { MoveBehavior, SPEED_BOOST } from './move-behavior'
import { GameObject } from '../game-object'

/** Quicker leftward drift for more aggressive enemies. */
export class fastBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number

  constructor(enemy: GameObject) {
    this.enemy = enemy
    this.speedX = 3
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
  }

  public speedUp() {
    this.speedX += SPEED_BOOST
  }
}
