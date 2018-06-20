class Ghost extends GameObject implements Observer {

    private behavior : MoveBehavior
    public player: Player

    constructor(p: Player) {

        super("ghost")
        this.player = p
        p.add(this)
        this.behavior = new fastBehavior(this)
        this.speedx = 10

    }

    public update():void {
        this.behavior.performUpdate()
        this.enemyWindowCol()
        this.draw()
    }

    public notify(): void {    
        this.behavior = new slowBehavior(this)

        setTimeout(() => { 
            this.behavior = new fastBehavior(this)
        }, 5000)

    }
    
}