import { Player } from './elements/player'
import { Powerup } from './elements/powerup'
import { Ghost, Slime, Eye, Skeleton } from './elements/monsters'
import { GameObject } from './game-object'
import { Fireball } from './elements/fireball'
import { Util } from './util'
import { Audio } from './utils/audio'
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

  private player: Player
  private monsters: GameObject[] = []
  public fireballs: Fireball[] = []

  private powerups: Powerup[] = []

  private backgroundPosX: number = 0
  private audio: Audio
  private gameAudio: Audio

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
    // this.gameAudio = new Audio('src/assets/audio/world.mp3', true)
    // this.gameAudio.play()

    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.container.style.backgroundImage =
      "url('./src/assets/img/background.png')"
    this.topbar = document.createElement('topbar')
    this.scoreBoard = document.createElement('scoreboard')
    this.healthBar = document.createElement('healthbar')

    this.container.appendChild(this.topbar)
    this.topbar.appendChild(this.scoreBoard)
    this.topbar.appendChild(this.healthBar)

    // Create player and monsters
    this.player = new Player()

    this.monsters.push(
      new Ghost(this.player),
      new Slime(this.player),
      new Eye(this.player),
      new Skeleton(this.player)
    )

    // Create instances of game elements and add them to the game
    setInterval(() => {
      if (this.powerups.length < 2 && this.life > 0) {
        this.powerups.push(new Powerup('firebolt'))
      } else {
        this.powerups.pop()
      }
    }, 7000)

    setInterval(() => {
      if (this.powerups.length < 2 && this.life > 0) {
        this.powerups.push(new Powerup('coin'))
      } else {
        this.powerups.pop()
      }
    }, 4000)
  }

  private gameLoop(): void {
    // start the animation of the game loop
    this.animationId = requestAnimationFrame(() => this.gameLoop())

    this.scoreBoard.innerHTML = `Score: ${this.score}`
    this.backgroundPosX = this.backgroundPosX - 1.5
    this.container.style.backgroundPosition = `${this.backgroundPosX}px 0px`

    this.player.update()
    this.handlePickups()

    if (this.life === 0) this.gameOver()

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
        this.removeLife()
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
        console.log(this.powerups)

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
    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e))
    const finalScore: HTMLElement = document.createElement('finalscore')
    const highScores: HTMLElement = document.createElement('highscores')

    this.container.innerHTML = ''
    cancelAnimationFrame(this.animationId)

    finalScore.innerHTML = `
    <span>Game over</span>
    <span>Score: ${this.score}</span>
    <span>Press "R" to restart</span>
    `

    highScores.innerHTML = `
      <span>Highscores here</span>
      <ul>
        <li>boss ${this.score}</li>
      </ul>`

    this.container.appendChild(finalScore)
    this.container.appendChild(highScores)
    // this.gameAudio.stop()
    // this.audio = new Audio('src/assets/audio/game_over.mp3')
    // this.audio.play()
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyR':
        window.location.reload()
        break
    }
  }
}
