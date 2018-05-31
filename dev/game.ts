class Game {
    
    private static instance: Game

    private score:number = 0
    private damage:number = 0
    private textfield:HTMLElement
    private finalscore:HTMLElement
    private statusbar:HTMLElement
    private bg:HTMLElement
    private player:Player
    //private fireball:Fireball
    private enemies:Enemy[] = []
    private xPos:number

    private constructor() {
        this.textfield = document.getElementsByTagName("textfield")[0] as HTMLElement
        this.finalscore = document.getElementsByTagName("finalscore")[0] as HTMLElement
        this.statusbar = document.getElementsByTagName("bar")[0] as HTMLElement
        this.bg = document.getElementsByTagName("background")[0] as HTMLElement
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))

        this.enemies.push(
            new Ghost(65, 65),
            new Bat(65, 65),
            new Eye(65, 65),
            new Skeleton(65, 65),
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

        this.xPos = this.xPos - 2;
        this.bg.style.backgroundPosition = this.xPos + 'px 0px';
        
        console.log("updating the game!")
        
        for(let enemy of this.enemies) {
            enemy.update()
            this.player.update()
            //this.fireball.update()

            if( Util.checkCollision( this.player.boundingBox(), enemy.boundingBox())) {
                enemy.removeMe()
                this.removeLife()
            }
        }
        
        if(this.damage < 5) {
            requestAnimationFrame(()=>this.gameLoop())
        } else {
            this.finalscore.innerHTML = "GAME OVER <br> Score: " + this.score
            this.finalscore.style.backgroundColor = "#000"
            this.finalscore.style.padding = "50px 100px"
            this.finalscore.style.width = "500px"
            this.finalscore.style.lineHeight = "30px"
            this.finalscore.style.fontSize = "25px"
        }   
    }

    public fire() {
        let fireball = new Fireball()
        fireball.posx = fireball.posx += fireball.speedx
        console.log("fired a shot");
    }

    onKeyDown(event:KeyboardEvent):void {
        switch(event.keyCode){
        case 82:
            console.log("Restart game")
            Game.getInstance()
            //this.gameLoop()
            break
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