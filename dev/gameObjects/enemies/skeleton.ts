class Skeleton extends GameObject implements Observer {

    private behavior : MoveBehavior
    public player: Player

    constructor(p: Player) {

        super("skeleton")
        this.player = p
        p.add(this)
        this.behavior = new fastBehavior(this, this.player)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }

    public notify(): void {
        this.posx = 0
    }
    
}