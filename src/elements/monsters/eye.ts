import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, fastBehavior, slowBehavior } from '../../behavior'
import { Player } from '../player'
import { Game } from '../../game'

export class Eye extends GameObject implements Observer {
  private behavior: MoveBehavior
  public player: Player
  public game: Game

  constructor(p: Player) {
    super('eye')

    this.player = p
    this.behavior = new fastBehavior(this)
  }

  public update(): void {
    this.behavior.performUpdate()
    this.elementWindowCol()
    this.windowYCol()
    this.draw()
  }

  public notify(): void {
    this.behavior = new slowBehavior(this)
  }
}
