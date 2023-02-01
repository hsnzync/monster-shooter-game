import { Observer } from './observer/observer'
import { Player, Powerup } from './elements'
import { Ghost, Slime, Eye, Skeleton } from './elements/monsters'
import { GameObject } from './game-object'
import { Fireball } from './elements/projectiles'
import { Audio, Overlay, Collision } from './utils'
import { texts } from './constants/texts'
import Background from './assets/img/background.png'
import HitSound from './assets/audio/player_hit.mp3'
import MonsterHitSound from './assets/audio/monster_hit.mp3'
import CountDownAudio from './assets/audio/countdown.mp3'
import WorldAudio from './assets/audio/world.mp3'
import PowerupAudio from './assets/audio/special.mp3'
import HeartAudio from './assets/audio/heart.mp3'
import CoinAudio from './assets/audio/coin.mp3'
import GameOverAudio from './assets/audio/game_over.mp3'
import './assets/scss/main.scss'

export class Game {
  private static game: Game
  private animationId: any

  public score: number = 0
  private life: number = 6

  private container: HTMLElement
  private wall: HTMLElement
  private topbar: HTMLElement
  private scoreBoard: HTMLElement
  private healthBar: HTMLElement
  private overlay: Overlay

  private player: Player
  private monsters: GameObject[] = []
  public fireballs: Fireball[] = []

  private powerups: Powerup[] = []

  private backgroundPosX: number = 0
  private audio: Audio
  private gameAudio: Audio
  private observers: Observer[] = []

  private gameStartCounter: HTMLElement
  public startcounter: number = 3
  private highestScore: number | null = 0

  public constructor() {
    this.setup()
    this.gameLoop()
    console.log(CountDownAudio)
  }

  public static init() {
    if (!this.game) {
      this.game = new Game()
    }
    return this.game
  }

  private setup(): void {
    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.container.style.backgroundImage = `url(${Background})`

    this.wall = document.createElement('wall')
    this.topbar = document.createElement('topbar')
    this.scoreBoard = document.createElement('scoreboard')
    this.healthBar = document.createElement('healthbar')
    this.container.appendChild(this.wall)

    this.startCountDown()
    this.player = new Player()
    this.topbar.appendChild(this.scoreBoard)
    this.topbar.appendChild(this.healthBar)
    this.container.appendChild(this.topbar)
  }

  private gameLoop(): void {
    // start the animation of the game loop
    this.animationId = requestAnimationFrame(() => this.gameLoop())

    this.scoreBoard.innerHTML = `Score: ${this.score}`
    this.backgroundPosX = this.backgroundPosX - 1
    this.container.style.backgroundPosition = `${this.backgroundPosX}px 0px`

    this.player.update()

    this.handlePickups()
    this.monsters.map((monster) => {
      monster.update()

      // Player hits a monster
      if (
        Collision.checkCollision(
          this.player.getBoundingClientRect(),
          monster.getBoundingClientRect()
        )
      ) {
        monster.reset()
        this.life--
        this.handleHearts()
        this.audio = new Audio(HitSound)
        this.audio.play()
      }

      this.fireballs.map((fireball) => {
        fireball.update()

        if (
          Collision.checkCollision(
            fireball.getBoundingClientRect(),
            monster.getBoundingClientRect()
          )
        ) {
          fireball.removeElement()
          this.score++
          monster.reset()

          this.audio = new Audio(MonsterHitSound)
          this.audio.play()

          let fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      })
    })

    if (this.life === 0) {
      this.gameOver()
    }

    if (this.score === 20) {
      this.notifyAllObservers()
    }
  }

  private startCountDown(): void {
    this.gameStartCounter = document.createElement('h2')
    this.container.appendChild(this.gameStartCounter)
    this.audio = new Audio(CountDownAudio)

    const intervalId = setInterval(() => {
      if (this.startcounter !== 0) {
        this.gameStartCounter.innerHTML = this.startcounter as unknown as string
        this.startcounter--
        this.audio.play()
      } else {
        clearInterval(intervalId)
        this.gameStartCounter.remove()
        this.start()
      }
    }, 1500)
  }

  private start(): void {
    this.topbar.appendChild(this.scoreBoard)
    this.topbar.appendChild(this.healthBar)
    this.container.appendChild(this.topbar)

    this.gameAudio = new Audio(WorldAudio, true)
    this.gameAudio.play()

    this.monsters.push(new Ghost(), new Slime(), new Eye(), new Skeleton())

    this.setPowerups()
  }

  // Create instances of game elements and add them to the game
  private setPowerups(): void {
    const special = this.powerups.filter(
      (p) => p.name === 'special'
    ) as unknown as Powerup
    const coin = this.powerups.filter(
      (p) => p.name === 'coin'
    ) as unknown as Powerup
    const heart = this.powerups.filter(
      (p) => p.name === 'heart'
    ) as unknown as Powerup

    if (!this.powerups.includes(special)) {
      setTimeout(() => {
        this.powerups.push(new Powerup('special'))
      }, 20000)
    }

    if (!this.powerups.includes(heart)) {
      setTimeout(() => {
        this.powerups.push(new Powerup('heart'))
      }, 30000)
    }

    if (!this.powerups.includes(coin)) {
      setTimeout(() => {
        this.powerups.push(new Powerup('coin'))
      }, 10000)
    }
  }

  private handlePickups(): void {
    this.powerups.map((item) => {
      item.update()
      if (
        Collision.checkCollision(
          this.player.getBoundingClientRect(),
          item.getBoundingClientRect()
        )
      ) {
        item.removeElement()
        this.powerups.pop()
        this.setPowerups()

        switch (item.name) {
          case 'special':
            this.audio = new Audio(PowerupAudio)
            this.audio.play()

            if (this.fireballs.length) this.fireballs = []
            this.fireballs.push(
              new Fireball(this.player.posX, this.player.posY - 50),
              new Fireball(this.player.posX, this.player.posY - 30),
              new Fireball(this.player.posX, this.player.posY - 10)
            )
            break
          case 'heart':
            if (this.life < 6) {
              this.life++
              this.handleHearts()
              this.audio = new Audio(HeartAudio)
              this.audio.play()
            }
            break

          default:
            this.score++
            this.audio = new Audio(CoinAudio)
            this.audio.play()
            break
        }
      }
    })
  }

  private notifyAllObservers(): void {
    this.observers = this.monsters as unknown as Observer[]
    this.observers.map((observer) => observer.notify())
  }

  private handleHearts(): void {
    switch (this.life) {
      case 6:
        this.healthBar.style.backgroundPositionY = `-336px;`
        break
      case 5:
        this.healthBar.style.backgroundPositionY = `-280px`
        break
      case 4:
        this.healthBar.style.backgroundPositionY = `-224px`
        break
      case 3:
        this.healthBar.style.backgroundPositionY = `-168px`
        break
      case 2:
        this.healthBar.style.backgroundPositionY = `-112px`
        break
      case 1:
        this.healthBar.style.backgroundPositionY = `-56px`
        break
      case 0:
        this.healthBar.style.backgroundPositionY = `0px`
        break
    }
  }

  private gameOver(): void {
    cancelAnimationFrame(this.animationId)
    this.container.innerHTML = ''

    this.overlay = new Overlay()
    this.overlay.show()
    this.setScore()

    document.addEventListener('keydown', (e: KeyboardEvent) =>
      this.onKeyDown(e)
    )
    const gameOver: HTMLElement = document.createElement('game-over')
    const gameOverText: HTMLElement = document.createElement('h3')
    const restartText: HTMLElement = document.createElement('span')
    const scoreText: HTMLElement = document.createElement('span')

    gameOverText.innerHTML = texts.game.game_over.title
    restartText.innerHTML = texts.game.game_over.description
    scoreText.innerHTML = texts.game.game_over.score + this.score
    gameOver.appendChild(gameOverText)
    gameOver.appendChild(restartText)
    gameOver.appendChild(scoreText)

    this.container.appendChild(gameOver)

    this.gameAudio.fadeOut()
    setTimeout(() => {
      this.audio = new Audio(GameOverAudio)
      this.audio.play()
      this.audio.fadeIn()
    }, 1500)
  }

  private setScore(): void {
    const localHighScore = localStorage.getItem('score')
    const score = this.score as unknown as string

    if (localHighScore) {
      this.highestScore = localHighScore as unknown as number
      if (this.score > this.highestScore) {
        localStorage.setItem('score', score)
      }
    } else {
      localStorage.setItem('score', score)
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'KeyR') {
      window.location.reload()
    }
  }
}
