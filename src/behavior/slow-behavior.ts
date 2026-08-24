import { MoveBehavior, SPEED_BOOST } from './move-behavior'
import { GameObject } from '../game-object'

/** Steady leftward drift — the classic, calm enemy movement. */
export class slowBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number

  constructor(enemy: GameObject) {
    this.enemy = enemy
    this.speedX = 2
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
  }

  public speedUp() {
    this.speedX += SPEED_BOOST
  }
}
