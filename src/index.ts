import { Introduction } from './introduction'
import { Audio, Overlay } from './utils'
import { texts } from './assets/texts'
import Background from './assets/img/start-background.gif'
import StartAudio from './assets/audio/start.mp3'
import './assets/scss/main.scss'

export class Start {
  private static start: Start
  private container: HTMLElement
  private home: HTMLElement
  private title: HTMLElement
  private description: HTMLElement
  private creator: HTMLElement
  private highScore: HTMLElement
  private titleCounter: number = 0
  private intro: Introduction
  private audio: Audio
  private overlay: Overlay
  private keydownListenerAdded: boolean = false
  private highestScore: number | null = 0

  private constructor() {
    this.setup()
  }

  public static init() {
    if (!this.start) {
      this.start = new Start()
    }
    return this.start
  }

  private setup(): void {
    this.audio = new Audio(StartAudio, true)
    this.audio.play()

    this.getScore()
    this.home = document.createElement('home')
    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.title = document.createElement('h1')
    this.title.innerHTML = texts.title_screen.title
    this.description = document.createElement('p')
    this.description.innerHTML = texts.title_screen.description
    this.creator = document.createElement('span')
    this.creator.innerHTML = texts.title_screen.creator
    this.home.appendChild(this.title)
    this.home.appendChild(this.description)
    this.home.appendChild(this.creator)
    this.home.appendChild(this.highScore)

    this.container.appendChild(this.home)

    this.container.style.backgroundImage = `url(${Background})`

    setInterval(() => {
      if (this.titleCounter < 1) {
        this.titleCounter = this.titleCounter + 0.2
      }
      this.title.style.opacity = `${this.titleCounter}`
    }, 300)

    setTimeout(() => {
      this.description.style.opacity = '0.7'
      this.highScore.style.opacity = '0.7'
      this.creator.style.opacity = '0.7'
      document.addEventListener('keydown', (e: KeyboardEvent) =>
        this.handleKeydown(e, this.audio)
      )
    }, 2000)
  }

  private getScore(): void {
    const localHighScore = localStorage.getItem('score')
    if (localHighScore) {
      this.highestScore = localHighScore as unknown as number
    }

    this.highScore = document.createElement('span')
    this.highScore.innerHTML = texts.title_screen.highscore + this.highestScore
  }

  // Handle the keydown event
  private handleKeydown(event: KeyboardEvent, audio: Audio): void {
    if (event.code === 'Enter' && !this.keydownListenerAdded) {
      this.container = document.getElementsByTagName('game')[0] as HTMLElement
      this.keydownListenerAdded = true

      this.overlay = new Overlay()
      this.overlay.show()

      setTimeout(() => {
        if (this.overlay.counter === 1) {
          this.container.innerHTML = ''
          this.intro = new Introduction(audio)
        }
      }, 2000)
    }
  }
}

window.addEventListener('load', () => {
  Start.init()
})
