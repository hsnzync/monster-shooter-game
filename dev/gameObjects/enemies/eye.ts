class Eye extends GameObject {

    private behavior : MoveBehavior

    constructor() {

        super("eye")
        this.behavior = new fastBehavior(this)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()

    }
    
}