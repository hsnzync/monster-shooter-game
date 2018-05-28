abstract class GameObject {

    public element: HTMLElement

    public posx        : number = 0
    public posy        : number = 0
    public speedx      : number = 0
    public speedy      : number = 0
    public minWidth    : number = 0
    public maxWidth    : number = 0
    public maxHeight   : number = 0

    constructor(type : string) {
        this.element = document.createElement(type)
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element);
    }

    abstract update() : void

    public draw() {
        this.element.style.transform = `translate(${this.posx}px, ${this.posy}px)`
    }

    public randomPosition() {
        this.minWidth = 0
        this.maxWidth = window.innerWidth - this.element.clientWidth
        this.maxHeight = window.innerHeight - this.element.clientHeight

        this.posx = (Math.random() * (this.maxWidth - this.minWidth) + this.minWidth)
        this.posy = (Math.random() * (this.maxHeight - 0) + 0 )
    }

    public boundingBox() {
        return this.element.getBoundingClientRect();
    }

}