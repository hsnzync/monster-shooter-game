/// <reference path="../gameObject.ts" />

class Fireball extends GameObject {

    constructor() {

        super("fireball")
        let r = Math.floor(Math.random() * 6) + 3
        this.speedx = r

    }

    public update():void {
        this.posx = this.posx + this.speedx
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`        
    }
}