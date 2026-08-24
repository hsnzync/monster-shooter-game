/**
 * Per-sprite collision boxes, expressed as pixel insets inside the sprite's
 * display box. They are computed from the actual opaque pixels of each sprite
 * at load time (see `assets.ts`) so a character's hitbox hugs the visible art
 * instead of its (mostly transparent) bounding box — you now only collide when
 * the sprites really overlap.
 *
 * The registry is empty until the engine populates it, so `GameObject.bounds()`
 * falls back to the full box under unit tests (where no assets are loaded).
 */
export interface HitboxInset {
  left: number
  top: number
  right: number
  bottom: number
}

const registry = new Map<string, HitboxInset>()

export function setHitbox(name: string, inset: HitboxInset): void {
  registry.set(name, inset)
}

export function getHitbox(name: string): HitboxInset | undefined {
  return registry.get(name)
}
