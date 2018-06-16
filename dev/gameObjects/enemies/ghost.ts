class Ghost extends GameObject implements Observer {

    private behavior : MoveBehavior
    public player: Player

    constructor(p: Player) {

        super("ghost")
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

        this.speedx = 0
        //this.speedx = 0

        setTimeout(() => this.speedx = 3, 3000);
    }
    
}