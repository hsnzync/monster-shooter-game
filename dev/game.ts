class Game {
    
    private static instance: Game

    private score:number = 0
    private damage:number = 0
    private textfield:HTMLElement
    private statusbar:HTMLElement
    private bg:HTMLElement
    private player:Player
    private enemies:Enemy[] = []
    private xPos:number

    
    private constructor() {
        this.textfield = document.getElementsByTagName("textfield")[0] as HTMLElement
        this.statusbar = document.getElementsByTagName("bar")[0] as HTMLElement
        this.bg = document.getElementsByTagName("background")[0] as HTMLElement

        // this.enemies = [
        //     new Slime(65, 65)
        // ]

        this.enemies.push(
            new Ghost(65, 65),
            new Bat(65, 65),
            new Skeleton(65, 65)
        )
        this.player = new Player()
        this.xPos = 0


        this.gameLoop()
    }

    public static getInstance() {
        if(! Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    
    public gameLoop():void {
        //requestAnimationFrame(() => this.gameLoop())

        this.xPos--;
        this.bg.style.backgroundPosition = this.xPos + 'px 0px';
        
        console.log("updating the game!")
        
        for(let enemy of this.enemies) {
            enemy.update()
            this.player.update()

            if( Util.checkCollision( this.player.boundingBox(), enemy.boundingBox())) {
                enemy.removeMe()
                this.removeLife()
            }
        }
        
        if(this.damage < 5) {
            requestAnimationFrame(()=>this.gameLoop())
        } else {
            this.textfield.innerHTML = "GAME OVER - Score: " + this.score
        }   
    }

    public removeLife(){
        this.damage ++
        console.log("life count: " + this.damage)

        switch (this.damage) {
            case 1:
                this.statusbar.style.backgroundPositionY = `-182px`;
                break
            case 2:
                this.statusbar.style.backgroundPositionY = `-136px`;
                break
            case 3:
                this.statusbar.style.backgroundPositionY = `-91px`;
                break
            case 4:
                this.statusbar.style.backgroundPositionY = `-46px`;
                break
            case 5:
                this.statusbar.style.backgroundPositionY = `0`;
                break
        }
    }
       
    public scorePoint() {
        this.score ++
        console.log(this.score)
        this.textfield.innerHTML = "Score: " + this.score

    }
} 

window.addEventListener("load", () => {
    Game.getInstance()
});