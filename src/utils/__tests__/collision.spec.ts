import { Collision } from '../collision'

export const dummyElementA: DOMRect = {
  x: 106,
  y: 426.3999938964844,
  width: 75,
  height: 90,
  top: 426.3999938964844,
  right: 181,
  bottom: 516.3999938964844,
  left: 106,
  toJSON: () => {},
}

export const dummyElementB: DOMRect = {
  x: 509,
  y: 670.4000244140625,
  width: 75,
  height: 90,
  top: 670.4000244140625,
  right: 584,
  bottom: 760.4000244140625,
  left: 509,
  toJSON: () => {},
}

describe('Collision class', () => {
  it('should have two elements NOT having a collision with each other', () => {
    const collision = Collision.checkCollision(dummyElementA, dummyElementB)
    expect(collision).toEqual(false)
  })
  it('should have two elements having a collision with each other', () => {
    const collision = Collision.checkCollision(dummyElementB, dummyElementB)
    expect(collision).toEqual(true)
  })
})
