import { MoveBehavior, SPEED_BOOST } from './move-behavior'
import { GameObject } from '../game-object'

/**
 * Leftward drift with a vertical sine wave — a floating/flying movement.
 * Oscillates around the enemy's current lane (`baseY`), which the GameObject
 * keeps in sync across resets, so the wave follows the enemy after it respawns.
 */
export class SineBehavior implements MoveBehavior {
  private enemy: GameObject
  private speedX: number
  private amplitude: number
  private frequency: number
  private angle: number = 0

  constructor(
    enemy: GameObject,
    speedX = 2.5,
    amplitude = 34,
    frequency = 0.12
  ) {
    this.enemy = enemy
    this.speedX = speedX
    this.amplitude = amplitude
    this.frequency = frequency
  }

  public performUpdate() {
    this.enemy.posX -= this.speedX
    this.angle += this.frequency
    this.enemy.posY = this.enemy.baseY + Math.sin(this.angle) * this.amplitude
  }

  public speedUp() {
    this.speedX += SPEED_BOOST
  }
}
