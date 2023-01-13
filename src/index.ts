import { Game } from './game'
import './assets/scss/main.scss'

export class Start {
  private static start: Start
  private container: HTMLElement
  private home: HTMLElement
  private title: HTMLElement
  private description: HTMLElement
  private footer: HTMLElement
  private titleCounter: number = 0

  private story: HTMLElement
  private storyDescription: HTMLElement
  private isContinue: boolean = false

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
    this.home = document.createElement('home')
    this.title = document.createElement('h1')
    this.title.innerHTML = 'Monster Shooter'
    this.description = document.createElement('span')
    this.description.innerHTML = 'Press ENTER to continue'
    this.footer = document.createElement('span')
    this.footer.innerHTML = '© hsnzync'
    this.home.appendChild(this.title)
    this.home.appendChild(this.description)
    this.home.appendChild(this.footer)

    this.container = document.getElementsByTagName('game')[0] as HTMLElement
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
      this.footer.style.opacity = '0.7'
      this.isContinue = true
    }, 2000)

    window.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e))
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Enter':
        if (this.isContinue) {
          this.story = document.createElement('story')
          this.storyDescription = document.createElement('p')
          this.storyDescription.innerHTML = `
        The year is 2200 and Captain John "Ace" Taylor is on a mission to save planet XZS-53 from an invasion of monsters. 
        As the best space hero in the galaxy, Ace is chosen to lead the battle on the ground. As he lands on the planet, Ace sees the monsters swarming the surface, destroying everything in their path. 

        Objective:
        Score as many points as possible in 30 seconds by destroying as many monsters as possible.`
          this.story.appendChild(this.storyDescription)
          this.home.appendChild(this.story)
          this.story.style.display = 'block'
        }

        // this.home.remove()
        // Game.init()
        break
    }
  }
}

window.addEventListener('load', () => {
  Start.init()
})
