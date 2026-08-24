import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, HopBehavior } from '../../behavior'

/** A hopping enemy that springs up and down as it advances. */
export class Frog extends GameObject implements Observer {
  private behavior: MoveBehavior

  constructor() {
    super('frog')
    this.behavior = new HopBehavior(this, 2.5, 52, 0.09)
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
