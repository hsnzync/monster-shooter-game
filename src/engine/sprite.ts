/**
 * Turns decoded GIF frames into ready-to-blit off-screen canvases and plays
 * them back on a timer, so a `<canvas>` sprite animates exactly like the
 * original animated `.gif` did in the DOM.
 */
import { GifFrame } from './gif'

export type Fit = 'contain' | 'cover'

/** Wrap raw RGBA pixels in an off-screen canvas we can `drawImage` from. */
function pixelsToCanvas(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.putImageData(new ImageData(pixels, width, height), 0, 0)
  return canvas
}

/**
 * Fit `src` into a `boxW x boxH` canvas, mirroring the CSS `background-size`
 * behaviour the DOM version relied on (`contain`, centered) and optionally
 * flipping horizontally (the original mirrored monsters/powerups with
 * `scaleX(-1)`).
 */
function fitFrame(
  src: HTMLCanvasElement,
  boxW: number,
  boxH: number,
  fit: Fit,
  flip: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = boxW
  canvas.height = boxH
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.imageSmoothingEnabled = false

  const scale =
    fit === 'cover'
      ? Math.max(boxW / src.width, boxH / src.height)
      : Math.min(boxW / src.width, boxH / src.height)
  const dw = src.width * scale
  const dh = src.height * scale
  const dx = (boxW - dw) / 2
  const dy = (boxH - dh) / 2

  if (flip) {
    ctx.translate(boxW, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(src, dx, dy, dw, dh)
  return canvas
}

export class AnimatedSprite {
  private frames: HTMLCanvasElement[]
  private cumulative: number[]
  private totalMs: number
  public readonly width: number
  public readonly height: number

  constructor(frames: HTMLCanvasElement[], delays: number[]) {
    this.frames = frames
    this.width = frames[0].width
    this.height = frames[0].height

    this.cumulative = []
    let acc = 0
    for (const d of delays) {
      acc += d
      this.cumulative.push(acc)
    }
    this.totalMs = acc || 1
  }

  /** Index of the frame visible at absolute time `now` (ms). */
  public indexAt(now: number): number {
    if (this.frames.length === 1) return 0
    const t = now % this.totalMs
    for (let i = 0; i < this.cumulative.length; i++) {
      if (t < this.cumulative[i]) return i
    }
    return this.frames.length - 1
  }

  public frameAt(now: number): HTMLCanvasElement {
    return this.frames[this.indexAt(now)]
  }

  /** Draw the current frame with its top-left at (x, y). */
  public draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    now: number
  ): void {
    ctx.drawImage(this.frameAt(now), Math.round(x), Math.round(y))
  }
}

/**
 * Build an {@link AnimatedSprite} whose frames are pre-scaled to a fixed box.
 * Pre-scaling means each render is a single, unscaled `drawImage` — cheap even
 * for the large source GIFs (e.g. the 800x800 heart).
 */
export function buildSprite(
  frames: GifFrame[],
  boxW: number,
  boxH: number,
  fit: Fit = 'contain',
  flip = false
): AnimatedSprite {
  const canvases: HTMLCanvasElement[] = []
  const delays: number[] = []
  for (const frame of frames) {
    const full = pixelsToCanvas(frame.pixels, frame.width, frame.height)
    canvases.push(fitFrame(full, boxW, boxH, fit, flip))
    delays.push(frame.delayMs)
  }
  return new AnimatedSprite(canvases, delays)
}

/**
 * Incremental builder for large animations: feed frames one at a time (via the
 * decoder's `onFrame` sink) so full-size frames are downscaled and discarded
 * immediately instead of all being held in memory at once.
 */
export class StreamingSpriteBuilder {
  private canvases: HTMLCanvasElement[] = []
  private delays: number[] = []

  constructor(
    private boxW: number,
    private boxH: number,
    private fit: Fit = 'contain',
    private flip = false
  ) {}

  public accept = (frame: GifFrame): void => {
    const full = pixelsToCanvas(frame.pixels, frame.width, frame.height)
    this.canvases.push(
      fitFrame(full, this.boxW, this.boxH, this.fit, this.flip)
    )
    this.delays.push(frame.delayMs)
  }

  public build(): AnimatedSprite {
    return new AnimatedSprite(this.canvases, this.delays)
  }
}
