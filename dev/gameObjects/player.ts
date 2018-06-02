/// <reference path="../playerObject.ts" />

class Player extends PlayerObject {

    public posy: number

    constructor() {
        super( "player")

        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e))
        
        this.posy = 400
        this.posx = 50
    }

    public update():void {
        this.posx = this.posx + this.speedx
        this.posy = this.posy + this.speedy

        if (this.posx >= window.innerWidth ) {
            this.posx = 0
        }
        this.windowCol()
        this.draw()

    }

    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        // case 37:
        //     this.speedx = -1
        //     break
        // case 39:
        //     this.speedx = 1
        //     break
        case 38:
            this.speedy = -1
            break
        case 40:
            this.speedy = 1
            break
        case 69:
            console.log("Fire!")
            Game.getInstance().fire()
            break
        }
    }
    
    onKeyUp(event:KeyboardEvent):void { 
        switch(event.keyCode){
        // case 37:
        //     this.speedx = 0
        //     break
        // case 39:
        //     this.speedx = 0
        //     break
        case 38:
            this.speedy = 0
            break
        case 40:
            this.speedy = 0
            break
        }
    }   


}