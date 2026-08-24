/**
 * Loads and decodes every game asset once, up front, so the render loop only
 * ever blits pre-built frames. Animated `.gif` sprites are decoded into frames
 * (see `gif.ts`) and pre-scaled to their display box (see `sprite.ts`); the two
 * big animations (heart, start background) are streamed so full-size frames are
 * never all held in memory at once.
 */
import { decodeGif } from './gif'
import { AnimatedSprite, buildSprite, StreamingSpriteBuilder } from './sprite'
import { spriteBox, FIELD_WIDTH, FIELD_HEIGHT } from './config'
import { setHitbox } from './hitbox'

// Trim the tight opaque box slightly (per side) so contact must be genuine.
const HITBOX_SHRINK = 0.06

/** Derive a snug collision box from a sprite's visible pixels and register it. */
function registerHitbox(name: string, sprite: AnimatedSprite): void {
  const b = sprite.opaqueBounds()
  const insetX = (b.right - b.left) * HITBOX_SHRINK
  const insetY = (b.bottom - b.top) * HITBOX_SHRINK
  setHitbox(name, {
    left: b.left + insetX,
    top: b.top + insetY,
    right: b.right - insetX,
    bottom: b.bottom - insetY,
  })
}

import PlayerGif from '../assets/img/player.gif'
import GhostGif from '../assets/img/ghost.gif'
import SlimeGif from '../assets/img/slime.gif'
import SkeletonGif from '../assets/img/skeleton.gif'
import EyeGif from '../assets/img/eye.gif'
import BatGif from '../assets/img/bat.gif'
import FrogGif from '../assets/img/frog.gif'
import LizardGif from '../assets/img/lizard.gif'
import DoomGif from '../assets/img/doom.gif'
import FireballGif from '../assets/img/fireball.gif'
import CoinGif from '../assets/img/coin.gif'
import PowerupGif from '../assets/img/powerup.gif'
import HeartGif from '../assets/img/heart.gif'
import StartBackgroundGif from '../assets/img/start-background.gif'
import BackgroundPng from '../assets/img/background.png'
import MeterPng from '../assets/img/meter.png'

/** Small, per-object animated sprites decoded eagerly in full. */
const SPRITE_GIFS: Record<string, string> = {
  player: PlayerGif,
  ghost: GhostGif,
  slime: SlimeGif,
  skeleton: SkeletonGif,
  eye: EyeGif,
  bat: BatGif,
  frog: FrogGif,
  lizard: LizardGif,
  doom: DoomGif,
  fireball: FireballGif,
  coin: CoinGif,
  special: PowerupGif,
}

async function fetchBuffer(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url)
  return response.arrayBuffer()
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

export class Assets {
  private static instance: Assets | null = null
  private sprites = new Map<string, AnimatedSprite>()

  public background!: HTMLImageElement
  public meter!: HTMLImageElement
  public startBackground: AnimatedSprite | null = null

  public static get(): Assets {
    if (!this.instance) this.instance = new Assets()
    return this.instance
  }

  public sprite(name: string): AnimatedSprite {
    const sprite = this.sprites.get(name)
    if (!sprite) throw new Error(`Sprite not loaded: ${name}`)
    return sprite
  }

  public async load(): Promise<void> {
    await this.loadFont()

    const [background, meter] = await Promise.all([
      loadImage(BackgroundPng),
      loadImage(MeterPng),
    ])
    this.background = background
    this.meter = meter

    await Promise.all(
      Object.entries(SPRITE_GIFS).map(async ([name, url]) => {
        const box = spriteBox(name)
        const decoded = decodeGif(await fetchBuffer(url))
        // The boss art is small within a large, padded frame; crop away the
        // padding and scale the art up to fit the box (contain => whole sprite
        // stays visible, never cut off).
        const crop = name === 'doom'
        const sprite = buildSprite(
          decoded.frames,
          box.w,
          box.h,
          'contain',
          box.flip,
          crop
        )
        this.sprites.set(name, sprite)
        registerHitbox(name, sprite)
      })
    )

    // Large animations: stream frames so full-size buffers are discarded early.
    const heartBox = spriteBox('heart')
    const heartBuilder = new StreamingSpriteBuilder(
      heartBox.w,
      heartBox.h,
      'contain',
      heartBox.flip
    )
    decodeGif(await fetchBuffer(HeartGif), heartBuilder.accept)
    const heartSprite = heartBuilder.build()
    this.sprites.set('heart', heartSprite)
    registerHitbox('heart', heartSprite)

    const bgBuilder = new StreamingSpriteBuilder(
      FIELD_WIDTH,
      FIELD_HEIGHT,
      'cover',
      false
    )
    decodeGif(await fetchBuffer(StartBackgroundGif), bgBuilder.accept)
    this.startBackground = bgBuilder.build()
  }

  /** Free the large start-screen animation once it is no longer shown. */
  public releaseStartBackground(): void {
    this.startBackground = null
  }

  private async loadFont(): Promise<void> {
    // The pixel font is linked from index.html; make sure it is ready before we
    // measure/draw text. Never block startup on it (offline fallback: monospace).
    try {
      const fonts = (document as any).fonts
      if (fonts?.load) {
        await Promise.race([
          Promise.all([
            fonts.load(`16px 'Press Start 2P'`),
            fonts.load(`32px 'Press Start 2P'`),
          ]),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ])
      }
    } catch {
      // Ignore — we fall back to a monospace font.
    }
  }
}
