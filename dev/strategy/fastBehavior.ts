class fastBehavior implements MoveBehavior {

    private enemy : EnemyObject
    private speedx : number

    constructor(enemy : EnemyObject) {
        this.enemy = enemy
        let r = Math.floor(Math.random() * 4) + 3
        this.speedx = r
    }

    public performUpdate () {
        this.enemy.posx -= this.speedx
    }
}