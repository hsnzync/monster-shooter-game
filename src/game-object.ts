import { Field } from './engine/field'
import { spriteBox } from './engine/config'
import { getHitbox } from './engine/hitbox'

export interface Bounds {
  left: number
  top: number
  right: number
  bottom: number
}

/**
 * Base class for everything that lives in the play field.
 *
 * In the DOM version each object owned an HTML element and drew itself via CSS
 * transforms. In the canvas version an object is pure state — position, size
 * and the name of the sprite that represents it — and the renderer paints it.
 * Movement, spawning and collision bounds are unchanged so gameplay matches the
 * original.
 */
export abstract class GameObject {
  public posY: number
  public posX: number
  public speedX: number
  /** Current vertical "lane" the object oscillates around (used by movement
   *  patterns like sine/hop); kept in sync with the spawn/reset position. */
  public baseY: number
  /** Sprite key, also used as the object's type name (e.g. 'ghost', 'coin'). */
  public name: string
  public readonly width: number
  public readonly height: number

  protected windowMaxPosY: number
  protected windowMinPosY: number
  protected startPosY: number
  protected startPosX: number
  protected speedY: number

  constructor(name: string) {
    this.name = name
    const box = spriteBox(name)
    this.width = box.w
    this.height = box.h

    // Minimum y: just below the top wall. Maximum y: above the bottom edge.
    this.windowMinPosY = Field.wallHeight - 70
    this.windowMaxPosY = Field.height - 150

    this.startPosY =
      Math.floor(Math.random() * (this.windowMaxPosY - this.windowMinPosY)) +
      this.windowMinPosY

    // Spawn just off the right edge of the field.
    this.startPosX = Field.width

    this.posY = this.startPosY
    this.baseY = this.startPosY
    this.posX = this.startPosX - this.width
    this.speedX = 0
    this.speedY = 0
  }

  abstract update(): void

  public elementWindowCol(): void {
    if (this.posX <= 0) {
      this.reset()
    }
  }

  public windowYCol(): void {
    // Top wall collision detection
    if (this.posY < this.windowMinPosY) {
      this.speedY = 0
      this.posY = this.windowMinPosY
    }

    // Bottom wall collision detection
    if (this.posY >= Field.height - 100) {
      this.speedY = 0
      this.posY = Field.height - 100
    }
  }

  /**
   * Retained as a no-op so subclasses' `update()` flow is unchanged. Rendering
   * is now the renderer's job: it draws each object from its position + sprite.
   */
  public draw(): void {}

  /** Axis-aligned bounds used for collision detection. */
  public bounds(): Bounds {
    // Prefer the tight, art-hugging hitbox registered for this sprite; fall
    // back to the full display box when none is loaded (e.g. in unit tests).
    const inset = getHitbox(this.name)
    if (inset) {
      return {
        left: this.posX + inset.left,
        top: this.posY + inset.top,
        right: this.posX + inset.right,
        bottom: this.posY + inset.bottom,
      }
    }
    return {
      left: this.posX,
      top: this.posY,
      right: this.posX + this.width,
      bottom: this.posY + this.height,
    }
  }

  /** Retained for API compatibility; nothing to remove on a canvas. */
  public removeElement(): void {}

  public reset(): void {
    this.posX = this.startPosX - this.width
    this.posY =
      Math.floor(Math.random() * (this.windowMaxPosY - this.windowMinPosY)) +
      this.windowMinPosY
    this.baseY = this.posY
  }
}
