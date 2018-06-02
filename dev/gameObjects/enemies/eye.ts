/// <reference path="../../enemyObject.ts" />

class Eye extends EnemyObject {

    private behavior : MoveBehavior

    constructor(minWidth: number, maxWidth: number) {

        super(minWidth, maxWidth, "eye")
        this.behavior = new fastBehavior(this)

    }

    public update():void {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px) scaleX(-1)`

        this.behavior.performUpdate()
        this.windowCol()

    }
    
}