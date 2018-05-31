/// <reference path="./gameObject.ts" />

abstract class Enemy extends GameObject {

    constructor(minWidth: number, maxWidth: number, element: string) {
        super(element)
        
        this.minWidth = 0
        this.maxWidth = 0
        this.maxHeight = 0

        maxWidth -= this.element.clientWidth
        this.minWidth = minWidth
        this.maxWidth = maxWidth
        this.maxHeight = window.innerHeight - this.element.clientHeight

        let randPos = Math.floor(Math.random() * window.innerHeight) + 1
        let randSp = Math.floor(Math.random() * 7) + 3
        
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

        if(this.posx <= 0) {
            this.posx = window.innerWidth - this.element.clientWidth
            this.posy =  Math.floor(Math.random() * window.innerHeight) + 1
            Game.getInstance().removeLife()
            //Game.getInstance().scorePoint()
        }
    }

    public removeMe() {
        this.element.remove()
        //console.log("Ouch")
    }

    abstract update() : void

}