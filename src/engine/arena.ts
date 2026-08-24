import { FIELD_HEIGHT } from './config'

/**
 * Tiny shared snapshot of things enemies may want to react to (currently the
 * player's vertical position, used by the homing movement pattern). The Game
 * updates it once per frame; behaviours read it. Kept separate so movement
 * behaviours stay decoupled from the Game/Player classes.
 */
export const arena = {
  playerY: FIELD_HEIGHT / 2,
}
