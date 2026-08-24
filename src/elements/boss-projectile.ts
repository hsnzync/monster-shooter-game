import { GameObject } from '../game-object'

/**
 * A projectile fired by the boss toward the player. It travels in a straight
 * line along the velocity it was created with and is drawn by the Game as a
 * glowing orb (no sprite sheet needed).
 */
export class BossProjectile extends GameObject {
  private vx: number
  private vy: number

  constructor(x: number, y: number, vx: number, vy: number) {
    super('bossshot')
    this.posX = x
    this.posY = y
    this.vx = vx
    this.vy = vy
  }

  public update(): void {
    this.posX += this.vx
    this.posY += this.vy
  }
}
