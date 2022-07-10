import { GameObject } from '../../gameObject'
import { Observer } from '../../observer/observer'
import { MoveBehavior, fastBehavior, slowBehavior } from '../../behavior'
import { Player } from '../player'
export class Skeleton extends GameObject implements Observer {
  private behavior: MoveBehavior
  public player: Player

  constructor(p: Player) {
    super('skeleton')
    this.player = p
    p.add(this)
    this.behavior = new fastBehavior(this)
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
