/// <reference path="DomObject" />


class Enemy extends DomObject {
    
    private posy:number
    private posx:number
    private speed:number

    constructor() {

        super("enemy")
        let w = window.innerWidth
        let h = window.innerHeight
        let randPos = Math.floor(Math.random() * w) + 1
        let randSp = Math.floor(Math.random() * 5) + 1
        
        this.posy = randPos
        this.posx = w - this.element.clientWidth
       // this.posx = 100
        this.speed = randSp
    }

    public update():void {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) scaleX(-1)`
        
        this.posx -= this.speed


        if(this.posx == -100) {
            this.posx = window.innerWidth - this.element.clientWidth
            Game.getInstance().removeLife()
        }

    }

    public removeMe() {
        //this.element.remove()
        console.log("Ouch")
    }

    public boundingBox() {
        return this.element.getBoundingClientRect();
    }
    
}