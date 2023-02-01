import { Game } from './game'
import { Audio, Overlay } from './utils'
import { texts } from './constants/texts'
import './assets/scss/main.scss'

export class Introduction {
  private intro: HTMLElement
  private container: HTMLElement
  private description: HTMLElement
  private mission: HTMLElement
  private tutorial: HTMLElement
  private tutorialArrowKeys: HTMLElement
  private tutorialSpaceKeys: HTMLElement
  private footer: HTMLElement
  private stylesCounter: number = 0
  private homeAudio: Audio
  private overlay: Overlay
  private keydownListenerAdded: boolean = false

  public constructor(audio: Audio) {
    this.setup()
    this.homeAudio = audio
  }

  private setup(): void {
    this.container = document.getElementsByTagName('game')[0] as HTMLElement

    this.description = document.createElement('p')
    this.mission = document.createElement('p')
    this.footer = document.createElement('span')
    this.footer.innerHTML = texts.introduction.footer

    this.intro = document.createElement('intro')
    this.intro.style.opacity = '1'
    this.container.appendChild(this.intro)

    this.description.innerHTML = texts.introduction.description
    this.mission.innerHTML = texts.introduction.mission

    this.tutorialArrowKeys = document.createElement('p')
    this.tutorialArrowKeys.innerHTML = texts.introduction.tutorial.arrow_keys
    this.tutorialSpaceKeys = document.createElement('p')
    this.tutorialSpaceKeys.innerHTML = texts.introduction.tutorial.space_keys

    this.intro.appendChild(this.description)
    this.intro.appendChild(this.mission)
    this.intro.appendChild(this.footer)
    this.intro.appendChild(this.tutorialArrowKeys)
    this.intro.appendChild(this.tutorialSpaceKeys)

    const intervalId = setInterval(() => {
      this.stylesCounter += 0.1
      this.description.style.opacity = `${this.stylesCounter}`
      this.mission.style.opacity = `${this.stylesCounter}`
      this.tutorialArrowKeys.style.opacity = `${this.stylesCounter}`
      this.tutorialSpaceKeys.style.opacity = `${this.stylesCounter}`

      if (this.stylesCounter >= 1) {
        clearInterval(intervalId)
      }
    }, 300)

    setTimeout(() => {
      this.footer.style.opacity = '0.7'
      document.addEventListener('keydown', (e: KeyboardEvent) =>
        this.onKeyDown(e)
      )
    }, 4000)
  }

  // Handle the keydown event
  private onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' && !this.keydownListenerAdded) {
      this.homeAudio.fadeOut()
      this.keydownListenerAdded = true
      this.overlay = new Overlay()
      this.overlay.show()

      setTimeout(() => {
        if (this.overlay.counter === 1) {
          this.container.innerHTML = ''
          Game.init()
        }
      }, 2000)
    }
  }
}
