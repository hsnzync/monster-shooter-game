class Player extends GameObject {

    public posy: number
    public speedx:number
    public speedy: number
    public x: number

    constructor() {
        super( "player")

        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e))
        
        this.posy = 400
        this.posx = 50
        this.speedx = 0
        this.speedy = 0
        this.x = 0

    }

    public update():void {
        this.posx = this.posx + this.speedx
        this.posy = this.posy + this.speedy

        if (this.posx >= window.innerWidth ) {
            this.posx = 0
        }

        this.playerWindowCol()
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
    }

    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 38:
            this.speedy = -2
            break
        case 40:
            this.speedy = 2
            break
        case 32:
            console.log("Fire!")
            Game.getInstance().fire()
            this.x -= 1
            setTimeout(10);
            break
        }
    }
    
    onKeyUp(event:KeyboardEvent):void { 
        switch(event.keyCode){
        case 38:
            this.speedy = 0
            break
        case 40:
            this.speedy = 0
            break
        }
    }   


}