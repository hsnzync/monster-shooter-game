import { GameObject } from '../game-object'
import { Field } from '../engine/field'

/**
 * A large boss enemy. It flies in from the right, holds near the right edge and
 * hovers up and down. Unlike normal monsters it has health: it takes several
 * fireball hits to defeat instead of dying in one.
 */
export class Boss extends GameObject {
  public health: number
  public readonly maxHealth: number

  private holdX: number
  private angle: number = 0
  private enterSpeed: number = 2.4
  private amplitude: number = 70
  private frequency: number = 0.03

  constructor(health = 12) {
    super('doom')
    this.maxHealth = health
    this.health = health

    // Hold near the right edge, hovering around the vertical centre of the field.
    this.holdX = Field.width - this.width - 30
    const centerY = (this.windowMinPosY + (Field.height - 100)) / 2
    this.posY = centerY - this.height / 2
    this.baseY = this.posY
  }

  public update(): void {
    if (this.posX > this.holdX) {
      this.posX -= this.enterSpeed
    } else {
      this.posX = this.holdX
      this.angle += this.frequency
      this.posY = this.baseY + Math.sin(this.angle) * this.amplitude
    }
  }

  public hit(): void {
    this.health--
  }

  public get defeated(): boolean {
    return this.health <= 0
  }
}
