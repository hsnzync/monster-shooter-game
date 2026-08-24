import { Engine, Scene } from '../engine/engine'
import { Renderer } from '../engine/renderer'
import { Audio } from '../utils'
import { texts } from '../constants/texts'
import { Game } from '../game'

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

/**
 * Story/tutorial screen on a black background. Press ENTER to fade the title
 * music out and drop into the game.
 */
export class IntroScene implements Scene {
  private engine!: Engine
  private enterTime = 0
  private leaving = false
  private leaveStart = 0
  private enterPressed = false
  private keyHandler = (e: KeyboardEvent) => this.onKeyDown(e)

  constructor(private audio: Audio) {}

  public enter(engine: Engine): void {
    this.engine = engine
    this.enterTime = 0
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

    if (this.enterPressed && !this.leaving && elapsed > 4000) {
      this.leaving = true
      this.leaveStart = now
      this.audio.fadeOut()
    }

    if (this.leaving && now - this.leaveStart >= 1200) {
      this.engine.go(Game.init())
    }
  }

  public render(r: Renderer, now: number): void {
    const { width, height } = r
    const elapsed = this.enterTime ? now - this.enterTime : 0
    const textAlpha = clamp(elapsed / 3000, 0, 1)

    r.clear('#000000')

    const pad = 40
    const maxWidth = width - pad * 2
    const size = 12
    const lineHeight = 26
    let y = 90

    const paragraph = (text: string, color: string, gap: number): void => {
      for (const line of r.wrap(text, maxWidth, size)) {
        r.text(line, pad, y, size, { color, alpha: textAlpha })
        y += lineHeight
      }
      y += gap
    }

    paragraph(texts.introduction.description, '#ffffff', 34)
    paragraph(texts.introduction.mission, '#ffffff', 40)
    paragraph(texts.introduction.tutorial.arrow_keys, '#dede7c', 8)
    paragraph(texts.introduction.tutorial.space_keys, '#dede7c', 0)

    const footerAlpha = elapsed > 4000 ? 0.7 : 0
    r.text(texts.introduction.footer, width - pad, height - pad, size, {
      align: 'right',
      alpha: footerAlpha,
    })

    if (this.leaving) {
      const fade = clamp((now - this.leaveStart) / 1000, 0, 1)
      r.rect(0, 0, width, height, '#000000', fade)
    }
  }
}
