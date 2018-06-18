class slowBehavior implements MoveBehavior {
    
    private enemy : GameObject
    private speedx : number
    
    constructor(enemy : GameObject) {
        this.enemy = enemy
        let r = Math.floor(Math.random() * 3) + 1
        this.speedx = r
        
    }
    
    public performUpdate () {
        
        this.enemy.posx = this.enemy.posx -= this.speedx
        
    }
}