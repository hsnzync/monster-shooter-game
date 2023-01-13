import { Howl } from 'howler'

export class Audio {
  private path: string
  private hasLoop: boolean
  private audio: Howl

  constructor(path: string, hasLoop: boolean = false) {
    this.path = path
    this.hasLoop = hasLoop
  }

  public play(): void {
    this.audio = new Howl({
      src: [this.path],
      loop: this.hasLoop,
    })

    this.audio.play()
  }
  public stop(): void {
    this.audio.stop()
  }
}
