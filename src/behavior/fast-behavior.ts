import { MoveBehavior } from './move-behavior';
import { GameObject } from '../game-object';

export class fastBehavior implements MoveBehavior {
  private enemy: GameObject;
  private speedX: number;

  constructor(enemy: GameObject) {
    this.enemy = enemy;
    let r = Math.floor(Math.random() * 3) + 2;
    this.speedX = r;
  }

  public performUpdate() {
    this.enemy.posX = this.enemy.posX -= this.speedX;
  }
}
