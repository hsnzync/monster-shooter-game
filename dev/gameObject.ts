abstract class GameObject {

    public element: HTMLElement

    public posy:number
    public posx:number
    public speedx:number
    public speedy: number

    constructor(element: string) { 

        this.element = document.createElement(element)
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element);
        
        this.posy = Math.floor(Math.random() * window.innerHeight) + 1
        this.posx = window.innerWidth - this.element.clientWidth
        this.speedx = 0
        this.speedy = 0

    }

    abstract update() : void

    public playerWindowCol() : void {
        if(this.posx + this.element.clientWidth > window.innerWidth) {
            this.posx && this.posy == 300
            this.speedx *= 0
        }
        if (this.posx < 0) {
            this.posx = 0
            this.speedx && this.speedy * 0
            console.log("hit the edge")
        }

        if (this.posy < 280 ) {
            this.speedy *= 0
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedy *= 0
        }
    }

    public enemyWindowCol() {
        if (this.posy < 280 ) {
            this.speedx *= 0
            this.posy = window.innerHeight - 280
        }
        if (this.posy + this.element.clientHeight > window.innerHeight)  {
            this.speedx *= 0
            this.posy = window.innerHeight - 100
        }

        if(this.posx <= 0) {
            this.posx = window.innerWidth - this.element.clientWidth
            this.posy =  Math.floor(Math.random() * window.innerHeight) + 1
            //Game.getInstance().removeLife()
            //Game.getInstance().scorePoint()
        }
    }

    public draw() {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) scaleX(-1)`
    }

    public getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }
    
    public removeMe() {
        this.element.remove()
        console.log("Removed monster")
    }

    public reset() {
        this.posx = window.innerWidth - this.element.clientWidth
        this.posy =  Math.floor(Math.random() * window.innerHeight) + 1
    }

}