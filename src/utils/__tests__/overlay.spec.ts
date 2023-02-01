/**
 * @jest-environment jsdom
 */

import { Overlay } from '../overlay'

let gameElement: HTMLElement
let overlay: Overlay

describe('Overlay class', () => {
  beforeEach(() => {
    gameElement = document.createElement('game')
    document.body.appendChild(gameElement)
    expect(gameElement).not.toBeNull()
  })
  it('should create a new instance and append it to its parent', () => {
    overlay = new Overlay()

    const overlayElement = document.createElement('overlay')
    gameElement.appendChild(overlayElement)
    expect(overlay).toBeInstanceOf(Overlay)
    expect(overlayElement).not.toBeNull()
  })

  it('should call the show function and increment counter from 0.2 to 1 every 300ms', async () => {
    let counter = overlay.counter
    const mockShow = jest.spyOn(overlay, 'show')
    overlay.show()

    await new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        counter += 0.2
        if (counter >= 1) {
          clearInterval(intervalId)
          expect(counter).toBeCloseTo(1)
          resolve()
        }
      }, 300)
    })

    expect(mockShow).toHaveBeenCalled()
  })
})
