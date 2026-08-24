/**
 * Static layout constants for the canvas build. These reproduce the sizes and
 * positions that were previously expressed in SCSS, so gameplay (spawn ranges,
 * hitboxes, HUD placement) stays identical to the DOM version.
 */

// Logical canvas size (the old `game` element was 800x600).
export const FIELD_WIDTH = 800
export const FIELD_HEIGHT = 600

// The old `wall` element was 40% of the field height and bounded enemy spawns.
export const WALL_HEIGHT = FIELD_HEIGHT * 0.4 // 240

// Slim HUD band holding the score and health meter (translucent, drawn on top).
export const TOPBAR_HEIGHT = 64

/**
 * Per-sprite display box (in px) and horizontal flip, matching `objects.scss`:
 * every object was `min-width: 75px` and `height: 15%` (90px) of the field,
 * except `slime`/`eye` which were `height: 10%` (60px). Monsters and powerups
 * were mirrored with `scaleX(-1)`; the player and fireball were not.
 */
export interface SpriteBox {
  w: number
  h: number
  flip: boolean
}

export const SPRITE_BOX: Record<string, SpriteBox> = {
  player: { w: 75, h: 90, flip: false },
  ghost: { w: 75, h: 90, flip: true },
  slime: { w: 75, h: 60, flip: true },
  skeleton: { w: 75, h: 90, flip: true },
  eye: { w: 75, h: 60, flip: true },
  fireball: { w: 75, h: 90, flip: false },
  special: { w: 75, h: 90, flip: true },
  coin: { w: 75, h: 90, flip: true },
  heart: { w: 75, h: 90, flip: true },
  // Extra enemy types (art already in the repo).
  bat: { w: 72, h: 82, flip: true },
  frog: { w: 72, h: 82, flip: true },
  lizard: { w: 78, h: 82, flip: true },
  // Boss: kept modest so the player can still dodge its charges. Its art is
  // cropped from the padded frame and scaled up (see the asset loader).
  doom: { w: 120, h: 110, flip: true },
  // Boss projectile (drawn as an orb, no sprite sheet).
  bossshot: { w: 22, h: 22, flip: false },
}

export function spriteBox(name: string): SpriteBox {
  return SPRITE_BOX[name] ?? { w: 75, h: 90, flip: false }
}
