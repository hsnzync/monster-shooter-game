class Powerup extends GameObject {
    
    constructor() {

        super("powerup")
        this.speedx = 1

    }

    public update():void {
        this.posx -= this.speedx
        this.enemyWindowCol()
        this.draw()
    }

    public removeMe() {
        this.element.remove()
        console.log("Removed monster")
    }
    
}