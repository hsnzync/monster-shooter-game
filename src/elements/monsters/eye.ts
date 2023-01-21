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
      console.log('eye is faster')
      this.behavior = new fastBehavior(this)
    }
  }
}
