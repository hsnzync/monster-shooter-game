import { Howl } from 'howler'

export class Audio {
  public path: string
  private hasLoop: boolean = false
  private volume: number = 0.5
  private audio: Howl

  constructor(path: string, hasLoop?: boolean, volume?: number) {
    this.path = path
    this.hasLoop = hasLoop
    this.volume = volume
  }

  public play(): void {
    this.audio = new Howl({
      src: [this.path],
      loop: this.hasLoop,
      volume: this.volume,
      html5: true,
    })

    this.audio.play()
  }
  public stop(): void {
    this.audio.stop()
  }

  public fadeOut(): void {
    this.audio.fade(0.5, 0, 2000)
  }
  public fadeIn(): void {
    this.audio.fade(0, 0.5, 1000)
  }
}
