import { Engine, Scene } from '../engine/engine'
import { Renderer } from '../engine/renderer'
import { Assets } from '../engine/assets'
import { Audio } from '../utils'
import { texts } from '../constants/texts'
import { IntroScene } from './intro-scene'
import StartAudio from '../assets/audio/start.mp3'

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

/**
 * Title screen: animated background, fading-in title and the high score.
 * Press ENTER to fade to the introduction.
 */
export class StartScene implements Scene {
  private engine!: Engine
  private audio!: Audio
  private enterTime = 0
  private leaving = false
  private leaveStart = 0
  private enterPressed = false
  private highScore = 0
  private keyHandler = (e: KeyboardEvent) => this.onKeyDown(e)

  public enter(engine: Engine): void {
    this.engine = engine
    this.enterTime = 0
    this.highScore = Number(localStorage.getItem('score')) || 0

    this.audio = new Audio(StartAudio, true)
    this.audio.play()

    document.addEventListener('keydown', this.keyHandler)
  }

  public exit(): void {
    document.removeEventListener('keydown', this.keyHandler)
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter') this.enterPressed = true
  }

  public update(now: number): void {
    if (!this.enterTime) this.enterTime = now
    const elapsed = now - this.enterTime

    // Only accept ENTER once the prompt is visible (matches the original ~2s).
    if (this.enterPressed && !this.leaving && elapsed > 2000) {
      this.leaving = true
      this.leaveStart = now
    }

    if (this.leaving && now - this.leaveStart >= 1200) {
      Assets.get().releaseStartBackground()
      this.engine.go(new IntroScene(this.audio))
    }
  }

  public render(r: Renderer, now: number): void {
    const { width, height } = r
    const elapsed = this.enterTime ? now - this.enterTime : 0

    r.clear('#000000')
    const bg = Assets.get().startBackground
    if (bg) bg.draw(r.ctx, 0, 0, now)

    // Title with a fade-in and a vertical gradient fill.
    const titleAlpha = clamp(elapsed / 1500, 0, 1)
    const titleSize = r.fitFontSize(texts.title_screen.title, width - 120, 56)
    r.gradientText(
      texts.title_screen.title,
      width / 2,
      height * 0.34,
      titleSize,
      titleAlpha
    )

    const promptAlpha = elapsed > 2000 ? 0.7 : 0
    r.text(texts.title_screen.description, width / 2, height * 0.5, 16, {
      align: 'center',
      baseline: 'middle',
      alpha: promptAlpha,
    })

    // Creator (bottom-right) and high score (bottom-left), matching home.scss.
    r.text(texts.title_screen.creator, width - 40, height - 40, 12, {
      align: 'right',
      alpha: promptAlpha,
    })
    r.text(
      `${texts.title_screen.highscore}${this.highScore}`,
      40,
      height - 40,
      12,
      {
        align: 'left',
        alpha: promptAlpha,
      }
    )

    if (this.leaving) {
      const fade = clamp((now - this.leaveStart) / 1000, 0, 1)
      r.rect(0, 0, width, height, '#000000', fade)
    }
  }
}
