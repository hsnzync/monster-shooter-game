class Ghost extends GameObject implements Observer {

    private behavior : MoveBehavior
    public player: Player

    constructor(p: Player) {

        super("ghost")
        this.behavior = new fastBehavior(this)
        this.player = p
        p.add(this)

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }

    public notify(): void {
        setTimeout(() => {
            this.speedx = 0
            this.posx = this.posx -= 0
        }, 5000);
    }
    
}