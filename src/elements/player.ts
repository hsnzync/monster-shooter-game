import { Observer } from '../observer/observer'
import { Game } from '../game'
import { GameObject } from '../game-object'
import { Audio } from '../utils/audio'
import { Fireball } from './projectiles/fireball'

export class Player extends GameObject {
  public speedX: number
  public speedY: number
  public cooldown: number = 0
  private observers: Observer[] = []
  private audio: Audio

  constructor() {
    super('player')

    document.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeyDown(e)
    )
    document.addEventListener('keyup', (e: KeyboardEvent) =>
      this.handleKeyUp(e)
    )

    this.posY = 300
    this.posX = 60
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
  }

  public shoot() {
    const fireballs = Game.init().fireballs
    fireballs.push(new Fireball(this.posX, this.posY))

    this.audio = new Audio('src/assets/audio/fire.mp3')
    this.audio.play()
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.speedY = -2
        break
      case 'ArrowDown':
        this.speedY = 2
        break
      case 'Space':
        if (this.cooldown === 0) {
          this.cooldown = 80
          if (Game.init().startcounter === 0) {
            this.shoot()
          }
          break
        }
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'ArrowUp':
        this.speedY = 0
        break
      case 'ArrowDown':
        this.speedY = 0
        break
    }
  }
}
