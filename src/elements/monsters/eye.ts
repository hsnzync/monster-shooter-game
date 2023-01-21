import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, fastBehavior, slowBehavior } from '../../behavior'
import { Player } from '../player'

export class Eye extends GameObject implements Observer {
  private behavior: MoveBehavior
  public player: Player

  constructor(p: Player) {
    super('eye')

    this.player = p
    p.add(this)

    this.behavior = new fastBehavior(this)
  }

  public update(): void {
    this.behavior.performUpdate()
    this.elementWindowCol()
    this.draw()
  }

  public animate(): void {
    // TODO: implement code here
  }

  public notify(): void {
    this.behavior = new slowBehavior(this)

    setTimeout(() => {
      this.behavior = new fastBehavior(this)
    }, 5000)
  }
}