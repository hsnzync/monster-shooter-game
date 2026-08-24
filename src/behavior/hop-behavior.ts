import { MoveBehavior, SPEED_BOOST } from './move-behavior'
import { GameObject } from '../game-object'

/**
 * Leftward drift with an upward hop — a frog-like bounce. The enemy springs up
 * from its lane (`baseY`) and settles back, repeatedly.
 */
export class HopBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number
  private height: number
  private frequency: number
  private angle: number = 0

  constructor(enemy: GameObject, speedX = 2.5, height = 46, frequency = 0.1) {
    this.enemy = enemy
    this.speedX = speedX
    this.height = height
    this.frequency = frequency
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
    this.angle += this.frequency
    this.enemy.posY =
      this.enemy.baseY - Math.abs(Math.sin(this.angle)) * this.height
  }

  public speedUp() {
    this.speedX += SPEED_BOOST
  }
}
