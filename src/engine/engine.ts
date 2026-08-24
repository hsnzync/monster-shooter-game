/**
 * The engine owns the single `<canvas>` and the single `requestAnimationFrame`
 * loop, delegating update + render to the active {@link Scene}. Replacing the
 * per-object DOM elements and the game's own rAF loop with one canvas and one
 * loop is what removes the DOM/layout thrash that made the original CPU-heavy.
 */
import { Renderer } from './renderer'

export interface Scene {
  enter(engine: Engine): void
  exit(): void
  update(now: number): void
  render(renderer: Renderer, now: number): void
}

export class Engine {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public renderer: Renderer
  public readonly width: number
  public readonly height: number

  private current: Scene | null = null
  private rafId = 0
  private running = false

  constructor(container: HTMLElement, width: number, height: number) {
    this.width = width
    this.height = height

    const canvas = document.createElement('canvas')
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.style.display = 'block'
    canvas.style.imageRendering = 'pixelated'

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = false

    container.appendChild(canvas)

    this.canvas = canvas
    this.ctx = ctx
    this.renderer = new Renderer(ctx, width, height)
  }

  /** Switch to a new scene, running the previous scene's teardown first. */
  public go(scene: Scene): void {
    if (this.current) this.current.exit()
    this.current = scene
    scene.enter(this)
  }

  public start(): void {
    if (this.running) return
    this.running = true
    this.rafId = requestAnimationFrame(this.loop)
  }

  public stop(): void {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }

  private loop = (now: number): void => {
    if (!this.running) return
    if (this.current) {
      this.current.update(now)
      this.current.render(this.renderer, now)
    }
    this.rafId = requestAnimationFrame(this.loop)
  }
}
