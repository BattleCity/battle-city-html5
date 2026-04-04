'use strict';

(function(exports, undefined) {

  // NES 四种敌人类型: [基础速度, 生命值, 开火间隔(帧)]
  var ENEMY_TYPES = [
    { speed: 1, life: 1, fireInterval: 80  },  // 0: 普通坦克
    { speed: 2, life: 1, fireInterval: 80  },  // 1: 快速坦克
    { speed: 1, life: 1, fireInterval: 40  },  // 2: 强力坦克（高射速）
    { speed: 1, life: 4, fireInterval: 80  },  // 3: 装甲坦克（4格血，最后1格闪烁）
  ];

  // 玩家基地格子坐标
  var HOME_GRID_X = 12;
  var HOME_GRID_Y = 24;

  function _toGridX(offsetX, screenOffsetX, scale, cellWidth) {
    return Math.round((offsetX - screenOffsetX / scale) / cellWidth);
  }

  function _toGridY(offsetY, screenOffsetY, scale, cellWidth) {
    return Math.round((offsetY - screenOffsetY / scale) / cellWidth);
  }

  // 返回从 (fx,fy) 朝 (tx,ty) 移动的最优方向
  function _directionToward(fx, fy, tx, ty) {
    var dx = tx - fx;
    var dy = ty - fy;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? 'right' : 'left';
    } else {
      return dy >= 0 ? 'down' : 'up';
    }
  }

  // 根据目标计算首选方向（70% 朝基地，30% 朝最近玩家）
  function _pickPreferredDirection() {
    var cw = this.cellWidth;
    var sc = this.scale;
    var gx = _toGridX(this.offsetX, this.screen.offsetX, sc, cw);
    var gy = _toGridY(this.offsetY, this.screen.offsetY, sc, cw);

    // 30% 概率追踪存活玩家
    if (Math.random() < 0.3 && this.players && this.players.length > 0) {
      var living = this.players.filter(function(p) { return p && !p.dead && !p.destroyed; });
      if (living.length > 0) {
        var target = living[Math.floor(Math.random() * living.length)];
        var tx = _toGridX(target.offsetX, this.screen.offsetX, sc, cw);
        var ty = _toGridY(target.offsetY, this.screen.offsetY, sc, cw);
        return _directionToward(gx, gy, tx, ty);
      }
    }

    // 默认朝玩家基地
    return _directionToward(gx, gy, HOME_GRID_X, HOME_GRID_Y);
  }

  // 选择新方向，并缓存备用方向列表（碰撞时依次尝试）
  function _chooseDirection() {
    var preferred = _pickPreferredDirection.call(this);

    // 如果首选方向与当前相同，60% 概率维持不变
    if (preferred === this.direction && Math.random() < 0.6) return;

    var others = ['up', 'down', 'left', 'right'].filter(function(d) { return d !== preferred; });
    // 打乱备用方向
    for (var i = others.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = others[i]; others[i] = others[j]; others[j] = tmp;
    }

    this.direction = preferred;
    this._fallbackDirs = others;
  }

  // 碰撞时从备用列表选下一个方向
  function _fallback() {
    if (this._fallbackDirs && this._fallbackDirs.length > 0) {
      this.direction = this._fallbackDirs.shift();
    } else {
      var all = ['up', 'down', 'left', 'right'].filter(function(d) { return d !== this.direction; }, this);
      this.direction = all[Math.floor(Math.random() * all.length)];
    }
  }

  function Enemy(options) {
    var level = (options && options.level !== undefined) ? options.level : 0;
    var stats = ENEMY_TYPES[level] || ENEMY_TYPES[0];

    var opt = {
      level: 0,
      fire: true,
      type: 'enemy',
      players: [],
      life: stats.life,
      speed: stats.speed
    };
    Util.merge(opt, options);

    // level 对应的属性优先（不被 Application 传入的固定值覆盖）
    var finalStats = ENEMY_TYPES[opt.level] || ENEMY_TYPES[0];
    opt.speed = finalStats.speed;
    opt.life = finalStats.life;

    Util.merge(this, opt);
    Enemy.sup.call(this, opt);

    this._fireInterval = finalStats.fireInterval;
    this._fireCounter = Math.floor(Math.random() * finalStats.fireInterval); // 错开开火节奏
    this._dirCounter = 0;
    this._dirInterval = 100 + Math.floor(Math.random() * 80); // 100~180 帧换方向
    this._fallbackDirs = [];
    this._flashCounter = 0;
  }

  var proto = {};

  proto.forward = function() {
    if (!this.canAct()) return;

    this.sounds['enemy'].sound.play();

    // 装甲坦克最后一血时闪烁
    if (this.level === 3 && this.life === 1) {
      this._flashCounter++;
      this.visible = (this._flashCounter % 8) < 4;
    }

    // 定时换方向
    this._dirCounter++;
    if (this._dirCounter >= this._dirInterval) {
      _chooseDirection.call(this);
      this._dirCounter = 0;
      this._dirInterval = 100 + Math.floor(Math.random() * 80);
    }

    // 碰撞时换方向
    if (this.test()) {
      _fallback.call(this);
      this._dirCounter = 0;
    }

    // 定时开火（与换方向相互独立）
    this._fireCounter++;
    if (this._fireCounter >= this._fireInterval) {
      this.shot();
      this._fireCounter = 0;
    }

    switch (this.direction) {
      case 'up':    this.move(0, -this.speed); break;
      case 'down':  this.move(0, this.speed); break;
      case 'left':  this.move(-this.speed, 0); break;
      case 'right': this.move(this.speed, 0); break;
    }
  }

  // 被子弹命中，返回 true 表示已死亡
  proto.hit = function() {
    if (!Tank.prototype.hit.call(this)) return false;
    this.life--;
    return this.life <= 0;
  }

  Util.augment(Enemy, proto);
  Util.inherit(Enemy, Tank);
  exports.Enemy = Enemy;
})(this);
