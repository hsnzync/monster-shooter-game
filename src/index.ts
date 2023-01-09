import { Player } from './objects/player'
import { Powerup } from './objects/powerup'
import { Coin } from './objects/coin'
import { Ghost, Slime, Eye, Skeleton } from './objects/enemies'
import { GameObject } from './game-object'
import { Fireball } from './objects/fireball'
import { Util } from './util'
import { Sounds } from './utils/sounds'
import './assets/scss/main.scss'

export class Game {
  private static instance: Game

  private score: number = 0
  private life: number = 6

  private scoreBoard: HTMLElement
  private healthBar: HTMLElement
  private topbar: HTMLElement
  private finalScore: HTMLElement
  private game: HTMLElement

  private player: Player
  private enemies: GameObject[] = []
  private fireballs: Fireball[] = []

  private pickup: Powerup
  private pickups: string[] = []

  private backgroundPosX: number = 0
  private sounds: Sounds
  private overworld: any

  private constructor() {
    this.game = document.getElementsByTagName('game')[0] as HTMLElement
    this.topbar = document.getElementsByTagName('topbar')[0] as HTMLElement
    this.scoreBoard = document.getElementsByTagName(
      'scoreboard'
    )[0] as HTMLElement
    this.healthBar = document.getElementsByTagName(
      'healthbar'
    )[0] as HTMLElement
    this.scoreBoard.innerHTML = `Your score: ${this.score}`

    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e))

    this.sounds = new Sounds('src/assets/sounds/overworld.mp3', true)
    // this.sounds.play()

    this.player = new Player()

    this.enemies.push(
      new Ghost(this.player),
      new Slime(this.player),
      new Eye(this.player),
      new Skeleton(this.player)
    )

    this.gameLoop()
  }

  public static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game()
    }
    return Game.instance
  }

  public gameLoop(): void {
    this.backgroundPosX = this.backgroundPosX - 2
    this.game.style.backgroundPosition = `${this.backgroundPosX}px 0px`
    this.player.update()
    this.setPickups()
    for (let enemy of this.enemies) {
      enemy.update()

      if (
        Util.checkCollision(
          this.player.getBoundingClientRect(),
          enemy.getBoundingClientRect()
        )
      ) {
        enemy.reset()
        this.removeLife()
        // this.score--

        this.sounds = new Sounds('src/assets/sounds/hit.mp3')
        // this.sounds.play()
      }

      for (let fireball of this.fireballs) {
        fireball.update()

        if (
          Util.checkCollision(
            fireball.getBoundingClientRect(),
            enemy.getBoundingClientRect()
          )
        ) {
          fireball.removeElement()
          this.scorePoint()
          enemy.reset()

          this.sounds = new Sounds('src/assets/sounds/hit2.mp3')
          // this.sounds.play()

          let fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      }
    }

    if (this.life === 0) {
      // this.sounds.stop()
      this.finalScore = document.createElement('finalscore')
      this.game.appendChild(this.finalScore)

      this.finalScore.innerHTML = 'Game over'
      this.finalScore.style.display = 'block'

      this.sounds = new Sounds('src/assets/sounds/game_over.mp3')
      // this.sounds.play()
    } else {
      requestAnimationFrame(() => this.gameLoop())
    }
  }

  private setPickups(): void {
    if (this.pickups.length === 0 || this.pickups.length <= 2) {
      setInterval(() => {
        if (!this.pickups.includes('powerup')) {
          this.pickups.push('powerup')
          this.pickup = new Powerup('powerup')
        }
      }, 8000)

      setInterval(() => {
        if (!this.pickups.includes('coin')) {
          this.pickups.push('coin')
          this.pickup = new Powerup('coin')
        }
      }, 4000)
    }

    if (this.pickups.length) {
      this.pickup.update()
      if (
        Util.checkCollision(
          this.player.getBoundingClientRect(),
          this.pickup.getBoundingClientRect()
        )
      ) {
        this.pickup.removeElement()

        if (this.pickups.includes('powerup')) {
          this.player.notifyAllObservers()

          this.sounds = new Sounds('src/assets/sounds/powerup.mp3')
          // this.sounds.play()

          if (this.fireballs.length) this.fireballs = []
          this.fireballs.push(
            new Fireball(this.player.posX, this.player.posY),
            new Fireball(this.player.posX, this.player.posY + 20),
            new Fireball(this.player.posX, this.player.posY + 40)
          )
        } else {
          this.scorePoint()
          this.sounds = new Sounds('src/assets/sounds/coin.mp3')
          // this.sounds.play()
        }
      }
    }
  }

  public fire() {
    if (this.fireballs.length) this.fireballs = []
    this.fireballs.push(new Fireball(this.player.posX, this.player.posY))

    this.sounds = new Sounds('src/assets/sounds/laser.mp3')
    // this.sounds.play()
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'r':
        Game.getInstance()
        //this.gameLoop()
        break
    }
  }

  public removeLife() {
    this.life--

    switch (this.life) {
      case 5:
        this.healthBar.style.backgroundPositionY = `-255px`
        break
      case 4:
        this.healthBar.style.backgroundPositionY = `-204px`
        break
      case 3:
        this.healthBar.style.backgroundPositionY = `-153px`
        break
      case 2:
        this.healthBar.style.backgroundPositionY = `-102px`
        break
      case 1:
        this.healthBar.style.backgroundPositionY = `-51px`
        break
      case 0:
        this.healthBar.style.backgroundPositionY = `0px`
        break
    }
  }

  public scorePoint() {
    this.score++
    this.scoreBoard.innerHTML = `Your score: ${this.score}`
  }
}

window.addEventListener('load', () => {
  Game.getInstance()
})
