class Slime extends GameObject implements Observer {

    private behavior : MoveBehavior
    public player: Player

    constructor(p: Player) {

        super("slime")
        this.behavior = new slowBehavior(this)
        this.player = p
        p.add(this)

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