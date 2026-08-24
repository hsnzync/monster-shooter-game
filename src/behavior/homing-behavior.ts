import { MoveBehavior, SPEED_BOOST } from './move-behavior'
import { GameObject } from '../game-object'
import { arena } from '../engine/arena'

/**
 * Leftward drift while chasing the player's vertical position — a hunter that
 * lines itself up with you as it approaches.
 */
export class HomingBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number
  private trackSpeed: number

  constructor(enemy: GameObject, speedX = 2.2, trackSpeed = 1.1) {
    this.enemy = enemy
    this.speedX = speedX
    this.trackSpeed = trackSpeed
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX

    const diff = arena.playerY - this.enemy.posY
    if (Math.abs(diff) <= this.trackSpeed) {
      this.enemy.posY = arena.playerY
    } else {
      this.enemy.posY += Math.sign(diff) * this.trackSpeed
    }
  }

  public speedUp() {
    this.speedX += SPEED_BOOST
    this.trackSpeed += 0.3
  }
}
