class fastBehavior implements MoveBehavior {

    private enemy : GameObject
    private player : GameObject
    private speedx : number

    constructor(enemy : GameObject, player: GameObject) {
        this.enemy = enemy
        this.player = player
        let r = Math.floor(Math.random() * 4) + 3
        this.speedx = r
    }

    public performUpdate () {
        this.enemy.posx = this.enemy.posx -= this.speedx
    }

    public playerMovement() {
        this.player.speedy += 5
    }
}