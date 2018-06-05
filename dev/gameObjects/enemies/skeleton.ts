class Skeleton extends GameObject {

    private behavior : MoveBehavior

    constructor() {

        super("skeleton")
        this.behavior = new fastBehavior(this)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }
    
}