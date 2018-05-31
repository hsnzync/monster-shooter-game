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
var GameObject = (function () {
    function GameObject(type) {
        this.posx = 0;
        this.posy = 0;
        this.speedx = 0;
        this.speedy = 0;
        this.minWidth = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
        this.element = document.createElement(type);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
    }
    GameObject.prototype.draw = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    GameObject.prototype.randomPosition = function () {
        this.minWidth = 0;
        this.maxWidth = window.innerWidth - this.element.clientWidth;
        this.maxHeight = window.innerHeight - this.element.clientHeight;
        this.posx = (Math.random() * (this.maxWidth - this.minWidth) + this.minWidth);
        this.posy = (Math.random() * (this.maxHeight - 0) + 0);
    };
    GameObject.prototype.boundingBox = function () {
        return this.element.getBoundingClientRect();
    };
    return GameObject;
}());
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(minWidth, maxWidth, element) {
        var _this = _super.call(this, element) || this;
        _this.minWidth = 0;
        _this.maxWidth = 0;
        _this.maxHeight = 0;
        maxWidth -= _this.element.clientWidth;
        _this.minWidth = minWidth;
        _this.maxWidth = maxWidth;
        _this.maxHeight = window.innerHeight - _this.element.clientHeight;
        var randPos = Math.floor(Math.random() * window.innerHeight) + 1;
        var randSp = Math.floor(Math.random() * 7) + 3;
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
        if (this.posx <= 0) {
            this.posx = window.innerWidth - this.element.clientWidth;
            this.posy = Math.floor(Math.random() * window.innerHeight) + 1;
            Game.getInstance().removeLife();
        }
    };
    Enemy.prototype.removeMe = function () {
        this.element.remove();
    };
    return Enemy;
}(GameObject));
var Game = (function () {
    function Game() {
        var _this = this;
        this.score = 0;
        this.damage = 0;
        this.enemies = [];
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.finalscore = document.getElementsByTagName("finalscore")[0];
        this.statusbar = document.getElementsByTagName("bar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        this.enemies.push(new Ghost(65, 65), new Bat(65, 65), new Eye(65, 65), new Skeleton(65, 65));
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
        this.xPos = this.xPos - 2;
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
            this.finalscore.innerHTML = "GAME OVER <br> Score: " + this.score;
            this.finalscore.style.backgroundColor = "#000";
            this.finalscore.style.padding = "50px 100px";
            this.finalscore.style.width = "500px";
            this.finalscore.style.lineHeight = "30px";
            this.finalscore.style.fontSize = "25px";
        }
    };
    Game.prototype.fire = function () {
        var fireball = new Fireball();
        fireball.posx = fireball.posx += fireball.speedx;
        console.log("fired a shot");
    };
    Game.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 82:
                console.log("Restart game");
                Game.getInstance();
                break;
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
var Fireball = (function (_super) {
    __extends(Fireball, _super);
    function Fireball() {
        var _this = _super.call(this, "fireball") || this;
        var r = Math.floor(Math.random() * 6) + 3;
        _this.speedx = r;
        return _this;
    }
    Fireball.prototype.update = function () {
        this.posx = this.posx + this.speedx;
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    return Fireball;
}(GameObject));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, "player") || this;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        _this.posy = 400;
        _this.posx = 50;
        _this.speedx = 0;
        _this.speedy = 0;
        return _this;
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
                Game.getInstance().fire();
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
    return Player;
}(GameObject));
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
var Eye = (function (_super) {
    __extends(Eye, _super);
    function Eye(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "eye") || this;
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Eye.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Eye;
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
var Skeleton = (function (_super) {
    __extends(Skeleton, _super);
    function Skeleton(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "skeleton") || this;
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Skeleton.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Skeleton;
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