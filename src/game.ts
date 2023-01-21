import { Player } from './elements/player'
import { Powerup } from './elements/powerup'
import { Ghost, Slime, Eye, Skeleton } from './elements/monsters'
import { GameObject } from './game-object'
import { Fireball } from './elements/fireball'
import { Util } from './util'
import { Audio } from './utils/audio'
import { Overlay } from './utils/overlay'
import './assets/scss/main.scss'

export class Game {
  private static game: Game
  private animationId: any

  private score: number = 0

  private container: HTMLElement
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

  private gameStartCounter: HTMLElement
  private startcounter: number = 3
  private gameTime: HTMLElement
  public time: number = 30
  private highestScore: number | null = 0

  public constructor() {
    // this.gameAudio = new Audio('src/assets/audio/world.mp3', true)
    // this.gameAudio.play()
    this.setup()
    this.gameLoop()
  }

  public static init() {
    if (!this.game) {
      this.game = new Game()
    }
    return this.game
  }

  private setup(): void {
    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.container.style.backgroundImage =
      "url('./src/assets/img/background.png')"

    this.topbar = document.createElement('topbar')
    this.scoreBoard = document.createElement('scoreboard')
    this.gameTime = document.createElement('time')

    this.startCountDown()

    // Create player and monsters
    this.player = new Player()
  }

  private gameLoop(): void {
    // start the animation of the game loop
    this.animationId = requestAnimationFrame(() => this.gameLoop())

    this.scoreBoard.innerHTML = `Score: ${this.score}`
    this.gameTime.innerHTML = `Time: ${this.time}`
    this.backgroundPosX = this.backgroundPosX - 1.5
    this.container.style.backgroundPosition = `${this.backgroundPosX}px 0px`

    this.player.update()
    this.handlePickups()

    this.monsters.map(monster => {
      monster.update()

      // Player hits a monster
      if (
        Util.checkCollision(
          this.player.getBoundingClientRect(),
          monster.getBoundingClientRect()
        )
      ) {
        monster.reset()
        if (this.score > 0) {
          this.score--
        }

        // this.audio = new Audio('src/assets/audio/hit.mp3')
        // this.audio.play()
      }

      this.fireballs.map(fireball => {
        fireball.update()

        if (
          Util.checkCollision(
            fireball.getBoundingClientRect(),
            monster.getBoundingClientRect()
          )
        ) {
          fireball.removeElement()
          this.score++
          monster.reset()

          // this.audio = new Audio('src/assets/audio/hit2.mp3')
          // this.audio.play()

          let fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      })
    })

    if (this.time === 0) {
      this.gameOver()
    }
  }

  private startCountDown(): void {
    this.gameStartCounter = document.createElement('h2')
    this.container.appendChild(this.gameStartCounter)
    const interval = setInterval(() => {
      if (this.startcounter !== 0) {
        this.gameStartCounter.innerHTML = (this
          .startcounter as unknown) as string
        this.startcounter--
      } else {
        clearInterval(interval)
        this.gameStartCounter.remove()
        this.start()
      }
    }, 1500)
  }

  private start(): void {
    this.topbar.appendChild(this.scoreBoard)
    this.topbar.appendChild(this.gameTime)
    this.container.appendChild(this.topbar)

    this.monsters.push(
      new Ghost(this.player),
      new Slime(this.player),
      new Eye(this.player),
      new Skeleton(this.player)
    )

    // Create instances of game elements and add them to the game
    setInterval(() => {
      if (this.powerups.length < 2 && this.time > 0) {
        this.powerups.push(new Powerup('firebolt'))
      } else {
        this.powerups.pop()
        this.powerups.map(item => item.reset())
      }
    }, 7000)

    setInterval(() => {
      if (this.powerups.length < 2 && this.time > 0) {
        this.powerups.push(new Powerup('coin'))
      } else {
        this.powerups.pop()
        this.powerups.map(item => item.reset())
      }
    }, 4000)

    this.countDown()
  }

  private handlePickups(): void {
    this.powerups.map(item => {
      item.update()
      if (
        Util.checkCollision(
          this.player.getBoundingClientRect(),
          item.getBoundingClientRect()
        )
      ) {
        item.removeElement()

        if (item.name === 'firebolt') {
          this.player.notifyAllObservers()

          // this.audio = new Audio('src/assets/audio/powerup.mp3')
          // this.audio.play()

          if (this.fireballs.length) this.fireballs = []
          this.fireballs.push(
            new Fireball(this.player.posX, this.player.posY + 10),
            new Fireball(this.player.posX, this.player.posY + 30),
            new Fireball(this.player.posX, this.player.posY + 50)
          )
        } else {
          this.score++
          // this.audio = new Audio('src/assets/audio/coin.mp3')
          // this.audio.play()
        }
      }
    })
  }

  private countDown(): void {
    setInterval(() => {
      this.time--
      if (this.time <= 10) {
        this.gameTime.style.color = '#fff'
      }
    }, 1000)
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

    gameOverText.innerHTML = 'Game over'
    restartText.innerHTML = 'Press R to restart'
    scoreText.innerHTML = `Score: ${this.score}`
    gameOver.appendChild(gameOverText)
    gameOver.appendChild(restartText)
    gameOver.appendChild(scoreText)

    this.container.appendChild(gameOver)

    // this.gameAudio.stop()
    // this.audio = new Audio('src/assets/audio/game_over.mp3')
    // this.audio.play()
  }

  private setScore(): void {
    const localHighScore = localStorage.getItem('score')
    const score = (this.score as unknown) as string

    if (localHighScore) {
      this.highestScore = (localHighScore as unknown) as number
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
