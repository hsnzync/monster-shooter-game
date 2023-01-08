import { Howl } from 'howler'
import { Player } from './objects/player'
import { Powerup } from './objects/powerup'
import { Coin } from './objects/coin'
import { Ghost, Slime, Eye, Skeleton } from './objects/enemies'
import { GameObject } from './game-object'
import { Fireball } from './objects/fireball'
import { Util } from './util'
import './assets/scss/main.scss'

export class Game {
  private static instance: Game

  private score: number = 0
  private life: number = 0

  private scoreBoard: HTMLElement
  private healthBar: HTMLElement
  private topbar: HTMLElement
  private finalScore: HTMLElement
  private game: HTMLElement

  private player: Player
  private enemies: GameObject[] = []
  private fireballs: Fireball[] = []
  // private fireballs: Fireball[] = []
  private pickups: GameObject[] = []
  private backgroundPosX: number
  // private audio:HTMLAudioElement
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

    // this.overworld = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/overworld.mp3')
    // this.overworld.play()

    // this.overworld = new Howl({
    //   src: ['src/assets/sounds/overworld.mp3'],
    //   loop: true,
    // })

    // this.overworld.play()

    this.player = new Player()

    this.enemies.push(
      new Ghost(this.player),
      new Slime(this.player),
      new Eye(this.player),
      new Skeleton(this.player)
    )

    this.backgroundPosX = 0

    this.gameLoop()

    setInterval(() => {
      if (this.pickups.length == 0) {
        this.pickups.push(new Powerup(), new Coin())
      }
    }, 10000)
  }

  public static getInstance() {
    if (!Game.instance) {
      Game.instance = new Game()
    }
    return Game.instance
  }

  public gameLoop(): void {
    //requestAnimationFrame(() => this.gameLoop())
    this.backgroundPosX = this.backgroundPosX - 2
    this.game.style.backgroundPosition = `${this.backgroundPosX}px 0px`

    this.player.update()

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
        this.score--

        let hitSound = new Howl({
          src: ['src/assets/sounds/hit.mp3'],
          loop: false,
        })

        // hitSound.play()

        // let hitSound = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/hit.mp3')
        // hitSound.play()
      }

      for (let pickup of this.pickups) {
        pickup.update()

        if (
          Util.checkCollision(
            this.player.getBoundingClientRect(),
            pickup.getBoundingClientRect()
          )
        ) {
          pickup.removeElement()
          let powerupIndex = this.pickups.indexOf(pickup)
          this.pickups.splice(powerupIndex, 1)

          if (this.pickups[0]) {
            this.player.notifyAllObservers()

            let powerupSound = new Howl({
              src: ['src/assets/sounds/powerup.mp3'],
              loop: false,
            })

            // powerupSound.play()

            // let powerupSound = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/powerup.mp3')
            // powerupSound.play()

            if (this.fireballs.length) this.fireballs = []
            this.fireballs.push(
              new Fireball(this.player.posX, this.player.posY),
              new Fireball(this.player.posX, this.player.posY + 20),
              new Fireball(this.player.posX, this.player.posY + 40)
            )
            console.log(this.fireballs)
          } else {
            this.scorePoint()
            // let coinSound = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/coin.mp3')
            // coinSound.play()

            let coinSound = new Howl({
              src: ['src/assets/sounds/coin.mp3'],
              loop: false,
            })

            // coinSound.play()
          }
        }
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

          // let hitEnemySound = new Howl({
          //   src: ['src/assets/sounds/hit2.mp3'],
          //   loop: false,
          // })

          // hitEnemySound.play()

          let fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      }
    }

    if (this.life >= 6) {
      this.overworld.pause()
      this.finalScore = document.createElement('finalscore')

      this.finalScore.innerHTML = 'Game over'
      this.finalScore.style.display = 'block'
      this.game.appendChild(this.finalScore)

      // let gameover = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/game_over.mp3')
      // gameover.play()

      // let gameover = new Howl({
      //   src: ['src/assets/sounds/game_over.mp3'],
      //   loop: false,
      // })

      // gameover.play()
    } else {
      requestAnimationFrame(() => this.gameLoop())
    }
  }

  public fire() {
    if (this.fireballs.length) this.fireballs = []
    this.fireballs.push(new Fireball(this.player.posX, this.player.posY))
    console.log(this.fireballs)
    // let fireSound = this.audio = new Audio('https://raw.githubusercontent.com/Hsnzync/monster-shooter/master/docs/sounds/laser.mp3')
    // fireSound.play()

    let fireSound = new Howl({
      src: ['src/assets/sounds/laser.mp3'],
      loop: false,
    })

    // fireSound.play()
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case 82:
        Game.getInstance()
        //this.gameLoop()
        break
    }
  }

  public removeLife() {
    this.life++

    switch (this.life) {
      case 1:
        this.healthBar.style.backgroundPositionY = `-255px`
        break
      case 2:
        this.healthBar.style.backgroundPositionY = `-204px`
        break
      case 3:
        this.healthBar.style.backgroundPositionY = `-153px`
        break
      case 4:
        this.healthBar.style.backgroundPositionY = `-102px`
        break
      case 5:
        this.healthBar.style.backgroundPositionY = `-51px`
        break
      case 6:
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
