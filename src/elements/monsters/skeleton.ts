import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, fastBehavior, slowBehavior } from '../../behavior'
import { Player } from '../player'
import { Game } from '../../game'
export class Skeleton extends GameObject implements Observer {
  private behavior: MoveBehavior
  public player: Player
  public game: Game

  constructor(p: Player) {
    super('skeleton')
    this.player = p
    this.behavior = new slowBehavior(this)
  }

  public update(): void {
    this.behavior.performUpdate()
    this.elementWindowCol()
    this.windowYCol()
    this.draw()
  }

  public notify(): void {
    if (this.game.time <= 10) {
      this.behavior = new fastBehavior(this)
    }
  }
}
