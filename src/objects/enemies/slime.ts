import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, fastBehavior, slowBehavior } from '../../behavior'
import { Player } from '../player'
export class Slime extends GameObject implements Observer {
  private behavior: MoveBehavior
  public player: Player

  constructor(p: Player) {
    super('slime')
    this.behavior = new slowBehavior(this)
    this.player = p
    p.add(this)
  }

  public update(): void {
    this.behavior.performUpdate()
    this.enemyWindowCol()
    this.draw()
  }

  public notify(): void {
    this.behavior = new slowBehavior(this)

    setTimeout(() => {
      this.behavior = new fastBehavior(this)
    }, 5000)
  }
}
