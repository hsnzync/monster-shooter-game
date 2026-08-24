import { Bat, Frog, Lizard } from '../index'
import { GameObject } from '../../../game-object'

const types: Array<[string, new () => GameObject & { notify(): void }]> = [
  ['Bat', Bat],
  ['Frog', Frog],
  ['Lizard', Lizard],
]

describe('additional monster types', () => {
  for (const [name, Type] of types) {
    it(`${name} advances leftward on update`, () => {
      const monster = new Type()
      monster.posX = 500
      monster.update()
      expect(monster.posX).toBeLessThan(500)
    })

    it(`${name} can be notified (speed up) without throwing`, () => {
      const monster = new Type()
      expect(() => monster.notify()).not.toThrow()
    })
  }
})
