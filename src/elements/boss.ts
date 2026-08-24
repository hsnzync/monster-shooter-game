import { GameObject } from '../game-object'
import { Field } from '../engine/field'
import { arena } from '../engine/arena'

type BossPhase = 'enter' | 'hover' | 'charge' | 'retreat'

/**
 * A boss enemy with a small behaviour loop:
 *  - enter  : fly in from the right to its hover spot.
 *  - hover  : bob gently near the right edge and fire aimed shots.
 *  - charge : dash toward where the player was, threatening a hit.
 *  - retreat: pull back to the hover spot, then hover again.
 *
 * It has health (several fireball hits to defeat) and signals the Game when it
 * wants to fire (the Game spawns the actual projectile aimed at the player).
 */
export class Boss extends GameObject {
  public health: number
  public readonly maxHealth: number

  private phase: BossPhase = 'enter'
  private hoverX: number
  private centerY: number
  private angle: number = 0

  // Timers (in frames, ~60fps).
  private hoverTimer: number = 120
  private shootTimer: number = 70
  private chargeTargetX: number = 0
  private chargeTargetY: number = 0
  private pendingShot: boolean = false

  private hoverSpeed: number = 3
  private chargeSpeed: number = 8
  private retreatSpeed: number = 5
  private amplitude: number = 36

  constructor(health = 10) {
    super('doom')
    this.maxHealth = health
    this.health = health

    this.hoverX = Field.width - this.width - 40
    this.centerY =
      (this.windowMinPosY + (Field.height - 100)) / 2 - this.height / 2
    this.posY = this.centerY
    this.baseY = this.centerY
  }

  public update(): void {
    switch (this.phase) {
      case 'enter':
        this.moveToward(this.hoverX, this.centerY, this.hoverSpeed)
        if (this.posX <= this.hoverX) {
          this.posX = this.hoverX
          this.enterHover()
        }
        break

      case 'hover':
        this.angle += 0.05
        this.posY = this.centerY + Math.sin(this.angle) * this.amplitude
        this.tickShooting()
        if (--this.hoverTimer <= 0) this.beginCharge()
        break

      case 'charge':
        this.moveToward(
          this.chargeTargetX,
          this.chargeTargetY,
          this.chargeSpeed
        )
        if (
          this.reached(this.chargeTargetX, this.chargeTargetY, this.chargeSpeed)
        ) {
          this.phase = 'retreat'
        }
        break

      case 'retreat':
        this.moveToward(this.hoverX, this.centerY, this.retreatSpeed)
        if (this.reached(this.hoverX, this.centerY, this.retreatSpeed)) {
          this.posX = this.hoverX
          this.posY = this.centerY
          this.enterHover()
        }
        break
    }
  }

  private enterHover(): void {
    this.phase = 'hover'
    this.hoverTimer = 150
  }

  private beginCharge(): void {
    // Telegraphed dash toward where the player is now (kept dodgeable: it aims
    // at the player's current spot, not a moving lock-on).
    this.chargeTargetX = Math.max(110, arena.playerX)
    this.chargeTargetY = arena.playerY
    this.phase = 'charge'
  }

  private tickShooting(): void {
    if (--this.shootTimer <= 0) {
      this.pendingShot = true
      this.shootTimer = 90
    }
  }

  /** True once when the boss wants to fire; clears the request. */
  public consumeShot(): boolean {
    if (!this.pendingShot) return false
    this.pendingShot = false
    return true
  }

  private moveToward(tx: number, ty: number, speed: number): void {
    const dx = tx - this.posX
    const dy = ty - this.posY
    const dist = Math.hypot(dx, dy) || 1
    this.posX += (dx / dist) * Math.min(speed, dist)
    this.posY += (dy / dist) * Math.min(speed, dist)
  }

  private reached(tx: number, ty: number, speed: number): boolean {
    return Math.hypot(tx - this.posX, ty - this.posY) <= speed
  }

  public hit(): void {
    this.health--
  }

  public get defeated(): boolean {
    return this.health <= 0
  }

  /** Centre point, used by the Game to aim the boss's shots. */
  public get centerX(): number {
    return this.posX + this.width / 2
  }

  public get midY(): number {
    return this.posY + this.height / 2
  }
}
