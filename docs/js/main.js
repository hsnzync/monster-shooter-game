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
var Enemy = (function () {
    function Enemy(minWidth, maxWidth, element) {
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
        var randPos = Math.floor(Math.random() * window.innerHeight) + 1;
        var randSp = Math.floor(Math.random() * 7) + 3;
        this.posy = randPos;
        this.posx = window.innerWidth - this.element.clientWidth;
        this.speedx = randSp;
    }
    Enemy.prototype.boundingBox = function () {
        return this.element.getBoundingClientRect();
    };
    Enemy.prototype.windowCol = function () {
        if (this.posy < 280) {
            this.speedx *= 0;
            this.posy = window.innerHeight - 280;
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedx *= 0;
        }
        if (this.posx <= 0) {
            this.posx = window.innerWidth - this.element.clientWidth;
            this.posy = Math.floor(Math.random() * window.innerHeight) + 1;
            Game.getInstance().removeLife();
        }
    };
    Enemy.prototype.removeMe = function () {
        console.log("Ouch");
    };
    return Enemy;
}());
var Game = (function () {
    function Game() {
        this.score = 0;
        this.damage = 0;
        this.enemies = [];
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.statusbar = document.getElementsByTagName("bar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        this.enemies.push(new Ghost(65, 65), new Bat(65, 65), new Frog(65, 65));
        this.player = new Player();
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
        if (this.damage < 5) {
            requestAnimationFrame(function () { return _this.gameLoop(); });
        }
        else {
            this.textfield.innerHTML = "GAME OVER - Score: " + this.score;
        }
    };
    Game.prototype.removeLife = function () {
        this.damage++;
        console.log("life count: " + this.damage);
        switch (this.damage) {
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
        console.log(this.score);
        this.textfield.innerHTML = "Score: " + this.score;
    };
    return Game;
}());
window.addEventListener("load", function () {
    Game.getInstance();
});
var Player = (function () {
    function Player() {
        var _this = this;
        this.element = document.createElement("player");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        this.posy = 400;
        this.posx = 50;
        this.speedx = 0;
        this.speedy = 0;
    }
    Player.prototype.windowCol = function () {
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
        this.windowCol();
    };
    Player.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 37:
                this.speedx = -3;
                break;
            case 39:
                this.speedx = 3;
                break;
            case 38:
                this.speedy = -3;
                break;
            case 40:
                this.speedy = 3;
                break;
            case 65:
                console.log("Fire!");
                Game.getInstance().scorePoint();
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
}());
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
var Bat = (function (_super) {
    __extends(Bat, _super);
    function Bat(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "bat") || this;
        _this.behavior = new slowBehavior(_this);
        return _this;
    }
    Bat.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Bat;
}(Enemy));
var Frog = (function (_super) {
    __extends(Frog, _super);
    function Frog(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "skeleton") || this;
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Frog.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Frog;
}(Enemy));
var Ghost = (function (_super) {
    __extends(Ghost, _super);
    function Ghost(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "ghost") || this;
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Ghost.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Ghost;
}(Enemy));
var fastBehavior = (function () {
    function fastBehavior(enemy) {
        this.enemy = enemy;
        var r = Math.floor(Math.random() * 6) + 3;
        this.speedx = r;
    }
    fastBehavior.prototype.performUpdate = function () {
        this.enemy.posx -= this.speedx;
    };
    return fastBehavior;
}());
var slowBehavior = (function () {
    function slowBehavior(enemy) {
        this.enemy = enemy;
        var r = Math.floor(Math.random() * 3) + 1;
        this.speedx = r;
    }
    slowBehavior.prototype.performUpdate = function () {
        this.enemy.posx -= this.speedx;
    };
    return slowBehavior;
}());
//# sourceMappingURL=main.js.map