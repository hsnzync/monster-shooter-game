/// <reference path="../../enemy.ts" />

class Bat extends Enemy {

    private behavior : MoveBehavior
    
    constructor(minWidth: number, maxWidth: number) {

        super(minWidth, maxWidth, "bat")
        this.behavior = new slowBehavior(this)

    }

    public update():void {

        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) scaleX(-1)`

        this.behavior.performUpdate()
        this.windowCol()

    }
    
}