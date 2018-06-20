class Game {
    
    private static instance: Game

    private score:number = 0
    private life:number = 0
    private textfield:HTMLElement
    private healthbar:HTMLElement
    private topbar:HTMLElement
    private bg:HTMLElement
    private player:Player
    private enemies:GameObject[] = []
    private fireballs:Fireball[] = []
    private pickups:GameObject[] = []
    private xPos:number
    private audio:HTMLAudioElement
    private overworld:any

    private constructor() {
        this.textfield = document.getElementsByTagName("textfield")[0] as HTMLElement
        this.healthbar = document.getElementsByTagName("healthbar")[0] as HTMLElement
        this.topbar = document.getElementsByTagName("topbar")[0] as HTMLElement
        this.bg = document.getElementsByTagName("background")[0] as HTMLElement
        window.addEventListener("keydown", (e:KeyboardEvent) => this.onKeyDown(e))

        this.overworld = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/overworld.mp3')
        this.overworld.play()

        this.topbar.style.width = `${window.innerWidth}px`

        this.player = new Player()

        this.enemies.push(
            new Ghost(this.player),
            new Slime(this.player),
            new Eye(this.player),
            new Skeleton(this.player),
        )

        this.xPos = 0

        this.gameLoop()
        
        setInterval( () => { 

            if(this.pickups.length == 0) {

                this.pickups.push(
                    new Powerup(),
                    new Coin ()
                )

            }

        }, 10000);

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
        
        this.player.update()
        
        for(let enemy of this.enemies) {
            enemy.update()

            if( Util.checkCollision( this.player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                enemy.reset()
                this.removeLife()
                this.score --

                let hitSound = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/hit.mp3')
                hitSound.play()
            }

            for(let pickup of this.pickups) {

                pickup.update()

                if( Util.checkCollision( this.player.getBoundingClientRect(), pickup.getBoundingClientRect())) {

                    pickup.removeMe()
                    let powerupIndex = this.pickups.indexOf(pickup)
                    this.pickups.splice(powerupIndex, 1)

                    if(this.pickups[0]) {
                        this.player.notifyAllObservers()
                        let powerupSound = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/powerup.mp3')
                        powerupSound.play()

                        this.fireballs.push (
                            new Fireball(this.player.posy),
                            new Fireball(this.player.posy + 20),
                            new Fireball(this.player.posy + 40)
                        )
                    }
                    else {
                        this.scorePoint()
                        let coinSound = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/coin.mp3')
                        coinSound.play()
                    }

                }
                
            }

            for(let fire of this.fireballs) {
                fire.update()
                
                if( Util.checkCollision( fire.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                    fire.removeMe()
                    this.scorePoint()
                    enemy.reset()

                    let hitEnemySound = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/hit2.mp3')
                    hitEnemySound.play()

                    let fireballIndex = this.fireballs.indexOf(fire)
                    this.fireballs.splice(fireballIndex, 1)
                    
                    enemy.posx = window.innerWidth - 65
                }
            }
        }
        
        if(this.life >= 6) {
            this.overworld.pause()
            let finalscore = document.getElementsByTagName("finalscore")[0] as HTMLElement

            finalscore.innerHTML = "GAME OVER"
            finalscore.style.display = "block"
            finalscore.style.marginLeft = `${window.innerWidth / 2 - 250}px`
            finalscore.style.marginTop = `${window.innerHeight / 2 - 50}px`

            let gameover = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/game_over.mp3')
            gameover.play()
        } else {
            requestAnimationFrame(()=>this.gameLoop())
        }
    }

    public fire() {
            if(this.fireballs.length >= 0) {
            this.fireballs.push (
                new Fireball(this.player.posy)
            )
        }

        let fireSound = this.audio = new Audio('https://github.com/Hsnzync/monster-shooter/blob/master/docs/sounds/laser.mp3')
        fireSound.play()

        console.log("fire");
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