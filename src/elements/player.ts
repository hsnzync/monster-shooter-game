import { Observer } from '../observer/observer'
import { Game } from '../game'
import { GameObject } from '../game-object'
import { Audio } from '../utils/audio'
import { Fireball } from './fireball'

export class Player extends GameObject {
  public speedX: number
  public speedY: number
  public cooldown: number
  private observers: Observer[] = []
  private audio: Audio

  constructor() {
    super('player')

    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e))
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e))

    this.posY = 300
    this.posX = 50
    this.speedX = 0
    this.speedY = 0
    this.cooldown = 0
  }

  public update(): void {
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
  }

  public add(o: Observer): void {
    this.observers.push(o)
  }

  public notifyAllObservers(): void {
    this.observers.forEach(observer => {
      observer.notify()
    })
  }

  public shoot() {
    const fireballs = Game.init().fireballs
    fireballs.push(new Fireball(this.posX, this.posY))

    // this.audio = new Audio('src/assets/sounds/laser.mp3')
    // this.audio.play()
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.speedY = -3
        break
      case 'ArrowDown':
        this.speedY = 3
        break
      case ' ':
        if (this.cooldown === 0) {
          this.cooldown = 80
          this.shoot()
          break
        }
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.speedY = 0
        break
      case 'ArrowDown':
        this.speedY = 0
        break
    }
  }
}
