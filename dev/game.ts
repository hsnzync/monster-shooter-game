class Game {
    
    private static instance: Game

    private score:number = 0
    private destroyed:number = 0
    private textfield:HTMLElement
    private statusbar:HTMLElement
    private bg:HTMLElement
    private player:Player
    private enemies:Enemy[]
    private xPos:number
    
    private constructor() {
        this.textfield = document.getElementsByTagName("textfield")[0] as HTMLElement
        this.statusbar = document.getElementsByTagName("bar")[0] as HTMLElement
        this.bg = document.getElementsByTagName("background")[0] as HTMLElement

        this.enemies = [
            new Enemy()
        ]
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
        
        if(this.destroyed < 5) {
            requestAnimationFrame(()=>this.gameLoop())
        } else {
            this.textfield.innerHTML = "GAME OVER - Score: " + this.score
        }   
    }

    public removeLife(){
        this.destroyed ++
        console.log("buildings destroyed " + this.destroyed)

        switch (this.destroyed) {
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
        this.textfield.innerHTML = "Score: " + this.score
    }
} 

window.addEventListener("load", () => {
    Game.getInstance()
});