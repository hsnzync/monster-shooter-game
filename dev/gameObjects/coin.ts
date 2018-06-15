class Coin extends GameObject {
    
    private behavior : MoveBehavior

    constructor() {

        super("coin")
        this.behavior = new slowBehavior(this)

    }

    public update():void {

        this.draw()
        this.enemyWindowCol()
        this.behavior.performUpdate()

    }
    
}