class Eye extends GameObject implements Observer {
    
    private behavior : MoveBehavior
    public player: Player
    
    constructor(p: Player) {
        
        super("eye")
        
        this.player = p
        p.add(this)
        
        this.behavior = new fastBehavior(this)
        
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