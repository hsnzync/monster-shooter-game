class Slime extends GameObject {

    private behavior : MoveBehavior
    
    constructor() {

        super("slime")
        this.behavior = new slowBehavior(this)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }
    
}