/**
 * @jest-environment jsdom
 */

import { Player } from '../player'
import { mockData } from '../../constants/mock'
import { Fireball } from '../projectiles'
import { fireEvent } from '@testing-library/react'

let gameElement: HTMLElement
let wallElement: HTMLElement
let player: Player

describe('Player class', () => {
  beforeEach(() => {
    gameElement = document.createElement('game')
    wallElement = document.createElement('wall')
    gameElement.appendChild(wallElement)
    document.body.appendChild(gameElement)

    player = new Player()
    player.posX = mockData.posX
    player.posY = mockData.posY

    expect(wallElement).not.toBeNull()
    expect(gameElement).not.toBeNull()
    expect(player).toBeInstanceOf(Player)
  })

  it('should create new player', () => {
    const playerElement = document.createElement('player')
    gameElement.appendChild(playerElement)
    expect(playerElement).not.toBeNull()
  })

  it('should handle keyDown events', () => {
    const handleKeyDown = jest.fn()
    document.addEventListener('keydown', handleKeyDown)
    fireEvent.keyDown(document, { key: 'Enter' })
    player.cooldown = 80
    expect(handleKeyDown).toHaveBeenCalled()
    document.removeEventListener('keydown', handleKeyDown)
  })

  it('should handle keyUp events', () => {
    const handleKeyUp = jest.fn()
    document.addEventListener('keyup', handleKeyUp)
    fireEvent.keyUp(document, { key: 'Enter' })
    player.cooldown = 80
    expect(handleKeyUp).toHaveBeenCalled()
    document.removeEventListener('keyup', handleKeyUp)
  })

  it('should update the player', () => {
    const mockUpdate = jest.spyOn(player, 'update')

    player.update()
    player.posX += mockData.speedX
    player.posY += mockData.speedY
    player.cooldown = mockData.cooldown

    expect(mockUpdate).toBeCalled()
    expect(player.posX).toBeLessThanOrEqual(mockData.posX)
    expect(player.posY).toBeLessThanOrEqual(mockData.posY)
    expect(player.cooldown).toEqual(mockData.cooldown)
  })

  it('should execute the shoot function and create a fireball', () => {
    const fireball = new Fireball(mockData.posX, mockData.posY)
    expect(fireball).toBeInstanceOf(Fireball)
  })
})
