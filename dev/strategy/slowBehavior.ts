class slowBehavior implements MoveBehavior {

    private enemy : EnemyObject
    private speedx : number

    constructor(enemy : EnemyObject) {
        this.enemy = enemy
        let r = Math.floor(Math.random() * 3) + 1
        this.speedx = r

    }

    public performUpdate () {
        
        this.enemy.posx -= this.speedx
        
    }
}