class Game {
    
    private static instance: Game

    private score:number = 0
    private life:number = 0
    private textfield:HTMLElement
    private healthbar:HTMLElement
    private topbar:HTMLElement
    private bg:HTMLElement
    private player:Player
    private objects:GameObject[] = []
    private fireballs:Fireball[] = []
    private xPos:number

    private constructor() {
        this.textfield = document.getElementsByTagName("textfield")[0] as HTMLElement
        this.healthbar = document.getElementsByTagName("healthbar")[0] as HTMLElement
        this.topbar = document.getElementsByTagName("topbar")[0] as HTMLElement
        this.bg = document.getElementsByTagName("background")[0] as HTMLElement
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))

        this.topbar.style.width = `${window.innerWidth}px`

        this.objects.push(
            new Ghost(),
            new Slime(),
            new Eye(),
            new Skeleton(),
            new Powerup()
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

        this.player.update()
        
        for(let enemy of this.objects) {
            enemy.update()

            if( Util.checkCollision( this.player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                enemy.removeMe()
                this.removeLife()

                let enemyIndex = this.objects.indexOf(enemy)
                this.objects.splice(enemyIndex, 1)

                this.objects.push(
                    new Ghost()
                )
            }

            for(let fire of this.fireballs) {
                fire.update()
                
                if( Util.checkCollision( fire.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                    //enemy.removeMe()
                    fire.removeMe()
                    this.scorePoint()
                    enemy.reset()

                    let fireballIndex = this.fireballs.indexOf(fire)
                    this.fireballs.splice(fireballIndex, 1)

                    //let enemyIndex = this.enemies.indexOf(enemy)
                    //this.enemies.splice(enemyIndex, 1)
                    
                    enemy.posx = window.innerWidth - 65
                }
            }
        }
        
        if(this.life >= 6) {
            let finalscore = document.getElementsByTagName("finalscore")[0] as HTMLElement

            finalscore.innerHTML = "GAME OVER"
            finalscore.style.display = "block"
            finalscore.style.marginLeft = `${window.innerWidth / 2 - 250}px`
            finalscore.style.marginTop = `${window.innerHeight / 2 - 50}px`
            //this.statusbar.remove()
            //this.textfield.remove()
        } else {
            requestAnimationFrame(()=>this.gameLoop())
        }

        // if (this.score == 4) {
        //     this.enemies.push(
        //         new Powerup()
        //     )
        // }
    }

    public fire() {
        this.fireballs.push (
            new Fireball(this.player.posy)
        )

        console.log("fired a shot");
        console.log(this.player.posy)
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
        this.life ++
        console.log("hit count: " + this.life)

        switch (this.life) {
            case 1:
                this.healthbar.style.backgroundPositionY = `-255px`;
                break
            case 2:
                this.healthbar.style.backgroundPositionY = `-204px`;
                break
            case 3:
                this.healthbar.style.backgroundPositionY = `-153px`;
                break
            case 4:
                this.healthbar.style.backgroundPositionY = `-102px`;
                break
            case 5:
                this.healthbar.style.backgroundPositionY = `-51px`;
                break
            case 6:
                this.healthbar.style.backgroundPositionY = `0px`;
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