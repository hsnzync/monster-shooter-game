import { SineBehavior, HopBehavior, HomingBehavior } from '../index'
import { arena } from '../../engine/arena'
import { GameObject } from '../../game-object'

const mockEnemy = (posY: number) =>
  ({ posX: 500, posY, baseY: posY }) as unknown as GameObject

describe('movement behaviors', () => {
  it('SineBehavior moves left and oscillates vertically around baseY', () => {
    const enemy = mockEnemy(200)
    const behavior = new SineBehavior(enemy, 3, 40, 0.5)

    behavior.performUpdate()

    expect(enemy.posX).toBe(497)
    expect(enemy.posY).toBeCloseTo(200 + Math.sin(0.5) * 40)
  })

  it('HopBehavior moves left and hops upward from baseY', () => {
    const enemy = mockEnemy(200)
    const behavior = new HopBehavior(enemy, 2, 50, 0.5)

    behavior.performUpdate()

    expect(enemy.posX).toBe(498)
    // Hops up => smaller y, never below the lane.
    expect(enemy.posY).toBeLessThanOrEqual(200)
    expect(enemy.posY).toBeCloseTo(200 - Math.abs(Math.sin(0.5)) * 50)
  })

  it('HomingBehavior moves left and tracks the player Y', () => {
    arena.playerY = 400
    const enemy = mockEnemy(200)
    const behavior = new HomingBehavior(enemy, 2, 5)

    behavior.performUpdate()

    expect(enemy.posX).toBe(498)
    expect(enemy.posY).toBeGreaterThan(200)
    expect(enemy.posY).toBeLessThanOrEqual(400)
  })

  it('speedUp increases the horizontal speed', () => {
    const enemy = mockEnemy(200)
    const behavior = new SineBehavior(enemy, 3, 10, 0.1)

    behavior.performUpdate()
    const firstStep = 500 - enemy.posX

    behavior.speedUp()
    const before = enemy.posX
    behavior.performUpdate()
    const secondStep = before - enemy.posX

    expect(secondStep).toBeGreaterThan(firstStep)
  })
})
