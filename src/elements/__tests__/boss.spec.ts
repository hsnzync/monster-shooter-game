import { Boss } from '../boss'

describe('Boss', () => {
  it('starts at full health and is not yet defeated', () => {
    const boss = new Boss(3)
    expect(boss.maxHealth).toBe(3)
    expect(boss.health).toBe(3)
    expect(boss.defeated).toBe(false)
  })

  it('is defeated only after enough hits', () => {
    const boss = new Boss(3)
    boss.hit()
    boss.hit()
    expect(boss.defeated).toBe(false)
    boss.hit()
    expect(boss.health).toBe(0)
    expect(boss.defeated).toBe(true)
  })

  it('advances (does not move backwards) on update', () => {
    const boss = new Boss()
    const startX = boss.posX
    boss.update()
    expect(boss.posX).toBeLessThanOrEqual(startX)
  })
})
