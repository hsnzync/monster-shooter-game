import { Howl } from 'howler'

export class Sounds {
  private path: string
  private hasLoop: boolean
  private sounds: any

  constructor(path: string, hasLoop: boolean = false) {
    this.path = path
    this.hasLoop = hasLoop
  }

  public play(): void {
    this.sounds = new Howl({
      src: [this.path],
      loop: this.hasLoop,
    })

    this.sounds.play()
  }
  public stop(): void {
    this.sounds.stop()
  }
}
