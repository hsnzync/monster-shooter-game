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
var EnemyObject = (function () {
    function EnemyObject(minWidth, maxWidth, element) {
        this.element = document.createElement(element);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.minWidth = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
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
    EnemyObject.prototype.windowCol = function () {
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
    EnemyObject.prototype.removeMe = function () {
        this.element.remove();
        console.log("Removed monster");
    };
    EnemyObject.prototype.getBoundingClientRect = function () {
        return this.element.getBoundingClientRect();
    };
    return EnemyObject;
}());
var Game = (function () {
    function Game() {
        var _this = this;
        this.score = 0;
        this.life = 0;
        this.enemies = [];
        this.fireball = [];
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.healthbar = document.getElementsByTagName("healthbar")[0];
        this.topbar = document.getElementsByTagName("topbar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        this.topbar.style.width = window.innerWidth + "px";
        this.enemies.push(new Ghost(65, 65), new Slime(55, 65), new Eye(50, 65), new Skeleton(65, 65));
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
            if (Util.checkCollision(this.player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                enemy.removeMe();
                this.removeLife();
            }
            for (var _b = 0, _c = this.fireball; _b < _c.length; _b++) {
                var fire = _c[_b];
                fire.update();
                if (Util.checkCollision(fire.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                    enemy.removeMe();
                    this.scorePoint();
                    this.removeLife();
                    for (var i = this.fireball.length; i >= 0; i--) {
                        var item = this.enemies[i];
                        if (item == this.enemies[0]) {
                            this.fireball.splice(i, 1);
                        }
                    }
                    enemy.posx = window.innerWidth - 65;
                }
            }
        }
        if (this.life == 5) {
            var finalscore = document.getElementsByTagName("finalscore")[0];
            finalscore.innerHTML = "GAME OVER";
            finalscore.style.display = "block";
            finalscore.style.marginLeft = window.innerWidth / 2 - 250 + "px";
            finalscore.style.marginTop = window.innerHeight / 2 - 50 + "px";
        }
        else {
            requestAnimationFrame(function () { return _this.gameLoop(); });
        }
    };
    Game.prototype.fire = function () {
        this.fireball.push(new Fireball(this.player.posy));
        console.log("fired a shot");
        console.log(this.player.posy);
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
        this.life++;
        console.log("life count: " + this.life);
        switch (this.life) {
            case 1:
                this.healthbar.style.backgroundPositionY = "-204px";
                break;
            case 2:
                this.healthbar.style.backgroundPositionY = "-153px";
                break;
            case 3:
                this.healthbar.style.backgroundPositionY = "-102px";
                break;
            case 4:
                this.healthbar.style.backgroundPositionY = "-51px";
                break;
            case 5:
                this.healthbar.style.backgroundPositionY = "0";
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
var PlayerObject = (function () {
    function PlayerObject(type) {
        this.element = document.createElement(type);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posx = 0;
        this.posy = 0;
        this.speedx = 0;
        this.speedy = 0;
        this.minWidth = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
    }
    PlayerObject.prototype.draw = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    PlayerObject.prototype.getBoundingClientRect = function () {
        return this.element.getBoundingClientRect();
    };
    PlayerObject.prototype.windowCol = function () {
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
    return PlayerObject;
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
var Fireball = (function (_super) {
    __extends(Fireball, _super);
    function Fireball(y) {
        var _this = _super.call(this, "fireball") || this;
        _this.speedx = 2;
        _this.posx = 80;
        _this.posy = y;
        return _this;
    }
    Fireball.prototype.update = function () {
        this.posx = this.posx += this.speedx;
        this.draw();
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    return Fireball;
}(PlayerObject));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, "player") || this;
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        _this.posy = 400;
        _this.posx = 50;
        return _this;
    }
    Player.prototype.update = function () {
        this.posx = this.posx + this.speedx;
        this.posy = this.posy + this.speedy;
        if (this.posx >= window.innerWidth) {
            this.posx = 0;
        }
        this.windowCol();
        this.draw();
    };
    Player.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                this.speedy = -1;
                break;
            case 40:
                this.speedy = 1;
                break;
            case 69:
                console.log("Fire!");
                Game.getInstance().fire();
                break;
        }
    };
    Player.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38:
                this.speedy = 0;
                break;
            case 40:
                this.speedy = 0;
                break;
        }
    };
    return Player;
}(PlayerObject));
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
}(EnemyObject));
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
}(EnemyObject));
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
}(EnemyObject));
var Slime = (function (_super) {
    __extends(Slime, _super);
    function Slime(minWidth, maxWidth) {
        var _this = _super.call(this, minWidth, maxWidth, "slime") || this;
        _this.behavior = new slowBehavior(_this);
        return _this;
    }
    Slime.prototype.update = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
        this.behavior.performUpdate();
        this.windowCol();
    };
    return Slime;
}(EnemyObject));
var fastBehavior = (function () {
    function fastBehavior(enemy) {
        this.enemy = enemy;
        var r = Math.floor(Math.random() * 4) + 3;
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