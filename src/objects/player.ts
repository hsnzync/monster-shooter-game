import { Observer } from '../observer/observer'
import { Game } from '../index'
import { GameObject } from '../game-object'

export class Player extends GameObject {
  public posY: number
  public speedX: number
  public speedY: number
  public x: number
  public cooldown: number
  private observers: Observer[] = []
  // private spritesY: number

  constructor() {
    super('player')

    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e))
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e))

    this.posY = 300
    this.posX = 50
    this.speedX = 0
    this.speedY = 0
    this.x = 0
    this.cooldown = 0
    // this.spritesY = 0
  }

  public update(): void {
    //this.cooldown --

    if (this.cooldown > 0) {
      this.cooldown = this.cooldown - 1
    }

    this.posX = this.posX + this.speedX
    this.posY = this.posY + this.speedY

    if (this.posX >= window.innerWidth) {
      this.posX = 0
    }

    this.playerWindowCol()
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px)`
    // this.spritesY = this.spritesY - 112.5;
    // this.element.style.backgroundPositionY = `${this.spritesY}px`;
  }

  public add(o: Observer): void {
    this.observers.push(o)
  }

  public notifyAllObservers(): void {
    this.observers.forEach(observer => {
      observer.notify()
    })
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 38:
        this.speedY = -3
        break
      case 40:
        this.speedY = 3
        break
      case 32:
        if (this.cooldown === 0) {
          this.cooldown = 80
          Game.getInstance().fire()
          this.x -= 1
          break
        }
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 38:
        this.speedY = 0
        break
      case 40:
        this.speedY = 0
        break
    }
  }
}
