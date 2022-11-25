import { GameObject } from '../game-object'

export class Fireball extends GameObject {
  constructor(y: number) {
    super('fireball')

    this.speedx = 2
    this.posx = 80
    this.posy = y
  }

  public update(): void {
    this.posx = this.posx += this.speedx

    this.draw()
    this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
  }

  public removeMe() {
    this.element.remove()
    console.log('Removed monster')
  }
}
