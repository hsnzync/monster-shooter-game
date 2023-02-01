/**
 * @jest-environment jsdom
 */

import { Powerup, type Powerups } from '../powerup'
import { mockData } from '../../constants/mock'

let gameElement: HTMLElement
let wallElement: HTMLElement
let powerup: Powerup

const powerups: Powerups[] = ['special', 'coin', 'heart']

describe('Powerup class', () => {
  beforeEach(() => {
    gameElement = document.createElement('game')
    wallElement = document.createElement('wall')
    gameElement.appendChild(wallElement)
    document.body.appendChild(gameElement)

    powerup = new Powerup('coin')
    powerup.posX = mockData.posX

    expect(wallElement).not.toBeNull()
    expect(gameElement).not.toBeNull()
    expect(powerup).toBeInstanceOf(Powerup)
  })
  it('should create new powerups', () => {
    powerups.map((name) => {
      const powerupElement = document.createElement(name)
      gameElement.appendChild(powerupElement)
      expect(powerupElement).not.toBeNull()
    })
  })
  it('should update the monster', () => {
    const mockUpdate = jest.spyOn(powerup, 'update')

    powerup.update()
    powerup.posX -= 3

    expect(mockUpdate).toBeCalled()
    expect(powerup.posX).toBeLessThan(mockData.posX)
  })
})
