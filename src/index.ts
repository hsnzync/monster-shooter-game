import { Engine } from './engine/engine'
import { Assets } from './engine/assets'
import { FIELD_WIDTH, FIELD_HEIGHT } from './engine/config'
import { font } from './engine/renderer'
import { StartScene } from './scenes/start-scene'
import './assets/scss/main.scss'

/**
 * Entry point. Sets up the single canvas inside the `<game>` element, shows a
 * loading screen while assets are decoded, then hands control to the scenes.
 */
async function main(): Promise<void> {
  const container = document.getElementsByTagName('game')[0] as HTMLElement
  const engine = new Engine(container, FIELD_WIDTH, FIELD_HEIGHT)

  drawLoading(engine)

  try {
    await Assets.get().load()
  } catch (error) {
    drawError(engine, error)
    return
  }

  engine.go(new StartScene())
  engine.start()
}

function drawLoading(engine: Engine): void {
  const { ctx } = engine
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, engine.width, engine.height)
  ctx.fillStyle = '#ffffff'
  ctx.font = font(16)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('LOADING...', engine.width / 2, engine.height / 2)
}

function drawError(engine: Engine, error: unknown): void {
  const { ctx } = engine
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, engine.width, engine.height)
  ctx.fillStyle = '#ff6b6b'
  ctx.font = font(12)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Failed to load assets', engine.width / 2, engine.height / 2)
  // eslint-disable-next-line no-console
  console.error(error)
}

window.addEventListener('load', () => {
  void main()
})
