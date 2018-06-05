class Ghost extends GameObject {

    private behavior : MoveBehavior

    constructor() {

        super("ghost")
        this.behavior = new fastBehavior(this)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }
    
}