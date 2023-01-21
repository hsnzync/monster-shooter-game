import { Introduction } from './introduction'
import { Audio } from './utils/audio'
import { Game } from './game'
import { Overlay } from './utils/overlay'
import './assets/scss/main.scss'

export class Start {
  private static start: Start
  private container: HTMLElement
  private home: HTMLElement
  private title: HTMLElement
  private description: HTMLElement
  private footer: HTMLElement
  private highScore: HTMLElement
  private titleCounter: number = 0
  private intro: Introduction
  private audio: Audio
  private overlay: Overlay
  private keydownListenerAdded: boolean = false
  private highestScore: number | null = 0

  private constructor() {
    this.setup()
    // this.audio = new Audio('src/assets/audio/start.mp3', true)
    // this.audio.play()
  }

  public static init() {
    if (!this.start) {
      this.start = new Start()
    }
    return this.start
  }

  private setup(): void {
    this.getScore()
    this.home = document.createElement('home')
    this.container = document.getElementsByTagName('game')[0] as HTMLElement
    this.title = document.createElement('h1')
    this.title.innerHTML = 'Monster Shooter'
    this.description = document.createElement('p')
    this.description.innerHTML = 'Press ENTER to start'
    this.footer = document.createElement('span')
    this.footer.innerHTML = '© hsnzync'
    this.home.appendChild(this.title)
    this.home.appendChild(this.description)
    this.home.appendChild(this.footer)
    this.home.appendChild(this.highScore)

    this.container.appendChild(this.home)

    this.container.style.backgroundImage =
      "url('./src/assets/img/start-background.gif')"

    setInterval(() => {
      if (this.titleCounter < 1) {
        this.titleCounter = this.titleCounter + 0.2
      }
      this.title.style.opacity = `${this.titleCounter}`
    }, 300)

    setTimeout(() => {
      this.description.style.opacity = '0.7'
      this.highScore.style.opacity = '0.7'
      this.footer.style.opacity = '0.7'
      document.addEventListener('keydown', this.handleKeydown)
    }, 2000)
  }

  private getScore(): void {
    const localHighScore = localStorage.getItem('score')
    if (localHighScore) {
      this.highestScore = (localHighScore as unknown) as number
    }

    this.highScore = document.createElement('span')
    this.highScore.innerHTML = `Highscore: ${this.highestScore}`
  }

  // Handle the keydown event
  private handleKeydown(event: KeyboardEvent): void {
    if (event.code === 'Enter' && !this.keydownListenerAdded) {
      this.container = document.getElementsByTagName('game')[0] as HTMLElement
      this.keydownListenerAdded = true

      this.overlay = new Overlay()
      this.overlay.show()

      setTimeout(() => {
        if (this.overlay.counter === 1) {
          this.container.innerHTML = ''
          this.intro = new Introduction(this.audio)
          // Game.init()
        }
      }, 2000)
    }
  }
}

window.addEventListener('load', () => {
  Start.init()
})
