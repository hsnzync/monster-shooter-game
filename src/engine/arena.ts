import { FIELD_WIDTH, FIELD_HEIGHT } from './config'

/**
 * Tiny shared snapshot of things enemies may want to react to (the player's
 * position, used by the homing pattern and the boss's charge/aim). The Game
 * updates it once per frame; behaviours and the boss read it. Kept separate so
 * they stay decoupled from the Game/Player classes.
 */
export const arena = {
  playerX: FIELD_WIDTH / 2,
  playerY: FIELD_HEIGHT / 2,
}
