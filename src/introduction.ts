import { Game } from './game'
import { Audio } from './utils/audio'
import './assets/scss/main.scss'
import { Overlay } from './utils/overlay'

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
    this.footer.innerHTML = 'Press ENTER to continue'

    this.intro = document.createElement('intro')
    this.intro.style.opacity = '1'
    this.container.appendChild(this.intro)

    var txt =
      'The year is 2200 and Captain John "Ace" Taylor is on a mission to save planet XZS-53 from an invasion of monsters. As the best space hero in the galaxy, Ace is chosen to lead the battle on the ground. As he lands on the planet, Ace sees the monsters swarming the surface, destroying everything in their path.'
    this.description.innerHTML = txt
    this.mission.innerHTML =
      'Mission: Score points in 30 seconds by destroying as many monsters as possible.'

    this.tutorialArrowKeys = document.createElement('p')
    this.tutorialArrowKeys.innerHTML = 'Arrow keys: Move'
    this.tutorialSpaceKeys = document.createElement('p')
    this.tutorialSpaceKeys.innerHTML = 'Spacebar: Shoot'

    this.intro.appendChild(this.description)
    this.intro.appendChild(this.mission)
    this.intro.appendChild(this.footer)
    this.intro.appendChild(this.tutorialArrowKeys)
    this.intro.appendChild(this.tutorialSpaceKeys)

    setInterval(() => {
      if (this.stylesCounter <= 1) {
        this.stylesCounter = this.stylesCounter + 0.1
      }
      this.description.style.opacity = `${this.stylesCounter}`
      this.mission.style.opacity = `${this.stylesCounter}`
      this.tutorialArrowKeys.style.opacity = `${this.stylesCounter}`
      this.tutorialSpaceKeys.style.opacity = `${this.stylesCounter}`
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
      this.keydownListenerAdded = true

      this.overlay = new Overlay()
      this.overlay.show()

      setTimeout(() => {
        if (this.overlay.counter === 1) {
          // this.homeAudio.stop()
          this.container.innerHTML = ''
          Game.init()
        }
      }, 2000)
    }
  }
}
