class DomObject {

    protected element: HTMLElement

    constructor(element: string) {
        this.element = document.createElement(element)
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this.element);
    }

}