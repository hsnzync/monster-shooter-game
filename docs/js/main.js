"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DomObject = (function () {
    function DomObject(minWidth, maxWidth, element) {
        this.minWidth = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
        this.element = document.createElement(element);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        maxWidth -= this.element.clientWidth;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.maxHeight = window.innerHeight - this.element.clientHeight;
    }
    return DomObject;
}());
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "enemy") || this;
        var randPos = Math.floor(Math.random() * window.innerHeight) + 1;
        var randSp = Math.floor(Math.random() * 5) + 1;
        _this.posy = randPos;
        _this.posx = window.innerWidth - _this.element.clientWidth;
        _this.speedx = randSp;
        return _this;
    }
    Enemy.prototype.windowCol = function () {
        if (this.posy < 280) {
            this.speedx *= 0;
            this.posy = window.innerHeight - 280;
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedx *= 0;
        }
    };
    Enemy.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.posx -= this.speedx;
        if (this.posx == -100) {
            this.posx = window.innerWidth - this.element.clientWidth;
            Game.getInstance().removeLife();
        }
        this.windowCol();
    };
    Enemy.prototype.removeMe = function () {
        console.log("Ouch");
    };
    Enemy.prototype.boundingBox = function () {
        return this.element.getBoundingClientRect();
    };
    return Enemy;
}(DomObject));
var Game = (function () {
    function Game() {
        this.score = 0;
        this.destroyed = 0;
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.statusbar = document.getElementsByTagName("bar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        this.enemies = [
            new Enemy(65, 65)
        ];
        this.player = new Player(65, 65);
        this.xPos = 0;
        this.gameLoop();
    }
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.xPos--;
        this.bg.style.backgroundPosition = this.xPos + 'px 0px';
        console.log("updating the game!");
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            enemy.update();
            this.player.update();
            if (Util.checkCollision(this.player.boundingBox(), enemy.boundingBox())) {
                enemy.removeMe();
                this.removeLife();
            }
        }
        if (this.destroyed < 5) {
            requestAnimationFrame(function () { return _this.gameLoop(); });
        }
        else {
            this.textfield.innerHTML = "GAME OVER - Score: " + this.score;
        }
    };
    Game.prototype.removeLife = function () {
        this.destroyed++;
        console.log("buildings destroyed " + this.destroyed);
        switch (this.destroyed) {
            case 1:
                this.statusbar.style.backgroundPositionY = "-182px";
                break;
            case 2:
                this.statusbar.style.backgroundPositionY = "-136px";
                break;
            case 3:
                this.statusbar.style.backgroundPositionY = "-91px";
                break;
            case 4:
                this.statusbar.style.backgroundPositionY = "-46px";
                break;
            case 5:
                this.statusbar.style.backgroundPositionY = "0";
                break;
        }
    };
    Game.prototype.scorePoint = function () {
        this.score++;
        this.textfield.innerHTML = "Score: " + this.score;
    };
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "player") || this;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        _this.posy = 400;
        _this.posx = 50;
        _this.speedx = 0;
        _this.speedy = 0;
        return _this;
    }
    Player.prototype.BoundingBox = function () {
        if (this.posx + this.element.clientWidth > window.innerWidth) {
            this.posx && this.posy == 300;
            this.speedx *= 0;
        }
        if (this.posx < 0) {
            this.posx = 0;
            this.speedx && this.speedy * 0;
            console.log("hit the edge");
        }
        if (this.posy < 280) {
            this.speedy *= 0;
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedy *= 0;
        }
    };
    Player.prototype.update = function () {
        this.posx = this.posx + this.speedx;
        this.posy = this.posy + this.speedy;
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
        if (this.posx >= window.innerWidth) {
            this.posx = 0;
        }
        this.BoundingBox();
    };
    Player.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 37:
                this.speedx = -5;
                this.element.style.backgroundPositionX = "-72px";
                this.element.style.transform = 'scaleX(-1) !important';
                break;
            case 39:
                this.speedx = 5;
                this.element.style.backgroundPositionX = "-72px";
                break;
            case 38:
                this.speedy = -5;
                this.element.style.backgroundPositionX = "-143px";
                break;
            case 40:
                this.speedy = 5;
                this.element.style.backgroundPositionX = "0px";
                break;
        }
    };
    Player.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 37:
                this.speedx = 0;
                break;
            case 39:
                this.speedx = 0;
                break;
            case 38:
                this.speedy = 0;
                break;
            case 40:
                this.speedy = 0;
                break;
        }
    };
    Player.prototype.boundingBox = function () {
        return this.element.getBoundingClientRect();
    };
    return Player;
}(DomObject));
var Util = (function () {
    function Util() {
    }
    Util.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    return Util;
}());
//# sourceMappingURL=main.js.map