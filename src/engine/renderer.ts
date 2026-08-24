/**
 * Thin drawing helpers over a 2D context. Centralises the text styling that
 * used to live in SCSS (the pixel font, drop shadows and the gradient title)
 * so the canvas scenes read cleanly.
 */

export const FONT_FAMILY = "'Press Start 2P', monospace"

export function font(size: number): string {
  return `${size}px ${FONT_FAMILY}`
}

export interface TextOptions {
  color?: string
  align?: CanvasTextAlign
  baseline?: CanvasTextBaseline
  alpha?: number
  /** Vertical drop-shadow offset (matches the old `text-shadow`). */
  shadowY?: number
  shadowColor?: string
}

export class Renderer {
  public ctx: CanvasRenderingContext2D
  public width: number
  public height: number

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  public clear(color?: string): void {
    if (color) {
      this.ctx.fillStyle = color
      this.ctx.fillRect(0, 0, this.width, this.height)
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }
  }

  public rect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    alpha = 1
  ): void {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.restore()
  }

  public text(
    str: string,
    x: number,
    y: number,
    size: number,
    opts: TextOptions = {}
  ): void {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = opts.alpha ?? 1
    ctx.font = font(size)
    ctx.textAlign = opts.align ?? 'left'
    ctx.textBaseline = opts.baseline ?? 'alphabetic'
    if (opts.shadowY) {
      ctx.fillStyle = opts.shadowColor ?? 'rgba(25, 51, 37, 1)'
      ctx.fillText(str, x, y + opts.shadowY)
    }
    ctx.fillStyle = opts.color ?? '#ffffff'
    ctx.fillText(str, x, y)
    ctx.restore()
  }

  /** Title text with a vertical gradient fill (white -> steel blue). */
  public gradientText(
    str: string,
    x: number,
    y: number,
    size: number,
    alpha = 1
  ): void {
    const ctx = this.ctx
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.font = font(size)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const grad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2)
    grad.addColorStop(0, 'rgb(255, 255, 255)')
    grad.addColorStop(0.22, 'rgb(255, 255, 255)')
    grad.addColorStop(1, 'rgb(55, 94, 115)')
    ctx.fillStyle = grad
    ctx.fillText(str, x, y)
    ctx.restore()
  }

  /** Largest font size (<= startSize) at which `str` fits within `maxWidth`. */
  public fitFontSize(str: string, maxWidth: number, startSize: number): number {
    const ctx = this.ctx
    let size = startSize
    while (size > 8) {
      ctx.font = font(size)
      if (ctx.measureText(str).width <= maxWidth) break
      size -= 2
    }
    return size
  }

  /**
   * Word-wrap `str` to `maxWidth` at the given font size and return the lines.
   */
  public wrap(str: string, maxWidth: number, size: number): string[] {
    const ctx = this.ctx
    ctx.font = font(size)
    const words = str.split(' ')
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (ctx.measureText(candidate).width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    }
    if (line) lines.push(line)
    return lines
  }
}
