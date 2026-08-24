/**
 * Strategy interface for how an enemy moves each frame.
 * `speedUp()` lets the difficulty system make an enemy faster while keeping its
 * movement pattern (used by the Observer notification at higher scores).
 */
export interface MoveBehavior {
  performUpdate(): void
  speedUp(): void
}

/** Amount added to an enemy's horizontal speed on each speed-up. */
export const SPEED_BOOST = 1
