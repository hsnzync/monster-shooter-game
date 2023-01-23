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
    this.posX = 60
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

    this.windowCol()
    this.element.style.transform = `translate(${this.posX}px, ${this.posY}px)`
  }

  private windowCol(): void {
    if (this.posX + this.element.clientWidth > this.game.clientWidth) {
      this.posX && this.posY == 300
      this.speedX *= 0
    }

    this.windowYCol()

    // Left wall collision detection
    if (this.posX < 30) {
      this.speedX *= 0
      this.posX = 30
    }

    // Right "invisible" wall collision detection
    if (this.posX >= 200) {
      this.speedX *= 0
      this.posX = 200
    }
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
    fireballs.push(new Fireball(this.posX - 20, this.posY - 30))

    this.audio = new Audio('src/assets/audio/fire.mp3')
    this.audio.play()
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.speedY = -2
        break
      case 'ArrowDown':
        this.speedY = 2
        break
      case 'ArrowRight':
        this.speedX = 2
        break
      case 'ArrowLeft':
        this.speedX = -2
        break
      case 'Space':
        if (this.cooldown === 0) {
          this.cooldown = 80
          this.shoot()
          break
        }
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.speedY = 0
        break
      case 'ArrowDown':
        this.speedY = 0
        break
      case 'ArrowRight':
        this.speedX = 0
        break
      case 'ArrowLeft':
        this.speedX = 0
        break
    }
  }
}
