import { Player } from './elements/player'
import { Powerup } from './elements/powerup'
import { Ghost, Slime, Eye, Skeleton } from './elements/monsters'
import { GameObject } from './game-object'
import { Fireball } from './elements/fireball'
import { Audio } from './utils/audio'
import { Overlay } from './utils/overlay'
import { Collision } from './utils/collision'
import { texts } from './assets/texts'
import './assets/scss/main.scss'

export class Game {
  private static game: Game
  private animationId: any

  private score: number = 0
  private life: number = 6

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
  private highestScore: number | null = 0

  public constructor() {
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
    this.healthBar = document.createElement('healthbar')

    this.startCountDown()
    this.player = new Player()
  }

  private gameLoop(): void {
    // start the animation of the game loop
    this.animationId = requestAnimationFrame(() => this.gameLoop())

    this.scoreBoard.innerHTML = `Score: ${this.score}`
    this.backgroundPosX = this.backgroundPosX - 1.5
    this.container.style.backgroundPosition = `${this.backgroundPosX}px 0px`

    this.player.update()
    this.handlePickups()

    this.monsters.map(monster => {
      monster.update()

      // Player hits a monster
      if (
        Collision.checkCollision(
          this.player.getBoundingClientRect(),
          monster.getBoundingClientRect()
        )
      ) {
        monster.reset()
        this.removeLife()
        if (this.score > 0) {
          this.score--
        }

        this.audio = new Audio('src/assets/audio/player_hit.mp3')
        this.audio.play()
      }

      this.fireballs.map(fireball => {
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

          this.audio = new Audio('src/assets/audio/monster_hit.mp3')
          this.audio.play()

          let fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      })
    })

    if (this.life === 0) {
      this.gameOver()
    }
  }

  private startCountDown(): void {
    this.gameStartCounter = document.createElement('h2')
    this.container.appendChild(this.gameStartCounter)
    this.audio = new Audio('src/assets/audio/countdown.mp3')

    const interval = setInterval(() => {
      if (this.startcounter !== 0) {
        this.gameStartCounter.innerHTML = (this
          .startcounter as unknown) as string
        this.startcounter--
        this.audio.play()
      } else {
        clearInterval(interval)
        this.gameStartCounter.remove()
        this.start()
      }
    }, 1500)
  }

  private start(): void {
    this.topbar.appendChild(this.scoreBoard)
    this.topbar.appendChild(this.healthBar)
    this.container.appendChild(this.topbar)

    this.gameAudio = new Audio('src/assets/audio/world.mp3', true)
    this.gameAudio.play()

    this.monsters.push(
      new Ghost(this.player),
      new Slime(this.player),
      new Eye(this.player),
      new Skeleton(this.player)
    )

    this.setPowerups()
  }

  // Create instances of game elements and add them to the game
  private setPowerups(): void {
    const firebolt = (this.powerups.filter(
      p => p.name === 'firebolt'
    ) as unknown) as Powerup
    const coin = (this.powerups.filter(
      p => p.name === 'coin'
    ) as unknown) as Powerup

    if (!this.powerups.includes(firebolt)) {
      setTimeout(() => {
        this.powerups.push(new Powerup('firebolt'))
      }, 16000)
    }

    if (!this.powerups.includes(coin)) {
      setTimeout(() => {
        this.powerups.push(new Powerup('coin'))
      }, 8000)
    }
  }

  private handlePickups(): void {
    this.powerups.map(item => {
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

        if (item.name === 'firebolt') {
          this.player.notifyAllObservers()

          this.audio = new Audio('src/assets/audio/firestorm.mp3')
          this.audio.play()

          if (this.fireballs.length) this.fireballs = []
          this.fireballs.push(
            new Fireball(this.player.posX, this.player.posY - 50),
            new Fireball(this.player.posX, this.player.posY - 30),
            new Fireball(this.player.posX, this.player.posY - 10)
          )
        } else {
          this.score++
          this.audio = new Audio('src/assets/audio/coin.mp3')
          this.audio.play()
        }
      }
    })
  }

  private removeLife(): void {
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
      this.audio = new Audio('src/assets/audio/game_over.mp3')
      this.audio.play()
      this.audio.fadeIn()
    }, 1500)
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
