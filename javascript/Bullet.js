'use strict';

(function(exports, undefined) {

  function _edgeTest() {
    switch (this.direction) {
      case 'up':
        return this.screen.offsetY >= this.offsetY * this.scale;
        break;
      case 'down':
        return this.screen.offsetY + this.cellWidth * 26 * this.scale - this.height * this.scale <= this.offsetY * this.scale;
        break;
      case 'left':
        return this.screen.offsetX >= this.offsetX * this.scale;
        break;
      case 'right':
        return this.screen.offsetX + this.cellWidth * 26 * this.scale - this.width * this.scale <= this.offsetX * this.scale;
        break;
    }
  }

  function _mapTest() {
    var currentX = this.offsetX - this.screen.offsetX;
    var currentY = this.offsetY - this.screen.offsetY;
    switch (this.direction) {
      case 'up':
        currentY -= 1;
        break;
      case 'down':
        currentY += 1;
        break;
      case 'left':
        currentX -= 1;
        break;
      case 'right':
        currentX += 1;
        break;
    }
    var x = parseInt(currentX / this.cellWidth);
    var y = parseInt(currentY / this.cellWidth);
    return this.map.hitBullet(x, y);
  }

  function _tankTest() {
    var that = this;
    
    // 检测与所有显示对象的碰撞
    for (var i = 0; i < this.screen._displayList.length; i++) {
      var obj = this.screen._displayList[i];
      if (obj.destroyed || !obj.visible) continue;
      
      // 跳过自己、地图、爆炸效果、子弹等
      if (obj === this || !obj.hitTest || obj === this.owner) continue;
      
      // 跳过非坦克对象
      var objType = obj.constructor && obj.constructor.name;
      if (!objType || 
          objType === 'Map' || 
          objType === 'Board' || 
          objType === 'Explostion' ||
          objType === 'Bullet' ||
          objType === 'Sprite') {
        continue;
      }
      
      // 识别坦克类型
      var isPlayer = objType === 'Player';
      var isEnemy = objType === 'Enemy';
      
      // 检测玩家坦克（只有敌人子弹才能击中玩家）
      if (this.ownerType === 'enemy' && isPlayer) {
        if (this.hitTest(obj)) {
          return { type: 'player', target: obj };
        }
      }
      
      // 检测敌人坦克（只有玩家子弹才能击中敌人）
      if (this.ownerType === 'player' && isEnemy) {
        if (this.hitTest(obj)) {
          return { type: 'enemy', target: obj };
        }
      }
    }
    
    return false;
  }

  function _hitTest() {
    var edgeTest = _edgeTest.call(this);
    if (edgeTest) return 'edge';
    var mapTest = _mapTest.call(this);
    if (mapTest) return mapTest;
    var tankTest = _tankTest.call(this);
    if (tankTest) return tankTest;
    return false;
  }

  function Bullet(options) {
    var opt = {
      speed: 1,
      direction: 'up',
      y: 0,
      x: 0,
      owner: null, // 子弹的发射者（玩家或敌人）
      ownerType: null // 'player' 或 'enemy'
    };
    Util.merge(opt, options);
    Util.merge(this, opt);
    Bullet.sup.call(this, opt);
  }

  var proto = {};

  proto.update = function() {
    // 移动子弹
    switch (this.direction) {
      case 'up':
        this.offsetY -= this.speed;
        break;
      case 'down':
        this.offsetY += this.speed;
        break;
      case 'left':
        this.offsetX -= this.speed;
        break;
      case 'right':
        this.offsetX += this.speed;
        break;
    }
    
    // 移动后检测碰撞
    var hitTest = this.test();
    if (hitTest) {
      this.destroy();
      
      // 处理击中坦克的情况
      if (hitTest && typeof hitTest === 'object' && hitTest.type) {
        var explosionType = hitTest.type === 'player' ? 'player' : 'enemy';
        new Explostion({
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          sounds: this.sounds,
          graphics: this.graphics,
          screen: this.screen,
          type: explosionType,
          target: hitTest.target
        });
      } else {
        // 击中地图障碍物
        new Explostion({
          offsetX: this.offsetX,
          offsetY: this.offsetY,
          sounds: this.sounds,
          graphics: this.graphics,
          screen: this.screen,
          type: hitTest
        });
      }
    }
  }

  proto.test = function() {
    return _hitTest.call(this);
  }

  Util.augment(Bullet, proto);
  Util.inherit(Bullet, Sprite);
  exports.Bullet = Bullet;
})(this);
