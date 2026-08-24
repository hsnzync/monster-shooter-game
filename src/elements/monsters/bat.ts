import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, SineBehavior } from '../../behavior'

/** A flying enemy that weaves up and down as it approaches. */
export class Bat extends GameObject implements Observer {
  private behavior: MoveBehavior

  constructor() {
    super('bat')
    this.behavior = new SineBehavior(this, 3, 40, 0.14)
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
