/// <reference path="DomObject" />

class Player extends DomObject {

    private speedx:number
    private speedy:number
    private posx:number
    private posy:number

    constructor() {
        super("player")
        
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.onKeyUp(e))
        let w = window.innerWidth
        let h = window.innerHeight
        
        this.posy = 400
        this.posx = 50
        this.speedx = 0
        this.speedy = 0
    }
    
    /*
    public void BoundingBox(){
        if (_Position.X + _Texture.Width > _g.GraphicsDevice.Viewport.Width) {
            _Position = new Vector2 (300, 300);
            _Speed.X *= -1;
        }
        if (_Position.X < 0) {
            _Position = new Vector2 (300, 300);
            _Speed *= -1;
        }
        if (_Position.Y < 0) {
            _Speed.Y *= -1;
        }

        if (_Position.Y + _Texture.Height > _g.GraphicsDevice.Viewport.Height) {
            _Speed.Y *= -1;
        }
    }
    */

    public BoundingBox() : void {
        if(this.posx + this.element.clientWidth > window.innerWidth) {
            this.posx && this.posy == 300
            this.speedx *= -1
        }
        if (this.posx < 0) {
            this.posx && this.posy == 300
            this.speedx && this.speedy * 1
        }
        if (this.posy <0 ) {
            this.speedy *= -1
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedy *= -1
        }
    }

    public update():void {
        this.posx = this.posx + this.speedx
        this.posy = this.posy + this.speedy
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`

        

        if (this.posx >= window.innerWidth ) {
            this.posx = 0
        }
    }

    
    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 37:
            this.speedx = -5
            this.element.style.backgroundPositionX = `-72px`;
            this.element.style.transform = 'scaleX(-1) !important';
            break
        case 39:
            this.speedx = 5
            this.element.style.backgroundPositionX = `-72px`;
            break
        case 38:
            this.speedy = -5
            this.element.style.backgroundPositionX = `-143px`;
            break
        case 40:
            this.speedy = 5
            this.element.style.backgroundPositionX = `0px`;
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
    

    public boundingBox() {
        return this.element.getBoundingClientRect();
    }
}