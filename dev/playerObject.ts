abstract class PlayerObject {

    public element: HTMLElement

    protected posx: number
    protected posy: number
    protected speedx: number
    protected speedy: number
    protected minWidth: number
    protected maxWidth: number
    protected maxHeight: number

    constructor(type : string) {
        this.element = document.createElement(type)
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element);
        
        this.posx = 0
        this.posy = 0
        this.speedx = 0
        this.speedy = 0
        this.minWidth = 0
        this.maxWidth = 0
        this.maxHeight = 0
    }

    abstract update() : void

    public draw() {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
    }

    public getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    public windowCol() : void {
        if(this.posx + this.element.clientWidth > window.innerWidth) {
            this.posx && this.posy == 300
            this.speedx *= 0
        }
        if (this.posx < 0) {
            this.posx = 0
            this.speedx && this.speedy * 0
            console.log("hit the edge")
        }

        if (this.posy < 280 ) {
            this.speedy *= 0
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedy *= 0
        }
    }

}