class Powerup extends GameObject {
    
    private behavior : MoveBehavior

    constructor() {

        super("powerup")
        this.behavior = new slowBehavior(this)

    }

    public update():void {

        this.draw()
        this.enemyWindowCol()
        this.behavior.performUpdate()

    }
    
}