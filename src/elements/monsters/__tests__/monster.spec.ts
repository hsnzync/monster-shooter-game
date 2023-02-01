/**
 * @jest-environment jsdom
 */

import { Eye as Monster } from '../eye'
import { mockData } from '../../../constants/mock'

let gameElement: HTMLElement
let wallElement: HTMLElement
let monster: Monster

describe('Monster class', () => {
  beforeEach(() => {
    gameElement = document.createElement('game')
    wallElement = document.createElement('wall')
    gameElement.appendChild(wallElement)
    document.body.appendChild(gameElement)

    monster = new Monster()
    monster.posX = mockData.posX
    monster.posY = mockData.posY
    monster.speedX = mockData.speedX

    expect(wallElement).not.toBeNull()
    expect(gameElement).not.toBeNull()
    expect(monster).toBeInstanceOf(Monster)
  })
  it('should create a new monster element', () => {
    const monster = document.createElement('eye')
    gameElement.appendChild(monster)
    expect(monster).not.toBeNull()
  })
  it('should update the monster', () => {
    const mockUpdate = jest.spyOn(monster, 'update')

    monster.update()
    monster.speedX += 3.5

    expect(mockUpdate).toBeCalled()
    expect(monster.speedX).toBeGreaterThan(mockData.speedX)
  })
  it('should be notified so it changes increments speed by 4.5', () => {
    const mockNotify = jest.spyOn(monster, 'notify')
    const mockUpdate = jest.spyOn(monster, 'update')

    monster.notify()
    monster.update()
    monster.speedX += 4.5

    expect(mockNotify).toBeCalled()
    expect(mockUpdate).toBeCalled()
    expect(monster.speedX).toBeGreaterThan(3.5 + mockData.speedX)
  })
})
