/// <reference path="DomObject" />


class Enemy extends DomObject {
    
    private posy:number
    private posx:number
    private speedx:number

    constructor(minWidth: number, maxWidth: number) {

        super(minWidth, maxWidth, "enemy")
        let randPos = Math.floor(Math.random() * window.innerHeight) + 1
        let randSp = Math.floor(Math.random() * 5) + 1
        
        this.posy = randPos
        this.posx = window.innerWidth - this.element.clientWidth
        this.speedx = randSp
    }

    public windowCol() :void {

        if (this.posy < 280 ) {
            this.speedx *= 0
            this.posy = window.innerHeight - 280
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedx *= 0
        }
    }

    public update():void {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) scaleX(-1)`
        
        this.posx -= this.speedx

        if(this.posx == -100) {
            this.posx = window.innerWidth - this.element.clientWidth
            Game.getInstance().removeLife()
        }

        this.windowCol()

    }

    public removeMe() {
        //this.element.remove()
        console.log("Ouch")
    }

    public boundingBox() {
        return this.element.getBoundingClientRect();
    }
    
}