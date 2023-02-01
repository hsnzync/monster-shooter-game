/**
 * @jest-environment jsdom
 */

import { Fireball } from '../fireball'
import { Collision } from '../../../utils/collision'
import { dummyElementB } from '../../../utils/__tests__/collision.spec'
import { mockData } from '../../../constants/mock'

let gameElement: HTMLElement
let wallElement: HTMLElement
let fireball: Fireball

describe('fireball class', () => {
  beforeEach(() => {
    gameElement = document.createElement('game')
    wallElement = document.createElement('wall')
    gameElement.appendChild(wallElement)
    document.body.appendChild(gameElement)

    fireball = new Fireball(mockData.posX, mockData.posY)
    fireball.posX = mockData.posX
    fireball.posY = mockData.posY

    expect(wallElement).not.toBeNull()
    expect(gameElement).not.toBeNull()
    expect(fireball).toBeInstanceOf(Fireball)
  })
  it('should create a new fireball element', () => {
    const fireballElement = document.createElement('fireball')
    gameElement.appendChild(fireballElement)
    expect(fireballElement).not.toBeNull()
  })
  it('should update the fireball so it moves', () => {
    const mockUpdate = jest.spyOn(fireball, 'update')
    fireball.update()

    fireball.posX += 2
    expect(mockUpdate).toHaveBeenCalled()
    expect(fireball.posX).toBeGreaterThan(mockData.posX)
  })
  it('should remove the element once it has collision with another element', () => {
    const collision = Collision.checkCollision(dummyElementB, dummyElementB)
    const mockRemove = jest.spyOn(fireball, 'removeElement')

    expect(collision).toEqual(true)

    fireball.removeElement()
    gameElement.innerHTML = ''

    expect(mockRemove).toHaveBeenCalled()
  })
})
