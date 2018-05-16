abstract class DomObject {

    protected element: HTMLElement

    public minWidth: number = 0
    public maxWidth: number = 0
    public maxHeight: number = 0

    constructor(minWidth: number, maxWidth: number, element: string) {
        this.element = document.createElement(element)
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element);

        maxWidth -= this.element.clientWidth
        this.minWidth = minWidth
        this.maxWidth = maxWidth
        this.maxHeight = window.innerHeight - this.element.clientHeight
    }

    abstract update() : void

}