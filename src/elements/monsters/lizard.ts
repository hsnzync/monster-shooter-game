import { GameObject } from '../../game-object'
import { Observer } from '../../observer/observer'
import { MoveBehavior, HomingBehavior } from '../../behavior'

/** A hunter that tracks the player's vertical position while closing in. */
export class Lizard extends GameObject implements Observer {
  private behavior: MoveBehavior

  constructor() {
    super('lizard')
    this.behavior = new HomingBehavior(this, 2.2, 1.2)
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
