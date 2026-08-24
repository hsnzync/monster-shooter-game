import { Player, Powerup } from './elements'
import { Ghost, Slime, Eye, Skeleton } from './elements/monsters'
import { GameObject } from './game-object'
import { Fireball } from './elements/projectiles'
import { Observer } from './observer/observer'
import { Audio, Collision } from './utils'
import { Engine, Scene } from './engine/engine'
import { Renderer } from './engine/renderer'
import { Assets } from './engine/assets'
import { configureField } from './engine/field'
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  WALL_HEIGHT,
  TOPBAR_HEIGHT,
} from './engine/config'
import { texts } from './constants/texts'
import HitSound from './assets/audio/player_hit.mp3'
import MonsterHitSound from './assets/audio/monster_hit.mp3'
import CountDownAudio from './assets/audio/countdown.mp3'
import WorldAudio from './assets/audio/world.mp3'
import PowerupAudio from './assets/audio/special.mp3'
import HeartAudio from './assets/audio/heart.mp3'
import CoinAudio from './assets/audio/coin.mp3'
import GameOverAudio from './assets/audio/game_over.mp3'

type Phase = 'countdown' | 'playing' | 'gameover'

// Background.png (384x240) scaled to cover the field height (x2.5) and tiled.
const BG_TILE_W = 960
const BG_TILE_H = 600

/**
 * The gameplay scene. Kept as a Singleton (as before) so `Player` can reach the
 * shared fireball list and countdown state. The gameplay rules, timings and
 * spawn logic are unchanged from the DOM version — only rendering (canvas
 * instead of DOM elements) and collision (numeric bounds instead of
 * `getBoundingClientRect`) have changed.
 */
export class Game implements Scene {
  private static game: Game

  public score: number = 0
  private life: number = 6

  private engine!: Engine
  private assets!: Assets

  private player!: Player
  private monsters: GameObject[] = []
  public fireballs: Fireball[] = []
  private powerups: Powerup[] = []

  private backgroundPosX: number = 0
  private audio!: Audio
  private gameAudio!: Audio
  private observers: Observer[] = []

  public startcounter: number = 3
  private countdownValue: number | null = null
  private phase: Phase = 'countdown'

  private highestScore: number | null = 0
  private gameOverTime: number = 0

  private countdownInterval: ReturnType<typeof setInterval> | null = null
  private timeouts: ReturnType<typeof setTimeout>[] = []
  private keyHandler = (e: KeyboardEvent) => this.onKeyDown(e)

  public static init(): Game {
    if (!this.game) {
      this.game = new Game()
    }
    return this.game
  }

  // --- Scene lifecycle -------------------------------------------------------

  public enter(engine: Engine): void {
    this.engine = engine
    this.assets = Assets.get()

    configureField(FIELD_WIDTH, FIELD_HEIGHT, WALL_HEIGHT)

    this.score = 0
    this.life = 6
    this.startcounter = 3
    this.phase = 'countdown'
    this.backgroundPosX = 0
    this.monsters = []
    this.fireballs = []
    this.powerups = []

    this.player = new Player()

    document.addEventListener('keydown', this.keyHandler)
    this.startCountDown()
  }

  public exit(): void {
    document.removeEventListener('keydown', this.keyHandler)
    this.clearTimers()
  }

  // --- Update ---------------------------------------------------------------

  public update(): void {
    if (this.phase === 'gameover') return

    this.backgroundPosX = this.backgroundPosX + 1
    this.player.update()

    this.handlePickups()

    this.monsters.map((monster) => {
      monster.update()

      // Player hits a monster
      if (Collision.checkCollision(this.player.bounds(), monster.bounds())) {
        monster.reset()
        this.life--
        this.audio = new Audio(HitSound)
        this.audio.play()
      }

      this.fireballs.map((fireball) => {
        fireball.update()

        if (Collision.checkCollision(fireball.bounds(), monster.bounds())) {
          fireball.removeElement()
          this.score++
          monster.reset()

          this.audio = new Audio(MonsterHitSound)
          this.audio.play()

          const fireballIndex = this.fireballs.indexOf(fireball)
          this.fireballs.splice(fireballIndex, 1)
        }
      })
    })

    // Drop fireballs that have flown off the right edge (they were never
    // removed in the DOM version and simply leaked; here we reclaim them).
    this.fireballs = this.fireballs.filter((f) => f.posX <= FIELD_WIDTH)

    if (this.life === 0) {
      this.gameOver()
    }

    if (this.score === 20) {
      this.notifyAllObservers()
    }
  }

  private startCountDown(): void {
    this.audio = new Audio(CountDownAudio)

    this.countdownInterval = setInterval(() => {
      if (this.startcounter !== 0) {
        this.countdownValue = this.startcounter
        this.startcounter--
        this.audio.play()
      } else {
        if (this.countdownInterval) clearInterval(this.countdownInterval)
        this.countdownInterval = null
        this.countdownValue = null
        this.start()
      }
    }, 1500)
  }

  private start(): void {
    this.phase = 'playing'

    this.gameAudio = new Audio(WorldAudio, true)
    this.gameAudio.play()

    this.monsters.push(new Ghost(), new Slime(), new Eye(), new Skeleton())

    this.setPowerups()
  }

  // Schedule the periodic power-up spawns (unchanged timings: coin 10s,
  // special 20s, heart 30s).
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
      this.timeouts.push(
        setTimeout(() => this.powerups.push(new Powerup('special')), 20000)
      )
    }

    if (!this.powerups.includes(heart)) {
      this.timeouts.push(
        setTimeout(() => this.powerups.push(new Powerup('heart')), 30000)
      )
    }

    if (!this.powerups.includes(coin)) {
      this.timeouts.push(
        setTimeout(() => this.powerups.push(new Powerup('coin')), 10000)
      )
    }
  }

  private handlePickups(): void {
    this.powerups.map((item) => {
      item.update()
      if (Collision.checkCollision(this.player.bounds(), item.bounds())) {
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

  // --- Render ---------------------------------------------------------------

  public render(r: Renderer, now: number): void {
    if (this.phase === 'gameover') {
      this.renderGameOver(r, now)
      return
    }

    this.renderBackground(r)
    this.renderObjects(r, now)
    this.renderTopbar(r)
    this.renderCountdown(r)
  }

  private renderBackground(r: Renderer): void {
    const ctx = r.ctx
    const offset = ((this.backgroundPosX % BG_TILE_W) + BG_TILE_W) % BG_TILE_W
    for (let x = -offset; x < r.width; x += BG_TILE_W) {
      ctx.drawImage(this.assets.background, x, 0, BG_TILE_W, BG_TILE_H)
    }
  }

  private renderObjects(r: Renderer, now: number): void {
    const ctx = r.ctx
    for (const monster of this.monsters) {
      this.assets
        .sprite(monster.name)
        .draw(ctx, monster.posX, monster.posY, now)
    }
    for (const powerup of this.powerups) {
      this.assets
        .sprite(powerup.name)
        .draw(ctx, powerup.posX, powerup.posY, now)
    }
    for (const fireball of this.fireballs) {
      this.assets
        .sprite('fireball')
        .draw(ctx, fireball.posX, fireball.posY, now)
    }
    this.assets
      .sprite('player')
      .draw(ctx, this.player.posX, this.player.posY, now)
  }

  private renderTopbar(r: Renderer): void {
    // Slim, lightly translucent band so the scrolling world shows through.
    r.rect(0, 0, r.width, TOPBAR_HEIGHT, '#248c76', 0.6)

    // Health meter: meter.png is a 25x47 vertical strip of 7 states. Higher
    // `life` shows a state lower in the strip.
    const meterW = 150
    const meterH = 30
    const meterY = (TOPBAR_HEIGHT - meterH) / 2
    const src = this.assets.meter
    r.ctx.drawImage(src, 0, 7 * this.life, 25, 5, 24, meterY, meterW, meterH)

    // Score, right-aligned in the topbar.
    const scoreText = `Score: ${this.score}`
    const size = r.fitFontSize(scoreText, 260, 18)
    r.text(scoreText, r.width - 24, TOPBAR_HEIGHT / 2, size, {
      align: 'right',
      baseline: 'middle',
      color: 'rgb(30, 222, 126)',
      shadowY: 3,
    })
  }

  private renderCountdown(r: Renderer): void {
    if (this.countdownValue === null) return
    const label = String(this.countdownValue)
    const size = r.fitFontSize(label, r.width * 0.5, 96)
    r.text(label, r.width / 2, r.height / 2, size, {
      align: 'center',
      baseline: 'middle',
      shadowY: 10,
    })
  }

  private renderGameOver(r: Renderer, now: number): void {
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v))
    if (!this.gameOverTime) this.gameOverTime = now
    const alpha = clamp((now - this.gameOverTime) / 1000, 0, 1)

    r.clear('#000000')

    const title = texts.game.game_over.title.toUpperCase()
    const titleSize = r.fitFontSize(title, r.width - 120, 56)
    r.text(title, r.width / 2, r.height * 0.42, titleSize, {
      align: 'center',
      baseline: 'middle',
      alpha,
      shadowY: 8,
    })
    r.text(
      texts.game.game_over.description.toUpperCase(),
      r.width / 2,
      r.height * 0.56,
      14,
      {
        align: 'center',
        baseline: 'middle',
        alpha,
      }
    )
    r.text(
      `${texts.game.game_over.score}${this.score}`.toUpperCase(),
      r.width / 2,
      r.height * 0.63,
      14,
      { align: 'center', baseline: 'middle', alpha }
    )
  }

  // --- Game over ------------------------------------------------------------

  private gameOver(): void {
    this.phase = 'gameover'
    this.gameOverTime = 0
    this.clearTimers()
    this.setScore()

    if (this.gameAudio) this.gameAudio.fadeOut()
    this.timeouts.push(
      setTimeout(() => {
        this.audio = new Audio(GameOverAudio)
        this.audio.play()
        this.audio.fadeIn()
      }, 1500)
    )
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

  private clearTimers(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
      this.countdownInterval = null
    }
    this.timeouts.forEach((t) => clearTimeout(t))
    this.timeouts = []
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'KeyR' && this.phase === 'gameover') {
      window.location.reload()
    }
  }
}
