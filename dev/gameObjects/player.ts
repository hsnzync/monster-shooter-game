/// <reference path="../gameObject.ts" />

class Player extends GameObject {

    constructor() {
        super( "player")

        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e))
        
        this.posy = 400
        this.posx = 50
        this.speedx = 0
        this.speedy = 0
        
    }

    public windowCol() : void {
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

    public update():void {
        this.posx = this.posx + this.speedx
        this.posy = this.posy + this.speedy
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`

        if (this.posx >= window.innerWidth ) {
            this.posx = 0
        }
        this.windowCol()
    }

    
    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 37:
            this.speedx = -3
            break
        case 39:
            this.speedx = 3
            break
        case 38:
            this.speedy = -3
            break
        case 40:
            this.speedy = 3
            break
        case 65:
            console.log("Fire!")
            Game.getInstance().scorePoint()
            Game.getInstance().fire()
            break
        }
    }
    
    onKeyUp(event:KeyboardEvent):void { 
        switch(event.keyCode){
        case 37:
            this.speedx = 0
            break
        case 39:
            this.speedx = 0
            break
        case 38:
            this.speedy = 0
            break
        case 40:
            this.speedy = 0
            break
        }
    }   


}