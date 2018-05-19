class fastBehavior implements MoveBehavior {

    private enemy : Enemy
    private speedx : number

    constructor(enemy : Enemy) {
        this.enemy = enemy
        let r = Math.floor(Math.random() * 6) + 3
        this.speedx = r
    }

    public performUpdate () {
        this.enemy.posx -= this.speedx
    }
}