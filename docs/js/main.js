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
        this.objects = [];
        this.fireballs = [];
        this.pickups = [];
        this.textfield = document.getElementsByTagName("textfield")[0];
        this.healthbar = document.getElementsByTagName("healthbar")[0];
        this.topbar = document.getElementsByTagName("topbar")[0];
        this.bg = document.getElementsByTagName("background")[0];
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        this.topbar.style.width = window.innerWidth + "px";
        this.player = new Player();
        this.objects.push(new Ghost(this.player), new Slime(this.player), new Eye(this.player), new Skeleton(this.player));
        this.xPos = 0;
        this.gameLoop();
        setInterval(function () {
            if (_this.pickups.length == 0) {
                _this.pickups.push(new Powerup());
            }
        }, 3000);
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
        for (var _i = 0, _a = this.objects; _i < _a.length; _i++) {
            var enemy = _a[_i];
            enemy.update();
            if (Util.checkCollision(this.player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                enemy.reset();
                this.removeLife();
                this.score--;
            }
            for (var _b = 0, _c = this.pickups; _b < _c.length; _b++) {
                var pickup = _c[_b];
                pickup.update();
                if (Util.checkCollision(this.player.getBoundingClientRect(), pickup.getBoundingClientRect())) {
                    pickup.removeMe();
                    console.log('powerup picked up');
                    var powerupIndex = this.pickups.indexOf(pickup);
                    this.pickups.splice(powerupIndex, 1);
                    this.player.notifyAllObservers();
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
        if (this.fireballs.length >= 0) {
            this.fireballs.push(new Fireball(this.player.posy));
        }
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
        var _this = _super.call(this, "coin") || this;
        _this.behavior = new slowBehavior(_this);
        return _this;
    }
    Coin.prototype.update = function () {
        this.draw();
        this.enemyWindowCol();
        this.behavior.performUpdate();
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
                this.speedy = -2;
                break;
            case 40:
                this.speedy = 2;
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
        var _this = _super.call(this, "powerup") || this;
        _this.speedx = 1;
        return _this;
    }
    Powerup.prototype.update = function () {
        this.posx -= this.speedx;
        this.enemyWindowCol();
        this.draw();
    };
    Powerup.prototype.removeMe = function () {
        this.element.remove();
        console.log("Removed monster");
    };
    return Powerup;
}(GameObject));
var Eye = (function (_super) {
    __extends(Eye, _super);
    function Eye(p) {
        var _this = _super.call(this, "eye") || this;
        _this.behavior = new fastBehavior(_this);
        _this.player = p;
        p.add(_this);
        return _this;
    }
    Eye.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Eye.prototype.notify = function () {
        var _this = this;
        setTimeout(function () {
            _this.speedx = 0;
            _this.posx = _this.posx -= 0;
        }, 5000);
    };
    return Eye;
}(GameObject));
var Ghost = (function (_super) {
    __extends(Ghost, _super);
    function Ghost(p) {
        var _this = _super.call(this, "ghost") || this;
        _this.behavior = new fastBehavior(_this);
        _this.player = p;
        p.add(_this);
        return _this;
    }
    Ghost.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Ghost.prototype.notify = function () {
        var _this = this;
        setTimeout(function () {
            _this.speedx = 0;
            _this.posx = _this.posx -= 0;
        }, 5000);
    };
    return Ghost;
}(GameObject));
var Skeleton = (function (_super) {
    __extends(Skeleton, _super);
    function Skeleton(p) {
        var _this = _super.call(this, "skeleton") || this;
        _this.behavior = new fastBehavior(_this);
        _this.player = p;
        p.add(_this);
        return _this;
    }
    Skeleton.prototype.update = function () {
        this.behavior.performUpdate();
        this.enemyWindowCol();
        this.draw();
    };
    Skeleton.prototype.notify = function () {
        var _this = this;
        setTimeout(function () {
            _this.speedx = 0;
            _this.posx = _this.posx -= 0;
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
        setTimeout(function () {
            _this.speedx = 0;
            _this.posx = _this.posx -= 0;
            console.log('hit the slime');
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