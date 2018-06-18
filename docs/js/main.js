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
var Game = (function () {
    function Game() {
        var _this = this;
        this.score = 0;
        this.life = 0;
        this.enemies = [];
        this.fireballs = [];
        this.pickups = [];
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.healthbar = document.getElementsByTagName("healthbar")[0];
        this.topbar = document.getElementsByTagName("topbar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        this.overworld = this.audio = new Audio('../docs/sounds/overworld.mp3');
        this.overworld.play();
        this.topbar.style.width = window.innerWidth + "px";
        this.player = new Player();
        this.enemies.push(new Ghost(this.player), new Slime(this.player), new Eye(this.player), new Skeleton(this.player));
        this.xPos = 0;
        this.gameLoop();
        setInterval(function () {
            if (_this.pickups.length == 0) {
                _this.pickups.push(new Powerup(), new Coin());
            }
        }, 10000);
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
        this.player.update();
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            enemy.update();
            if (Util.checkCollision(this.player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                enemy.reset();
                this.removeLife();
                this.score--;
                var hitSound = this.audio = new Audio('../docs/sounds/hit.mp3');
                hitSound.play();
            }
            for (var _b = 0, _c = this.pickups; _b < _c.length; _b++) {
                var pickup = _c[_b];
                pickup.update();
                if (Util.checkCollision(this.player.getBoundingClientRect(), pickup.getBoundingClientRect())) {
                    pickup.removeMe();
                    var powerupIndex = this.pickups.indexOf(pickup);
                    this.pickups.splice(powerupIndex, 1);
                    if (this.pickups[0]) {
                        this.player.notifyAllObservers();
                        var powerupSound = this.audio = new Audio('../docs/sounds/powerup.mp3');
                        powerupSound.play();
                    }
                    else {
                        this.scorePoint();
                        var coinSound = this.audio = new Audio('../docs/sounds/coin.mp3');
                        coinSound.play();
                    }
                }
            }
            for (var _d = 0, _e = this.fireballs; _d < _e.length; _d++) {
                var fire = _e[_d];
                fire.update();
                if (Util.checkCollision(fire.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                    fire.removeMe();
                    this.scorePoint();
                    enemy.reset();
                    var fireballIndex = this.fireballs.indexOf(fire);
                    this.fireballs.splice(fireballIndex, 1);
                    enemy.posx = window.innerWidth - 65;
                }
            }
        }
        if (this.life >= 6) {
            this.overworld.pause();
            var finalscore = document.getElementsByTagName("finalscore")[0];
            finalscore.innerHTML = "GAME OVER";
            finalscore.style.display = "block";
            finalscore.style.marginLeft = window.innerWidth / 2 - 250 + "px";
            finalscore.style.marginTop = window.innerHeight / 2 - 50 + "px";
            var gameover = this.audio = new Audio('../docs/sounds/game_over.mp3');
            gameover.play();
        }
        else {
            requestAnimationFrame(function () { return _this.gameLoop(); });
        }
    };
    Game.prototype.fire = function () {
        if (this.fireballs.length >= 0) {
            this.fireballs.push(new Fireball(this.player.posy));
        }
        var fireSound = this.audio = new Audio('../docs/sounds/laser.mp3');
        fireSound.play();
        console.log("fire");
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
        console.log("hit count: " + this.life);
        switch (this.life) {
            case 1:
                this.healthbar.style.backgroundPositionY = "-255px";
                break;
            case 2:
                this.healthbar.style.backgroundPositionY = "-204px";
                break;
            case 3:
                this.healthbar.style.backgroundPositionY = "-153px";
                break;
            case 4:
                this.healthbar.style.backgroundPositionY = "-102px";
                break;
            case 5:
                this.healthbar.style.backgroundPositionY = "-51px";
                break;
            case 6:
                this.healthbar.style.backgroundPositionY = "0px";
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
var GameObject = (function () {
    function GameObject(element) {
        this.element = document.createElement(element);
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this.element);
        this.posy = Math.floor(Math.random() * window.innerHeight) + 1;
        this.posx = window.innerWidth - this.element.clientWidth;
        this.speedx = 0;
        this.speedy = 0;
    }
    GameObject.prototype.playerWindowCol = function () {
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
    GameObject.prototype.enemyWindowCol = function () {
        if (this.posy < 280) {
            this.speedx *= 0;
            this.posy = window.innerHeight - 280;
        }
        if (this.posy + this.element.clientHeight > window.innerHeight) {
            this.speedx *= 0;
            this.posy = window.innerHeight - 100;
        }
        if (this.posx <= 0) {
            this.posx = window.innerWidth - this.element.clientWidth;
            this.posy = Math.floor(Math.random() * window.innerHeight) + 1;
        }
    };
    GameObject.prototype.draw = function () {
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px) scaleX(-1)";
    };
    GameObject.prototype.getBoundingClientRect = function () {
        return this.element.getBoundingClientRect();
    };
    GameObject.prototype.removeMe = function () {
        this.element.remove();
        console.log("Removed monster");
    };
    GameObject.prototype.reset = function () {
        this.posx = window.innerWidth - this.element.clientWidth;
        this.posy = Math.floor(Math.random() * window.innerHeight) + 1;
    };
    return GameObject;
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
var Coin = (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        return _super.call(this, "coin") || this;
    }
    Coin.prototype.update = function () {
        this.posx = this.posx -= 1;
        this.enemyWindowCol();
        this.draw();
    };
    Coin.prototype.removeMe = function () {
        this.element.remove();
    };
    return Coin;
}(GameObject));
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
    Fireball.prototype.removeMe = function () {
        this.element.remove();
        console.log("Removed monster");
    };
    return Fireball;
}(GameObject));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, "player") || this;
        _this.observers = [];
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        _this.posy = 400;
        _this.posx = 50;
        _this.speedx = 0;
        _this.speedy = 0;
        _this.x = 0;
        _this.cooldown = 0;
        return _this;
    }
    Player.prototype.update = function () {
        if (this.cooldown > 0) {
            this.cooldown = this.cooldown - 1;
        }
        this.posx = this.posx + this.speedx;
        this.posy = this.posy + this.speedy;
        if (this.posx >= window.innerWidth) {
            this.posx = 0;
        }
        this.playerWindowCol();
        this.element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    };
    Player.prototype.add = function (o) {
        this.observers.push(o);
    };
    Player.prototype.notifyAllObservers = function () {
        this.observers.forEach(function (observer) {
            observer.notify();
        });
    };
    Player.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                this.speedy = -5;
                break;
            case 40:
                this.speedy = 5;
                break;
            case 32:
                if (this.cooldown == 0) {
                    this.cooldown = 30;
                    Game.getInstance().fire();
                    this.x -= 1;
                    break;
                }
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
}(GameObject));
var Powerup = (function (_super) {
    __extends(Powerup, _super);
    function Powerup() {
        return _super.call(this, "powerup") || this;
    }
    Powerup.prototype.update = function () {
        this.posx = this.posx -= 2;
        this.enemyWindowCol();
        this.draw();
    };
    Powerup.prototype.removeMe = function () {
        this.element.remove();
    };
    return Powerup;
}(GameObject));
var Eye = (function (_super) {
    __extends(Eye, _super);
    function Eye(p) {
        var _this = _super.call(this, "eye") || this;
        _this.player = p;
        p.add(_this);
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Eye.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Eye.prototype.notify = function () {
        var _this = this;
        this.posx = 0;
        this.behavior = new slowBehavior(this);
        setTimeout(function () {
            _this.behavior = new fastBehavior(_this);
        }, 5000);
    };
    return Eye;
}(GameObject));
var Ghost = (function (_super) {
    __extends(Ghost, _super);
    function Ghost(p) {
        var _this = _super.call(this, "ghost") || this;
        _this.player = p;
        p.add(_this);
        _this.behavior = new fastBehavior(_this);
        _this.speedx = 10;
        return _this;
    }
    Ghost.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Ghost.prototype.notify = function () {
        var _this = this;
        this.posx = 0;
        this.behavior = new slowBehavior(this);
        setTimeout(function () {
            _this.behavior = new fastBehavior(_this);
        }, 5000);
    };
    return Ghost;
}(GameObject));
var Skeleton = (function (_super) {
    __extends(Skeleton, _super);
    function Skeleton(p) {
        var _this = _super.call(this, "skeleton") || this;
        _this.player = p;
        p.add(_this);
        _this.behavior = new fastBehavior(_this);
        return _this;
    }
    Skeleton.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Skeleton.prototype.notify = function () {
        var _this = this;
        this.posx = 0;
        this.behavior = new slowBehavior(this);
        setTimeout(function () {
            _this.behavior = new fastBehavior(_this);
        }, 5000);
    };
    return Skeleton;
}(GameObject));
var Slime = (function (_super) {
    __extends(Slime, _super);
    function Slime(p) {
        var _this = _super.call(this, "slime") || this;
        _this.behavior = new slowBehavior(_this);
        _this.player = p;
        p.add(_this);
        return _this;
    }
    Slime.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Slime.prototype.notify = function () {
        var _this = this;
        this.posx = 0;
        this.behavior = new slowBehavior(this);
        setTimeout(function () {
            _this.behavior = new fastBehavior(_this);
        }, 5000);
    };
    return Slime;
}(GameObject));
var fastBehavior = (function () {
    function fastBehavior(enemy) {
        this.enemy = enemy;
        var r = Math.floor(Math.random() * 4) + 3;
        this.speedx = r;
    }
    fastBehavior.prototype.performUpdate = function () {
        this.enemy.posx = this.enemy.posx -= this.speedx;
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
        this.enemy.posx = this.enemy.posx -= this.speedx;
    };
    return slowBehavior;
}());
//# sourceMappingURL=main.js.map