import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, slowBehavior } from '../../behavior'

export class Skeleton extends GameObject implements Observer {
  private behavior: MoveBehavior

  constructor() {
    super('skeleton')
    this.behavior = new slowBehavior(this)
  }

  public update(): void {
    this.behavior.performUpdate()
    this.elementWindowCol()
    this.windowYCol()
    this.draw()
  }

  public notify(): void {
    this.behavior.speedUp()
  }
}
